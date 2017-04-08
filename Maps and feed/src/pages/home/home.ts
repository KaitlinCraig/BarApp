

import { MapPage } from '../map/map';
import { ListPage } from '../list/list';
import { PostPage } from '../post/post';
import { FeedPage } from '../feed/feed';

import {BarsPage} from '../bars/bars';
import { ProfilePage } from '../profile/profile';
import { AuthService } from '../../providers/auth-service';
import {Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, Tabs } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  @ViewChild('forumTabs') tabRef: Tabs;

  public barsPage: any;
  public profilePage: any;

  public newBars: string = '';
  public selectedTab: number = -1;

  // tab1Root: any = MapPage;
  // tab2Root: any = ListPage;
  // tab3Root: any = PostPage;
  // tab4Root: any = FeedPage;

  constructor(public navCtrl: NavController,
        public authService: AuthService,
        public events: Events){
        this.barsPage = BarsPage;
        this.profilePage = ProfilePage;
  }

  ngOnInit() {
        this.startListening();
    }

    startListening() {
        var self = this;

        self.events.subscribe('bar:created', (barData) => {
            if (self.newBars === '') {
                self.newBars = '1';
            } else {
                self.newBars = (+self.newBars + 1).toString();
            }
        });

        self.events.subscribe('bars:viewed', (barData) => {
            self.newBars = '';
        });
    }

    clicked() {
        var self = this;

        if (self.newBars !== '') {
            self.events.publish('bars:add');
            self.newBars = '';
        }
    }

}
