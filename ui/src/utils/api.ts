import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

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
        console.info("projects:", projects);
        return projects;
    }
}

export default new ApiProvider();
