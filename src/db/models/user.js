import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateSetting, hashPassword } from '../hooks.js';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },

    avatarUrl: {
      type: String,
      default:
        'https://res.cloudinary.com/dcyt4kr5s/image/upload/v1762684805/avatars/ycozq7nun3lbze83tjsk.png',
    },

    articlesAmount: { type: Number, default: 0 },
    description: { type: String },

    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },

    articles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'travellers' }],
      default: [],
      select: false,
    },

      savedStories: {
      type: [{ type: Schema.Types.ObjectId, ref: 'travellers' }],
      default: [],
      select: false,
    },
    savedAmount: { type: Number, default: 0, select: false },
  },
  { timestamps: true, versionKey: false },
);

// хуки
usersSchema.pre('save', hashPassword);
usersSchema.post('save', handleSaveError);
usersSchema.pre('findOneAndUpdate', setUpdateSetting);
usersSchema.post('findOneAndUpdate', handleSaveError);

usersSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.email;
    delete ret.password;
    return ret;
  },
});

usersSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.email;
    delete ret.password;
    return ret;
  },
});

export const UsersCollection = model('users', usersSchema);
