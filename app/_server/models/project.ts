import mongoose, { Schema, model } from 'mongoose';
import { ModelProject, PROJECT_STATUSES } from '../lib/types/constants';
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

const ProjectSchema = new Schema<ModelProject>(
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
    featuredImage: {
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
    images: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: '',
      index: true,
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'draft',
      index: true,
    },
    clientName: {
      type: String,
      default: '',
    },
    clientWebsite: {
      type: String,
      default: '',
    },
    projectUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
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
    collection: 'projects',
  }
);

// Slug generation middleware
const slugMiddleware = createSlugMiddleware<ModelProject>('title');
ProjectSchema.pre('save', slugMiddleware.preSave);
ProjectSchema.pre(/update/i, slugMiddleware.preUpdate);

// Index for common queries
// Note: slug already has an index from unique: true, so we don't need to index it again
ProjectSchema.index({ status: 1, isFeatured: 1, displayOrder: 1 });
ProjectSchema.index({ category: 1, status: 1 });

export const Project = mongoose.models.Project || model<ModelProject>('Project', ProjectSchema);
