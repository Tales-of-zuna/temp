import mongoose from "mongoose";

const teamsDataSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
    },
    matchNumber: {
      type: String,
    },
    totalPoints: {
      type: Number,
    },
    winCount: {
      type: Number,
    },
    killCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const TeamsData =
  mongoose.models?.TeamsData || mongoose.model("TeamsData", teamsDataSchema);

export default TeamsData;
