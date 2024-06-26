const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");
const seedDatabase = require("./utils/seed");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once("open", async () => {
  // Seed the database
  await seedDatabase();

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
