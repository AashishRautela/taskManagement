import mongoose from 'mongoose';

const stageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['open', 'in-progress', 'closed'],
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#2EB6C9'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Stage', stageSchema);
