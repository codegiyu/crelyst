import mongoose, { Schema, model } from 'mongoose';
import { ModelTestimonial } from '../lib/types/constants';

const TestimonialSchema = new Schema<ModelTestimonial>(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientRole: {
      type: String,
      default: '',
    },
    companyName: {
      type: String,
      default: '',
    },
    companyLogo: {
      type: String,
      default: '',
    },
    clientImage: {
      type: String,
      default: '',
    },
    testimonial: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'testimonials',
  }
);

// Index for common queries
TestimonialSchema.index({ isFeatured: 1, displayOrder: 1 });
TestimonialSchema.index({ projectId: 1 });

export const Testimonial =
  mongoose.models.Testimonial || model<ModelTestimonial>('Testimonial', TestimonialSchema);
