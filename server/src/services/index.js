const projects = require("./projects/projects.service.js");
const jobs = require("./jobs/jobs.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(projects);
  app.configure(jobs);
};
