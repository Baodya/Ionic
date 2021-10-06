import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {ChatService} from '../../../../services/chat.service';
import {FileService} from '../../../../services/file.service';

@Component({
  selector: 'app-option-component',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  public currentMessage;
  constructor(public popoverController: PopoverController,
              private chatService: ChatService,
              private fileService: FileService
  ) {
    this.popoverController.getTop().then(data => {
      this.currentMessage = data.componentProps.message;
    });
  }

  ngOnInit() {

  }

  public delete(): void {
    this.chatService.deleteMessage(this.currentMessage).then(() => {
      if (this.currentMessage.file) {
        this.fileService.deleteFile(this.currentMessage);
      }
    });
    this.popoverController.dismiss(this.currentMessage, 'delete').then();
  }

  edit() {
    this.popoverController.dismiss(this.currentMessage, 'edit').then();
  }
}
