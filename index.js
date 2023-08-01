const express = require("express");
const runTypeGenerator = require("./services/typeGenerator");

const app = express();
const port = process.env.PORT || 3000;
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
