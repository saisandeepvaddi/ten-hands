module.exports = {
  createdAt() {
    return context => {
      context.data.createdAt = new Date().getTime();
    };
  },
  updatedAt() {
    return context => {
      context.data.updatedAt = new Date().getTime();
    };
  }
};
