const fs = require("fs");

function createObjectsFromFile(filePath) {
  // Read the TypeScript file
  const fileContents = fs.readFileSync(filePath, "utf-8");

  // Remove comments from the file contents
  const contentsWithoutComments = removeCommentsFromFile(fileContents);

  // Find all interface definitions using regular expressions
  const interfaceRegex = /export interface (\w+)\s?\{(.*?)\}/gs;
  const matches = [...contentsWithoutComments.matchAll(interfaceRegex)];

  // Create an array to store the objects
  const objects = [];

  // Iterate over the matches
  for (const match of matches) {
    const interfaceName = match[1];
    console.log("interfaceName", interfaceName);
    // Skip interfaces with excluded names
    if (
      interfaceName.includes("ApiResponse") ||
      interfaceName.includes("Get") ||
      interfaceName.includes("Update") ||
      interfaceName.includes("Delete")
    ) {
      continue;
    }

    const interfaceContent = match[2];

    // Get the lines of the interface content
    const lines = interfaceContent.split("\n").map((line) => line.trim());

    // Create an object to store the properties
    const object = {};

    // Iterate over the lines of the interface content
    for (const line of lines) {
      // Ignore empty lines and lines starting with "readonly"
      if (line && !line.startsWith("readonly")) {
        const [propertyName, propertyType] = line
          .split(":")
          .map((part) => part.trim());

        // Assign the property to the object with the specified data type
        object[propertyName] = propertyType;
      }
    }

    // Add the identifier to the object
    Object.defineProperty(object, "identifier", {
      value: interfaceName,
      enumerable: false,
    });

    // Add the object to the array
    // objects.interfaceName = object;
    objects.push({ [`${interfaceName}`]: object });
  }

  return objects;
}

// Function to remove comments from the file contents
function removeCommentsFromFile(fileContents) {
  const commentRegex = /\/\*[\s\S]*?\*\/|\/\/.*$/gm; // Matches /* ... */ and // ...
  return fileContents.replace(commentRegex, "");
}

module.exports = createObjectsFromFile;
