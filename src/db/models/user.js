import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },

    avatarUrl: { type: String },
    articlesAmount: { type: Number, default: 0 },
    description: { type: String },

    email: { type: String, unique: true },
    password: { type: String },

    articles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'travellers' }],
      default: [],
      select: false,
    },

    savedArticles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'travellers' }],
      default: [],
    },
  },

  { timestamps: true, versionKey: false },
);

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
