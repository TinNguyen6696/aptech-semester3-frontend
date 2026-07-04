import { StringValue } from "./stringValue";

export const getStoredUser = () => {
  const savedUser = localStorage.getItem(StringValue.USER_INFO);
  try {
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    return null;
  }
};