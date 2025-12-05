import mongoose, { Schema, model } from 'mongoose';
import { ModelBrand } from '../lib/types/constants';

const BrandSchema = new Schema<ModelBrand>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      default: '',
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
  },
  {
    timestamps: true,
    collection: 'brands',
  }
);

// Index for common queries (for marquee display)
BrandSchema.index({ isActive: 1, displayOrder: 1 });

export const Brand = mongoose.models.Brand || model<ModelBrand>('Brand', BrandSchema);
