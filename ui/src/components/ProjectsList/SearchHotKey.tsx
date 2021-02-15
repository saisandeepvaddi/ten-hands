import React, { Component } from "react";
//https://github.com/palantir/blueprint/issues/3604
//https://github.com/pmclachlan/blink-mind/commit/79511a52ac379ab04f4d7fa96588733bac54b8cd
import {
  Hotkeys,
  Hotkey,
  HotkeysTarget,
} from "@blueprintjs/core/lib/esnext/components/hotkeys";

interface ISearchHotKeyProps {
  searchbarOpen: boolean;
  setSearchbarOpen: (boolean) => any;
}

@HotkeysTarget
// eslint-disable-next-line @typescript-eslint/ban-types
class SearchHotKey extends Component<ISearchHotKeyProps, {}> {
  public render() {
    return <span style={{ position: "absolute", top: -100, left: -100 }} />;
  }

  public renderHotkeys() {
    const { searchbarOpen, setSearchbarOpen } = this.props;
    return (
      <Hotkeys>
        <Hotkey
          global={true}
          combo="ctrl+f"
          label="Search"
          onKeyDown={() => {
            if (!searchbarOpen) {
              setSearchbarOpen(true);
            }
          }}
        />
      </Hotkeys>
    );
  }
}
export default SearchHotKey;
