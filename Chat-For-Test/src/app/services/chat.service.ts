import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';

export interface User{
  uid: string;
  email: string;
}

export interface Message{
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUser: User = null;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.afAuth.onAuthStateChanged( user => {
      console.log('Changed: ', user);
      this.currentUser = user;
    });
  }

  async signUp({email, password}): Promise<void>{
    const credential = await  this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    const uid = credential.user.uid;

    return this.afs.doc( `users/${uid}`).set({uid, email: credential.user.email});
  }

  private signIn({email, password}): ReturnType<firebase.auth.Auth['signInWithEmailAndPassword']>{
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  private signOut(): ReturnType<firebase.auth.Auth['signOut']> {
    return this.afAuth.signOut();
  }
}
