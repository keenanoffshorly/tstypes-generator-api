const express = require("express");
const runTypeGenerator = require("./services/typeGenerator");
const cors = require("cors");
const createObjectsFromFile = require("./services/extractTypescript");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/download", (req, res) => {
  const filePath = __dirname + "/generated-ts/types.ts";
  res.download(filePath, "types.ts", (err) => {
    if (err) {
      res.send({
        error: err,
        msg: "Problem downloading the file",
      });
    }
  });
});

app.get("/get-typescript-objects", (req, res) => {
  const filePath = __dirname + "/generated-ts/types.ts";
  const objects = createObjectsFromFile(filePath);

  return res.status(201).send(objects);
});

app.post("/generate", (req, res) => {
  try {
    console.log(req.body);
    runTypeGenerator(req.body.swaggerLink);
    return res.status(201).send("Types succesfully generated.");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Types generation failed.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
