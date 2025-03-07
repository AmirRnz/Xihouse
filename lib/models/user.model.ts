import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
//Virtual for full name
// userSchema.virtual("fullName").get(function () {
//     return `${this.firstName} ${this.lastName}`;
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
