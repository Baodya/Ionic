import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {ChatService} from '../../services/chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public credentialForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private async signUp(): Promise<void>{
    const loading = await this.loadingController.create();
    await loading.present();

    this.chatService.signUp(this.credentialForm.value).then(user => {
      loading.dismiss();
      this.router.navigateByUrl('/main', {replaceUrl: true});
    }, async err => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Sign Up Failed',
        message: err.message,
        buttons: ['OK']
      });
    });
  }

  private async signIn(): Promise<void>{
    const loading = await this.loadingController.create();
    await loading.present();

    this.chatService.signUp(this.credentialForm.value).then(
      (res) => {
        loading.dismiss();
        this.router.navigateByUrl('/main', {replaceUrl: true});
      },
      async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: ':(',
          message: err.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

}
