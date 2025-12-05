import { ACCOUNT_STATUSES, AuthUserRole, ModelAdmin, Permission } from '../lib/types/constants';
import mongoose, { Schema } from 'mongoose';

export const AdminSchema = new Schema<ModelAdmin>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: 'unverified',
    },
    email: { type: String, required: true, unique: true, index: true },
    avatar: { type: String, default: '' },
    auth: {
      password: {
        value: { type: String, required: true },
        passwordChangedAt: { type: Date },
      },
      roles: {
        type: [
          {
            _id: false,
            slug: {
              type: String,
              required: true,
            },
            roleId: {
              type: Schema.Types.ObjectId,
              ref: 'Role',
              required: true,
            },
          },
        ],
        validate: [
          {
            validator: function (value: Array<AuthUserRole>) {
              return value.length > 0;
            },
            message: 'There must be at least one role.',
          },
          {
            validator: function (roles: Array<AuthUserRole>) {
              const slugs = roles.map(r => r.slug);
              return new Set(slugs).size === slugs.length;
            },
            message: 'Duplicate role slug within roles array is not allowed.',
          },
        ],
      },
      permissions: {
        type: [
          {
            _id: false,
            slug: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String, required: true },
            isRestricted: { type: Boolean },
          },
        ],
        validate: [
          {
            validator: function (permissions: Array<Permission>) {
              const slugs = permissions.map(p => p.slug);
              return new Set(slugs).size === slugs.length;
            },
            message: 'Duplicate permission slug within permissions array is not allowed.',
          },
        ],
        default: [],
      },
      lastLogin: { type: Date },
      refreshTokenJTI: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    collection: 'admins',
  }
);

AdminSchema.pre(/^find/, function async(next) {
  next();
});

export const Admin =
  mongoose.models.Admin || mongoose.model<ModelAdmin>('Admin', AdminSchema);
