import { EnterpriseLogic } from "..";
import { enterpriseLogicBoot } from "./enterprise-logic.boot";

export function logic(logicClass: typeof EnterpriseLogic) {
    enterpriseLogicBoot.register(logicClass);
}
