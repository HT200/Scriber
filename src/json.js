// Fetch the JSON file
const loadFile = (callback, url) => {
    const fetchPromise = async () => {
      const response = await fetch(url);
      callback(await response.json());
    }
    fetchPromise();
};

export {loadFile};