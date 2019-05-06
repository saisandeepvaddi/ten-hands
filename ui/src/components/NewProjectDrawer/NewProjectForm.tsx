import { FileInput, FormGroup, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { Form } from "formik";
import React from "react";

const NewProjectForm = props => {
    const { fileName, values, handleChange, onProjectFileChange } = props;
    return (
        <Form>
            <FormGroup labelFor="configFile" label="Project Config File" helperText="E.g., package.json">
                <FileInput
                    text={fileName}
                    inputProps={{ id: "configFile" }}
                    fill={true}
                    onInputChange={onProjectFileChange}
                />
            </FormGroup>
            <FormGroup
                label="Project Name"
                labelFor="name"
                helperText="Will be auto-filled if available in config file."
            >
                <InputGroup id="name" type="text" onChange={handleChange} value={values.name} />
            </FormGroup>
            <FormGroup
                label="Project Path"
                labelFor="path"
                helperText="Will be auto-filled if provided by user in config file (E.g., tenHandsConfig.path in package.json). Browsers won't tell path of uploaded file."
            >
                <InputGroup id="path" type="text" onChange={handleChange} value={values.path} />
            </FormGroup>
            <FormGroup
                label="Project Type"
                labelFor="type"
                helperText="Will be auto-filled if can be determined from config file."
            >
                <HTMLSelect fill={true} id="type" onChange={handleChange} value={values.type}>
                    <option value="">Select Project Type</option>
                    <option value="nodejs">NodeJS</option>
                    <option value="dotnet-core">.NET Core</option>
                    <option value="other">Other</option>
                </HTMLSelect>
            </FormGroup>
        </Form>
    );
};

export default NewProjectForm;
