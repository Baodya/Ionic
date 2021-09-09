import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {ChatService} from '../../../../services/chat.service';

@Component({
  selector: 'app-option-component',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  public currentMessage;
  private componentProps;
  constructor(public popoverController: PopoverController, private chatService: ChatService) {
    this.popoverController.getTop().then(data => {
      this.currentMessage = data.componentProps.message;
      this.componentProps = data;
    });
  }

  ngOnInit() {

  }

  public delete(): void {
      this.popoverController.dismiss(this.chatService.deleteMessage(this.currentMessage)).then(() => {
        this.chatService.getChatMessages();
      });

      //toDo: продовжи з поверненя нового списку після видалення повідомлення))
    // і знай ти красавчик
  }

  edit() {

  }
}
