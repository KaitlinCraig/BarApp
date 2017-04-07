import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController  } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthProvider } from '../../providers/auth-provider';


class Bar {
  barName: string
  barRating: string
  id: string
  ageRange: any
  hotness: any
  user: string

  constructor() {

  }
}

@Component({
  selector: 'page-review',
  templateUrl: 'review.html'
})
export class ReviewPage {



  BarName: string
  BarId: string
  User: string

  @ViewChild(Slides) slides: Slides;

  bar: Bar = new Bar()
  bars: FirebaseListObservable<any>
;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public af: AngularFire,
      public nav: NavController,
      public auth: AuthProvider)
    {
    this.BarName = this.navParams.get('barName');
    this.BarId = this.navParams.get('barId');
    this.User = this.navParams.get('userName');
    this.bars = af.database.list('/bars')
  }



  ionViewDidLoad() {
    console.log('Hello ReviewPage');
  }

  goToSlide() {
   this.slides.slideTo(2,500);
 }

 slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", currentIndex);
  }

  submit() {
    this.bar.barName = this.BarName;
    this.bar.id = this.BarId;
    this.bar.user = this.auth.currentUser;
    console.log(this.User);
    this.af.database.list('/bars').push(this.bar)
    this.bar = new Bar()
    this.navCtrl.parent.select(1)
    //this.navCtrl.pop();
  }

}
