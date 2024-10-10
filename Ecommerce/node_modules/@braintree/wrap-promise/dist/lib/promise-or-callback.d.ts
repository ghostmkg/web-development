export declare function promiseOrCallback<T>(promise: Promise<T>, callback?: (error: Error | null, data?: T) => void): void | Promise<unknown>;
