import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, LoadingController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IReview, IUser } from '../../interfaces';
import { AuthService } from '../../providers/auth-service';
import { DataService } from '../../providers/data.service';

@Component({
  templateUrl: 'review-create.html'
})
export class ReviewCreatePage implements OnInit {

  createReviewForm: FormGroup;
  review: AbstractControl;
  barKey: string;
  loaded: boolean = false;

  constructor(public nav: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public authService: AuthService,
    public dataService: DataService) {

  }

  ngOnInit() {
    this.barKey = this.navParams.get('barKey');

    this.createReviewForm = this.fb.group({
      'review': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });

    this.review = this.createReviewForm.controls['review'];
    this.loaded = true;
  }

  cancelNewReview() {
    this.viewCtrl.dismiss();
  }

  onSubmit(reviewForm: any): void {
    var self = this;
    if (this.createReviewForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting review...',
        dismissOnPageChange: true
      });

      loader.present();

      let uid = self.authService.getLoggedInUser().uid;
      self.dataService.getUsername(uid).then(function (snapshot) {
        let username = snapshot.val();

        let reviewRef = self.dataService.getReviewsRef().push();
        let reviewkey: string = reviewRef.key;
        let user: IUser = { uid: uid, username: username };

        let newReview: IReview = {
          key: reviewkey,
          text: reviewForm.review,
          bar: self.barKey,
          user: user,
          dateCreated: new Date().toString(),
          votesUp: null,
          votesDown: null
        };

        self.dataService.submitReview(self.barKey, newReview)
          .then(function (snapshot) {
            loader.dismiss()
              .then(() => {
                self.viewCtrl.dismiss({
                  review: newReview,
                  user: user
                });
              });
          }, function (error) {
            // The Promise was rejected.
            console.error(error);
            loader.dismiss();
          });
      });
    }
  }
}
