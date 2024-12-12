import { AbstractControl, ValidationErrors } from '@angular/forms';

function isEmptyInputValue(value: any): boolean {
  return value == null || value.length === 0;
}

export class CustomValidators{
  static numberReg = /^\d+$/;
  static specialCharactersReg = /[!@#$%^&*(),.?":{}|<>]/g;
  static emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  static phoneReg = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  static phoneRegNonVN = /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/;
  static numberFalseReg = /.*\d.*/

  static cannotContainsFirstWhiteSpace(c: AbstractControl) : ValidationErrors | null {
    const field = c.value as string;

    if(isEmptyInputValue(field))
      return null;

    return (!field.startsWith(" ")) ? null : { 'validateFirstWhiteSpace': true};
  }

  static cannotContainsWhiteSpace(c: AbstractControl) : ValidationErrors | null {
    const field = c.value as string;

    if(isEmptyInputValue(field))
          return null;

    return (/\s/.test(field)) ? { 'spaces': true } : null;
  }

  static number(c: AbstractControl): ValidationErrors | null {
    const field = c.value as string;

    if(isEmptyInputValue(field))
          return null;

    return CustomValidators.numberReg.test(field) ? null : { 'number': true };
  }

  static phoneNumber(c: AbstractControl): ValidationErrors | null {
    const field = c.value as string;

    if(isEmptyInputValue(field))
          return null;

    return CustomValidators.phoneReg.test(field) || CustomValidators.phoneRegNonVN.test(field) ? null : { 'phone': true };
  }

  static specialCharacterFalse(c: AbstractControl): ValidationErrors | null {
    const field = c.value as string;

    if(isEmptyInputValue(field))
          return null;

    return CustomValidators.specialCharactersReg.test(field) ? { 'special': true } : null;
  }

  static numberFalse(c: AbstractControl): ValidationErrors | null {
    const field = c.value as string;

    if(isEmptyInputValue(field))
      return null;

    return CustomValidators.numberFalseReg.test(field) ? { 'numberfalse': true } : null;
  }
}
