import mongoose from 'mongoose';

const watcherSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ['epic', 'issue', 'project'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

watcherSchema.index(
  { entityType: 1, entityId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.model('Watcher', watcherSchema);
