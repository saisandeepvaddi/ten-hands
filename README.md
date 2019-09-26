# ten-hands

[![Build Status](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_apis/build/status/All%20OS?branchName=master)](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_build/latest?definitionId=4&branchName=master)

# What is this?

Do you keep opening terminals to run your scripts/commands/tasks etc,. If you have to do that everyday for same project (Example running scripts from `package.json` for multiple projects), `Ten Hands` makes it easier to organize all your tasks in one place.
You can organize tasks into projects and run them whenever you want with a click of a button.

# Sample UI (in v2.0.0)

|                  Dark                  |                  Light                  |
| :------------------------------------: | :-------------------------------------: |
| <img src="/docs/images/demo_dark.jpg"> | <img src="/docs/images/demo_light.jpg"> |

# Downloads

Downloads are available in `releases` section if you just want to download and run.

# Steps to build (To get latest features)

1. Install nodejs >= 10.6.0

2. Install dependencies (Use [_yarn_](https://yarnpkg.com/en/) because I used workspaces).

   - `yarn install`. Only in root folder.

3. To start in development mode - `yarn start:desktop`. (`yarn start:browser` to start browser version instead.)

4. To build the app - `yarn build:desktop` (Building for browser version not available yet.)

5. Installers for your platform will be available in `dist` folder.

# Note

This project can be run in browser instead of desktop version. But desktop version comes with additional features and is recommended. The following is the list of additional features available in desktop version.

1. Drag & Drop **package.json** to add project.
2. Link to open project directory in file explorer.

# Configuration

A `config.json` is supported which is placed at `~/.ten-hands/` path.

> {  
>  "port": 5010, // number  
>  "enableTerminalTheme": true // boolean  
> }

You have to restart the app when you change configuration.

## FAQ

This project is in experimental stage, so there are some limitations to use the app. Expect them to be resolved soon.

1. Can I create a project without `package.json`?

> Yes, a project in `ten-hands` is just a logical separation for task organization. It is **not** specific for running nodejs based projects. So, if you are not using a nodejs based project, simply create a project with any name. Then add your tasks with any name and command.

2. Does adding a task in a project updates the project's `package.json`?

> No, when you create a project from `package.json`, it extracts it's name, scripts, directory path (in desktop version) and saves in it's own database file. `package.json` is only useful to quickly create a project from file. You can add more tasks related or unrelated to this nodejs project once a project is created.

3. I just need to run global commands as tasks. Do I have to give a path? What path do I use?

> Yes, in that case, just give some valid path where the command has permissions to execute. Note that if you do not enter a path while creating task, it tries to execute in the project's path. This requirement of absolute paths allows to organize tasks that run at different locations in a single project.

4. Why do I see black color flashes on terminals when I switch projects?

> Terminal renders with default black color. Applying dark/light theme on all terminals taking time when there are large number of tasks in the project. I'm working on a solution. If you do not need theme on terminals, set `enableTerminalTheme` to `false` in config file which can make it responsive. Check [Configuration](#configuration) section for info.

5. My app doesn't start.

> Try changing the port in config file and restart the app.

6. My task automatically stops saying `process closed with code` right after clicking the start button.

> Check if task is running at correct location. By default, task is executed in the project directory path if no path entered at task creation time. Relative paths to project path _do not_ work. When you create a task, you either have to enter absolute path where the command needs to execute or leave empty to run it at project's path.

# Contributions

Please use issue tracker for any kind of bugs/suggestions/discussions.

# License

[MIT](/LICENSE) - Sai Sandeep Vaddi
