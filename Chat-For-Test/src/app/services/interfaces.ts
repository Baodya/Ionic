import firebase from 'firebase';
import { Directory } from '@capacitor/filesystem';

export interface User {
  uid: string;
  email: string;
  photo?: string;
  nickname?: string;
}

export interface VoiceMessage {
  mimeType: string;
  recordDataBase64: string;
  msDuration: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  photo: string;
  voiceMessage: VoiceMessage;
  fromName: string;
  myMsg: boolean;
  file: string;
  coordinates: Coordinates;
}

export interface Photos {
  path: string;
  data: string;
  directory: Directory;
}