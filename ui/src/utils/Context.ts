import { Classes } from "@blueprintjs/core";
import io from "socket.io-client";

import React from "react";

export const ThemeContext = React.createContext(Classes.DARK);

export const ProjectsContext = React.createContext([]);

export const SocketContext = React.createContext({
    emit: (x, y) => {},
    on: (x, y) => {},
});
