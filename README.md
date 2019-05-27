# ten-hands

| Module           | Build Status                                                                                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop: Windows | [![Build Status](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_apis/build/status/saisandeepvaddi.ten-hands%20(2)?branchName=master)](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_build/latest?definitionId=3&branchName=master) |

# What is this?

Do you keep opening large number of terminals to run your scripts/commands/tasks or whatever. If you have to do that everyday for same project (Example running scripts from package.json for multiple projects), `Ten-Hands` makes it easier to organize all your tasks in one place.
You can save any tasks organized into projects and run them whenever you want with a click of button.

# Sample UI

|                  Dark                  |                  Light                  |
| :------------------------------------: | :-------------------------------------: |
| <img src="/docs/images/demo_dark.PNG"> | <img src="/docs/images/demo_light.PNG"> |

# Downloads

Official Builds coming soon....

# How to build yourself?

For now, please use electron app which has best support.

### Steps to build:

1. Install dependencies (Use yarn because I used workspaces).
2. Currently, build scripts available for Desktop App and CLI. Web App build will be added soon.
   - To build Desktop App - `yarn build:desktop`
   - To build CLI App - `yarn build:cli`
3. Releases will be available in `dist` folder.

#### CLI

1. Use `npm link` to use cli app. (Here use npm instead of yarn. For some reason yarn link did not work for me)
2. Can be run as `ten-hands`.

#### Web App (Not straightforward/discouraged currently)

1. Install dependencies (Use yarn)
2. `cd ./ui && yarn build:browser` - build ui for browser
3. `cd ./app`. Uncomment line 26 `// startServer()`. Desktop app calls this one automatically to start server.
4. `cd ./app && yarn build`
5. Build will be in `./app/build` folder. Start Server using `node ./app/build/server/index.js`.
6. Use UI with a static server or directly.

## Some gotchas

This project is in experimental stage, so there are some limitations to use the app. Expect them to be resolved soon.

1. Currently, only package.json can be automatically uploaded from Desktop App. Use CLI for adding other kind of projects. Recognizing multiple other framework config files is in the roadmap.
2. On UI, If you feel switching project terminals slow and stuck, that can be due to using theme on terminals by default. I'll add a setting that toggles theme on terminals. For now, you can comment inside `setTheme()` function in [terminal.ts](/ui/src/components/Command/terminal.ts) and build app again.
3. Currently PORT is set to 1010. Will add a config file soon.

# Contributions

This project started as educational for myself to get my hands dirty with react hooks, sockets, typescript and other stuff. So expect some weirdness around the code.
Please create issue/pr for any kind of improvements/suggestions regardless of how small it is.

# License

[MIT](/LICENSE) - Sai Sandeep Vaddi
