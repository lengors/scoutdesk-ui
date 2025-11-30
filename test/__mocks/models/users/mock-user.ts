import type { User } from "../../../../src/models/users/user";

import { mockServer } from "../../containers/mock-server";

export async function mockUser({
  unauthorized = false,
}: { unauthorized?: boolean } = {}) {
  await mockServer.mockAnyResponse({
    httpRequest: {
      method: "GET",
      path: "/api/v1/users/me",
    },
    httpResponse: unauthorized
      ? {
          statusCode: 401,
          body: "Unauthorized",
        }
      : {
          statusCode: 200,
          body: {
            avatar: "https://cdn.scoutdesk.dev/assets/avatar.png",
            email: "scoutdesk@example.com",
            name: "Scout Desk",
            roles: ["admin"],
            username: "scoutdesk",
          } satisfies User,
        },
  });
}
