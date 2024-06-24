const { Thought, User } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }
      res.json(thought);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      // Push the created thought's _id to the associated user's thoughts array field
      const user = await User.findById(req.body.userId);
      if (user) {
        user.thoughts.push(thought._id);
        await user.save();
      }
      res.status(201).json(thought);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }
      res.status(200).json(thought);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }
      res.status(200).json({ message: "Thought deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async createReaction(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      thought.reactions.push(req.body);
      await thought.save();

      res.status(201).json(thought);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async removeReaction(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      const reactionId = req.params.reactionId;
      thought.reactions = thought.reactions.filter(
        (reaction) => reaction.reactionId.toString() !== reactionId
      );
      await thought.save();

      res.status(200).json(thought);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};
