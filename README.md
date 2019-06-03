# ten-hands

| Module           | Build Status                                                                                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop: Windows | [![Build Status](<https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_apis/build/status/saisandeepvaddi.ten-hands%20(2)?branchName=master>)](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_build/latest?definitionId=3&branchName=master) |

# What is this?

Do you keep opening large number of terminals to run your scripts/commands/tasks etc,. If you have to do that everyday for same project (Example running scripts from package.json for multiple projects), `Ten-Hands` makes it easier to organize all your tasks in one place.
You can save any tasks organized into projects and run them whenever you want with a click of button.

# Sample UI

|                  Dark                  |                  Light                  |
| :------------------------------------: | :-------------------------------------: |
| <img src="/docs/images/demo_dark.PNG"> | <img src="/docs/images/demo_light.PNG"> |

### Steps to build

1. Install dependencies (Use yarn because I used workspaces).
   - `yarn install`. Only in parent folder. Do not have to install inside any directories.
2. Build.
   - To build Desktop App - `yarn build:desktop`
3. Releases will be available in `dist` folder.

### Configuration

A `config.json` is supported which is placed at `~/.ten-hands/` path.

> Currently, only `port` option can be changed. Default port is `1010`.

## Some gotchas

This project is in experimental stage, so there are some limitations to use the app. Expect them to be resolved soon.

1. Currently, only package.json can be automatically uploaded.
2. But, you can add any type of commands to existing projects.
3. You can even create project without uploading any config files and then add custom commands. This is useful when your project doesn't have `package.json`.
4. Recognizing multiple frameworks' tasks is in roadmap.

# Contributions

This project started as educational for myself to get my hands dirty with react hooks, sockets, typescript and other stuff. So expect some weirdness around the code.
Please create issue/pr for any kind of improvements/suggestions regardless of how small it is.

# License

[MIT](/LICENSE) - Sai Sandeep Vaddi
