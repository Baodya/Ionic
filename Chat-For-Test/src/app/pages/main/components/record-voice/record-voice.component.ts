import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {CurrentRecordingStatus, RecordingData, VoiceRecorder} from 'capacitor-voice-recorder';

export enum StatusRecord {
  ready = 'Ready',
  none = 'Saved',
  paused = 'Paused',
  recording = 'Recording',
}

@Component({
  selector: 'app-record-voice-component',
  templateUrl: './record-voice.component.html',
  styleUrls: ['./record-voice.component.scss'],
})
export class RecordVoiceComponent implements OnInit {
  public recordingStatus: StatusRecord;
  public record = false;
  public canSave = true;
  constructor(public popoverController: PopoverController,
  ) {}

  ngOnInit() {
    this.recordingStatus = StatusRecord.ready;
  }

  public recordVoice() {
      VoiceRecorder.startRecording()
        .then(() => {
          this.recordingStatus = StatusRecord.recording;
          this.record = true;
          this.canSave = true;
        })
        .catch(() => {
          this.resumeRecord();
        });
  }

  public pauseRecord() {
    VoiceRecorder.pauseRecording()
      .then(() => {
        this.getStatusRecording();
        this.record = false;
        this.canSave = false;
      });
  }

  public saveRecord() {
    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => {
        this.getStatusRecording();
        this.record = false;
        this.canSave = true;
        this.closeModal(result.value, 'saveRecord');
      });
  }

  public closeModal(data, role?: string) {
    this.popoverController.dismiss(data, role).then();
  }

  private resumeRecord() {
    VoiceRecorder.resumeRecording()
      .then(() => {
        this.getStatusRecording();
        this.record = true;
        this.canSave = true;
      });
  }

  private getStatusRecording() {
    VoiceRecorder.getCurrentStatus()
      .then((result: CurrentRecordingStatus) => {
        switch (result.status) {
          case 'NONE':
            this.recordingStatus = StatusRecord.none;
            break;
          case 'PAUSED':
            this.recordingStatus = StatusRecord.paused;
            break;
          case 'RECORDING':
            this.recordingStatus = StatusRecord.recording;
            break;
        }
      });
  }
}
