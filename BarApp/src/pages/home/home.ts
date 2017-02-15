import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import {AutocompletePage} from './autocomplete';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

   address;

     constructor(private navCtrl: NavController, private modalCtrl: ModalController) {
       this.address = {
         place: ''
       };
     }

     showAddressModal () {
       let modal = this.modalCtrl.create(AutocompletePage);
       let me = this;
       modal.onDidDismiss(data => {
         this.address.place = data;
       });
       modal.present();
     }

}
