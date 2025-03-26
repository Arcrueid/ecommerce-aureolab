import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: "../.env" });
const PORT = process.env.API_PORT || 3001;

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
