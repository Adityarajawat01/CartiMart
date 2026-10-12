 import Product from "../models/productModel.js";

 const getProductFields = (body) => ({
   name: typeof body.name === "string" ? body.name.trim() : "",
   description:
     typeof body.description === "string" ? body.description.trim() : "",
   size: typeof body.size === "string" ? body.size.trim() : "",
   price: body.price === "" || body.price == null ? Number.NaN : Number(body.price),
   image: typeof body.image === "string" ? body.image.trim() : "",
   category: typeof body.category === "string" ? body.category.trim() : "",
   specifications:
     typeof body.specifications === "string"
       ? body.specifications.trim()
       : "",
   stock: body.stock === "" || body.stock == null ? Number.NaN : Number(body.stock),
 });

 const validateProduct = (product) => {
   if (
     !product.name ||
     !product.description ||
     !product.image ||
     !product.category ||
     !product.specifications ||
     !Number.isFinite(product.price) ||
     product.price <= 0 ||
     !Number.isInteger(product.stock) ||
     product.stock < 0
   ) {
     return "Complete all required fields. Price must be positive and stock must be zero or more.";
   }

   try {
     const imageUrl = new URL(product.image);
     if (!["http:", "https:"].includes(imageUrl.protocol)) {
       return "Image must use an HTTP or HTTPS URL.";
     }
   } catch {
     return "Image must be a valid URL.";
   }

   return null;
 };

 export const createProduct = async (req, res) => {
   try {
     const fields = getProductFields(req.body);
     const validationError = validateProduct(fields);
     if (validationError) {
       return res.status(400).json({
         success: false,
         message: validationError,
       });
     }

     const product = await Product.create(fields);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const fields = getProductFields(req.body);
    const validationError = validateProduct(fields);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const product = await Product.findByIdAndUpdate(productId, fields, {
      returnDocument: "after",
      runValidators: true,
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
    console.error("Update product error:", error);
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
        success: false,
        message: "product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: -1 });
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
