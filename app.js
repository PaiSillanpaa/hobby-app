import express, { json } from "express";
import "dotenv/config";
import { port } from "./config/config.js";
import connectDB from "./config/db.js";

const app = express();

app.get("/", (request, response) => {
  response.send("hello!");
});

const startServer = async () => {
  try {
    await connectDB();

    console.log("Trying to start server on port: ", port);
    app.listen(port, () => {
      console.log("listening on port: ", port);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
