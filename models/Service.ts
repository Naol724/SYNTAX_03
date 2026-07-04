import mongoose, { Schema, model, models } from 'mongoose';

export interface IService extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  features: string[];
  price?: number;
  category: string;
  icon: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    features: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'code',
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Create index for slug
ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ isActive: 1, isFeatured: 1 });

const Service = models.Service || model<IService>('Service', ServiceSchema);

export default Service;
