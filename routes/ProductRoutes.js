const express = require('express');
const router = express.Router();
const Product = require('../modals/ProductModals');

// Create Product
router.post('/create', async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const product = new Product({ name, description, price, image });
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create product', error: err.message });
    }
});

// Edit Product
router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update product', error: err.message });
    }
});

// Delete Product
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product', error: err.message });
    }
});

module.exports = router;
