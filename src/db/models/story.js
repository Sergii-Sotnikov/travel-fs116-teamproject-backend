import { Schema, model } from 'mongoose';
import { STORY_CATEGORIES } from '../../constants/validation.js';

const storySchema = new Schema(
  {
    img: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    article: {
      type: String,
      required: [true, 'Article is required'],
      trim: true,
    },
    fullText: {
      type: String,
      required: [true, 'Full text is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: STORY_CATEGORIES,
      required: [true, 'Category is required'],
    },
    rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

storySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const StoriesCollection = model('story', storySchema);