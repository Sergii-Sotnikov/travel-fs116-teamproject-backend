import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },

    avatarUrl: { type: String },
    articlesAmount: { type: Number },
    description: { type: String },


    email: { type: String, unique: true },
    password: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },

    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'articles', // або 'traveller', якщо статті зберігаються там
      },
    ], // почему не savedStory key?
  },

  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
