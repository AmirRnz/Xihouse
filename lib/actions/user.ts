import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongodb/mongoose";
import { UserDataType } from "@/types/types";
export const createOrUpdateUser = async (userData: UserDataType) => {
  try {
    await connect();
    console.log("hit user update", userData);
    // Destructure the userData object to match the schema fields
    const { id, first_name, last_name, image_url, email_addresses } = userData;

    // Create or update the user document
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0],
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

export const deleteUser = async (userData: UserDataType) => {
  try {
    await connect();
    console.log("hit user delete", userData);
    // Destructure the userData object to match the schema fields
    const { id } = userData;

    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Could delete:", error);
  }
};
