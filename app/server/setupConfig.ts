const path = require("path");
const fs = require("fs-extra");

export const configFilePath = path.join(
  require("os").homedir(),
  ".ten-hands",
  "config.json"
);

const createIfConfigFileNotExist = async () => {
  try {
    await fs.outputJson(configFilePath, { port: 1010 });
  } catch (error) {
    console.error(error);
  }
};

export const getConfig = async () => {
  try {
    await createIfConfigFileNotExist();
    const config = await fs.readJson(configFilePath);
    return config;
  } catch (error) {
    console.error(error);
  }
};
