import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import {Camera} from 'ionic-native';
/*
  Generated class for the Post page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
class Post {
  title: string
  body: string
  base64Image
  id: string


  constructor() {

  }

  takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        console.log(err);
    });
  }
}

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  post: Post = new Post()
  constructor(public navCtrl: NavController, public af: AngularFire) {}

  submit() {
    this.af.database.list('/posts').push(this.post)
    this.post = new Post()
    this.navCtrl.parent.select(3)
  }

}
