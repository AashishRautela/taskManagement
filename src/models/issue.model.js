// src/models/Issue.js
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ENUMS } from '../utils/common/index.js';
import AppError from '../utils/errors/appError.js';

const issue = ENUMS.ISSUE;
const priority = ENUMS.PRIORITY;

const attachmentSubSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    size: { type: Number, min: 0 },
    mime: {
      type: String,
      trim: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [50, 'Title can not be more than 50 characters'],
      trim: true
    },
    key: {
      type: String,
      required: true,
      maxlength: [10, 'Key can not be more than 10 characters'],
      unique: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: [issue.TASK, issue.STORY, issue.SUBTASK, issue.BUG],
      index: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },

    priority: {
      type: String,
      enum: [
        priority.LOW,
        priority.MEDIUM,
        priority.HIGH,
        priority.CRITICAL,
        priority.BLOCKER
      ],
      default: priority.MEDIUM,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description can not be more than 500 characters'],
      trim: true
    },

    attachments: [attachmentSubSchema],

    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage',
      required: true,
      index: true
    },

    dueDate: { type: Date },

    originalEstimate: { type: Number, default: 0, min: 0 },
    spentEstimate: { type: Number, default: 0, min: 0 },

    // Optional labels / watchers
    labels: [
      {
        type: String,
        trim: true
      }
    ],
    watchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* ---------- Virtuals (derived, not stored) ---------- */
issueSchema.virtual('remainingEstimate').get(function () {
  const orig = this.originalEstimate || 0;
  const spent = this.spentEstimate || 0;
  return Math.max(0, orig - spent);
});

issueSchema.virtual('overrunMinutes').get(function () {
  const orig = this.originalEstimate || 0;
  const spent = this.spentEstimate || 0;
  return spent > orig ? spent - orig : 0;
});

/* ---------- Indexes for common queries ---------- */
issueSchema.index({ project: 1, epic: 1 });
issueSchema.index({ project: 1, parent: 1 });
issueSchema.index({ project: 1, assignee: 1, stage: 1 });
issueSchema.index({ project: 1, type: 1, priority: 1 });

/* ---------- Validation / Defaults (with AppError) ---------- */
issueSchema.pre('validate', async function (next) {
  try {
    // 1) Ensure default Stage before required validation triggers
    if (!this.stage) {
      const defaultStage = await mongoose
        .model('Stage')
        .findOne({ isDefault: true })
        .select('_id');

      if (defaultStage) {
        this.stage = defaultStage._id;
      } else {
        return next(
          new AppError(
            ['No default Stage configured.'],
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }

    next();
  } catch (err) {
    next(
      err instanceof AppError
        ? err
        : new AppError(
            [err?.message || 'Something went wrong while validating issue.'],
            StatusCodes.INTERNAL_SERVER_ERROR
          )
    );
  }
});

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
