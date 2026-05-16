/* eslint-disable @typescript-eslint/no-magic-numbers */
export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar o usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account',
            },
          },
        },
      },
    },
  },
};
