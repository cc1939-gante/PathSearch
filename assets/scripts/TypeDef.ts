export class Singleton<T extends Singleton<T>> {
    private static _instance: Singleton<any> = null;

    protected constructor() {
        // 防止通过 new 关键字直接创建实例
        if (Singleton._instance) {
            throw new Error("This class is a singleton and cannot be instantiated directly.");
        }
    }

    public static getInstance<T extends Singleton<T>>(): T {
        if (!Singleton._instance) {
            Singleton._instance = new this();
        }
        return Singleton._instance as T;
    }
}