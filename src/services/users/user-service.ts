import { User } from "../../models/users/user";
import { httpService } from "../http/http-provider";

const USER_PATH = "/users";

export async function findUser() {
  return await httpService.get(`${USER_PATH}/me`, User);
}
