import axios, { AxiosInstance } from "axios";
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
        console.log("projects:", projects);
        return projects;
    }
}

export default new ApiProvider();

export const useApi = (url: string = "projects", initData = []) => {
    const [data, setData] = useState(initData);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const result = await axios.get(`http://localhost:1010/${url}`);
                setData(result.data);
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [url]);

    return { data, isLoading, isError };
};
