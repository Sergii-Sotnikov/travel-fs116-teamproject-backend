import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },

    avatarUrl: { type: String },
    articlesAmount: { type: Number, default: 0 },
    description: { type: String },

    email: { type: String, unique: true },
    password: { type: String },

    savedStory: {
      type: [{ type: Schema.Types.ObjectId, ref: 'travellers' }],
      default: [],
    },
  },

  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
