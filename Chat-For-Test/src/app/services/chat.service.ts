import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Message, User } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public dark = true;

  public currentUser: User = null;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    }).then();
  }

  public async signUp({email, password, nickname, photo}): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    const uid = credential.user.uid;

    return this.afs.doc(
      `users/${uid}`
    ).set({
      uid,
      email: credential.user.email,
      nickname,
      photo,
    });
  }

  public signIn({email, password}): ReturnType<firebase.auth.Auth['signInWithEmailAndPassword']> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  public signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  public addChatMessage(msg, photo, file = '', voiceMessage = '', coordinates = ''): Promise<DocumentReference<unknown>> {
    return this.afs.collection('messages').add({
      file,
      photo,
      msg,
      voiceMessage,
      coordinates,
      from: this.currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  public getChatMessages(): Observable<Message[]> {
    let users = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({idField: 'id'}) as Observable<Message[]>;
      }),
      map(messages => {
        for (const m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser.uid === m.from;
        }
        return messages;
      })
    );
  }

  public deleteMessage(currentMessage): Promise<void> {
    return this.afs.collection('messages').doc(currentMessage.id).delete();
  }

  public getUsers(): Observable<User[]> {
    return this.afs.collection('users').valueChanges({idField: 'uid'}) as Observable<User[]>;
  }

  private getUserForMsg(msgFromId, users: User[]): string {
    for (const usr of users) {
      if (usr.uid === msgFromId) {
        return usr.nickname;
      }
    }
    return 'Deleted';
  }

  public updateMessage(newMessage): Promise<void> {
    return this.afs.collection('messages').doc(newMessage.id).update(newMessage);
  }

}
