import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TAuthService } from 'src/app/lib';
import { PageLoadingService } from 'src/app/shared/services/page-loading.service';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSHelperString, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    private message: TDSMessageService) {

  }

  ngOnInit(): void {
    let that = this

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
    this.loader.show()
    this.authen.getCacheToken().subscribe(
      data => {
        if (TDSHelperObject.hasValue(data) &&
          TDSHelperString.hasValueString(data.access_token)) {
          that.router.navigate([that.returnUrl]);
          this.isSubmit = false;
          
        } 
        this.loader.hidden();
      },
      error => {
        this.isSubmit = false;
        this.loader.hidden();
      }
    )

  }

  onSubmit() {
    let that = this;

    if (this.loginForm.invalid || this.isSubmit) {
      return
    }
    this.isSubmit = true;
    this.isLoading = true;
    //this.loader.show()
    const { userName, password } = this.loginForm.value;

    this.authen.signInPassword(userName, password)
      .subscribe(
        data => {
          setTimeout(() => {
            this.isSubmit = false;
            this.isLoading = false;
            //this.loader.hidden();
          }, 100);
          that.router.navigate([that.returnUrl]);
       
        },
        (error: TDSSafeAny) => {
          this.message.error("Tài khoản hoặc mật khẩu không đúng");
          this.isSubmit = false;
          this.isLoading = false;
          console.log(this.loginForm)
          //this.loader.hidden();
        }
      );
  }
  
  showPass(){
    if(TDSHelperString.hasValueString(this.loginForm.value.password))
    this.isShowPass = !this.isShowPass
  }

  onChangeInputPass(){
    if(this.loginForm.value.password=='')
    this.isShowPass = false
  }



}
