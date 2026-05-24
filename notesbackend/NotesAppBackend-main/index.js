import "./config/env.js";
import app from "./app.js";
import connectToDatabase from "./config/db.js";

const port = Number(process.env.PORT) || 4005;

const startServer = async () => {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
