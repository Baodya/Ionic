import {Injectable} from '@angular/core';
import firebase from 'firebase/app';
import {ChatService} from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private storageRef: firebase.storage.Reference;

  constructor(private chatService: ChatService) {
    this.storageRef = firebase.storage().ref();
  }


  async fileSelected() {
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

  async loadDocuments(selectedFile: File) {
    firebase.storage()
      .ref()
      .child(`${this.chatService.currentUser.uid}/${selectedFile.name}`)
      .put(selectedFile).then((snapshot) => {
      console.log(snapshot);
    });

  };

}
