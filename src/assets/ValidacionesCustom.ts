import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidacionesCustom {
    static validarRFC(control: AbstractControl): ValidationErrors | null {
        let rfc = control.value.toUpperCase();
        const re = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/; //Expresion regular del RFC
        let validar = rfc.match(re);
        if(!validar){
            return {validarRFC: true};
        }
        return null
    }
    static validarCURP(control: AbstractControl): ValidationErrors | null {
        let curp = control.value.toUpperCase();
        const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/; //Expresion regular de la curp
        let validar = curp.match(re);
        if(!validar){
            return {validarCURP: true};
        }
        return null
    }
}