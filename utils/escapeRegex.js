export const escapeRegex = (search) => {
  return search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
