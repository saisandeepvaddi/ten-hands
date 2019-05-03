import axios, { AxiosInstance } from "axios";

class ApiProvider {
    private instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: "http://localhost:1010",
        });
    }
    public async getAllProjects(): Promise<any[]> {
        const response = await this.instance.get("/projects");
        const projects = response.data.data;
        console.log("projects:", projects);
        return projects;
    }
}

export default new ApiProvider();
