import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class FileTransferService {
  public fileTransfer: FileTransferObject;

  constructor(private transfer: FileTransfer) {
    this.fileTransfer = this.transfer.create();
  }

  public sendFile(): void {
    console.log(this.fileTransfer);
  }

  upload() {
    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',
      headers: {}
    };

    this.fileTransfer.upload('<file path>', '<api endpoint>', options)
      .then((data) => {
        // success
      }, (err) => {
        // error
      });
  }

  download() {
    // const url = 'https://www.example.com/file.pdf';
    // this.fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
    // this.fileTransfer.download().then((entry) => {
    //   console.log('download complete: ' + entry.toURL());
    //   console.log('download complete: ');
    // }, (error) => {
    //   throw error;
    // });
  }

}
