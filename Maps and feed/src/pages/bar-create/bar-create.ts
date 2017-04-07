import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IBar } from '../../interfaces';
import { AuthProvider } from  '../../providers/auth-provider';
import { DataService } from '../../providers/data.service';

@Component({
  templateUrl: 'bar-create.html'
})
export class BarCreatePage implements OnInit {

  createBarForm: FormGroup;
  title: AbstractControl;
  question: AbstractControl;
  category: AbstractControl;

  constructor(public nav: NavController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public authService: AuthProvider,
    public dataService: DataService) { }

  ngOnInit() {
    console.log('in bar create..');
    this.createBarForm = this.fb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'question': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'category': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.title = this.createBarForm.controls['title'];
    this.question = this.createBarForm.controls['question'];
    this.category = this.createBarForm.controls['category'];
  }

  cancelNewBar() {
    this.viewCtrl.dismiss();
  }

  onSubmit(bar: any): void {
    var self = this;
    if (this.createBarForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting bar...',
        dismissOnPageChange: true
      });

      loader.present();

      let uid = self.authService.getLoggedInUser().uid;
      self.dataService.getUsername(uid).then(function (snapshot) {
        let username = snapshot.val();

        self.dataService.getTotalBars().then(function (snapshot) {
          let currentNumber = snapshot.val();
          let newPriority: number = currentNumber === null ? 1 : (currentNumber + 1);

          let newBar: IBar = {
            key: null,
            title: bar.title,
            question: bar.question,
            category: bar.category,
            user: { uid: uid, username: username },
            dateCreated: new Date().toString(),
            reviews: null
          };

          self.dataService.submitBar(newBar, newPriority)
            .then(function (snapshot) {
              loader.dismiss()
                .then(() => {
                  self.viewCtrl.dismiss({
                    bar: newBar,
                    priority: newPriority
                  });
                });
            }, function (error) {
              // The Promise was rejected.
              console.error(error);
              loader.dismiss();
            });
        });
      });
    }
  }

}
