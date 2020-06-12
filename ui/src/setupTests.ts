// import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import "jest-canvas-mock";

if (document) {
  document.createRange = (): any => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document,
    },
  });
}
