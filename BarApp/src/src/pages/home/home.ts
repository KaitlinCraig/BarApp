import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

const data = [{
  title: 'post1',
  body: 'hi',
  id: 0
},{
  title: 'post2',
  body: 'hi2',
  id: 1
},{
  title: 'post3',
  body: 'hi3',
  id: 2
},]

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: any
  constructor(public navCtrl: NavController) {
    this.posts = data;
  }

}
