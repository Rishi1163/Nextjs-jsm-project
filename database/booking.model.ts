import {
  Schema,
  model,
  models,
  Types,
  HydratedDocument,
} from "mongoose";
import Event from "./event.model";

/**
 * ✅ Plain data interface (NO Document extension)
 */
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ✅ Booking Schema
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event id is required"],
    },
    email: {
      type: String,
      required: [true, "Email id is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ✅ Pre-save hook to validate Event existence
 * - Uses HydratedDocument
 * - Uses async/await (NO next())
 * - Throws errors properly
 */
BookingSchema.pre(
  "save",
  async function (this: HydratedDocument<IBooking>) {
    if (this.isNew || this.isModified("eventId")) {
      const eventExists = await Event.findById(this.eventId).select("_id");

      if (!eventExists) {
        const error = new Error(
          `Event with id ${this.eventId} does not exist`
        );
        error.name = "ValidationError";
        throw error;
      }
    }
  }
);

/**
 * ✅ Indexes for performance & constraints
 */
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "uniq_event_email" }
);

/**
 * ✅ Model export (Next.js safe)
 */
const Booking =
  models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
