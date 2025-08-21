import express, { json } from "express";
const port = 3001;

const app = express();

app.get("/", (request, response) => {
  response.send("hello!");
});

console.log("starting...");
app.listen(port, () => {
  console.log("listening on port: ", port);
});
