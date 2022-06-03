import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { Observable, timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ApplicationUserService } from "../application-user.service";



@Injectable({
  providedIn: 'root'
})
export class UserRestHandler {

  constructor(
    private applicationUserService: ApplicationUserService
  ) {

  }

  validateExitUsername(userId: string) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(1000).pipe(
          switchMap(() => {
              return this.findByUserName(control.value, userId).pipe(map((res: any) => {
                  let result = res.UserExist ? { userExist: true } : null;
                  return result;
              }));
          }),
      )
    }
  }

  validateExitEmail(userId: string) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return timer(1000).pipe(
            switchMap(() => {
                return this.findByEmail(control.value, userId).pipe(map((res: any) => {
                    var result = res.EmailExist ? { emailExist: true } : null;
                    return result;
                }));
            }),
        )
    }
  }

  validateMustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

  findByUserName(userName: string, userId: string) {
    return this.applicationUserService.getUserExist(userName, userId);
  }

  findByEmail(email: string, userId: string) {
    return this.applicationUserService.getEmailExist(email, userId);
  }

}
