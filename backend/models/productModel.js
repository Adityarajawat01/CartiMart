import mongoose from "mongoose";

const productSchema =  new mongoose.Schema(
    {
    name:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    size:{
        type: String,
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    specifications:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
},{ timestamps: true }
);

export default mongoose.model("Product", productSchema);