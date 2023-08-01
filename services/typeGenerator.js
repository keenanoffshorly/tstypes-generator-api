const { exec } = require("child_process");
const fs = require("fs");

const createSwaggerConfigFile = async (swaggerLink) => {
  const jsonObj = {
    url: swaggerLink,
    dir: "./generated-ts",
    language: "typescript",
  };

  const jsonData = JSON.stringify(jsonObj);

  fs.writeFile("swagger.config.json", jsonData, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File created successfully!");
  });
};

const generateTypes = async (script) => {
  exec(script, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

const runTypeGenerator = async (swaggerLink) => {
  try {
    await createSwaggerConfigFile(swaggerLink);
    await generateTypes("npm run generate-types");
  } catch (e) {
    console.log(e);
  }
};

module.exports = runTypeGenerator;
