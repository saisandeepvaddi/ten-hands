import axios from "axios";
import { getAppUpdate } from "../updates";

jest.mock("electron");
jest.mock("axios");

const axiosMock = axios as jest.Mocked<typeof axios>;

describe("Electron Util Functions", () => {
  it("tests github updates available", async () => {
    let data = [
      {
        published_at: "2019-09-26T05:42:08Z",
        prerelease: true,
        tag_name: "v2.0.0-alpha.0"
      },
      {
        published_at: "2019-06-05T02:31:29Z",
        prerelease: false,
        tag_name: "v1.0.0"
      }
    ];

    axiosMock.get.mockResolvedValue({ data });
    await expect(getAppUpdate("1.0.0")).resolves.not.toThrow(
      /unable to find updates/i
    );
    // If we don't know current version can't know whether if the one in github is update or not. So leave it.
    // v10.0.0 is not currently in package.json or in github.
    await expect(getAppUpdate("v10.0.0")).rejects.toThrow(
      /unable to find updates/i
    );
    await expect(getAppUpdate("1.0.0")).resolves.toMatchObject(data[0]);

    // If it's already latest version, then no need to update
    await expect(getAppUpdate("v2.0.0-alpha.0")).resolves.toBe(null);

    data = [
      {
        published_at: "2021-06-05T02:31:29Z",
        prerelease: false,
        tag_name: "v3.0.0"
      },
      {
        published_at: "2020-06-05T02:31:29Z",
        prerelease: false,
        tag_name: "v2.0.0"
      },
      ...data
    ];

    axiosMock.get.mockResolvedValue({ data });

    await expect(getAppUpdate("1.0.0")).resolves.toMatchObject(data[0]);
    await expect(getAppUpdate("v2.0.0-alpha.0")).resolves.toMatchObject(
      data[0]
    );
    await expect(getAppUpdate("2.0.0")).resolves.toMatchObject(data[0]);
    await expect(getAppUpdate("3.0.0")).resolves.toBe(null);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
