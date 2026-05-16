export const serverError = {
  description: 'Problemas no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
