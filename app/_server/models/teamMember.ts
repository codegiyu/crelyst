import mongoose, { Schema, model } from 'mongoose';
import { ModelTeamMember } from '../lib/types/constants';

const TeamMemberSchema = new Schema<ModelTeamMember>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    socials: {
      linkedin: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      github: {
        type: String,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },
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
    collection: 'teamMembers',
  }
);

// Index for common queries
TeamMemberSchema.index({ isActive: 1, displayOrder: 1 });

export const TeamMember =
  mongoose.models.TeamMember || model<ModelTeamMember>('TeamMember', TeamMemberSchema);
