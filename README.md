<p align="center">
    <a href="https://github.com/saisandeepvaddi/ten-hands">
      <img alt="Ten Hands Logo" src="./docs/src/images/logo.png" width="60" />
    </a>
  <h1 align="center">
    Ten Hands
  </h1>
</p>

<h3 align="center">
  One place to run your command-line tasks
</h3>

[![Build Status](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_apis/build/status/All%20OS?branchName=releases)](https://dev.azure.com/saisandeepvaddi/Ten%20Hands/_build/latest?definitionId=4&branchName=releases)

# What is this?

Do you keep opening terminals to run your scripts/commands/tasks etc,. If you have to do that everyday for same project (Example running scripts from `package.json` for multiple projects), `Ten Hands` makes it easier to organize all your tasks in one place.
You can organize tasks into projects and run them whenever you want with a click of a button.

# UI

Please visit website to see intro video.

|                    Dark                    |                    Light                    |
| :----------------------------------------: | :-----------------------------------------: |
| <img src="/docs/src/images/demo_dark.jpg"> | <img src="/docs/src/images/demo_light.jpg"> |

# Downloads

Downloads are available in `releases` section if you just want to download and run. 

If you want to get latest updates, you can click on _"Azure Pipelines"_ badge above to download latest builds from CI. These may have small bugs. But, please create an issue if you find any.

# Installing browser version

This project can be run in browser instead of desktop version. Before installing browser version, check what additional features the desktop version has currently.

1. Drag & Drop **package.json** to add project.
2. Link to open project directory in file explorer.

To run in browser.

1. Install `ten-hands-cli` tool from npm.

```
  npm install --global ten-hands-cli

  (or)

  yarn global add ten-hands-cli
```

2. Start app

```
  ten-hands start
```

3. Your teminal will show you the localhost address with port where Ten Hands is running. Copy and open it in browser.

# Configuration

A `config.json` is supported which is placed at `~/.ten-hands/` path.

> Check [Configration](https://github.com/saisandeepvaddi/ten-hands/wiki/Configuration) at Wiki for configuration options.

You have to restart the app when you change configuration.

## FAQ

> FAQ section has been moved to Wiki at [FAQ](https://github.com/saisandeepvaddi/ten-hands/wiki/FAQ).

# Contributions

Check [CONTRIBUTING](/CONTRIBUTING.md) for project setup and folder structure details. Please use issue tracker for any kind of bugs/suggestions/discussions.

# License

[MIT](/LICENSE) - Sai Sandeep Vaddi
