import { Event } from "@/database"
import connectDb from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"


type RouteParams = {
    params: Promise<{
        slug: string
    }>
}

export async function GET (
    req: NextRequest,
    {params}: RouteParams
): Promise<NextResponse> {
    try {
        await connectDb()
        const {slug} = await params;

        if(!slug || typeof slug !== 'string' || slug.trim() === '') {
            return NextResponse.json(
                {message: "Invalid pr missing slug parameter"},
                {status: 400}
            )
        }

        const sanitizeSlug = slug.trim().toLowerCase()

        const event = await Event.findOne({slug: sanitizeSlug}).lean()

        if(!event) {
            return NextResponse.json(
                {message: `Event with slug ${sanitizeSlug} not found`},
                {status: 400}
            )
        }

        return NextResponse.json(
            {message: "Event fetched successfully!", event},
            {status: 200}
        )
    } catch (error) {
        if(process.env.NODE_ENV==="production") {
            console.error("Error fetching events by slug", error)
        }

        if(error instanceof Error) {
            if(error.message.includes('MONGODB_URI')) {
                return NextResponse.json(
                    {message: "Db configuration error!"},
                    {status: 500}
                )
            }

            return NextResponse.json(
                {message: "Failed to fetch events", error: error.message},
                {status: 500}
            )
        }

        return NextResponse.json(
            {message: "An unexpected error occured"},
            {status: 500}
        )
        
    }
}