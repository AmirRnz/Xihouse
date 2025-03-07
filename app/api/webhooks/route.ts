import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
// import { UserDataType } from "@/types/types";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const id = evt.data.id;
  const eventType = evt.type;

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);
  console.log("data", evt.data);

  if (evt.type === "user.created" || evt.type === "user.updated") {
    try {
      const { first_name, last_name, image_url } = evt?.data;
      const primary_email = evt.data.email_addresses[0].email_address;
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        primary_email
      );
      //primary_email is a problem
      if (user && eventType === "user.created") {
        try {
          const client = await clerkClient(); // Get the actual client instance
          client.users.updateUserMetadata(id as string, {
            publicMetadata: {
              usermongoId: user._id,
            },
          });
        } catch (error) {
          console.log("could not update user metadata", error);
        }
      }
    } catch (error) {
      console.log("could not update or create user", error);
      return new Response("could not update or create user", {
        status: 400,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser(id);
    } catch (error) {
      console.log("could not delete", error);
      return new Response("could not delete user", {
        status: 400,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
