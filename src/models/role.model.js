import mongoose from 'mongoose';

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['owner', 'admin', 'manager', 'developer', 'qa', 'viewer'],
      trim: true
    },
    permissions: {
      task: {
        type: [String],
        enum: ['create', 'edit', 'delete', 'view'],
        default: []
      },
      project: {
        type: [String],
        enum: ['create', 'edit', 'delete', 'view'],
        default: []
      },
      member: {
        type: [String],
        enum: ['add', 'remove', 'view'],
        default: []
      }
    }
  },
  {
    timestamps: true
  }
);

const Role = mongoose.model('Role', roleSchema);
export default Role;
