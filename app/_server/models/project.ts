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
    // Expanded fields
    challenge: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
    approach: {
      type: String,
      default: '',
    },
    results: {
      type: String,
      default: '',
    },
    metrics: {
      type: [
        {
          label: { type: String, required: true },
          value: { type: String, required: true },
          icon: { type: String },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    timeline: {
      type: [
        {
          phase: { type: String, required: true },
          description: { type: String, required: true },
          startDate: { type: Date },
          endDate: { type: Date },
          status: {
            type: String,
            enum: ['planned', 'in-progress', 'completed', 'on-hold'],
            default: 'planned',
          },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    teamMembers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'TeamMember' }],
      default: [],
    },
    challengesFaced: {
      type: [
        {
          challenge: { type: String, required: true },
          solution: { type: String, required: true },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    lessonsLearned: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: '',
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
    relatedProjects: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
      default: [],
    },
    testimonials: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Testimonial' }],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    budget: {
      amount: { type: Number },
      currency: { type: String, default: 'USD' },
      range: { type: String },
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
