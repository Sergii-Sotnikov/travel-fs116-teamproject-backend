export const parseFilterParams = (query) => {
  const filter = {};

  if (query.category) {
    filter.category = query.category;
  }

  if (query.ownerId) {
    filter.ownerId = query.ownerId;
  }

  return filter;
};
