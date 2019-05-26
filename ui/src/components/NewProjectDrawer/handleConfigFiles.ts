import { v4 as uuidv4 } from "uuid";

// This is a project parser function which takes data of FileReader.
// These functions can be added by users to parse config files of framework of their choice.
const nodeConfigFileParser = (file: ITenHandsFile): IProject | null => {
    const project: IProject = {
        name: "",
        type: "",
        commands: [],
        path: "",
        configFile: "",
    };
    try {
        // Return if file came as null, otherwise, cant do JSON.parse later
        if (!file.data) {
            return null;
        }

        project.configFile = file.name;

        if (!project.configFile.endsWith(".json")) {
            return null;
        }

        // NodeJS projects use package.json, so parse package.json file
        const packageJsonData = JSON.parse(file.data.toString());

        if (file.path) {
            project.path = file.path;
        } else if (packageJsonData.tenHands) {
            // Browsers don't let read the file paths on FS.
            // So if config files have tenHandsConfig with users mentioning path, take it
            const userConfig = packageJsonData.tenHands;
            project.path = userConfig.path ? userConfig.path : "";
        } else {
            project.path = "";
        }

        project.name = packageJsonData.name;
        project.type = "nodejs";
        project.commands = Object.entries(packageJsonData.scripts).map(script => {
            const [name, cmd] = script;
            return {
                _id: uuidv4(),
                name,
                cmd: cmd.toString(),
                execDir: "./",
            };
        });
        return project;
    } catch (error) {
        return null;
    }
};

const projectParsers = [nodeConfigFileParser];

const getProjectData = (file: ITenHandsFile): IProject | null => {
    for (const parser of projectParsers) {
        const parsedData = parser(file);
        // Return the result of first parser or null
        if (parsedData === null) {
            continue;
        }
        // If it is recognized as node project just return without proceeding
        return parsedData;
    }
    return null;
};

export default (file: ITenHandsFile): IProject | null => {
    if (file.data !== null) {
        const project = getProjectData(file);
        return project;
    }
    return null;
};
