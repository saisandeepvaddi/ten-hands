import React from "react";
import { ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import { MenuItem } from "@blueprintjs/core";

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
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
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

export const filterCommand: ItemPredicate<ISearchProjectCommand> = (
  query,
  command,
  _index,
  exactMatch
) => {
  const normalizedName =
    command.name.toLowerCase() + "-" + command.cmd.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  console.log("_index:", _index);

  return normalizedName.indexOf(normalizedQuery) >= 0;
  // if (exactMatch) {
  //   return normalizedName === normalizedQuery;
  // } else {
  //   return normalizedName.indexOf(normalizedQuery) >= 0;
  // }
};

export function areCommandsEqual(
  commandA: ISearchProjectCommand,
  commandB: ISearchProjectCommand
) {
  return commandA._id === commandB._id;
}

export const getCommandSelectProps = (commands: ISearchProjectCommand[]) => ({
  itemPredicate: filterCommand,
  itemRenderer: renderCommand,
  items: commands,
});
