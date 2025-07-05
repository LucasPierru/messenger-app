export type IUser = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  profileUrl?: string;
  bio?: string;
  birthday?: Date;
  phoneNumber?: string;
  location?: string;
  gender?: "male" | "female" | "other";
  createdAt: Date;
  isActive: boolean;
  lastActive: Date;
};
