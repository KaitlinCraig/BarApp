import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';

import { IBar } from '../interfaces';
import { DataService } from '../providers/data.service';

@Component({
    selector: 'forum-bar',
    templateUrl: 'bar.component.html'
})
export class BarComponent implements OnInit, OnDestroy {
    @Input() bar: IBar;
    @Output() onViewReviews = new EventEmitter<string>();

    constructor(private dataService: DataService) { }

    ngOnInit() {
        var self = this;
        self.dataService.getBarsRef().child(self.bar.key).on('child_changed', self.onReviewAdded);
    }

    ngOnDestroy() {
         console.log('destroying..');
        var self = this;
        self.dataService.getBarsRef().child(self.bar.key).off('child_changed', self.onReviewAdded);
    }

    // Notice function declarion to keep the right this reference
    public onReviewAdded = (childSnapshot, prevChildKey) => {
       console.log(childSnapshot.val());
        var self = this;
        // Attention: only number of comments is supposed to changed.
        // Otherwise you should run some checks..
        self.bar.reviews = childSnapshot.val();
    }

    viewReviews(key: string) {
        this.onViewReviews.emit(key);
    }

}
