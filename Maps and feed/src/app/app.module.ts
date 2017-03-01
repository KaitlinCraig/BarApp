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
    AccountPage
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
    AccountPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Locations, GoogleMaps, Connectivity, Data]
})
export class AppModule {}
