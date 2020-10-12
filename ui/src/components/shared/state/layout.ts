import { atom } from "recoil";
import { getItem } from "../../../utils/storage";

export const siderWidthAtom = atom<number>({
  key: "siderWidth",
  default: Number(getItem("sider-width")) ?? 300,
});
