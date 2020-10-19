import React from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { DataService } from "../../../common/DataService";
import { projectsAtom } from "../../stores/projects.atom";
import Main from "./Main";
import Sidebar from "./Sidebar";
import { Colors, Icon, Spinner } from "@blueprintjs/core";

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

const StatusContainer = styled.div<{ statusType: string }>`
  height: 500px;
  width: 500px;
  color: ${(props) => (props.statusType === "error" ? "#9E2B0E" : "#182026")};
  display: grid;
  place-items: center;
  padding: 20px;
`;

const PopupLayout = () => {
  const updateProjectsInRecoil = useSetRecoilState(projectsAtom);

  const { data, isLoading, isError, error } = useQuery(
    "projects",
    DataService.getProjects,
    {
      retry: 1,
    }
  );

  React.useEffect(() => {
    if (isError || isLoading) {
      return;
    }
    updateProjectsInRecoil(data);
  }, [data, isError, isLoading]);

  if (isError) {
    return (
      <StatusContainer statusType="error">
        <div>
          <p>
            <Icon icon="error" iconSize={Icon.SIZE_LARGE} />{" "}
            <span style={{ marginLeft: 10 }}>
              Failed to connect to Ten Hands server.
            </span>
          </p>

          <p>Please check if the server is running and at the port 5010.</p>
        </div>
      </StatusContainer>
    );
  }

  if (isLoading) {
    return (
      <StatusContainer statusType="loading">
        <div className="all-center">
          <Spinner size={Spinner.SIZE_SMALL} />{" "}
          <span style={{ marginLeft: 10 }}>
            Connecting to Ten Hands server...
          </span>
        </div>
      </StatusContainer>
    );
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
