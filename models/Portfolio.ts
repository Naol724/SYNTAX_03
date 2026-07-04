import mongoose, { Schema, model, models } from 'mongoose';

export interface IPortfolio extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  images: string[];
  technologies: string[];
  clientName?: string;
  clientWebsite?: string;
  liveUrl?: string;
  githubUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    technologies: {
      type: [String],
      default: [],
    },
    clientName: {
      type: String,
      trim: true,
    },
    clientWebsite: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
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
PortfolioSchema.index({ slug: 1 });
PortfolioSchema.index({ category: 1 });
PortfolioSchema.index({ isFeatured: 1 });

const Portfolio = models.Portfolio || model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
