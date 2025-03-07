export type ClerkEmailAddress = {
  email_address: string;
  // Add other properties if needed (like id, created_at, etc.)
};

// Define the structure of the external_account (if needed)
export type ClerkExternalAccount = {
  email_address: string;
  provider: string;
  // Other relevant fields
};

// Define the full Clerk user data type (simplified for your needs)
export type ClerkUserEventData = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: ClerkEmailAddress[];
  // Add other relevant fields if needed
};
// Define the shape of user data expected by the function
export type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: ClerkEmailAddress[];
};
