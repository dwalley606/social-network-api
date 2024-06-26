const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { users, thoughts } = require("./data");

const seedDatabase = async () => {
  try {
    console.log("Connected");

    // Drop existing collections
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

    // Seed users
    const createdUsers = await User.create(users);

    // Seed thoughts and associate them with users
    for (let thought of thoughts) {
      const user = createdUsers.find(
        (user) => user.username === thought.username
      );
      if (user) {
        const newThought = await Thought.create(thought);
        user.thoughts.push(newThought._id);
        await user.save();
      }
    }

    console.log("Users and thoughts seeded");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
