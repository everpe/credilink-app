import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function atLeastOneFieldValidator(fields: string[]): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const isValid = fields.some(field => !!formGroup.get(field)?.value);  // Verifica que al menos uno de los campos tenga valor
    return isValid ? null : { atLeastOneField: true };  // Retorna un error si ninguno tiene valor
  };
}
