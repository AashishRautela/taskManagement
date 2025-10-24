import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Project name must be at least 3 characters'],
      maxlength: [50, 'Project name must be less than 50 characters']
    },
    key: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      minlength: [2, 'Key must be at least 2 characters'],
      maxlength: [10, 'Key must be less than 10 characters']
    },
    status: {
      type: String,
      enum: ['backlog', 'active', 'on-hold', 'completed', 'archived'],
      default: 'active'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    defaultAssignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.startDate || !value || value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    projectIcon: {
      type: String,
      trim: true,
      default: ''
    },
    issueSeq: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

projectSchema.pre('save', function (next) {
  if (!this.key && this.name) {
    const trimmed = this.name.trim();
    const words = trimmed.split(/\s+/);

    if (words.length === 1 && trimmed.length <= 4) {
      this.key = trimmed.toUpperCase();
    } else {
      const acronym = words
        .map((w) => w[0])
        .join('')
        .toUpperCase();
      this.key = acronym.substring(0, 10);
    }
  }
  next();
});

projectSchema.statics.reserveIssueKey = async function (projectId) {
  const doc = await this.findByIdAndUpdate(
    projectId,
    { $inc: { issueSeq: 1 } },
    { new: true, select: 'key issueSeq' }
  );
  return `${doc.key}-${doc.issueSeq}`;
};

const Project = mongoose.model('Project', projectSchema);
export default Project;
