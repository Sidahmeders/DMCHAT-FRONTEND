export declare function register(config: {
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
}): void;
export declare function unregister(): void;
