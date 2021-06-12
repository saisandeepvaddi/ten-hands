import { atom } from "recoil";

import { getItem, setItem } from "../../../utils/storage";

let defaultSiderWidth = Number(getItem("sider-width"));

if (
  !defaultSiderWidth ||
  defaultSiderWidth === 0 ||
  Number.isNaN(defaultSiderWidth)
) {
  setItem("sider-width", 300);
  defaultSiderWidth = 300;
}

export const siderWidthAtom = atom<number>({
  key: "siderWidth",
  default: defaultSiderWidth ?? 300,
});
