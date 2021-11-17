import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../services/interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentUser: User = null;
  private destroy$ = new Subject();
  constructor(public chatService: ChatService, private router: Router, private afAuth: AngularFireAuth) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', {replaceUrl: true}).then();
    });
  }

  private getUsers() {
    this.chatService.getUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.currentUser = user.find(( oneUser) => oneUser.uid === this.currentUser.uid);
      }
    });

  }

}
