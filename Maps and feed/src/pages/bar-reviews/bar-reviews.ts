import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, LoadingController, NavParams, Content } from 'ionic-angular';

import { ReviewCreatePage } from '../review-create/review-create';
import { IReview } from '../../interfaces';
import { AuthService } from '../../providers/auth-service';
import { DataService } from '../../providers/data.service';
import { ItemsService } from '../../providers/items.service';
import { MappingsService } from '../../providers/mappings.service';

@Component({
    templateUrl: 'bar-reviews.html'
})
export class BarReviewsPage implements OnInit {
    @ViewChild(Content) content: Content;
    barKey: string;
    reviewsLoaded: boolean = false;
    reviews: IReview[];

    constructor(public actionSheeCtrl: ActionSheetController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public authService: AuthService,
        public itemsService: ItemsService,
        public dataService: DataService,
        public mappingsService: MappingsService) { }

    ngOnInit() {
        var self = this;
        self.barKey = self.navParams.get('barKey');
        self.reviewsLoaded = false;

        self.dataService.getBarReviewsRef(self.barKey).once('value', function (snapshot) {
            self.reviews = self.mappingsService.getReviews(snapshot);
            self.reviewsLoaded = true;
        }, function (error) {});
    }

    createReview() {
        let self = this;

        let modalPage = this.modalCtrl.create(ReviewCreatePage, {
            barKey: this.barKey
        });

        modalPage.onDidDismiss((reviewData: any) => {
            if (reviewData) {
                let reviewVals = reviewData.review;
                let reviewUser = reviewData.user;

                let createdReview: IReview = {
                    key: reviewVals.key,
                    bar: reviewVals.bar,
                    text: reviewVals.text,
                    user: reviewUser,
                    dateCreated: reviewVals.dateCreated,
                    votesUp: null,
                    votesDown: null
                };

                self.reviews.push(createdReview);
                self.scrollToBottom();

                let toast = this.toastCtrl.create({
                    message: 'Review created',
                    duration: 2000,
                    position: 'top'
                });
                toast.present();
            }
        });

        modalPage.present();
    }

    scrollToBottom() {
        this.content.scrollToBottom();
    }

    vote(like: boolean, review: IReview) {
        var self = this;

        self.dataService.voteReview(review.key, like, self.authService.getLoggedInUser().uid).then(function () {
            self.dataService.getReviewsRef().child(review.key).once('value').then(function (snapshot) {
                review = self.mappingsService.getReview(snapshot, review.key);
                self.itemsService.setItem<IReview>(self.reviews, c => c.key === review.key, review);
            });
        });
    }

    showReviewActions() {
        var self = this;
        let actionSheet = self.actionSheeCtrl.create({
            title: 'Bar Actions',
            buttons: [
                {
                    text: 'Add to favorites',
                    icon: 'heart',
                    handler: () => {
                        self.addBarToFavorites();
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close-circle',
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        });

        actionSheet.present();
    }

    addBarToFavorites() {
        var self = this;
        let currentUser = self.authService.getLoggedInUser();
        if (currentUser != null) {
            self.dataService.addBarToFavorites(currentUser.uid, self.barKey)
                .then(function () {
                    let toast = self.toastCtrl.create({
                        message: 'Added to favorites',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                });
        } else {
            let toast = self.toastCtrl.create({
                message: 'This action is available only for authenticated users',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    }
}
