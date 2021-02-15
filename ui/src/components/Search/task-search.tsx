import React from "react";
import { ItemRenderer } from "@blueprintjs/select";
import { MenuItem } from "@blueprintjs/core";
import Fuse from "fuse.js";
import { throttle } from "lodash";
function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: React.ReactNode[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(
      <strong key={lastIndex} style={{ color: "goldenrod" }}>
        {match[0]}
      </strong>
    );
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

function escapeRegExpChars(text: string) {
  // eslint-disable-next-line no-useless-escape
  return text?.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

export const renderCommand: ItemRenderer<ISearchProjectCommand> = (
  command,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuItem
        key={command._id}
        active={modifiers.active}
        disabled={modifiers.disabled}
        label={command.projectName}
        onClick={handleClick}
        text={highlightText(`${command.name} - ${command.cmd}`, query)}
      />
    </React.Fragment>
  );
};

const getSearchResults = throttle(function (fuse, query) {
  const results = fuse.search(query);
  return results.map((result) => result.item);
}, 100);

export const filterCommands = (fuse, query: string) => {
  const results = getSearchResults(fuse, query);
  return results;
};

export function areCommandsEqual(
  commandA: ISearchProjectCommand,
  commandB: ISearchProjectCommand
) {
  return commandA._id === commandB._id;
}

export const getCommandSelectProps = (commands: ISearchProjectCommand[]) => {
  const fuse = new Fuse(commands, {
    keys: [
      { name: "projectName", weight: 1 },
      { name: "name", weight: 2 },
      { name: "cmd", weight: 2 },
    ],
    includeMatches: true,
  });

  return {
    itemListPredicate: (query: string) => filterCommands(fuse, query),
    itemRenderer: renderCommand,
    items: commands,
  };
};
