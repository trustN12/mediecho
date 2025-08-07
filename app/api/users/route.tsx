import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const user = await currentUser();

//   try {
//     //  check if user already exist
//     const users = await db
//       .select()
//       .from(usersTable)
//       //@ts-ignore
//       .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

//     // if not then create new user
//     if (users?.length == 0) {
//       const result = await db
//         .insert(usersTable)
//         .values({
//           //@ts-ignore
//           name: user?.fullName,
//           email: user?.primaryEmailAddress?.emailAddress,
//           credits: 1,
//         }) //@ts-ignore
//         .returning({ usersTable });

//       return NextResponse.json(result[0]?.usersTable);
//     }

//     return NextResponse.json(users[0]);
//   } catch (error) {
//     return NextResponse.json(error);
//   }
// }


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, name, email, imageUrl } = body;

  try {
    // Check if user already exists
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // If not, create a new user
    if (users?.length === 0) {
      const result = await db
        .insert(usersTable) 
        // @ts-ignore
        .values({
          name,
          email,
          credits: 1,
          imageUrl,
          userId,
        }) 
        // @ts-ignore
        .returning({ usersTable });

      return NextResponse.json(result[0]?.usersTable);
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(error);
  }
}




export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user?.primaryEmailAddress?.emailAddress;
  const users = await db
    .select()
    .from(usersTable)
    // @ts-ignore
    .where(eq(usersTable.email, email));

  if (!users.length) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ implement: what happens after one month sub
  const endsOn = users[0].subscriptionEndsOn;
  const isPro = users[0].plan === "pro" &&
  endsOn !== null &&
  new Date(endsOn) > new Date();


  return NextResponse.json({
    credits: users[0].credits,
    isPro,
    plan: users[0].plan, // Optional: include raw plan too
  });
}

// export async function PATCH(req: NextRequest) {
//   const user = await currentUser();
//   const { amount } = await req.json(); // e.g., { amount: -1 }

//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const email = user?.primaryEmailAddress?.emailAddress;

//   try {
//     // Get current credits
//     const current = await db
//       .select({ credits: usersTable.credits })
//       .from(usersTable)
//       // @ts-ignore
//       .where(eq(usersTable.email, email));

//     const currentCredits = current[0]?.credits ?? 0;

//     // Prevent going below zero
//     if (currentCredits + amount < 0) {
//       return NextResponse.json(
//         { error: "Insufficient credits" },
//         { status: 400 }
//       );
//     }

//     // Update credits
//     const updated = await db
//       .update(usersTable)
//       .set({
//         credits: sql`${usersTable.credits} + ${amount}`,
//       })
//       //@ts-ignore
//       .where(eq(usersTable.email, email))
//       .returning();

//     return NextResponse.json({
//       message: "Credits updated",
//       credits: updated[0].credits,
//     });
//   } catch (error) {
//     console.error("Credit update failed:", error);
//     return NextResponse.json(
//       { error: "Update failed" },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req: NextRequest) {
//   const user = await currentUser();
//   const { amount, upgradeToPro } = await req.json(); // Support both operations

//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const email = user?.primaryEmailAddress?.emailAddress;

//   try {
//     // ✅ Upgrade to Pro
//     if (upgradeToPro) {
//       // Check if already pro
//       if (user.privateMetadata?.plan === "pro") {
//         return NextResponse.json({ message: "User already Pro" });
//       }

//       // @ts-ignore
//       await clerkClient.users.updateUser(user.id, {
//         privateMetadata: { plan: "pro" },
//       });

//       return NextResponse.json({ message: "User upgraded to Pro" });
//     }

//     // ✅ Handle credit changes
//     if (typeof amount === "number") {
//       // Get current credits
//       const current = await db
//         .select({ credits: usersTable.credits })
//         .from(usersTable)
//         // @ts-ignore
//         .where(eq(usersTable.email, email));

//       const currentCredits = current[0]?.credits ?? 0;

//       if (currentCredits + amount < 0) {
//         return NextResponse.json(
//           { error: "Insufficient credits" },
//           { status: 400 }
//         );
//       }

//       // Update credits
//       const updated = await db
//         .update(usersTable)
//         .set({
//           credits: sql`${usersTable.credits} + ${amount}`,
//         })
//         // @ts-ignore
//         .where(eq(usersTable.email, email))
//         .returning();

//       return NextResponse.json({
//         message: "Credits updated",
//         credits: updated[0].credits,
//       });
//     }

//     // ❌ Invalid request
//     return NextResponse.json({ error: "No valid action provided" }, { status: 400 });
//   } catch (error) {
//     console.error("PATCH /api/users error:", error);
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }

export async function PATCH(req: NextRequest) {
  const user = await currentUser();
  const { amount, upgradeToPro, subscriptionType } = await req.json(); // Add subscriptionType here

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user?.primaryEmailAddress?.emailAddress;

  try {
    // Upgrade to Pro
    if (upgradeToPro && subscriptionType) {
      const now = new Date();
      const endsOn = new Date();
      endsOn.setMonth(
        now.getMonth() + (subscriptionType === "annually" ? 12 : 1)
      );

      const updated = await db
        .update(usersTable)
        .set({
          plan: "pro",
          subscriptionType,
          credits: 10,
          lastCreditRefill: now.toISOString().split("T")[0],
          subscriptionEndsOn: endsOn.toISOString().split("T")[0],
        })
        // @ts-ignore
        .where(eq(usersTable.email, email))
        .returning();

      return NextResponse.json({
        message: "User upgraded to Pro",
        user: updated[0],
      });
    }

    // Handle credit deduction or monthly refill
    const [currentUserData] = await db
      .select()
      .from(usersTable)
      //@ts-ignore
      .where(eq(usersTable.email, email));

    if (!currentUserData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const lastRefill = new Date(`${currentUserData.lastCreditRefill}T00:00:00`);

    const diffDays =
      (now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60 * 24);

    const isPro = currentUserData.plan === "pro";
    const isSubActive =
      currentUserData.subscriptionEndsOn &&
      new Date(currentUserData.subscriptionEndsOn) > now;

    if (isPro && isSubActive && diffDays >= 30) {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
      // ⏳ Refill credits
      await db
        .update(usersTable)
        .set({
          credits: 10,
          lastCreditRefill: today,
        })
        //@ts-ignore
        .where(eq(usersTable.email, email));
    }

    // Deduct credits
    if (typeof amount === "number") {
      const currentCredits = currentUserData.credits ?? 0;

      if (currentCredits + amount < 0) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 400 }
        );
      }

      const updated = await db
        .update(usersTable)
        .set({
          credits: sql`${usersTable.credits} + ${amount}`,
        })
        //@ts-ignore
        .where(eq(usersTable.email, email))
        .returning();

      return NextResponse.json({
        message: "Credits updated",
        credits: updated[0].credits,
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
