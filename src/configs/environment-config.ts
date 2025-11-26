import { Environment } from "../models/common/environment";

export const ENVIRONMENT_CONFIG = await Environment.parseAsync(import.meta.env);
