import { Component } from '@angular/core';

import { MapPage } from '../map/map';
import { ListPage } from '../list/list';
import { PostPage } from '../post/post';
import { FeedPage } from '../feed/feed';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab1Root: any = MapPage;
  tab2Root: any = ListPage;
  tab3Root: any = PostPage;
  tab4Root: any = FeedPage;

  constructor(){

  }

}
