class EnumValueGenerator {
    static value: int = 0;

    static next() {
        return EnumValueGenerator.value++;
    }
}

export = EnumValueGenerator;
