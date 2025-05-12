import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        productName: '',
        buyUnitPrice: '',
        sellUnitPrice: ''
    });

    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Handle input changes for adding a new product
    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // Handle adding a new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/products', newProduct);
            alert('Product added successfully!');
            fetchProducts(); // Refresh the product list
            setNewProduct({ productName: '', buyUnitPrice: '', sellUnitPrice: '' }); // Reset form
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product!');
        }
    };

    // Handle editing a product
    const handleEditProduct = (product) => {
        setEditProduct(product);
    };

    // Handle saving the edited product
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/products/${editProduct.productID}`, editProduct);
            alert('Product updated successfully!');
            fetchProducts(); // Refresh the product list
            setEditProduct(null); // Reset edit mode
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product!');
        }
    };

    // Handle deleting a product
    const handleDeleteProduct = async (productID) => {
        try {
            const response = await axios.delete(`http://localhost:5000/products/${productID}`);
            alert('Product deleted successfully!');
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product!');
        }
    };

    return (
        <div className="products-container">
            <h2>Products</h2>

            {/* Form to add a new product */}
            <div className="add-product-form">
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        name="productName"
                        value={newProduct.productName}
                        placeholder="Product Name"
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="buyUnitPrice"
                        value={newProduct.buyUnitPrice}
                        placeholder="Buy Unit Price"
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="sellUnitPrice"
                        value={newProduct.sellUnitPrice}
                        placeholder="Sell Unit Price"
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Add Product</button>
                </form>
            </div>

            {/* Display the product list */}
            <div className="product-list">
                <h3>Product List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Buy Price</th>
                            <th>Sell Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.productID}>
                                <td>{product.productName}</td>
                                <td>{product.buyUnitPrice}</td>
                                <td>{product.sellUnitPrice}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.productID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit product form */}
            {editProduct && (
                <div className="edit-product-form">
                    <h3>Edit Product</h3>
                    <form onSubmit={handleSaveEdit}>
                        <input
                            type="text"
                            name="productName"
                            value={editProduct.productName}
                            onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            name="buyUnitPrice"
                            value={editProduct.buyUnitPrice}
                            onChange={(e) => setEditProduct({ ...editProduct, buyUnitPrice: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            name="sellUnitPrice"
                            value={editProduct.sellUnitPrice}
                            onChange={(e) => setEditProduct({ ...editProduct, sellUnitPrice: e.target.value })}
                            required
                        />
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Products;
