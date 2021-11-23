import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-login',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public credentialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService,
    private router: Router,
    private photoService: PhotoService,
  ) {
  }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      photo: [''],
      nickname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async signUp(): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    this.chatService
      .signUp(this.credentialForm.value)
      .then(
        () => {
          loading.dismiss();
          this.router.navigateByUrl('/main', {replaceUrl: true});
        },
        async (err) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Sign up failed',
            message: err.message,
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
  }

  get email() {
    return this.credentialForm.get('email');
  }

  get password() {
    return this.credentialForm.get('password');
  }

  get nickname() {
    return this.credentialForm.get('nickname');
  }

  get photo() {
    return this.credentialForm.get('photo');
  }

  signIn(): void {
    this.router.navigate(['/sign-in']);
  }

  addPhotoForAvatar(): void {
    this.photoService.addNewToGallery().then(data => {
      this.credentialForm.get('photo').setValue(data.data);
    });
  }

  loadPhotoFromAvatar(): void {
    this.photoService.fileSelectedForAvatar();
    this.photoService.photoForAvatar.subscribe({
      next: data => {
        this.credentialForm.get('photo').setValue(data);
      }
    });
  }
}
