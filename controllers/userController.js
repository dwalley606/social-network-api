const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId).select("-__v");
      if (!user) {
        res.status(404).json({ message: "No user found with that ID" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // ... existing code ...

  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        runValidators: true,
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      // Find the user by ID and delete
      const user = await User.findByIdAndDelete(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      // Delete the user's associated thoughts
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      res.status(200).json({ message: "User and thoughts deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async addFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const friendId = req.params.friendId;
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend already added" });
      }

      user.friends.push(friendId);
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async removeFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const friendId = req.params.friendId;
      if (!user.friends.includes(friendId)) {
        return res
          .status(400)
          .json({ message: "Friend not found in the list" });
      }

      user.friends = user.friends.filter(
        (friend) => friend.toString() !== friendId
      );
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};
