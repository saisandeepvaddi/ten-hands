const projects = require("./projects/projects.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(projects);
};
