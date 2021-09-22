import {Component, OnInit} from '@angular/core';
import {ChatService, User} from '../../services/chat.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public currentUser: User = null;
  constructor(public chatService: ChatService, private router: Router, private afAuth: AngularFireAuth) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  public signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', {replaceUrl: true}).then();
    });
  }

  private getUsers() {
    this.chatService.getUsers().subscribe({
      next: (user) => {
        this.currentUser = user.find(( oneUser) => oneUser.uid === this.currentUser.uid);
      }
    });

  }

}
