import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IBar, IReview } from '../interfaces';
declare var firebase: any;

@Injectable()
export class DataService {

  databaseRef: any = firebase.database();
  usersRef: any = firebase.database().ref('users');
  barsRef: any = firebase.database().ref('bars');
  reviewsRef: any = firebase.database().ref('reviews');
  statisticsRef: any = firebase.database().ref('statistics');
  storageRef: any = firebase.storage().ref();
  connectionRef: any = firebase.database().ref('.info/connected');
  defaultImageUrl: string;
  connected: boolean = false;

    constructor() {
      var self = this;
          try {
              self.checkFirebaseConnection();
              /*
              self.storageRef.child('images/default/profile.png').getDownloadURL().then(function (url) {
                  self.defaultImageUrl = url.split('?')[0] + '?alt=media';
              });
              */
              self.InitData();
          } catch (error) {
              console.log('Data Service error:' + error);
          }
    }


    checkFirebaseConnection() {
          try {
              var self = this;
              var connectedRef = self.getConnectionRef();
              connectedRef.on('value', function (snap) {
                  console.log(snap.val());
                  if (snap.val() === true) {
                      console.log('Firebase: Connected:');
                      self.connected = true;
                  } else {
                      console.log('Firebase: No connection:');
                      self.connected = false;
                  }
              });
          } catch (error) {
              self.connected = false;
          }
      }

      isFirebaseConnected() {
          return this.connected;
      }

      private InitData() {
          let self = this;
          // Set statistics/threads = 1 for the first time only
          self.getStatisticsRef().child('bars').transaction(function (currentRank) {
              if (currentRank === null) {
                  return 1;
              }
          }, function (error, committed, snapshot) {
              if (error) {
                  console.log('Transaction failed abnormally!', error);
              } else if (!committed) {
                  console.log('We aborted the transaction because there is already one thread.');
              } else {
                  console.log('Threads number initialized!');

                  let bar: IBar = {
                      key: null,
                      title: 'Welcome to Forum!',
                      question: 'Congratulations! It seems that you have successfully setup the Forum app.',
                      category: 'welcome',
                      dateCreated: new Date().toString(),
                      user: { uid: 'default', username: 'Administrator' },
                      reviews: 0
                  };

                  let firstBarRef = self.barsRef.push();
                  firstBarRef.setWithPriority(bar, 1).then(function (dataShapshot) {
                      console.log('Congratulations! You have created the first bar!');
                  });
              }
              console.log('commited', snapshot.val());
          }, false);
      }

      getDatabaseRef() {
          return this.databaseRef;
      }

      getConnectionRef() {
          return this.connectionRef;
      }

      goOffline() {
          firebase.database().goOffline();
      }

      goOnline() {
          firebase.database().goOnline();
      }

      getDefaultImageUrl() {
          return this.defaultImageUrl;
      }

      getTotalBars() {
          return this.statisticsRef.child('bars').once('value');
      }

      getBarsRef() {
          return this.barsRef;
      }

      getReviewsRef() {
          return this.reviewsRef;
      }

      getStatisticsRef() {
          return this.statisticsRef;
      }

      getUsersRef() {
          return this.usersRef;
      }

      getStorageRef() {
          return this.storageRef;
      }

      getBarReviewsRef(barKey: string) {
          return this.reviewsRef.orderByChild('bar').equalTo(barKey);
      }

      loadBars() {
          return this.barsRef.once('value');
      }

      submitBar(bar: IBar, priority: number) {

          var newBarRef = this.barsRef.push();
          this.statisticsRef.child('bars').set(priority);
          console.log(priority);
          return newBarRef.setWithPriority(bar, priority);
      }

      addBarToFavorites(userKey: string, barKey: string) {
          return this.usersRef.child(userKey + '/favorites/' + barKey).set(true);
      }

      getFavoriteBars(user: string) {
          return this.usersRef.child(user + '/favorites/').once('value');
      }

      setUserImage(uid: string) {
          this.usersRef.child(uid).update({
              image: true
          });
      }

      loadReviews(barKey: string) {
          return this.reviewsRef.orderByChild('bar').equalTo(barKey).once('value');
      }

      submitReview(barKey: string, review: IReview) {
          // let commentRef = this.commentsRef.push();
          // let commentkey: string = commentRef.key;
          this.reviewsRef.child(review.key).set(review);

          return this.barsRef.child(barKey + '/reviews').once('value')
              .then((snapshot) => {
                  let numberOfReviews = snapshot == null ? 0 : snapshot.val();
                  this.barsRef.child(barKey + '/reviews').set(numberOfReviews + 1);
              });
      }

      voteReview(reviewKey: string, like: boolean, user: string): any {
          let reviewRef = this.reviewsRef.child(reviewKey + '/votes/' + user);
          return reviewRef.set(like);
      }

      getUsername(userUid: string) {
          return this.usersRef.child(userUid + '/username').once('value');
      }

      getUser(userUid: string) {
          return this.usersRef.child(userUid).once('value');
      }

      getUserBars(userUid: string) {
          return this.barsRef.orderByChild('user/uid').equalTo(userUid).once('value');
      }

      getUserReviews(userUid: string) {
          return this.reviewsRef.orderByChild('user/uid').equalTo(userUid).once('value');
      }

}
