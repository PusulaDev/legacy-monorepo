import { EnterpriseApi, EnterpriseApiOptions } from "./api";
import { enterpriseLogicBoot } from "./logic/dependency-injection/enterprise-logic.boot";

export const enterpirseBoot = (
    apiOptions: EnterpriseApiOptions
): EnterpriseApi => {
    const api = new EnterpriseApi(apiOptions);
    enterpriseLogicBoot.initialize(api);

    return api;
};
