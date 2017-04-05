import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

class Bar {
  barName: string
  barRating: string
  id: string


  constructor() {

  }
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  bar: Bar = new Bar()

  constructor(public navCtrl: NavController, public locations: Locations, private alertCtrl: AlertController, public af: AngularFire) {}

  ionViewDidLoad() {
    console.log('Hello ListPage Page');
  }

//   public open(event, location) {
//   event.stopPropagation();
//   alert('Open ' + location.name);
// }
//
//   public download(event, location) {
//   event.stopPropagation();
//   alert('Download ' + location.name);
// }

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
  this.af.database.list('/bars').push(this.bar)
  this.bar = new Bar()

  // this.navCtrl.parent.select(3)
}
}
