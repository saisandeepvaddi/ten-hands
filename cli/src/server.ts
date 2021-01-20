// import { getConfig } from "../../app/shared/config";
import { resolve } from "path";
import pm2 from "pm2";

const startProcess = (script) => {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.list((error, list) => {
      if (error) {
        throw error;
      }

      const existingProcess = list.find(
        (p: pm2.ProcessDescription) => p.name === "ten-hands"
      );

      if (!existingProcess) {
        pm2.start(
          {
            script,
            name: "ten-hands",
            exec_mode: "cluster",
            max_restarts: 1,
            instances: 1,
          },
          (startError, apps) => {
            pm2.disconnect();

            if (startError) {
              throw startError;
            }
            const name = apps[0]?.pm2_env?.name;
            const pid = apps[0]?.pid;

            console.log(`${name} started with pid: ${pid}`);
          }
        );
      } else {
        console.error(
          `Ten Hands is already running with PID: ${existingProcess.pid}`
        );
        pm2.disconnect();
      }
    });
  });
};

export const startServer = async () => {
  try {
    const serverPath = resolve(__dirname, "server", "start.js");
    startProcess(serverPath);
  } catch (error) {
    console.error("Error starting server: ", error.message);
  }
};

export const stopServer = async () => {
  try {
    pm2.delete("ten-hands", (err, apps) => {
      if (err) {
        throw err;
      }
      const name = apps[0]?.pm2_env?.name;
      console.log(`${name} stopped.`);
      pm2.disconnect();
    });
  } catch (error) {
    console.log("error:", error);
    console.error("Error stopping server: ", error.message);
    pm2.disconnect();
  }
};
