import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  date: Date;
}

const ItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IItem>("Item", ItemSchema);
