import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthProvider } from '../../providers/auth-provider'; //added AuthProvider
import { SignupPage } from '../signup/signup' //Added sign up page
import { ResetPasswordPage } from '../reset-password/reset-password' //Added reset password page
import { ListPage } from '../list/list';
import { HomePage } from '../home/home';
/*
  Generated class for the Account page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  error: any;
    signupPage = SignupPage;  //Added sing up page
    resetPasswordPage = ResetPasswordPage //Added reset password page

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private auth: AuthProvider)
  {
    this.loginForm = this.fb.group({
               'email': ['', Validators.compose([Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])],
               'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
           });

           this.email = this.loginForm.controls['email'];
           this.password = this.loginForm.controls['password'];
     }

     loginWithGoogle(): void{
   this.auth.loginWithGoogle().subscribe((success) => {
     console.log(success);
   }, err => {
     console.log(err);
   });
 }

     login(): void {
        if(this.loginForm.valid) {
          var credentials = ({email: this.email.value, password: this.password.value});

          // this.navCtrl.push(HomePage, {userName: this.auth.currentUser})

          this.auth.loginWithEmail(credentials).subscribe(data => {
            console.log(data);
          }, error=>{             //Added next lines for handling unknown users
            console.log(error);
            if (error.code == 'auth/user-not-found')
            {
              alert('User not found');
            }
          });
        }
    }

    logout(): void {
      this.auth.logout();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

}
