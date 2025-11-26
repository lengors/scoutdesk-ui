import type { HttpService } from "./http-service";

import { axiosHttpService } from "../axios/axios-http-provider";

export const httpService: HttpService = axiosHttpService;
