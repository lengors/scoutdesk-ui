import { User } from "../../models/users/user";
import { httpService } from "../http/http-provider";

export async function findUser() {
  return await httpService.get("/users/me", User);
}
