import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 80 },
    description: { type: String, required: true, maxlength: 2500 },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    storyImage: { type: String, required: true },
  },
  { timestamps: true },
);

const Story = mongoose.model('Story', storySchema);
export default Story;
