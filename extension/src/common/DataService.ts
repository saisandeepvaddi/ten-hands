import Axios, { AxiosResponse } from "axios";
import { config } from "./config";

export const DataService = {
  async getProjects() {
    const response: AxiosResponse = await Axios.get(
      `${config.server}/projects`
    );
    const projects: any = response.data;
    return projects;
  },
};
