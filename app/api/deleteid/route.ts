import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function deletedata(id: any) {
  try {
    await prisma.fileinfo.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error("Failed to delete data", error);
    return false;
  }
}

export async function POST(req: Request) {
  const d = await req.json();
  deletedata(d.id);

  return new Response("deleted");
}
