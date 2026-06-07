import type { HttpRequestConfig } from "../../models/http/http-request-config";

import { User } from "../../models/users/user";
import { httpService } from "../http/http-provider";

const USER_PATH = "/users";

export async function findUser(config?: HttpRequestConfig) {
  return await httpService.get(`${USER_PATH}/me`, User, config);
}
