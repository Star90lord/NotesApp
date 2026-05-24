import dotenv from "dotenv";
import { projectRoot } from "./paths.js";

dotenv.config({
  path: `${projectRoot}\\.env`,
});

export default projectRoot;
