import { AbstractControl, ValidationErrors } from '@angular/forms';

function isEmptyInputValue(value: any): boolean {
  return value == null || value.length === 0;
}

export class CustomValidators{
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
}
