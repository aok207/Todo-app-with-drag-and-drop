import { TodoType } from "./App";
// Helper function to check if two arrays of objects are equal
export function arraysAreEqual(arr1: TodoType[], arr2: TodoType[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!objectsAreEqual(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
}

// Helper function to check if two objects are equal
export function objectsAreEqual(obj1: TodoType, obj2: TodoType) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
