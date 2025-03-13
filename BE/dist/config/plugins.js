"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export default () => ({});
exports.default = ({ env }) => ({
    "users-permissions": {
        config: {
            register: {
                allowedFields: ["phone", "fullname"],
            },
        },
    },
    email: {
        config: {
            provider: "sendgrid",
            providerOptions: {
                apiKey: env("SENDGRID_API_KEY"),
            },
            settings: {
                defaultFrom: env("SENDGRID_EMAIL_FROM"),
                defaultReplyTo: env("SENDGRID_EMAIL_TO"),
                testAddress: env("SENDGRID_EMAIL_TESTTEST"),
            },
        },
    },
    graphql: {
        config: {
            defaultLimit: 50, // Số lượng bản ghi mặc định khi không truyền pageSize
            maxLimit: 1000, // Số lượng bản ghi tối đa được phép lấy
        },
    },
});
