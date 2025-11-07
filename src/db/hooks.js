// src/db/hooks.js

export const handleSaveError = (error, doc, next) => {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};

export const setUpdateSetting = function (next) {
  this.options.runValidators = true;
  this.options.new = true;
  next();
};