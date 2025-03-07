export type UserDataType = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: string[]; // Adjust type if email_addresses is an array of objects
};
