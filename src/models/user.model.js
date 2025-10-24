import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: [4, 'User Name must contain 4 characters'],
      maxlength: [10, 'User Name can not be more than 15 characters'],
      unique: true,
      trim: true,
      index: 1
    },
    firstName: {
      type: String,
      required: true,
      maxlength: [15, 'First Name can not be more than 15 characters'],
      trim: true
    },
    lastName: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [50, 'Email can not be more than 50 characters']
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    profileColor: {
      type: String,
      default: '#F06D85'
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.methods.validatePassword = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);
  return isPasswordValid;
};

userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this?._id
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this?._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    }
  );
};

const User = mongoose.model('User', userSchema);
export default User;
