import { EnterpriseLogic } from "../enterprise-logic";
import { IEnterpriseApi } from "../../api";

declare global {
    interface Window {
        enterpriseLogicBoot: any;
    }
}

  class EnterpriseLogicBoot {
    private api: IEnterpriseApi | null = null;
    private collection: typeof EnterpriseLogic[] = [];

     register(logic: typeof EnterpriseLogic) {
        this.collection.push(logic);

        if (this.api) this.initialize(this.api);
    }

     initialize(api: IEnterpriseApi) {
        this.api = api;
        this.collection.forEach((logic) => {
            this.initalizeLogic(logic, api);
        });

        this.collection.forEach(this.runReadyMethods);

        this.collection = [];

        window.enterpriseLogicBoot = this;
    }

    private  runReadyMethods(logic: typeof EnterpriseLogic) {
        logic.instance?.ready?.();
    }

    private  initalizeLogic(logic: typeof EnterpriseLogic, api: IEnterpriseApi) {
        logic.instance = new logic(api);
    }
}

const enterpriseLogicBoot = window.enterpriseLogicBoot ?? new EnterpriseLogicBoot();
window.enterpriseLogicBoot = enterpriseLogicBoot;
export { enterpriseLogicBoot }