#! /usr/bin/env node

const { spawn } = require("child_process");

const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: express-api-typescript sample-directory
`);
}

const repoURL = "https://github.com/p-rk/express-api-typescript.git";

runCommand("git", ["clone", repoURL, name])
  .then(() => {
    return runCommand("rm", ["-rf", `${name}/.git`]);
  })
  .then(() => {
    console.log("🔥 Installing dependencies...");
    return runCommand("yarn", {
      cwd: process.cwd() + "/" + name,
    });
  })
  .then(() => {
    console.log("Done! 🏁");
    console.log("--------------------------------");
    console.log("To get started: 🚀");
    console.log("cd", name);
    console.log("yarn dev");
  });

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    spawned.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    spawned.on("close", () => {
      resolve();
    });
  });
}
