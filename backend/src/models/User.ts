import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  clerkId: { type: String, required: true, unique: true },
  role: { type: String, default: "user" },
});

export default mongoose.model<IUser>("User", UserSchema);
