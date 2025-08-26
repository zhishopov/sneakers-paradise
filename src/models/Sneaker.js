import { Schema, model, Types } from "mongoose";

const isValidImageUrl = (value) => /^https?:\/\//.test(value);

const sneakerSchema = new Schema({
  brand: {
    type: String,
    required: [true, "Brand is required"],
    minlength: [3, "Brand must be at least 3 characters long"],
  },
  model: {
    type: String,
    required: [true, "Model is required"],
    minlength: [5, "Model must be at least 5 characters long"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  condition: {
    type: String,
    required: [true, "Condition is required"],
    minlength: [3, "Condition must be at least 3 characters long"],
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: [1000, "Year must be exactly 4 digits"],
    max: [9999, "Year must be exactly 4 digits"], // Ensure year is exactly 4 digits
  },
  size: {
    type: Number,
    required: [true, "Size is required"],
    min: [0, "Size must be a positive number"], // Ensure size is positive
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [150, "Description must be less than 150 characters long"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: [
      isValidImageUrl,
      "Image URL must start with http:// or https://",
    ],
  },
  preferredList: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  creator: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Sneaker = model("Sneaker", sneakerSchema);

export default Sneaker;
