export const getUsersByIdController = async (req, res) => {
  
  res.status(200).json({
    status: 200,
    message: `Successfully found users with id!`,
  });
};


export const getMeProfileController = async (req, res) => {
  
  res.status(200).json({
    status: 200,
    message: ``,
  });
};


export const createMeSavedStoriesController = async (req, res) => {
  
  res.status(201).json({
    status: 201,
    message: 'Successfully created a story!',
  });
};


export const deleteMeSavedStoriesController = async (req, res) => {
  
res.status(204).send();
};


export const patchMeAvatarController = async (req, res) => {
  
  res.json({
    status: 200,
    message: `Successfully patched a avatar!`,

  });
};


export const patchMeController = async (req, res) => {
  
  res.json({
    status: 200,
    message: `Successfully patched my profile!`,

  });
};