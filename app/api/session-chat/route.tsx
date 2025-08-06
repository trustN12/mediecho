import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();

  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdOn: new Date().toString(),
        notes: notes,
        selectedDoctor: selectedDoctor,
      }) //@ts-ignore
      .returning({ SessionChatTable });

    return NextResponse.json(result[0]?.SessionChatTable);
  } catch (error) {
    return NextResponse.json(error);
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const sessionId = searchParams.get("sessionId");

//     if (!sessionId) {
//       return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
//     }

//     const user = await currentUser();

//     if (!user) {
//       return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
//     }

//     const result = await db
//       .select()
//       .from(SessionChatTable)
//       .where(eq(SessionChatTable.sessionId, sessionId));

//     if (!result || result.length === 0) {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }

//     return NextResponse.json(result[0]);
//   } catch (error) {
//     console.error("Error fetching session:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  if (sessionId == "all") {
    const result = await db
      .select()
      .from(SessionChatTable)

      .where(
        // @ts-ignore
        eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(SessionChatTable.id));

    return NextResponse.json(result);
  } else {
    const result = await db
      .select()
      .from(SessionChatTable)
      // @ts-ignore
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(result[0]);
  }
}
