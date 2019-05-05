// taken from FileReader interface in lib.dom.d.ts
type ReaderResult = string | ArrayBuffer | null;

// This is a project parser function which takes data of FileReader.
// These functions can be added by users to parse config files of framework of their choice.
const nodeConfigFileParser = (file: File, readerResult: ReaderResult): IProject | null => {
    const project: IProject = {
        name: "",
        type: "",
        commands: [],
        path: "",
        configFile: "",
    };
    try {
        // Return if file came as null, otherwise, cant do JSON.parse later
        if (!readerResult) {
            return null;
        }

        project.configFile = file.name;

        if (!project.configFile.endsWith(".json")) {
            return null;
        }

        // Node projects use package.json, so parse package.json file
        const data = JSON.parse(readerResult.toString());

        if (data.tenHandsConfig) {
            // Browsers don't let read the file paths on FS.
            // So if config files have tenHandsConfig with users mentioning path, take it
            const userConfig = data.tenHandsConfig;
            project.path = userConfig.path ? userConfig.path : "";
        }
        project.name = data.name;
        project.type = "nodejs";
        project.commands = Object.entries(data.scripts).map(script => {
            const [name, cmd] = script;
            return {
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

const getProjectData = (file: File, readerResult: ReaderResult): IProject | null => {
    for (const parser of projectParsers) {
        const parsedData = parser(file, readerResult);
        // Return the result of first parser or null
        if (parsedData === null) {
            continue;
        }
        // If it is recognized as node project just return without proceeding
        return parsedData;
    }
    return null;
};

export default (file: File, readerResult: ReaderResult): IProject | null => {
    if (readerResult !== null) {
        const project = getProjectData(file, readerResult);
        return project;
    }
    return null;
};
