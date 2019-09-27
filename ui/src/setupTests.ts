import "@testing-library/react/cleanup-after-each";
import "jest-axe/extend-expect";
import "jest-canvas-mock";
import "jest-dom/extend-expect";

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
