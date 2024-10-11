"use strict";

const fs = require("fs").promises; // Use built-in fs.promises
const config = require("./config");
const path = require("path");

module.exports = async function routes(app) {
  const controllerRootUrl = config.routes.controllerRootUrl;

  let controllersFolder = path.join(__dirname, "controllers");

  try {
    // Read all files in the controllers folder
    const files = await fs.readdir(controllersFolder);

    // Setup routes for all controllers
    files.forEach((file) => {
      /* eslint-disable global-require */
      let currentController = require(path.join(controllersFolder, file));
      currentController.routes(app, controllerRootUrl);
      /* eslint-enable global-require */
    });
  } catch (error) {
    console.error("Error setting up routes:", error);
    throw error;
  }
};
