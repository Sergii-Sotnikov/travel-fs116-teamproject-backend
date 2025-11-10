import { model, Schema } from 'mongoose';

const travellersSchema = new Schema(
  {
    img: {
      type: String,
      required: true,
      trim:true,
    },
    title: {
      type: String,
      maxlength: 80,
      required: true,
      trim:true,
    },
    article: {
      type: String,
      maxlength: 2500,
      required: true,
      trim:true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
      min:0
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TravellersCollection = model('travellers', travellersSchema);
