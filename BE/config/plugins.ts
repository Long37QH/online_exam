// export default () => ({});
export default ({ env }) => ({

    "users-permissions": {
      config: {
        register: {
          allowedFields: ["phone","fullname"],
        },
      },
    },
  });