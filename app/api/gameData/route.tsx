import ConnectMongoDB from "@/database/connection";
import TeamsData from "@/database/models/teamsDataModel";
import { NextRequest, NextResponse } from "next/server";

ConnectMongoDB();

export const POST = async (req: NextRequest) => {
  try {
    const teamData = await req.json();

    const existingTeam = await TeamsData.findOne({
      teamName: teamData.teamName,
    });

    if (existingTeam) {
      existingTeam.totalPoints += teamData.totalPoints;
      existingTeam.winCount += teamData.winCount;
      existingTeam.killCount += teamData.killCount;
      await existingTeam.save();
      return NextResponse.json(existingTeam);
    } else {
      const newTeamData = await TeamsData.create(teamData);
      return NextResponse.json(newTeamData);
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const teamData = await TeamsData.find();
    return NextResponse.json(teamData);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const teamData = await TeamsData.findByIdAndUpdate(body._id, body, {
      new: true,
    });
    return NextResponse.json(teamData);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
