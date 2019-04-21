const { createdAt, updatedAt } = require("../../hooks/dates");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createdAt()],
    update: [updatedAt()],
    patch: [updatedAt()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
