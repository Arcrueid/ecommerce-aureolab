import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const PORT = process.env.API_PORT || 3001;
const app = express();

app.use(express.json());

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
