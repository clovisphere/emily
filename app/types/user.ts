export type CreateUserInput = {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt?: string; // populated during registration
    sessionToken?: string; // set on login
  };
};

export type UpdateUserInput = {
  username?: string;
  email?: string;
};
