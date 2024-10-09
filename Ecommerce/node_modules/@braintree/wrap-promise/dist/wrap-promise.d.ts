interface ClassContructor {
    new (...args: any[]): any;
    [propName: string]: any;
}
declare type WrapPrototypeOptions = {
    ignoreMethods?: string[];
    transformPrivateMethods?: boolean;
};
declare function wrapPromise(fn: Function): Function;
declare namespace wrapPromise {
    var wrapPrototype: (target: ClassContructor, options?: WrapPrototypeOptions) => ClassContructor;
}
export = wrapPromise;
