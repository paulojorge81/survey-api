export const loginResolver = {
  Query: {
    login() {
      return {
        accessToken: 'any_token',
        name: 'any_name',
      };
    },
  },
};
