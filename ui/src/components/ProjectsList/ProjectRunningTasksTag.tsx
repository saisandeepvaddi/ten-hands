import { Tag, Tooltip } from "@blueprintjs/core";
import React from "react";

interface IProjectRunningTasksTagProps {
    count: number;
}

const ProjectRunningTasksTag: React.FC<IProjectRunningTasksTagProps> = ({ count = 0 }) => {
    return (
        <>
            {count > 0 ? (
                <span style={{ paddingRight: 20 }}>
                    <Tooltip content={`${count} ${count > 1 ? "tasks" : "task"} running`}>
                        <Tag intent="success" minimal={true}>
                            {count}
                        </Tag>
                    </Tooltip>
                </span>
            ) : null}
        </>
    );
};

export default ProjectRunningTasksTag;
