import React from "react";
import { useQuery } from "react-query";
import { DataService } from "../common/DataService";

const Popup = () => {
  const { data, isLoading, isError } = useQuery(
    "projects",
    DataService.getProjects
  );

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: 500 }}>
      <ul>
        {data?.map((project) => (
          <li key={project._id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Popup;
