import { FormControl, ValidationErrors } from "@angular/forms";

export class CloneCartValidator {
    //Whitespace validator
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null{
         
        //check if rthe string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)){

            // invalid, return the error object
            return { 'notOnlyWhitespace': true};
        }else{
            return null;
        }
        
    }
}
