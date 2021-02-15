// import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import "jest-canvas-mock";

if (document) {
  document.createRange = (): any => ({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setStart: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document,
    },
  });
}
