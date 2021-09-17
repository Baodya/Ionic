import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatService, Message} from '../../services/chat.service';
import {ActionSheetController, IonContent, PopoverController} from '@ionic/angular';
import {OptionsComponent} from './components/option-component/options.component';
import {finalize, tap} from 'rxjs/operators';

// import {PhotoService} from "../../services/photo.service";

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

  constructor(private chatService: ChatService,
              public actionSheetController: ActionSheetController,
              public popoverController: PopoverController,
              // private photoService: PhotoService,
  ) {
  }

  ngOnInit() {
    this.getAllMessage();
  }

  public sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
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

    await popover.onDidDismiss().then(data => {
      switch (data.role){
        case 'delete':
          this.deleteMessageAndUpdate(data);
          break;
        case 'edit':
          console.log('edit');
          this.editMode = true;
          this.newMsg = data.data.msg;
          this.editMessage(data.data);

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
            // this.fileTransfer.download();
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

  // public async addNewToGallery() {
  //   // Take a photo
  //   const capturedPhoto = await Camera.getPhoto({
  //     resultType: CameraResultType.Uri, // file-based data; provides best performance
  //     source: CameraSource.Camera, // automatically take a new photo with the camera
  //     quality: 100 // highest quality (0 to 100)
  //   });
  //
  //   // Save the picture and add it to photo collection
  //   const savedImageFile = await this.photoService.savePicture(capturedPhoto);
  //   this.photos.unshift(savedImageFile);
  // }


  private editMessage(editMessage: Message) {

  }
}
