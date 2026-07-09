module.exports = {
  '*.{ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{js,json,md,yml,yaml}': ['prettier --write'],
};
