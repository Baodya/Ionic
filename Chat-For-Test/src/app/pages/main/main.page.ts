import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatService, Message} from '../../services/chat.service';
import {ActionSheetController, IonContent, PopoverController} from '@ionic/angular';
import {OptionsComponent} from './components/option-component/options.component';
import {PhotoService} from '../../services/photo.service';
import {ViewPhotoComponent} from './components/view-photo/view-photo.component';
import {FileService} from '../../services/file.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public messages: Message[];
  public newMsg = '';
  public editMode = false;
  private updateMessage: Message;
  private photo = '';

  constructor(private chatService: ChatService,
              public actionSheetController: ActionSheetController,
              public popoverController: PopoverController,
              private photoService: PhotoService,
              private fileService: FileService,
  ) {
  }

  ngOnInit() {
    this.getAllMessage();
  }

  public sendMessage() {
    this.chatService.addChatMessage(this.newMsg, this.photo).then(() => {
      this.newMsg = '';
    });
  }

  async presentOption(ev: any, message: Message) {
    const popover = await this.popoverController.create({
      component: OptionsComponent,
      componentProps: {message},
      event: ev,
      translucent: true,
    });
    await popover.present();

    await popover.onDidDismiss().then(data => {
      switch (data.role){
        case 'delete':
          this.deleteMessageAndUpdate(data);
          break;
        case 'edit':
          this.editMode = true;
          this.newMsg = data.data.msg;
          this.updateMessage = data.data;
          break;
        default:
          console.log('default');
      }
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Option Message',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.addPhotoToGallery();
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
            // this.fileTransfer.download();
            console.log('Send File clicked');
            this.fileService.fileChooser();
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
        }
      ]
    });
    await actionSheet.present();

    const {role} = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  public editMessage(): void {
    this.updateMessage.msg = this.newMsg;
    this.chatService.updateMessage(this.updateMessage).finally(() => {
      this.newMsg = '';
      this.editMode = false;
    });
  }

  public exitEditMode(): void {
    this.newMsg = '';
    this.editMode = false;
  }

  public async openPhoto(ev: any,  photo: string): Promise<void> {
    ev.stopImmediatePropagation();

    const popover = await this.popoverController.create({
      component: ViewPhotoComponent,
      componentProps: {photo},
      cssClass: 'my-custom-class',
      translucent: true,
    });
    await popover.present();

    await popover.onDidDismiss();
  }

  private getAllMessage(): void {
    //FIxMe: fix this GAVNO code
    // Sorry Oleg)
    this.chatService.getChatMessages()
      .subscribe(msg => {
        if (!this.messages) {
          this.messages = msg;
        } else {
          msg.forEach(upadatedItem => {
            if (upadatedItem.createdAt !== null) {
              const messageFound = this.messages.filter(oldItem => upadatedItem.id === oldItem.id);
              if (!messageFound.length) {
                this.messages.push(upadatedItem);
              }
            }
          });
        }
        setTimeout(() => {
          this.content.scrollToBottom(500);
        }, 200);
      });
  }

  private deleteMessageAndUpdate(deleteMessage): void {
    this.chatService.getChatMessages()
      .subscribe(() => {
        const index = this.messages.indexOf(deleteMessage.data);
        if (index > -1) {
          this.messages.splice(index, 1);
        }
      });
  }

  private addPhotoToGallery() {
    this.photoService.addNewToGallery().then(data => {
      this.photo = data.data;
      this.sendMessage();
    });
  }
}
