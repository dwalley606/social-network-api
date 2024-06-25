const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { users, thoughts, reactions } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("Connected");

  let userCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (userCheck.length) {
    await connection.dropCollection("users");
  }

  let thoughtCheck = await connection.db
    .listCollections({ name: "thoughts" })
    .toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection("thoughts");
  }

  await User.create(users);
  await Thought.create(thoughts);
  await Reaction.create(reactions);
  console.log("Users and thoughts seeded");
  process.exit(0);
});
