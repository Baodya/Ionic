import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatService, Message} from '../../services/chat.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {IonContent} from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  public messages: Observable<Message[]>;
  newMsg = '';

  public dark = false;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }

  public sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom().then();
    });
  }

  public signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', {replaceUrl: true}).then();
    });
  }
}
