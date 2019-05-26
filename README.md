# ten-hands

|Dark|Light|
|:--:|:--:|
 |<img src="/docs/images/demo_dark.PNG"> | <img src="/docs/images/demo_light.PNG">|


# What is this ?

Do you keep opening large number of terminals to run your scripts/commands or whatever. If you have to do that everyday for same project (Example running scripts from package.json for multiple projects), `Ten-Hands` makes it easier to organize all your scripts in one place by projects.
You can save any command(s) organized into projects and run them whenever you want with a click of button.

# Downloads

Official Builds coming soon....

Both, regular browser web app and electron version can be used.

> NOTE Desktop app and web app have differences in how projects are added due to limitations in getting file path when file uploaded from browser compared to electron app.
> But, a helper CLI tool is available which can be used to add scrips/commands just like typing them into terminal.

> Currently, package.json can automatically uploaded from Desktop App. For now, use CLI for adding other kind of projects. Recognizing multiple framework config files in roadmap.

For now, to create an electron build which has best support.

1. Install dependencies (Use yarn because I used workspaces)
2. Run `node build.js`

You'll see an app in dist folder.

## Using CLI

1. `cd ./cli`
2. `yarn build`
3. `npm link` (Here use npm instead of yarn. For some reason yarn link did not work for me)

## Some gotchas

1. If you feel switching project terminals stuck, that can be due to applying theme on terminals. I'll add a setting that toggles theme on terminal. Or you can comment inside `setTheme()` function in [terminal.ts](/ui/src/components/Command/terminal.ts) for now and build.

# Contributions

This project started as educational for myself to get into react hooks, socket, typescript and other stuff. So expect some wierdness around the code.
Please create issue/pr for any kind of improvements regardless of how small.

# License

[MIT](/LICENSE) - Sai Sandeep Vaddi
