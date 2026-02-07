'use server'

import { Event } from "@/database"
import connectDb from "../mongodb"

export const getSimilarEventsBySlug = async (slug: string) => {
  await connectDb()

  const event = await Event.findOne({ slug })
  if (!event) return []

  const similarEvents = await Event.find({
    _id: { $ne: event._id },
    tags: { $in: event.tags },
  }).lean()

  return similarEvents.map((ev) => ({
    ...ev,
    _id: ev._id.toString(), // React key safe
    date: ev.date,          // keep string
  }))
}