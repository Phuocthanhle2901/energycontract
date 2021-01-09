export class ErrorListBuilder{
    errorList : {locale: string, line: number, param1: string, param2: null | undefined | string}[] = [];

    public ErrorListBuilder(): void{};

    public add(condition: boolean, error : {locale: string, line: number, param1: string, param2: null | undefined | string}): ErrorListBuilder{
        if(condition)
            this.errorList.push(error);
        return this;
    }

    public build(): {locale: string, line: number, param1: string, param2: null | undefined | string}[]{
        return this.errorList;
    }
}

export class UserImportValidator{
    numberReg = /^\d+$/;
    specialCharactersReg = /[!@#$%^&*(),.?":{}|<>]/g;
    emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    phoneReg = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g;
    numberFalse = /.*\d.*/

    public UserImportValidator(): void{};

    public isNumber(value: string): boolean {
        return this.numberReg.test(value);
    }

    public isEmailAddress(value: string): boolean {
        return this.emailReg.test(value);
    }

    public isPhoneNumber(value: string): boolean {
        return this.phoneReg.test(value);
    }

    public firstCharacterIsASpace(value: string): boolean {
        return value.startsWith(" ");
    }

    public containsSpaces(value: string): boolean {
        return /\s/.test(value);
    }

    public containsCharacter(value: string): boolean {
        return /[a-zA-Z\p{L}]/.test(value);
    }

    public isEmpty(value: string): boolean {
        return (!value || /^\s*$/.test(value));
    }

    public containsNumber(value: string): boolean {
        return this.numberFalse.test(value);
    }
}