import {
  FormGroup,
  Validators,
  ValidationErrors,
  FormControl,
} from '@angular/forms';

// control là true return error elsse null

export const RepeatPasswordValidator = (
  control: FormGroup
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmpassword = control.get('confirmpassword');
  return password && confirmpassword && password.value === confirmpassword.value
    ? null
    : { identityRevealed: true };
};

export const EmailValidation = [Validators.required, Validators.email];
export const PasswordValidation = [
  Validators.required,
  Validators.minLength(6),
];
