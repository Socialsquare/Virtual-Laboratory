interface KnockoutObservableArrayFunctions<T> {
    setAt(index: number, value: T): void;
    isEmpty(): boolean;
    pushAll(valuesToPush: T[]): T[];
}

interface KnockoutObservableFunctions<T> {
    toggle(): boolean;
}
