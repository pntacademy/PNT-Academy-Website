import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Gallery from "@/lib/models/Gallery";
import School from "@/lib/models/School";
import Internship from "@/lib/models/Internship";
import SiteMetric from "@/lib/models/SiteMetric";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectMongo();

        // 1. Get counts for each collection
        const [galleryCount, schoolsCount, internshipsCount, visitsMetric] = await Promise.all([
            Gallery.countDocuments({}),
            School.countDocuments({}),
            Internship.countDocuments({}),
            SiteMetric.findOne({ key: "total_visits" }).lean()
        ]);

        const totalVisits = visitsMetric?.value || 0;

        // 2. Get database storage stats
        // We use mongoose.connection.db.stats() to get the size
        let dbSizeInBytes = 0;
        if (mongoose.connection.db) {
            const stats = await mongoose.connection.db.stats();
            dbSizeInBytes = stats.dataSize + stats.indexSize; // Total logical size
        }

        return NextResponse.json({
            success: true,
            data: {
                galleryCount,
                schoolsCount,
                internshipsCount,
                totalVisits,
                dbSizeInBytes,
            }
        });
    } catch (error: any) {
        console.error("Failed to fetch admin stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stats", details: error.message },
            { status: 500 }
        );
    }
}
