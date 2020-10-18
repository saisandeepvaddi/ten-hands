import React from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { DataService } from "../../../common/DataService";
import { projectsAtom } from "../../stores/projects.atom";
import Main from "./Main";
import Sidebar from "./Sidebar";
import { Colors } from "@blueprintjs/core";

const Container = styled.div`
  height: 500px;
  width: 600px;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 30% auto;
  .sidebar {
    border-right: 1px solid #e2e2e2;
    overflow: auto;
  }
  background: ${Colors.DARK_GRAY3};
`;

const PopupLayout = () => {
  const updateProjectsInRecoil = useSetRecoilState(projectsAtom);

  const { data, isLoading, isError } = useQuery(
    "projects",
    DataService.getProjects
  );

  React.useEffect(() => {
    if (isError || isLoading) {
      return;
    }
    updateProjectsInRecoil(data);
  }, [data, isError, isLoading]);

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main">
        <Main />
      </div>
    </Container>
  );
};

export default PopupLayout;
