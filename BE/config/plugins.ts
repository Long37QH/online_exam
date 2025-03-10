// export default () => ({});
export default ({ env }) => ({

    "users-permissions": {
      config: {
        register: {
          allowedFields: ["phone","fullname"],
        },
      },
    },

    email: {
      config: {
        provider: 'sendgrid', 
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: env('SENDGRID_EMAIL_FROM'),
          defaultReplyTo: env('SENDGRID_EMAIL_TO'),
          testAddress: env('SENDGRID_EMAIL_TESTTEST'),
        },
      },
    },
  });