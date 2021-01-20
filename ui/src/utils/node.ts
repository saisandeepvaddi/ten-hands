import { checkIfValidPath } from "../components/shared/API";

export const isValidPath = async (
  config: IConfig,
  path: string
): Promise<boolean> => {
  try {
    const response = await checkIfValidPath(config, path);
    if (response.isValid) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("error:", error);
    return false;
  }
};
