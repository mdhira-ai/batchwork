import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function getallinfo() {
  try {
    const allinfo = await prisma.fileinfo.findMany();
    return allinfo;
  } catch (error) {
    console.error("Failed to fetch all info", error);
    return null;
  }
}
export async function POST(req: Request) {
  const d = await getallinfo();

  // Process the data here
  return NextResponse.json(d);
}
