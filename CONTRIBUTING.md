Thanks for willing to contribute. Please read this document for project setup and updating details.

# Table of contents
- [Table of contents](#table-of-contents)
- [Folder structure](#folder-structure)
  - [Root folders](#root-folders)
  - [Tech stack](#tech-stack)
- [Setup](#setup)
  - [What you need to have](#what-you-need-to-have)
  - [Run development version](#run-development-version)
- [Tips on changes](#tips-on-changes)


# Folder structure

There are multiple sub-projects here.

## Root folders

```
/app           -> For Electron Shell and NodeJS backend.
  - /electron
  - /server
  - /shared
  ...others

/ui            -> UI for the app.
  - /cypress   -> Integration testing
  - /src       -> UI code

/cli           -> Small companion tool to install web version of Ten Hands.
  - /src

/docs          -> Code for website https://tenhands.app
  

```

## Tech stack

List of primary libs/frameworks.

```
1. UI (ReactJS/TypeScript)
2. Desktop App (Electron/TypeScript)
3. Server (NodeJS/TypeScript)
4. CLI (NodeJS/TypeScript)
5. Website (ReactJS/Gatsby)
```



# Setup

## What you need to have

- [NodeJS](https://nodejs.org) (latest release built using NodeJS v12.11.1). > v10.x.x would be ok. Install latest if you see TypeScript typings cause any problems.
- [Yarn](https://yarnpkg.com). Please do not use npm as this project uses Yarn's workspaces feature.


## Run development version

1. Fork the repository and clone (your fork) to your local machine.

2. Install packages.
   - If you are working on CLI
      - In root folder -> `yarn install`
      - In /cli folder -> `yarn install` (because `cli` is not part of yarn workspaces)
      - 
   - For other sub-projects
      - In root folder -> `yarn install`

3. To start desktop version
   - In root folder -> `yarn start:desktop`
   - If you see blank screen for a long time, check console for any errors and give a quick `CTRL + R` to refresh.
  
4. To start brower version
   - In root folder -> `yarn start:browser`
   
5. To build installers
   - In root folder
      - For Desktop: `yarn build:desktop` (builds for whichever OS you are currently running)
      - For Browser: `yarn build:cli` (CLI is how you can run Ten Hands as web app. Check [README](https://github.com/saisandeepvaddi/ten-hands/blob/master/README.md#installing-browser-version) for details)
      - Building in Azure Pipelines - `yarn build:desktop-azure`. I use this to create release builds for multiple platforms. You can **ignore** this. Check [azure-pipelines.yml](/azure-pipelines.yml) if you are curious about configuration.

# Tips on changes

1. This project aims to run in desktop version using electron as well as a browser version with same feature parity as much as possible. Please check if the feature can work on both ends, and if it can,  make sure it works in both environments.
> For example, in electron version, you can directly use nodejs related code in front-end code. In such cases, make sure it won't break browser version. For this specific example, always use `isRunningInElectron()` utility functinon defined in `/ui/src/utils/electron.ts`.

2. Tests
  - Tests are good. It doesn't have to have 100% coverage on lines/branches etc. But, make sure the use case is covered will all possible corner cases you can think of are tested.
  - There is a large part yet to be coverted in tests. Please do contribute even if you want to write only tests (Actually, very much required for existing code).
  - Testing is set up in Jest ([@testing-library/react](https://testing-library.com/docs/react-testing-library/intro)) and [Cypress](https://www.cypress.io/).

3. Typings
  - Define types in [/project]/types/index.d.ts
  
4. Improving the existing code.
  - This project started out as educational for myself to learn. So, the code is not reviewed by any expert developer (as of Oct, 2019). If you think the code can be improved in quality/performance, please discuss your suggestion and make a PR.

