import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
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
// import { ReviewPage } from '../pages/review/review';
import { BarCreatePage } from '../pages/bar-create/bar-create';
import { ReviewCreatePage } from '../pages/review-create/review-create';
import { BarReviewsPage } from '../pages/bar-reviews/bar-reviews';
import { BarComponent } from '../components/bar.component';
import { UserAvatarComponent } from '../components/user-avatar.component';
import { BarsPage } from '../pages/bars/bars';
import { ProfilePage } from '../pages/profile/profile';
import { ItemsService } from '../providers/items.service';
import { SqliteService } from '../providers/sqlite.service';
import { MappingsService } from '../providers/mappings.service';
import { DataService } from '../providers/data.service';
import { AuthService } from '../providers/auth-service';
import { LoginPage } from '../pages/login/login';

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
    // ReviewPage,
    BarCreatePage,
    ReviewCreatePage,
    BarReviewsPage,
    BarComponent,
    UserAvatarComponent,
    BarsPage,
    ProfilePage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    HttpModule,
    FormsModule
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
    // ReviewPage,
    BarCreatePage,
    ReviewCreatePage,
    BarReviewsPage,
    BarsPage,
    ProfilePage,
    LoginPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    Locations,
    GoogleMaps,
    Connectivity,
    Data,
    AuthProvider,
    AuthService,
    DataService,
    ItemsService,
    SqliteService,
    MappingsService]
})
export class AppModule {}
