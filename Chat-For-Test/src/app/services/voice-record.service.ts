import {Injectable} from '@angular/core';
import {GenericResponse, VoiceRecorder} from 'capacitor-voice-recorder';
import {PopoverController} from '@ionic/angular';
import {RecordVoiceComponent} from '../pages/main/components/record-voice/record-voice.component';


@Injectable({
  providedIn: 'root'
})
export class VoiceRecordService {
  constructor(public popoverController: PopoverController,) {
  }

  public async startRecord() {
    const popover = await this.popoverController.create({
      component: RecordVoiceComponent,
      cssClass: 'my-custom-class-for-record-voice',
      translucent: true,
    });

    VoiceRecorder.requestAudioRecordingPermission().then(async (result: GenericResponse) => {
      await popover.present();
    });
    return await popover.onDidDismiss();
  }


}
