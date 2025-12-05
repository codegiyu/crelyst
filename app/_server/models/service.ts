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
