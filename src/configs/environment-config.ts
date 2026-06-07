import { Environment } from "../models/common/environment";
import { httpService } from "../services/http/http-provider";
import { RuntimeEnvironment } from "../models/common/runtime-environment";

export const ENVIRONMENT_CONFIG = await Environment.parseAsync(
  import.meta.env,
).then(async ({ RUNTIME_CONFIG_URL, ...environment }) => {
  let runtimeEnvironment: RuntimeEnvironment;
  try {
    runtimeEnvironment = await httpService.get(
      RUNTIME_CONFIG_URL,
      RuntimeEnvironment,
      {
        baseURL: "/",
      },
    );
  } catch (_) {
    console.warn("No runtime environment configuration found");
    return environment;
  }

  return {
    ...environment,
    ...runtimeEnvironment,
  };
});
