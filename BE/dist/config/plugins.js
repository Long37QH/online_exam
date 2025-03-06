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
});
