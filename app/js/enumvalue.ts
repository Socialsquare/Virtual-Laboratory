class EnumValueGenerator {
    static value: number = 0;

    static next() {
        return EnumValueGenerator.value++;
    }
}

export = EnumValueGenerator;
