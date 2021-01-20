import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public messaging;
  public curToken: string;
  constructor() {
    firebase.default.initializeApp(environment.firebaseConfig);
    this.messaging = firebase.default.messaging();
    this.getPermission();
    this.receiveMessage();
  }

  async getPermission(): Promise<any> {
    try {
      const msg = await Notification.requestPermission();
      if (msg) {
        console.log('have permission');
        const token = await this.messaging.getToken();
        this.curToken = token;
      }
    } catch (error) {
      console.log('error occur:', error);
    }
  }

  receiveMessage(): void {
    this.messaging.onMessage(
      payload => {
        console.log(payload);
      }
    );
  }


}
