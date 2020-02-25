import React from "react";
import { Dialog, FormGroup, Button, InputGroup } from "@blueprintjs/core";

interface IProjectRenameDialogProps {
  activeProject: IProject;
  theme: string;
  renameProjectModalOpen: boolean;
  handleRenameProjectModalClose: () => void;
  updateProjectName: (e: any) => Promise<void>;
  projectNameError: string;
  setUpdatedProjectName: (value: React.SetStateAction<string>) => void;
  updatedProjectName: string;
  isRenaming: boolean;
}

const ProjectRenameDialog: React.FC<IProjectRenameDialogProps> = ({
  activeProject,
  theme,
  renameProjectModalOpen,
  handleRenameProjectModalClose,
  updateProjectName,
  projectNameError,
  setUpdatedProjectName,
  updatedProjectName,
  isRenaming
}) => {
  return (
    <Dialog
      title={`Rename project: ${activeProject.name}`}
      icon="edit"
      className={theme}
      isOpen={renameProjectModalOpen}
      onClose={handleRenameProjectModalClose}
      style={{ paddingBottom: 0 }}
    >
      <form
        onSubmit={updateProjectName}
        style={{ padding: "10px 20px" }}
        data-testid="rename-project-form"
      >
        <FormGroup
          labelFor="updated-project-name"
          intent={projectNameError ? "danger" : "none"}
          helperText={projectNameError ? projectNameError : ""}
        >
          <InputGroup
            autoFocus={true}
            type="text"
            required={true}
            data-testid="updated-project-name"
            onChange={e => setUpdatedProjectName(e.target.value)}
            value={updatedProjectName}
          />
        </FormGroup>
        <div className="d-flex justify-center align-center">
          <FormGroup>
            <Button
              data-testid="rename-project-button"
              intent="primary"
              text="Update"
              type="submit"
              loading={isRenaming}
              large={true}
            />
          </FormGroup>
        </div>
      </form>
    </Dialog>
  );
};

export default ProjectRenameDialog;
