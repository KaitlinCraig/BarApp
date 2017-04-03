import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  constructor(public navCtrl: NavController, public locations: Locations, private alertCtrl: AlertController) {}

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
}
