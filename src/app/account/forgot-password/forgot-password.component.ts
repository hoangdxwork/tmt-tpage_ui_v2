import { PageLoadingService } from 'src/app/shared/services/page-loading.service';
import { TAuthService } from 'src/app/lib';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil} from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [ TDSDestroyService]
})

export class ForgotPasswordComponent implements OnInit {

  forgotPassForm!: FormGroup;
  returnUrl!: string;
  isSubmit: boolean = false;
  isLoading: boolean = false;
  isShowPass: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authen: TAuthService,
    private route: ActivatedRoute,
    private loader: PageLoadingService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {
    let that = this;

    that.forgotPassForm = this.formBuilder.group({
        email: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (TDSHelperString.hasValueString(returnUrl) && returnUrl != environment.urlLogin) {
      this.returnUrl = returnUrl;
    } else {
      this.returnUrl = '/dashboard';
    }

    this.loader.show();
    this.authen.getCacheToken().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        if (TDSHelperObject.hasValue(data) && TDSHelperString.hasValueString(data.access_token)) {
            that.router.navigate([that.returnUrl]);
            this.isSubmit = false;
        }
        this.loader.hidden();
      },
      error: (error: any) => {
          this.isSubmit = false;
          this.loader.hidden();
      }
    })
  }

  onSubmit() {
  }

}
