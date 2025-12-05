import mongoose, { Schema } from 'mongoose';
import {
  ACCOUNT_STATUSES,
  AuthUserRole,
  GENDERS,
  ModelUser,
  Permission,
} from '../lib/types/constants';

// 🚫 Fields that cannot be updated
export const DISALLOWED_FIELDS = [
  '_id',
  '__v',
  'createdAt',
  'updatedAt',
  'googleId',
  'auth',
  'accountStatus',
  'email',
  'kyc',
];

export const unselectedFields = [
  '+auth.password',
  '+auth.password.value',
  '+auth.password.passwordChangedAt',
  '+auth.refreshTokenJTI',
  '+ísDeleted',
  '+deleteRequestedAt',
  '+deletionApprovedAt',
  '+deletionApprovedBy',
];

export const UserSchema = new Schema<ModelUser>(
  {
    googleId: { type: String, unique: true, sparse: true, index: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    title: { type: String },
    avatar: { type: String, default: '' },
    gender: { type: String, enum: GENDERS },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: 'unverified',
    },
    email: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, unique: true, sparse: true, index: true },
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
    kyc: {
      email: {
        isVerified: {
          type: Boolean,
          default: false,
        },
        data: {
          type: Schema.Types.Mixed,
        },
      },
      phoneNumber: {
        isVerified: {
          type: Boolean,
          default: false,
        },
        data: {
          type: Schema.Types.Mixed,
        },
      },
    },
    isDeleted: { type: Boolean, default: false },
    deleteRequestedAt: { type: Date },
    deletionApprovedAt: { type: Date },
    deletionApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

UserSchema.pre(/^find/, async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const User = mongoose.models.User || mongoose.model<ModelUser>('User', UserSchema);
