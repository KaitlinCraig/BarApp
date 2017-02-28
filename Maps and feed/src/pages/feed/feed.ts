import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AngularFire, FirebaseListObservable} from 'angularfire2';


@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {
  posts: FirebaseListObservable<any>
  constructor(public navCtrl: NavController, public af: AngularFire) {
    this.posts = af.database.list('/posts')
  }

}
