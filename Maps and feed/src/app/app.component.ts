import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController, ViewController, Events, ModalController  } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';
import { Subscription } from '../../node_modules/rxjs/Subscription';

import { HomePage } from '../pages/home/home';

import { SettingsPage } from '../pages/settings/settings';
// import { AccountPage } from '../pages/account/account';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
// import { BarsPage } from '../pages/bars/bars';
import { DataService } from '../providers/data.service';
// import { AuthProvider } from '../providers/auth-provider';
import { SqliteService } from '../providers/sqlite.service';
import { AuthService } from '../providers/auth-service';

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  @ViewChild('content') nav: any;
  // @ViewChild(Nav) nav: Nav;

  public rootPage: any;
  public loginPage: LoginPage;

  connectSubscription: Subscription;


  //rootPage = BarsPage;

  //pages: Array<{title: string, component: any}>;

  constructor(platform: Platform,
    public dataService: DataService,
    public authService: AuthService,
    public sqliteService: SqliteService,
    public menu: MenuController,
    public events: Events,
    public modalCtrl: ModalController) {
    // this.initializeApp();
    //
    // // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Homepage', component: HomePage },
    //   { title: 'Settings', component: SettingsPage },
    //   { title: 'Account', component: AccountPage }
    // ];

    // this.ngOnInit();
    var self = this;
    this.rootPage = HomePage;

    platform.ready().then(() => {
      if (window.cordova) {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        self.watchForConnection();
        self.watchForDisconnect();
        Splashscreen.hide();

        console.log('in ready..');
        let array: string[] = platform.platforms();
        console.log(array);
        self.sqliteService.InitDatabase();
      }
    });

  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Okay, so the platform is ready and our plugins are available.
  //     // Here you can do any higher level native things you might need.
  //     StatusBar.styleDefault();
  //     Splashscreen.hide();
  //   });
  // }



  watchForConnection() {
    var self = this;
    Network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        console.log('we got a connection..');
        console.log('Firebase: Go Online..');
        self.dataService.goOnline();
        self.events.publish('network:connected', true);
      }, 3000);
    });
  }

  watchForDisconnect() {
    var self = this;
    // watch network for a disconnect
    Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      console.log('Firebase: Go Offline..');
      //self.sqliteService.resetDatabase();
      self.dataService.goOffline();
      self.events.publish('network:connected', false);
    });
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }

  ngOnInit() {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (!user) {
  //       this.nav.setRoot(HomePage);
  //     }
  //   });
  //   this.platform.ready().then(() => {
  //    StatusBar.styleDefault();
  //  });
  }

  ngAfterViewInit() {
    var self = this;

    this.authService.onAuthStateChanged(function (user) {
      if (user === null) {
        self.menu.close();
        //self.nav.setRoot(LoginPage);

        let loginodal = self.modalCtrl.create(LoginPage);
        loginodal.present();
      }
    });
  }

  openPage(page) {
    let viewCtrl: ViewController = this.nav.getActive();
    // close the menu when clicking a link from the menu
    this.menu.close();

    if (page === 'signup') {
      if (!(viewCtrl.instance instanceof SignupPage))
        this.nav.push(SignupPage);
    }
  }

  // openMenu() {
  // this.menu.open();
  // }

  signout() {
    var self = this;
    self.menu.close();
    self.authService.signOut();
  }

  isUserLoggedIn(): boolean {
    let user = this.authService.getLoggedInUser();
    return user !== null;
  }
}
