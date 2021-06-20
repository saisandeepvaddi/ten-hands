import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { useFormik } from "formik";
import React, { ChangeEvent, useState } from "react";

interface INewCommandFormProps {
  onSubmit: (values: Record<string, string>, actions: any) => Promise<any>;
  initialValues: IProjectCommand;
  customErrors: Record<string, string>;
}

// const parseArgs = (cmd: string): Map<string, string> => {
//   const argv = Parser(cmd);

//   const { _, ...other } = argv;

//   const myArgs: Map<string, string> = new Map();

//   if (_ && _.length > 0) {
//     for (const ar of _) {
//       if (ar.startsWith("$")) {
//         myArgs.set(ar, "");
//       }
//     }
//   }

//   Object.keys(other).forEach((argName) => {
//     myArgs.set(argName, "");
//   });

//   return myArgs;
// };
const parseArgs = (cmd: string): Map<string, string> => {
  const argv = cmd.split(" ");

  const myArgs: Map<string, string> = new Map();

  for (const ar of argv) {
    if (ar.startsWith("$")) {
      myArgs.set(ar, "");
    }
  }

  return myArgs;
};

const NewCommandForm: React.FC<INewCommandFormProps> = React.memo(
  ({ onSubmit, initialValues, customErrors }) => {
    const formik = useFormik({
      initialValues,
      onSubmit,
    });

    const [args, setArgs] = useState<Map<string, string> | null>(() => {
      if (!initialValues.arguments) {
        return null;
      }

      if (
        initialValues.arguments &&
        Object.keys(initialValues.arguments).length > 0
      ) {
        return new Map(Object.entries(initialValues.arguments));
      }

      return parseArgs(initialValues.cmd);
    });

    const handleCommandChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const myArgs = parseArgs(value);
      console.log("myArgs:", myArgs);
      setArgs(myArgs);

      formik.setFieldValue("cmd", value);
    };

    const handleArgChange = (argName: string, value: string) => {
      if (args?.has(argName)) {
        const newArgs = new Map(args.entries());
        newArgs.set(argName, value);
        setArgs(newArgs);
        formik.setFieldValue(
          "arguments",
          Object.fromEntries(newArgs.entries()),
        );
      }
    };

    return (
      <form onSubmit={formik.handleSubmit} data-testid="new-task-form">
        <FormGroup
          label="Name"
          labelFor="name"
          helperText="A short name for your task."
        >
          <InputGroup
            required={true}
            placeholder="E.g., Start DB"
            id="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </FormGroup>

        <FormGroup
          label="Task"
          labelFor="cmd"
          helperText="Actual task to run in terminal."
        >
          <InputGroup
            required={true}
            id="cmd"
            type="text"
            placeholder="e.g., yarn test"
            onChange={handleCommandChange}
            value={formik.values.cmd}
          />
        </FormGroup>
        {args && args.size > 0 ? (
          <div style={{ paddingLeft: 20, maxHeight: 900, overflow: "auto" }}>
            <h5>Arguments</h5>
            <FormGroup>
              {Array.from(args).map(([argName, value]) => {
                return (
                  <div
                    key={argName}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: 10,
                    }}
                  >
                    <div
                      style={{ width: 50, textAlign: "right", marginRight: 10 }}
                    >
                      <label htmlFor={argName}>{argName}</label>
                    </div>
                    <InputGroup
                      id={argName}
                      value={value}
                      placeholder="Default value"
                      onChange={(e) => handleArgChange(argName, e.target.value)}
                    />
                  </div>
                );
              })}
            </FormGroup>
          </div>
        ) : null}
        <FormGroup
          label="Path (optional)"
          labelFor="execDir"
          intent={customErrors.path ? "danger" : "none"}
          helperText={
            customErrors.path ? (
              customErrors.path
            ) : (
              <span>
                Use this{" "}
                <b>
                  <i>only</i>
                </b>{" "}
                when task path is different from the project path.
              </span>
            )
          }
        >
          <InputGroup
            placeholder="E.g., Absolute path where to execute the task."
            id="execDir"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.execDir}
          />
        </FormGroup>
        <FormGroup
          label="Shell (optional)"
          labelFor="shell"
          intent={customErrors.shell ? "danger" : "none"}
          helperText={
            customErrors.shell ? (
              customErrors.shell
            ) : (
              <span>
                Absolute path to the shell. Overrides project&apos;s shell or
                global shell.
              </span>
            )
          }
        >
          <InputGroup
            placeholder={
              navigator.platform.toLowerCase() === "win32"
                ? "C:\\Windows\\System32\\cmd.exe"
                : "/bin/sh"
            }
            id="shell"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.shell}
          />
        </FormGroup>

        <FormGroup>
          <Button
            data-testid="save-task-button"
            intent="primary"
            text="Save Task"
            type="submit"
            loading={formik.isSubmitting}
            large={true}
          />
        </FormGroup>
      </form>
    );
  },
);

export default NewCommandForm;
