import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { emailRegexp } from '../../constants/auth.js';
import { handleSaveError, setUpdateSetting } from '../hooks.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, match: emailRegexp, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    onboardingCompleted: { type: Boolean, default: false },
    savedStories: [{ type: Schema.Types.ObjectId, ref: 'stories' }],
    settings: {
      darkMode: { type: Boolean, default: false },
    },
    socialLinks: {
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSetting);
userSchema.post('findOneAndUpdate', handleSaveError);

export const UserCollection = model('user', userSchema);