import mongoose, { Schema, model, models } from 'mongoose';

export interface IBooking extends mongoose.Document {
  service: mongoose.Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  company?: string;
  preferredDate: Date;
  budget: string;
  message: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  adminNotes?: string;
  confirmedDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    clientPhone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    budget: {
      type: String,
      required: [true, 'Budget is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
    },
    confirmedDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ clientEmail: 1 });
BookingSchema.index({ service: 1 });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
