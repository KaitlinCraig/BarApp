import { Component } from '@angular/core';
import { FirebaseObjectObservable, AngularFire } from 'angularfire2';

/*
  Generated class for the Connection component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'connection',
  templateUrl: 'connection.html'
})
export class ConnectionComponent {

  status: FirebaseObjectObservable<any>
  constructor(public af: AngularFire) {
    this.status = this.af.database.object('.info/connected')
  }

}
