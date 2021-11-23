import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory } from '@capacitor/filesystem';
import { Subject } from 'rxjs';
import { Photos } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photoForAvatar = new Subject();

  constructor() {}

  public async addNewToGallery(): Promise<Photos> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      width: 300,
      allowEditing: true,
    });

    return await this.savePicture(capturedPhoto);
  }

  private async savePicture(cameraPhoto: CameraPhoto): Promise<Photos> {
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    return {
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    };
  }

  private async readAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public fileSelectedForAvatar(): void {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', event => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files[0];
      if (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg'){
        this.fileToBase64(selectedFile);
      }else {
        return;
      }
      fileInput = null;
    });
    fileInput.click();
  };

  private  fileToBase64(file): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result;
      this.photoForAvatar.next(base64data);
    };
  }

}
