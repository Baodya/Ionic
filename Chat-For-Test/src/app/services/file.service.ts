import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import {ChatService} from './chat.service';
import {Message} from './interface';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  private storageRef: firebase.storage.Reference;

  constructor(private chatService: ChatService,
  ) {
    this.storageRef = firebase.storage().ref();
  }


  public deleteFile(currentMessage): void{
    firebase.storage()
      .ref()
      .child(`${currentMessage.from}/${currentMessage.file}`)
      .delete().then();
  }

  public fileSelected(): void {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', event => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files[0];
      this.loadDocuments(selectedFile);
      fileInput = null;
    });
    fileInput.click();
  };

  public downloadFile(message: Message): Promise<string> {
    return firebase.storage()
      .ref(`${message.from}/${message.file}`)
      .getDownloadURL();

  }

  public downloadFileIntoDevice(urlForDownload): void {
    const a = document.createElement('a');
    a.href = urlForDownload;
    a.click();
  }

  private loadDocuments(selectedFile: File): void {
    firebase.storage()
      .ref()
      .child(`${this.chatService.currentUser.uid}/${selectedFile.name}`)
      .put(selectedFile).then(() => this.chatService.addChatMessage('', '', selectedFile.name, '', ''));
  };
}
