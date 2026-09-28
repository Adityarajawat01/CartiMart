import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import productRoutes from "./routes/productRoutes.js"

const app = express();
const PORT = process.env.PORT || 8000

app.use(cors());
app.use(express.json());   // json data parsing
app.use(express.urlencoded({ extended: true}));  //parsing form data


app.get("/", (req, res) => {
    console.log("hello");
    res.send("hello friends");
})

app.use("/api", productRoutes);

connectDb();

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})