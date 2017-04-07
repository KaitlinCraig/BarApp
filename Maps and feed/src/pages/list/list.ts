import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { ReviewPage } from '../review/review';

class Bar {
  barName: string
  id: string
  user: string

  constructor() {

  }
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  User: string
  bar: Bar = new Bar()

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public locations: Locations,
    private alertCtrl: AlertController,
    public af: AngularFire) {
    this.User = this.navParams.get('userName');
  }

  ionViewDidLoad() {
    console.log('Hello ListPage Page');
  }

presentAlert(location) {
  let alert = this.alertCtrl.create({
    title: 'Would you like to rate ' + location.name + "?",
    subTitle: 'Rating is currently ' + location.rating + ".",
    buttons: ['No', 'Yes']
  });
  alert.present();
}

submit(location) {
  this.bar.barName = location.name;
  this.bar.id = location.id;
  this.bar.user = this.User;
  //this.af.database.list('/bars').push(this.bar)
  this.navCtrl.push(ReviewPage, {barName: this.bar.barName, barId: this.bar.id, userName: this.bar.user})
  //this.bar = new Bar()
  // this.navCtrl.parent.select(3)
}


}
