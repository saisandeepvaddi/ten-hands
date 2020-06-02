import chalk from "chalk";

const isWindows = process.platform === "win32";

console.log(`

  ---------------------------------------------
 
  ${chalk.greenBright("$> ten-hands start")}
 
  ---------------------------------------------

  - Use config file at ${
    isWindows
      ? chalk.cyan("C:\\Users\\[username]\\.ten-hands\\config.json")
      : chalk.cyan("~/.ten-hands/config.json")
  } to change any options such as port.

  - Visit ${chalk.blue.underline(
    "https://github.com/saisandeepvaddi/ten-hands/wiki/Configuration"
  )} for available options.


`);
