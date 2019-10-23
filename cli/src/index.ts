#!/usr/bin/env node

import meow from "meow";
import { startServer } from "./server";

const serverCLI = meow(`
  Usage
    $ ten-hands <input>

  Examples
    $ ten-hands start
`);

const inputs = serverCLI.input;
if (inputs[0] === "start") {
  startServer();
}
