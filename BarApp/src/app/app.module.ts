import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

// Import the AF2 Module
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

// AF2 Settings
export const firebaseConfig = {
    apiKey: "AIzaSyCvIeTLt_navIsnvRQAb-yHFmEfAPnDoZA",
    authDomain: "fir-stuff-40bcf.firebaseapp.com",
    databaseURL: "https://fir-stuff-40bcf.firebaseio.com/",
    storageBucket: "fir-stuff-40bcf.appspot.com",
    messagingSenderId: "695531012598"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect, 
  scope: ['email','id','name','picture'],
  offline: true
};


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
	AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
