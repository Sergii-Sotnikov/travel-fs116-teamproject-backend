

export const getAllStoriesController = async (req, res) => {
  res.json({
    status: 200,
    message: 'Successfully found stories!',
  });
};


export const createStoryController = async (req, res) => {

  res.status(201).json({
    status: 201,
    message: 'Successfully created a story!',

  });
};



export const patchStoryController = async (req, res) => {

  res.json({
    status: 200,
    message: `Successfully patched a story!`,
  });
};