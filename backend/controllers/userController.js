import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, mobile, password, image, role } = req.body;

    // Validate fields
    if (!name?.trim() || !email?.trim() || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name, email, mobile and password are required",
      });
    }

    // Validate email
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      mobile,
      password: hashedPassword,
      image: image?.trim() || "",
      role: "customer",
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        mobile: user.mobile,
        image: user.image,
        role:  user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// Get Profile Controller
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        mobile: req.user.mobile,
        email: req.user.email,
        image: req.user.image,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      updates.name = name.trim();
    }

    if (mobile !== undefined) {
      const normalizedMobile = String(mobile).replace(/\D/g, "");

      if (!/^[0-9]{10}$/.test(normalizedMobile)) {
        return res.status(400).json({
          success: false,
          message: "Mobile number must be 10 digits",
        });
      }

      const existingUser = await User.findOne({
        mobile: normalizedMobile,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Mobile number already registered",
        });
      }

      updates.mobile = normalizedMobile;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};




export const updateProfileImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error("Cloudinary is not configured; check the backend environment variables.");
      return res.status(503).json({
        success: false,
        message: "Image uploads are unavailable. Configure Cloudinary credentials on the server.",
      });
    }

    const cloudResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cartimart/profiles",
          resource_type: "image",
          public_id: String(userId),
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    if (!cloudResponse?.secure_url) {
      throw new Error("Cloudinary did not return a secure image URL");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        image: cloudResponse.secure_url,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  }

 catch (error) {
  console.error("========== CLOUDINARY ERROR ==========");
  console.error("Message:", error.message);
  console.error("HTTP Status:", error.http_code);
  console.error("Error Details:", error.error);
  console.error("Name:", error.name);
  console.error("=======================================");

  return res.status(500).json({
    success: false,
    message: error.message || "Image upload failed",
    cloudinaryStatus: error.http_code || null,
  });
}
}
