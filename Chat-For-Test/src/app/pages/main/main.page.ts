import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatService, Message} from '../../services/chat.service';
import {Observable} from 'rxjs';
import {ActionSheetController, IonContent, PopoverController} from '@ionic/angular';
import {FileTransferService} from '../../services/file-transfer.service';
import {OptionsComponent} from './components/option-component/options.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public messages: Observable<Message[]>;
  newMsg = '';

  constructor(private chatService: ChatService,
              public actionSheetController: ActionSheetController,
              private fileTransfer: FileTransferService,
              public popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  public sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom().then();
    });
  }

  async presentOption(ev: any, message: Message) {
    const popover = await this.popoverController.create({
      component: OptionsComponent,
      componentProps: {message},
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Option Message',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera clicked');
          }
        },
        {
          text: 'Voice Message',
          icon: 'mic',
          handler: () => {
            console.log('Voice clicked');
          }
        },
        {
          text: 'Send File',
          icon: 'document',
          handler: () => {
            this.fileTransfer.download();
            console.log('Send File clicked');
          }
        },
        {
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
        }
        ]
    });
    await actionSheet.present();

    const {role} = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
