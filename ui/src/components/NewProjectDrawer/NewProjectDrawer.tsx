import { Classes, Drawer, FileInput, FormGroup, HTMLSelect, InputGroup, Label } from "@blueprintjs/core";
import { Field, Form, Formik, FormikActions } from "formik";
import React from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/Context";

const DrawerContainer = styled.div`
    height: 100%;
    /* display: flex;
    flex-direction: column;
    align-items: center; */
    padding: 2rem;
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
                                        labelFor="path"
                                        label="Project Config File"
                                        labelInfo="*"
                                        helperText="E.g., package.json"
                                    >
                                        <FileInput text="Choose file..." inputProps={{ id: "path" }} fill={true} />
                                    </FormGroup>
                                )}
                            />
                            <Field
                                name="name"
                                render={field => (
                                    <FormGroup
                                        label="Project Name"
                                        labelFor="name"
                                        labelInfo="*"
                                        helperText="Will be auto-filled if available in config file"
                                    >
                                        <InputGroup id="name" type="text" />
                                    </FormGroup>
                                )}
                            />
                            <Field
                                name="type"
                                render={field => (
                                    <FormGroup
                                        label="Project Type"
                                        labelFor="type"
                                        labelInfo="*"
                                        helperText="Will be auto-filled if can be determined from config file"
                                    >
                                        <HTMLSelect fill={true} id="type">
                                            <option value="nodejs">NodeJS</option>
                                            <option value="nodejs">.NET Core</option>
                                            <option value="other">Other</option>
                                        </HTMLSelect>
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
