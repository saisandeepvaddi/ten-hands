const projects = [
    {
        id: "1",
        name: "Project 1",
        type: "node",
        configFile: "package.json",
        commands: [
            {
                name: "Start",
                command: "yarn start",
            },
            {
                name: "Dev",
                command: "yarn dev",
            },
        ],
    },
    {
        id: "2",
        name: "Project 2",
        type: "node",
        configFile: "package.json",
        commands: [
            {
                name: "Start",
                command: "npm start",
            },
            {
                name: "Dev",
                command: "npm dev",
            },
            {
                name: "Test",
                command: "npm test",
            },
        ],
    },
];

export const getProjects: () => Promise<any> = async () => {
    try {
        return Promise.resolve(projects);
    } catch (error) {
        console.log("error:", error);
    }
};
