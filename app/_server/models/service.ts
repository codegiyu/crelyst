import mongoose, { Schema, model } from 'mongoose';
import { ModelService } from '../lib/types/constants';
import { createSlugMiddleware } from '../lib/utils/slugify';

const SEOSchema = new Schema(
  {
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const ServiceSchema = new Schema<ModelService>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    cardImage: {
      type: String,
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    // Expanded fields
    process: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    pricing: {
      startingPrice: { type: Number },
      priceRange: { type: String },
      pricingModel: {
        type: String,
        enum: ['fixed', 'hourly', 'project-based', 'subscription', 'custom'],
        default: 'custom',
      },
      currency: { type: String, default: 'USD' },
      notes: { type: String },
    },
    duration: {
      minWeeks: { type: Number },
      maxWeeks: { type: Number },
      typicalDuration: { type: String },
    },
    videoUrl: {
      type: String,
      default: '',
    },
    faq: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    additionalContent: {
      type: [
        {
          title: { type: String, required: true },
          content: { type: String, required: true },
          type: { type: String, enum: ['text', 'html', 'markdown'], default: 'text' },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    relatedServices: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
      default: [],
    },
    testimonials: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Testimonial' }],
      default: [],
    },
    caseStudies: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    seo: {
      type: SEOSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    collection: 'services',
  }
);

// Slug generation middleware
const slugMiddleware = createSlugMiddleware<ModelService>('title');
ServiceSchema.pre('save', slugMiddleware.preSave);
ServiceSchema.pre(/update/i, slugMiddleware.preUpdate);

// Index for common queries
// Note: slug already has an index from unique: true, so we don't need to index it again
ServiceSchema.index({ isActive: 1, displayOrder: 1 });

export const Service = mongoose.models.Service || model<ModelService>('Service', ServiceSchema);
