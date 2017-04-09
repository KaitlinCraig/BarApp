import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, ToastController, Content, Events } from 'ionic-angular';

import { IBar } from '../../interfaces';
import { BarCreatePage } from '../bar-create/bar-create';
import { BarReviewsPage } from '../bar-reviews/bar-reviews';
import { AuthService } from '../../providers/auth-service';
import { DataService } from '../../providers/data.service';
import { MappingsService } from '../../providers/mappings.service';
import { ItemsService } from '../../providers/items.service';
import { SqliteService } from '../../providers/sqlite.service';

@Component({
  templateUrl: 'bars.html'
})
export class BarsPage implements OnInit {
  @ViewChild(Content) content: Content;
  segment: string = 'all';
  selectedSegment: string = this.segment;
  queryText: string = '';
  public start: number;
  //Austin Note: This sets the number of bar reviews on the page
  public pageSize: number = 19;
  public loading: boolean = true;
  public internetConnected: boolean = true;

  public bars: Array<IBar> = [];
  public newBars: Array<IBar> = [];
  public favoriteBarKeys: string[];

  public firebaseConnectionAttempts: number = 0;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public authService: AuthService,
    public dataService: DataService,
    public sqliteService: SqliteService,
    public mappingsService: MappingsService,
    public itemsService: ItemsService,
    public events: Events) { }

  ngOnInit() {
    var self = this;
    self.segment = 'all';
    self.events.subscribe('network:connected', self.networkConnected);
    self.events.subscribe('bars:add', self.addNewBars);

    self.checkFirebase();
  }

  checkFirebase() {
    let self = this;
    if (!self.dataService.isFirebaseConnected()) {
      setTimeout(function () {
        console.log('Retry : ' + self.firebaseConnectionAttempts);
        self.firebaseConnectionAttempts++;
        if (self.firebaseConnectionAttempts < 5) {
          self.checkFirebase();
        } else {
          self.internetConnected = false;
          self.dataService.goOffline();
          self.loadSqliteBars();
        }
      }, 1000);
    } else {
      console.log('Firebase connection found (bars.ts) - attempt: ' + self.firebaseConnectionAttempts);
      self.dataService.getStatisticsRef().on('child_changed', self.onBarAdded);
      if (self.authService.getLoggedInUser() === null) {
        //
      } else {
        self.loadBars(true);
      }
    }
  }

  loadSqliteBars() {
    let self = this;

    if (self.bars.length > 0)
      return;

    self.bars = [];
    console.log('Loading from db..');
    self.sqliteService.getBars().then((data) => {
      console.log('Found in db: ' + data.rows.length + ' bars');
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let bar: IBar = {
            key: data.rows.item(i).key,
            title: data.rows.item(i).title,
            question: data.rows.item(i).question,
            category: data.rows.item(i).category,
            musicCategory: data.rows.item(i).musicCategory,
            dateCreated: data.rows.item(i).datecreated,
            user: { uid: data.rows.item(i).user, username: data.rows.item(i).username },
            reviews: data.rows.item(i).reviews
          };

          self.bars.push(bar);
          console.log('Bar added from db:' + bar.key);
          console.log(bar);
        }
        self.loading = false;
      }
    }, (error) => {
      console.log('Error: ' + JSON.stringify(error));
      self.loading = true;
    });
  }

  public networkConnected = (connection) => {
    var self = this;
    self.internetConnected = connection[0];
    console.log('NetworkConnected event: ' + self.internetConnected);

    if (self.internetConnected) {
      self.bars = [];
      self.loadBars(true);
    } else {
      self.notify('Connection lost. Working offline..');
      // save current threads..
      setTimeout(function () {
        console.log(self.bars.length);
        self.sqliteService.saveBars(self.bars);
        self.loadSqliteBars();
      }, 1000);
    }
  }

  // Notice function declarion to keep the right this reference
  public onBarAdded = (childSnapshot, prevChildKey) => {
    let priority = childSnapshot.val(); // priority..
    var self = this;
    self.events.publish('bar:created');
    // fetch new thread..
    self.dataService.getBarsRef().orderByPriority().equalTo(priority).once('value').then(function (dataSnapshot) {
      let key = Object.keys(dataSnapshot.val())[0];
      let newBar: IBar = self.mappingsService.getBar(dataSnapshot.val()[key], key);
      self.newBars.push(newBar);
    });
  }

  public addNewBars = () => {
    var self = this;
    self.newBars.forEach(function (bar: IBar) {
      self.bars.unshift(bar);
    });

    self.newBars = [];
    self.scrollToTop();
    self.events.publish('bars:viewed');
  }

  loadBars(fromStart: boolean) {
    var self = this;

    if (fromStart) {
      self.loading = true;
      self.bars = [];
      self.newBars = [];

      if (self.segment === 'all') {
        this.dataService.getTotalBars().then(function (snapshot) {
          self.start = snapshot.val();
          self.getBars();
        });
      } else {
        self.start = 0;
        self.favoriteBarKeys = [];
        self.dataService.getFavoriteBars(self.authService.getLoggedInUser().uid).then(function (dataSnapshot) {
          let favoriteBars = dataSnapshot.val();
          self.itemsService.getKeys(favoriteBars).forEach(function (barKey) {
            self.start++;
            self.favoriteBarKeys.push(barKey);
          });
          self.getBars();
        });
      }
    } else {
      self.getBars();
    }
  }

  getBars() {
    var self = this;
    let startFrom: number = self.start - self.pageSize;
    if (startFrom < 0)
      startFrom = 0;
    if (self.segment === 'all') {
      this.dataService.getBarsRef().orderByPriority().startAt(startFrom).endAt(self.start).once('value', function (snapshot) {
        self.itemsService.reversedItems<IBar>(self.mappingsService.getBars(snapshot)).forEach(function (bar) {
          self.bars.push(bar);
        });
        self.start -= (self.pageSize + 1);
        self.events.publish('bars:viewed');
        self.loading = false;
      });
    } else {
      self.favoriteBarKeys.forEach(key => {
        this.dataService.getBarsRef().child(key).once('value')
          .then(function (dataSnapshot) {
            self.bars.unshift(self.mappingsService.getBar(dataSnapshot.val(), key));
          });
      });
      self.events.publish('bars:viewed');
      self.loading = false;
    }

  }

  filterBars(segment) {
    if (this.selectedSegment !== this.segment) {
      this.selectedSegment = this.segment;
      if (this.selectedSegment === 'favorites')
        this.queryText = '';
      if (this.internetConnected)
        // Initialize
        this.loadBars(true);
    } else {
      this.scrollToTop();
    }
  }

  searchBars() {
    var self = this;
    if (self.queryText.trim().length !== 0) {
      self.segment = 'all';
      // empty current threads
      self.bars = [];
      self.dataService.loadBars().then(function (snapshot) {
        self.itemsService.reversedItems<IBar>(self.mappingsService.getBars(snapshot)).forEach(function (bar) {
          if (bar.title.toLowerCase().includes(self.queryText.toLowerCase()))
            self.bars.push(bar);
        });
      });
    } else { // text cleared..
      this.loadBars(true);
    }
  }

  createBar() {
    var self = this;
    let modalPage = this.modalCtrl.create(BarCreatePage);

    modalPage.onDidDismiss((data: any) => {
      if (data) {
        let toast = this.toastCtrl.create({
          message: 'Bar created',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();

        if (data.priority === 1)
          self.newBars.push(data.bar);

        self.addNewBars();
      }
    });

    modalPage.present();
  }

  viewReviews(key: string) {
    if (this.internetConnected) {
      this.navCtrl.push(BarReviewsPage, {
        barKey: key
      });
    } else {
      this.notify('Network not found..');
    }
  }

  reloadBars(refresher) {
    this.queryText = '';
    if (this.internetConnected) {
      this.loadBars(true);
      refresher.complete();
    } else {
      refresher.complete();
    }
  }

  fetchNextBars(infiniteScroll) {
    if (this.start > 0 && this.internetConnected) {
      this.loadBars(false);
      infiniteScroll.complete();
    } else {
      infiniteScroll.complete();
    }
  }

  scrollToTop() {
    var self = this;
    setTimeout(function () {
      self.content.scrollToTop();
    }, 1500);
  }

  notify(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
