import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
    name: string;
    role: string;
    quote: string;
    imageUrl: string;
    page: "home" | "lab" | "college"; // which page this testimonial appears on
    createdAt: Date;
}

const TestimonialSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    quote: { type: String, required: true },
    imageUrl: { type: String, required: true },
    page: { type: String, enum: ["home", "lab", "college"], default: "home" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
