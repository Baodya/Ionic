import {Injectable} from '@angular/core';
import {Camera, CameraPhoto, CameraResultType, CameraSource} from '@capacitor/camera';
import {AngularFireStorage} from '@angular/fire/storage';
import {Directory} from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private storage: AngularFireStorage) {}

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      width: 300,
      allowEditing: true,
    });

    return await this.savePicture(capturedPhoto);
    // return capturedPhoto;
  }


  private async savePicture(cameraPhoto: CameraPhoto) {
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    return {
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    };
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
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

}
