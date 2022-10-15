import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TAuthService } from 'src/app/lib';
import { PageLoadingService } from 'src/app/shared/services/page-loading.service';
import { environment } from 'src/environments/environment';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ TDSDestroyService]
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  returnUrl!: string;
  isSubmit: boolean = false;
  isLoading: boolean = false;
  isShowPass: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authen: TAuthService,
    private route: ActivatedRoute,
    private loader: PageLoadingService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {
    let that = this;

    that.loginForm = this.formBuilder.group({
        userName: ['', Validators.required],
        password: ['', Validators.required],
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
    let that = this;
    if (this.loginForm.invalid || this.isSubmit) {
      return
    }

    this.isSubmit = true;
    this.isLoading = true;
    const { userName, password } = this.loginForm.value;

    this.authen.signInPassword(userName, password).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        setTimeout(() => {
            this.isSubmit = false;
            this.isLoading = false;
        }, 100);

        that.router.navigate([that.returnUrl]);
      },
      error: (error: any) => {
          this.isSubmit = false;
          this.isLoading = false;
          this.message.error("Tài khoản hoặc mật khẩu không đúng");
      }
    });
  }

  showPass(){
    if(TDSHelperString.hasValueString(this.loginForm.value.password))
    this.isShowPass = !this.isShowPass;
  }

  onChangeInputPass(){
    if(this.loginForm.value.password=='')
    this.isShowPass = false;
  }

  forgotPassword() {
      this.router.navigateByUrl('/account/forgot-password');
  }

}
