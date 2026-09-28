 import Product from "../models/productModel.js"

export const createProduct = async (req, res) => {
  try {
    const { name, price, image, description, category, specifications, stock } =
      req.body;

    if (
      !name ||
      !price ||
      !image ||
      !description ||
      !category ||
      !specifications ||
      !stock
    ) {
      return res.status(400).json({
        sucess: false,
        message: "something is missing",
      });
    }

    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.log(`something went wrong ${err}`);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(productId, req.body, {
     returnDocument: "after",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(`something went wrong ${error}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        sucess: false,
        message: "product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find();
    if (product.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Product not found",
        product: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product found",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product found",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
