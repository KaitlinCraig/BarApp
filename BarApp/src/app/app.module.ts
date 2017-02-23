import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PostPage } from '../pages/post/post';
import { Data } from '../providers/data';
import { AngularFireModule } from 'angularfire2';
import { ConnectionComponent } from '../components/connection/connection'

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
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PostPage,
    ConnectionComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PostPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Data]
})
export class AppModule {}
