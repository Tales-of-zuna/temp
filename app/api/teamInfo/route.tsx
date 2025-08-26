import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch("http://localhost:10086/getteaminfolist", {
      signal: controller.signal,
    });

    clearTimeout(timeout); // Clear timeout if request succeeds
    const data = await res.json();
    return NextResponse.json(data.teamInfoList);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
};
