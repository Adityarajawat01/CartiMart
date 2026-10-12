import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import orderRouter from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoute.js";
import adminRouter from "./routes/adminRoutes.js";
import ensureAdminAccount, {
  validateAdminConfiguration,
} from "./utils/ensureAdminAccount.js";

const app = express();
const PORT = process.env.PORT || 8000

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const validateEnvironment = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }

  if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
    throw new Error("CORS_ORIGINS must list the deployed frontend origin in production.");
  }

  if (process.env.NODE_ENV === "production") {
    for (const origin of allowedOrigins) {
      let parsedOrigin;
      try {
        parsedOrigin = new URL(origin);
      } catch {
        throw new Error("Each production CORS_ORIGINS entry must be a valid HTTPS origin.");
      }

      if (parsedOrigin.protocol !== "https:" || parsedOrigin.origin !== origin) {
        throw new Error("Each production CORS_ORIGINS entry must be an exact HTTPS origin without a path or trailing slash.");
      }
    }
  }

  validateAdminConfiguration();
};

app.use(cors({
  origin(origin, callback) {
    if (!origin || process.env.NODE_ENV !== "production" || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("This origin is not allowed by CORS."));
  },
}));
app.use(express.json());   // json data parsing
app.use(express.urlencoded({ extended: true}));  //parsing form data


app.get("/", (req, res) => {
  res.redirect(302, allowedOrigins[0]);
})

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is working",
  });
});

app.use("/api/users", userRoutes);
app.use("/api", productRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);

try {
  validateEnvironment();
} catch (error) {
  console.error("Startup configuration error:", error.message);
  process.exit(1);
}

connectDb().then(() => {
    ensureAdminAccount().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
    }).catch((error) => {
        console.error("Administrator account setup failed:", error.message);
        process.exit(1);
    });
});
