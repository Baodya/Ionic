import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-option-component',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  public currentMessage;
  constructor(public popoverController: PopoverController) {
    this.popoverController.getTop().then(data => {
      this.currentMessage = data.componentProps.message;
    });
  }

  ngOnInit() {

  }

  public delete(): void {
    console.log(this.currentMessage);
  }

  edit() {

  }
}
