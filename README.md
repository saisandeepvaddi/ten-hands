# ten-hands

[![Build Status](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_apis/build/status/All%20OS?branchName=master)](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_build/latest?definitionId=4&branchName=master)

# What is this?

Do you keep opening terminals to run your scripts/commands/tasks etc,. If you have to do that everyday for same project (Example running scripts from `package.json` for multiple projects), `Ten Hands` makes it easier to organize all your tasks in one place.
You can organize tasks into projects and run them whenever you want with a click of button.

# Sample UI

|                  Dark                  |                  Light                  |
| :------------------------------------: | :-------------------------------------: |
| <img src="/docs/images/demo_dark.PNG"> | <img src="/docs/images/demo_light.PNG"> |

# Downloads

Downloads are available in `releases` section.

> **IMPORTANT NOTE**: I couldn't afford signing certificates. So, you'll have to allow the app to run.

# Steps to build

1. Install dependencies (Use _yarn_ because I used workspaces).

   - `yarn install`. Only in root folder.

2. To start in development mode - `yarn start:desktop`

3. To build the app - `yarn build:desktop`

4. Installers will be available in `dist` folder.

## Note 

I am making updates in `v2.0.0` branch. Check Projects tab to see what I'm working on. You can pull and build that branch to get latest updates (with a risk of getting unstable build).

# Configuration

A `config.json` is supported which is placed at `~/.ten-hands/` path.

> Currently, only `port` option can be changed. Default port is `5010`.

## Gotchas & Tips

This project is in experimental stage, so there are some limitations to use the app. Expect them to be resolved soon.

1. Currently, tasks can be extracted only from `package.json`. But, If you have other type of project, you can create a project without any such file. Then, add the tasks using `New Command` button inside the project.

2. Every project when opened, will render terminals for all the tasks in the project which can be costly based on the number of tasks. So, if you do not use a certain command, consider deleting it (not from your project file. Inside `Ten Hands`). This will make project switching faster. Performance will improve in coming versions.

3. The default port is `5010`. If app doesn't start, try changing the port in `~/.ten-hands/config.json` to any one that is not being used and reopen the app.

# Contributions

This project started as educational for myself to learn more about react hooks, sockets, typescript and other stuff. So there might be some weirdness around the code.

Please create issue/pr for any kind of improvements/suggestions regardless of how small it is.

# License

[MIT](/LICENSE) - Sai Sandeep Vaddi
