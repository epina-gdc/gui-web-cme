import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        
        const value = control.value || '';
        const errores: any = {};
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (value.length < 8) {
            errores.minLength = true;
        }
        if (value.length > 12) {
            errores.maxLength = true;
        }
        if (!/[A-Z]/.test(value)) {
            errores.mayuscula = true;
        }
        if (!/[a-z]/.test(value)) {
            errores.minuscula = true;
        }
        if (!/\d/.test(value)) {
         errores.numero = true;
        }
        if(!specialCharRegex.test(value)){
            errores.caracter = true;
        }
        return Object.keys(errores).length ? errores : null;
    };
  }
  