import meow from "meow";
// import qoa from "qoa";

// qoa.prefix(">");

// const nameProps = {
//   type: "input",
//   query: "Name for Project: ",
//   handle: "name"
// };

// const projectPathProps = {
//   type: "input",
//   query:
//     "Directory Path where to execute command(s) (Full Path) [default: current directory]:",
//   handle: "projectPath"
// };

// const cmdProps = {
//   type: "input",
//   query: "Command: ",
//   handle: "cmd"
// };

// const cmdNameProps = {
//   type: "input",
//   query: "Name for Command: ",
//   handle: "cmdName"
// };

// const newCommandProps = {
//   type: "confirm",
//   query: "You want to add another command ?",
//   handle: "wantNewCommand",
//   accept: "Y",
//   deny: "n"
// };

// export const getProjectName = async () => {
//   try {
//     const answer = await qoa.prompt([nameProps]);
//     return answer.name;
//   } catch (error) {
//     console.log(`Error at asking project name: `);
//     console.error(error);
//   }
// };

// export const getProjectPath = async () => {
//   try {
//     const answer = await qoa.prompt([projectPathProps]);
//     return answer.projectPath;
//   } catch (error) {
//     console.log(`Error at asking project path: `);
//     console.error(error);
//   }
// };

// export const getCommandName = async () => {
//   try {
//     const answer = await qoa.prompt([cmdNameProps]);
//     return answer.cmdName;
//   } catch (error) {
//     console.log(`Error at asking project path: `);
//     console.error(error);
//   }
// };

// export const getActualCommand = async () => {
//   try {
//     const answer = await qoa.prompt([cmdProps]);
//     return answer.cmd;
//   } catch (error) {
//     console.log(`Error at asking project path: `);
//     console.error(error);
//   }
// };

// export const checkIfUserWantsMoreCommands = async () => {
//   try {
//     const answer = await qoa.prompt([newCommandProps]);
//     return answer.wantNewCommand;
//   } catch (error) {
//     console.log(`Error at asking project path: `);
//     console.error(error);
//   }
// };

// export const startQuestions = async () => {
//   try {
//     let answers = {
//       name: null,
//       type: "other",
//       projectPath: null,
//       cmds: []
//     };

//     let cmds = [];
//     answers.name = await getProjectName();
//     answers.projectPath = await getProjectPath();

//     let firstCommandName = await getCommandName();
//     let firstCommand = await getActualCommand();
//     cmds.push({ name: firstCommandName, cmd: firstCommand });

//     while (await checkIfUserWantsMoreCommands()) {
//       let newCommandName = await getCommandName();
//       let newCommand = await getActualCommand();
//       cmds.push({ name: newCommandName, cmd: newCommand });
//     }

//     answers.cmds = cmds.slice();
//     return answers;
//   } catch (error) {
//     console.log("error:", error);
//   }
// };

export const serverCLI = meow(`
  Usage
    $ ten-hands <input>

  Examples
    $ ten-hands start
`);
