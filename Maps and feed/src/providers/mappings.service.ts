import { Injectable } from '@angular/core';

import { IBar, IReview } from '../interfaces';
import { ItemsService } from '../providers/items.service';

@Injectable()
export class MappingsService {

    constructor(private itemsService: ItemsService) { }

    getBars(snapshot: any): Array<IBar> {
        let bars: Array<IBar> = [];
        if (snapshot.val() == null)
            return bars;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let bar: any = list[key];
            bars.push({
                key: key,
                title: bar.title,
                question: bar.question,
                category: bar.category,
                dateCreated: bar.dateCreated,
                user: { uid: bar.user.uid, username: bar.user.username },
                reviews: bar.reviews == null ? 0 : bar.reviews
            });
        });

        return bars;
    }

    getThread(snapshot: any, key: string): IBar {

        let bar: IBar = {
            key: key,
            title: snapshot.title,
            question: snapshot.question,
            category: snapshot.category,
            dateCreated: snapshot.dateCreated,
            user: snapshot.user,
            reviews: snapshot.reviews == null ? 0 : snapshot.reviews
        };

        return bar;
    }

    getReviews(snapshot: any): Array<IReview> {
        let reviews: Array<IReview> = [];
        if (snapshot.val() == null)
            return reviews;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let review: any = list[key];
            //console.log(comment.votes);
            this.itemsService.groupByBoolean(review.votes, true);

            reviews.push({
                key: key,
                text: review.text,
                bar: review.thread,
                dateCreated: review.dateCreated,
                user: review.user,
                votesUp: this.itemsService.groupByBoolean(review.votes, true),
                votesDown: this.itemsService.groupByBoolean(review.votes, false)
            });
        });

        return reviews;
    }

    getReview(snapshot: any, reviewKey: string): IReview {
        let review: IReview;

        if (snapshot.val() == null)
            return null;

        let snapshotReview = snapshot.val();
        console.log(snapshotReview);
        review = {
            key: reviewKey,
            text: snapshotReview.text,
            bar: snapshotReview.bar,
            dateCreated: snapshotReview.dateCreated,
            user: snapshotReview.user,
            votesUp: this.itemsService.groupByBoolean(snapshotReview.votes, true),
            votesDown: this.itemsService.groupByBoolean(snapshotReview.votes, false)
        };

        return review;
    }

}
