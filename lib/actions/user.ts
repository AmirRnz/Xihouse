import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongodb/mongoose";
export const createOrUpdateUser = async (
  id: string | undefined,
  first_name: string | null,
  last_name: string | null,
  image_url?: string,
  primary_email?: string
) => {
  try {
    await connect();

    // Create or update the user document
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: primary_email,
        },
      },
      { upsert: true, new: true }
    );

    return user;
  } catch (error) {
    console.error("Could not create or update user:", error);
    return null; // Return null in case of an error
  }
};

export const deleteUser = async (id: string | undefined) => {
  try {
    await connect();
    console.log("hit user delete", id);
    // Destructure the userData object to match the schema fields
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Could delete:", error);
  }
};
