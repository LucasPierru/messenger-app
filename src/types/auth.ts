export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  firstName: string;
  lastName: string;
} & LoginCredentials;

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  lastConversationId?: string;
  user: AuthUser
};


