import { queryOptions } from "@tanstack/react-query";
import { findUser } from "../../services/users/user-service";

export const userQueryOptions = queryOptions({
  queryFn: findUser,
  queryKey: ["users"],
});
