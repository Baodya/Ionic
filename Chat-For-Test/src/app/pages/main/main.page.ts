import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatService, Message} from '../../services/chat.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ActionSheetController, IonContent} from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public messages: Observable<Message[]>;
  newMsg = '';

  constructor(private chatService: ChatService, public actionSheetController: ActionSheetController) {
  }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  public sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom().then();
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Option Message',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log('Camera clicked');
        }
      }, {
        text: 'Voice Message',
        icon: 'mic',
        handler: () => {
          console.log('Voice clicked');
        }
      },{
        text: 'Location',
        icon: 'navigate-circle',
        handler: () => {
          console.log('Voice clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
