import { v4 as uuidv4 } from "uuid";
import { isRunningInElectron } from "../../utils/electron";

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

        let shouldRunWithYarn = false;

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

        if (isRunningInElectron()) {
            try {
                const fs = require("fs");
                const path = require("path");
                if (fs.existsSync(path.join(file.path, "yarn.lock"))) {
                    console.log("yarn.lock exists at file path. Using yarn to run scripts.");
                    // yarn.lock exists
                    shouldRunWithYarn = true;
                } else {
                    console.log("yarn.lock doesn't exist at file path. Using npm to run scripts.");
                    shouldRunWithYarn = false;
                }
            } catch (err) {
                console.error(err);
                shouldRunWithYarn = false;
            }
        }

        project.name = packageJsonData.name;
        project.type = "nodejs";
        const scriptsInPackageJson = packageJsonData.scripts;
        if (scriptsInPackageJson && typeof scriptsInPackageJson === "object") {
            project.commands = Object.keys(scriptsInPackageJson).map(name => {
                // Instead of running actual command, run yarn cmd or npm run cmd.
                // Reason, getting '.' is not recognized errors might happen if cmd is ran directly
                return {
                    _id: uuidv4(),
                    name,
                    cmd: shouldRunWithYarn ? `yarn ${name}` : `npm run ${name}`,
                    execDir: "",
                };
            });
        } else {
            project.commands = [];
        }
        return project;
    } catch (error) {
        console.log("nodeConfigFileParser error:", error);
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
