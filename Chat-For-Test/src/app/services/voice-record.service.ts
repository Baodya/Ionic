import { Injectable } from '@angular/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { PopoverController } from '@ionic/angular';
import { RecordVoiceComponent } from '../pages/main/components/record-voice/record-voice.component';


@Injectable({
  providedIn: 'root'
})
export class VoiceRecordService {
  constructor(public popoverController: PopoverController,) {
  }

  public async startRecord(): Promise<any> {
    const popover = await this.popoverController.create({
      component: RecordVoiceComponent,
      cssClass: 'for-record-voice',
      translucent: true,
    });

    VoiceRecorder.requestAudioRecordingPermission().then(async () => {
      await popover.present();
    });
    return await popover.onDidDismiss();
  }


}
