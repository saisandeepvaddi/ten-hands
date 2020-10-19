#!/usr/bin/env node

import meow from "meow";
import { startServer, stopServer } from "./server";

const serverCLI = meow(`
  Usage
    $ ten-hands <input>

  Examples
    $ ten-hands start
    $ ten-hands stop
`);

const inputs = serverCLI.input;

if (inputs[0] === "start") {
  startServer();
} else if (inputs[0] === "stop") {
  stopServer();
}
