// const execSync = require("child_process").execSync;

// const getServerPath = async () => {
//   try {
//     const npmStdOut = execSync(`npm list -g --depth 0`);
//     const globalPackageList = npmStdOut
//       .toString()
//       .toLowerCase()
//       .replace(/\s|\n/g, "");

//     const isServerInstalled =
//       globalPackageList.indexOf("@ten-hands/server") > -1;
//   } catch (error) {
//     console.log(`Error: `);
//     console.log(error);
//   }
// };

// export const startServer = async () => {
//   try {
//     console.log(await getServerPath());
//   } catch (error) {}
// };
