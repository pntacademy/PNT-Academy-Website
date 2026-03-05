"use server";
import connectMongo from "@/lib/mongodb";
import Gallery from "@/lib/models/Gallery";
import School from "@/lib/models/School";
import Internship from "@/lib/models/Internship";

// Using Lean() for plain JSON objects to pass safely to Client Components
import SiteMetric from "@/lib/models/SiteMetric";

export async function incrementLiveVisits() {
    try {
        await connectMongo();
        // Increment the total_visits counter by 1, or create it if it doesn't exist
        const metric = await SiteMetric.findOneAndUpdate(
            { key: "total_visits" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        ).lean();
        return metric?.value || 0;
    } catch (error) {
        console.error("Failed to increment visits:", error);
        return 0;
    }
}
export async function getLiveGallery() {
    try {
        await connectMongo();
        const items = await Gallery.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch gallery:", error);
        return [];
    }
}

export async function getLiveSchools() {
    try {
        await connectMongo();
        const items = await School.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch schools:", error);
        return [];
    }
}

export async function getLiveInternships() {
    try {
        await connectMongo();
        const items = await Internship.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch internships:", error);
        return [];
    }
}
