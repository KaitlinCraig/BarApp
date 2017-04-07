import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { Locations } from '../providers/locations';
import { GoogleMaps } from '../providers/google-maps';
import { Connectivity } from '../providers/connectivity';
import { FeedPage } from '../pages/feed/feed';
import { PostPage } from '../pages/post/post';
import { Data } from '../providers/data';
import { AngularFireModule } from 'angularfire2';
import { SettingsPage } from '../pages/settings/settings';
import { AccountPage } from '../pages/account/account';
import { AuthProvider} from '../providers/auth-provider'  //Added AuthProvider
import { SignupPage } from '../pages/signup/signup'; //Added signup page
import { ResetPasswordPage } from '../pages/reset-password/reset-password'; //Added reset password page
import { ReviewPage } from '../pages/review/review';

const config = {
    apiKey: "AIzaSyD6qBJuMZmh8ouKycWIGRC85gs3GoPV_ec",
    authDomain: "barapp-90893.firebaseapp.com",
    databaseURL: "https://barapp-90893.firebaseio.com",
    storageBucket: "barapp-90893.appspot.com",
    messagingSenderId: "330038628477"
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    ListPage,
    PostPage,
    FeedPage,
    SettingsPage,
    AccountPage,
    SignupPage,  //Added signup page
    ResetPasswordPage, //Added
    ReviewPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    ListPage,
    PostPage,
    FeedPage,
    SettingsPage,
    AccountPage,
    SignupPage,  //Added signup page
    ResetPasswordPage, //Added
    ReviewPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Locations, GoogleMaps, Connectivity, Data, AuthProvider]
})
export class AppModule {}
