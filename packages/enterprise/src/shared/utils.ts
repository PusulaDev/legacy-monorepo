import cloneDeep from "lodash.clonedeep";

export abstract class EnterpriseUtils {
    static clone<TModel>(object: TModel): TModel {
        return cloneDeep(object);
    }
}
