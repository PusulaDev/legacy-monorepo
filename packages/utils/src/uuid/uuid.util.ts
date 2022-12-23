export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (16 * Math.random()) | 0;
    return ("x" == c ? r : (r & 3) | 8).toString(16);
  });
};
