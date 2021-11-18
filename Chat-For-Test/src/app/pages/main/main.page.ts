import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ActionSheetController, IonContent, PopoverController, ToastController} from '@ionic/angular';
import {OptionsComponent} from './components/option-component/options.component';
import {PhotoService} from '../../services/photo.service';
import {ViewPhotoComponent} from './components/view-photo/view-photo.component';
import {FileService} from '../../services/file.service';
import {VoiceRecordService} from '../../services/voice-record.service';
import {Howl} from 'howler';
import {LocationService} from '../../services/location.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Coordinates, Message} from '../../services/interface';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;
  public messages: Message[];
  public newMsg = '';
  public editMode = false;
  public loadingForFile = false;
  public listenMessage: string;
  public coordinates: any;

  private updateMessage: Message;
  private photo = '';
  private recordVoiceMessage: any;
  private sound;
  private destroy$ = new Subject();

  constructor(private chatService: ChatService,
              public actionSheetController: ActionSheetController,
              public popoverController: PopoverController,
              private photoService: PhotoService,
              private fileService: FileService,
              private toastController: ToastController,
              private voiceRecordService: VoiceRecordService,
              private locationService: LocationService
  ) {
  }

  ngOnInit() {
    this.getAllMessage();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public sendMessage(): void {
    this.chatService.addChatMessage(this.newMsg, this.photo, '', this.recordVoiceMessage, this.coordinates).then(() => {
      this.newMsg = '';
      this.coordinates = '';
      this.photo = '';
      this.recordVoiceMessage = '';
    });
  }

  public async presentOption(ev: any, message: Message) {
    const popover = await this.popoverController.create({
      component: OptionsComponent,
      componentProps: {message},
      event: ev,
      translucent: true,
    });
    await popover.present();

    await popover.onDidDismiss().then(data => {
      switch (data.role) {
        case 'delete':
          this.chatService.deleteMessage(data.data).then(() => {
            if (data.data.file) {
              this.fileService.deleteFile(data.data);
            }
            const index = this.messages.indexOf(data.data);
            if (index > -1) {
              this.messages.splice(index, 1);
            }
          });
          break;
        case 'edit':
          this.editMode = true;
          this.newMsg = data.data.msg;
          this.updateMessage = data.data;
          break;
      }
    });
  }

  public async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Option Message',
      buttons: [
        {
          text: 'Camera',
          icon: 'aperture',
          handler: () => {
            this.addPhotoToGallery();
          }
        },
        {
          text: 'Voice Message',
          icon: 'mic',
          handler: () => {
            this.recordNewMessage();
          }
        },
        {
          text: 'Send File',
          icon: 'document',
          handler: () => {
            this.fileService.fileSelected();
          }
        },
        {
          text: 'Location',
          icon: 'navigate-circle',
          handler: () => {
            this.shareLocation();
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        }
      ]
    });
    await actionSheet.present();

    await actionSheet.onDidDismiss();
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

  public async openPhoto(ev: any, photo: string) {
    ev.stopImmediatePropagation();

    const popover = await this.popoverController.create({
      component: ViewPhotoComponent,
      componentProps: {photo},
      cssClass: 'open-photo',
      translucent: true,
    });
    await popover.present();

    await popover.onDidDismiss();
  }

  public downloadFile(message: Message, event): void {
    event.stopImmediatePropagation();
    this.loadingForFile = true;
    this.fileService.downloadFile(message).then(url => this.fileService.downloadFileIntoDevice(url))
      .finally(() => {
        this.loadingForFile = false;
        this.showToast('Download Success').then();
      })
      .catch(() => {
        this.showToast('Ups something wrong').then();
      });
  }

  private async showToast(text: string): Promise<void> {
    const toast = await this.toastController.create({
      color: 'primary',
      duration: 2000,
      position: 'middle',
      message: text,
    });

    await toast.present();
  }

  public listenVoiceMessage(message: Message, event): void {
    event.stopImmediatePropagation();


    if (!this.sound){
      this.listenMessage = message.id;
      this.sound = new Howl({
        src: [message.voiceMessage.recordDataBase64],
        onend: () => {
          this.listenMessage = null;
        },
      });
      this.sound.play();
    }
    else if(this.sound.playing()){
      this.sound.unload();

      this.listenMessage = null;
      this.listenMessage = message.id;
      this.sound = new Howl({
        src: [message.voiceMessage.recordDataBase64],
        onend: () => {
          this.listenMessage = null;
        },
      });
      this.sound.play();
    }
    else {
      this.listenMessage = message.id;
      this.sound.play();
    }

  }

  public pauseVoiceMessage(event): void {
    event.stopImmediatePropagation();
    this.sound.pause();
    this.listenMessage = null;
  }

  private getAllMessage(): void {
    this.chatService.getChatMessages().pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        if (!this.messages) {
          this.messages = msg;
        } else {
          msg.forEach(updatedItem => {
            if (updatedItem.createdAt !== null) {
              const messageFound = this.messages.filter(oldItem => updatedItem.id === oldItem.id);
              if (!messageFound.length) {
                this.messages.push(updatedItem);
              }
            }
          });
        }
        setTimeout(() => {
          this.content.scrollToBottom(500);
        }, 200);
      });
  }

  private addPhotoToGallery(): void {
    this.photoService.addNewToGallery().then(data => {
      this.photo = data.data;
      this.sendMessage();
    });
  }

  private recordNewMessage(): void {
    this.voiceRecordService.startRecord().then(recMes => {
      if (recMes.role){
        this.recordVoiceMessage = recMes.data;
        this.sendMessage();
      }
      return;
    });
  }

  private shareLocation(): void {
    this.locationService.getCurrentlyLocation().then(res => {
      this.coordinates = {
        lat: res.data.latitude,
        lng: res.data.longitude,
      };
      this.sendMessage();
    });
  }

  private openLocation(coordinates: Coordinates, $event: any): void {
    $event.stopImmediatePropagation();
    this.locationService.showLocation(coordinates);
  }
}
