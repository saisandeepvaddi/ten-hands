import { Drawer, FileInput, FormGroup } from "@blueprintjs/core";
import { Field, Form, Formik, FormikActions } from "formik";
import React from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/Context";

const DrawerContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
`;

interface INewDrawerProps {
    isDrawerOpen: boolean;
    setDrawerOpen: (isOpen: boolean) => any;
}

const NewProjectDrawer: React.FC<INewDrawerProps> = ({ isDrawerOpen, setDrawerOpen }) => {
    const theme = React.useContext(ThemeContext);
    const intialProject: IProject = {
        name: "",
        type: "node",
        commands: [],
        path: "",
    };

    function onSubmit(values: IProject, { setSubmitting }: FormikActions<IProject>) {}

    return (
        <Drawer className={theme} isOpen={isDrawerOpen} title="Add Project" onClose={() => setDrawerOpen(false)}>
            <DrawerContainer>
                <Formik
                    initialValues={intialProject}
                    onSubmit={onSubmit}
                    render={() => (
                        <Form>
                            <Field
                                name="path"
                                render={field => (
                                    <FormGroup
                                        label="Project File"
                                        labelFor="path"
                                        labelInfo="*"
                                        helperText="E.g., package.json"
                                    >
                                        <FileInput text="Open Project file" {...field} />
                                    </FormGroup>
                                )}
                            />
                        </Form>
                    )}
                />
            </DrawerContainer>
        </Drawer>
    );
};

export default NewProjectDrawer;
