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
  base64Image: string
  id: string


  constructor() {

  }
}

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  post: Post = new Post()
  public base64Image: string;
  constructor(public navCtrl: NavController, public af: AngularFire) {}

  takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        //console.log("this is image:" + this.base64Image);

        var takePicture= document.getElementById('takePicture');

            takePicture.addEventListener('change',function(e) {
              var file = imageData;
              var storageRef = firebase.storage().ref('data:image/jpeg;base64,' + imageData);
              var task = storageRef.put(file);
          });


    }, (err) => {
        console.log(err);
    });
  }


  submit() {
    this.af.database.list('/posts2').push(this.post)
    this.post = new Post()
    this.navCtrl.parent.select(3)
  }

}
