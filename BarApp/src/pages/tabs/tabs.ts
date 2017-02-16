import { Component } from '@angular/core';

import { NavController, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {GooglePlus} from 'ionic-native';
import firebase from 'firebase'


import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

  constructor() {

  }
}
