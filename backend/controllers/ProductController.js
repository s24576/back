const mongoose = require('mongoose');
const Product = require('../models/Product');

const getProducts = async (req, res) => {
    const products = await Product.find();
  
    res.status(200).json(products);
};

const createProduct = async (req, res) => {
    const {name, price, description, quantity, measure} = req.body;
    try{
        if(!name || !price || !description || !quantity || !measure){
        return res.status(400).json("error");
    }

    if (isNaN(price) || isNaN(quantity) || price < 1 || quantity < 1) {
        return res.status(400).json("error");
    }

    const existingProduct = await Product.findOne({name});

    if(existingProduct){
        return res.status(400).json("error");
    }

    const newProduct = new Product({name: name, price: price, description: description,
        quantity: quantity, measure:measure});
    
    const savedProduct=await newProduct.save();

    res.status(200).json({savedProduct});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such product" });
    }
  
    const product = await Product.findOneAndDelete({ _id: id });
  
    if (!product) {
      return res.status(400).json({ error: "No such product" });
    }
  
    res.status(200).json(product);
  };

  const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, quantity, measure } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        if (!name && !price && !description && !quantity && !measure) {
            return res.status(400).json({ error: "At least one parameter is required for update" });
        }

        if ((price && isNaN(price)) || (quantity && isNaN(quantity))) {
            return res.status(400).json({ error: "Invalid 'price' or 'quantity' value" });
        }

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (name) existingProduct.name = name;
        if (price) existingProduct.price = price;
        if (description) existingProduct.description = description;
        if (quantity) existingProduct.quantity = quantity;
        if (measure) existingProduct.measure = measure;

        const updatedProduct = await existingProduct.save();

        res.status(200).json({ updatedProduct });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const generateInventoryReport = async (req, res) => {
    try {
        // Use MongoDB aggregate to get the quantity and value of each product
        const inventoryReport = await Product.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    quantity: 1,
                    value: { $multiply: ["$quantity", "$price"] }
                }
            }
        ]);

        if (inventoryReport.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }

        // Return the generated inventory report
        res.status(200).json({ inventoryReport });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {getProducts, createProduct, deleteProduct, updateProduct};