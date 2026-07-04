import mongoose, { Schema, model, models } from 'mongoose';

export interface ITestimonial extends mongoose.Document {
  clientName: string;
  clientTitle: string;
  company: string;
  rating: number;
  comment: string;
  avatar?: string;
  isApproved: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientTitle: {
      type: String,
      required: [true, 'Client title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TestimonialSchema.index({ isApproved: 1, isFeatured: 1 });

const Testimonial = models.Testimonial || model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
