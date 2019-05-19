import qoa from "qoa";

qoa.config({
  prefix: ">"
});

const ps = [
  {
    type: "input",
    query: "Name for command: ",
    handle: "name"
  },
  {
    type: "interactive",
    query: "What is type of command (Choose other if not in the list) ?",
    handle: "type",
    symbol: ">",
    menu: ["Other", "NodeJS"]
  },
  {
    type: "input",
    query:
      "Path where to execute command (D:\\MyProject etc) [default: current path]: ",
    handle: "projectPath"
  },
  {
    type: "input",
    query: "Actual command: ",
    handle: "cmd"
  }
];

export const startQuestions = async () => {
  try {
    const answers = await qoa.prompt(ps);
    return answers;
  } catch (error) {
    console.log("error:", error);
  }
};
