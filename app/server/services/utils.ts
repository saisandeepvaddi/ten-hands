/**
 * A utility function to check if two arrays have same elements.
 *
 * @param {any[]} arrayOne Array One.
 * @param {any[]} arrayTwo Array Two.
 */
export const areTwoArraysEqual = (arrayOne: any[], arrayTwo: any[]) => {
  if (!Array.isArray(arrayOne) || !Array.isArray(arrayTwo)) {
    throw new Error("Arguments are not valid arrays");
  }

  if (arrayOne.length !== arrayTwo.length) {
    return false;
  }

  const sortedArrayOne = [...arrayOne].sort();
  const sortedArrayTwo = [...arrayTwo].sort();

  return sortedArrayOne.join("") === sortedArrayTwo.join("");
};
