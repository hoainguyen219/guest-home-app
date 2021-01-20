import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Chat } from '../../interfaces/chat';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';
import { MessageService } from '../../services/message.service';
declare const $;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit {
  public isShowMessage: boolean;
  public sub$: Subscription;
  public messageForm: FormGroup;
  public database;
  public uid;
  public messages = [];
  public msgId;
  public historyMessages;
  public messages1 = [];
  public curUser;
  public chatUser;
  @ViewChild('chatMessage', { read: ElementRef }) chatMessage: ElementRef;

  constructor(
    private config: ConfigService,
    private formBuilder: FormBuilder,
    private message: MessageService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.messages = [];
    // kết nối firebase database
    // this.database = firebase.database();
    this.database = firebase.default.database();
    this.auth.currentUser$.subscribe(
      () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          this.uid = user.user_id;
          this.curUser = user;
          firebase.default.database().ref(`users/${this.uid}`).set(this.curUser);
          this.getHistoryChat();
          this.isShowMessage = false;
          this.messageForm = this.formBuilder.group({
            message: ['', Validators.required]
          });

          this.sub$ = this.config.contactMessage$.subscribe(
            async (val: any) => {
              this.isShowMessage = true;
              this.msgId = val.userId;
              const chatUser = firebase.default.database().ref(`users/${this.msgId}`).get();
              this.chatUser = (await chatUser).val();
              this.getMessages();
              this.showMessageBox();
            }
          );
        }
      }
    );
  }

  async getHistoryChat() {
    const history = await firebase.default.database().ref(`chat/${this.uid}/messages/`);
    history.on('value', msg => {
      const data = msg.val() || null;
      if (data) {
        this.historyMessages = [];
        const uid = Object.keys(data);
        uid.forEach(async (id) => {
          const user = await firebase.default.database().ref(`users/${id}`).get();
          let count = 0;
          const histMess = await firebase.default.database().ref(`chat/${this.uid}/messages/${id}`).get();
          histMess.forEach(hMsg => {
            if (!hMsg.val().read) {
              count += 1;
            }
          });
          const hisData = {
            ...user.val(),
            count
          };
          if (!this.historyMessages.some(msgUser => msgUser.user_id === user.val().user_id)) {
            this.historyMessages.push(hisData);
          }
        });
      }
    });


    // Hiển thị khi mới load trang
    history.once('child_added', msg => {
      const notifyMessage = {};
      msg.forEach(message => {
        const messageId = message.key;
        const data = message.val();
        if (!data.read && !this.isShowMessage) {
          if (!data.noti) {
            firebase.default.database().ref(`users/${data.from}`).get().then(
              userData => {
                const user = userData.val();
                this.toastr.info(`${user.full_name}:${data.message}`);
                // chỗ này là cập nhật những message đã hiển thị thông báo tới người dùng.
                data.noti = true;
                notifyMessage[messageId] = data;
                firebase.default.database().ref(`chat/${this.uid}/messages/${user.user_id}`).update(notifyMessage);
              }
            );
          }
        }
      });
    });


    // Hiển thị khi có tin mới
    history.on('child_changed', msg => {
      const notifyMessage = {};
      msg.forEach(message => {
        const messageId = message.key;
        const data = message.val();
        if (!data.read && (!this.isShowMessage || this.uid !== data.from)) {
          if (!data.noti) {
            firebase.default.database().ref(`users/${data.from}`).get().then(
              userData => {
                const user = userData.val();
                this.toastr.info(`${user.full_name}:${data.message}`);
                // chỗ này là cập nhật những message đã hiển thị thông báo tới người dùng.
                data.noti = true;
                notifyMessage[messageId] = data;
                firebase.default.database().ref(`chat/${this.uid}/messages/${user.user_id}`).update(notifyMessage);
              }
            );
          }
        }
      });
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }

    const message = this.messageForm.value.message;
    const chat: Chat = {
      from: this.uid * 1,
      type: 'string',
      message,
      to: this.msgId * 1,
      date: new Date().toJSON(),
      read: false,
      noti: false
    };

    firebase.default.database().ref(`chat/${this.uid}/messages/${this.msgId}`).push(chat);
    firebase.default.database().ref(`chat/${this.msgId}/messages/${this.uid}`).push(chat);

    this.messageForm.get('message').patchValue('');
  }

  backToMessageList() {
    $('#chat-messages, #profile, #profile p').removeClass('animate');
    $('.cx, .cy').removeClass('s1 s2 s3');
    $('.floatingImg').animate({
      width: '40px',
      top,
      left: '12px'
    }, 200, function() { $('.floatingImg').remove(); });

    setTimeout(function() {
      $('#chatview').fadeOut();
      $('#friendslist').fadeIn();
    }, 50);
  }

  showMessageBox(): void {
    setTimeout(function() { $('#profile p').addClass('animate'); $('#profile').addClass('animate'); }, 100);
    setTimeout(function() {
      $('#chat-messages').addClass('animate');
      $('.cx, .cy').addClass('s1');
      setTimeout(function() { $('.cx, .cy').addClass('s2'); }, 100);
      setTimeout(function() { $('.cx, .cy').addClass('s3'); }, 200);
    }, 150);

    $('.floatingImg').animate({
      width: '68px',
      left: '40%',
      top: '5%'
    }, 200);

    const name = $(this).find('p strong').html();
    const email = $(this).find('p span').html();
    $('#profile p').html(name);
    $('#profile span').html(email);
    $('#friendslist').fadeOut();
    $('#chatview').fadeIn();
  }

  getMessages() {
    // get message từ dữ liệu đầu
    this.messages = [];
    const updateMessage = {};
    const messages1 = firebase.default.database().ref(`chat/${this.uid}/messages/${this.msgId}`);
    messages1.on('value', messages => {
      this.messages1 = [];
      messages.forEach(message => {
        const data = message.val();
        this.messages1.push(data);
        if (this.isShowMessage && !data.read) {
          data.read = true;
          updateMessage[message.key] = data;
          messages1.update(updateMessage);
        }
      });
      this.messages = [...this.messages1].sort((a, b) => a.date.localeCompare(b.date));
      setTimeout(() => {
        this.chatMessage.nativeElement.scrollTop = this.chatMessage.nativeElement.scrollHeight;
      }, 1);
    });
  }

  ngAfterViewInit(): void {
    $(document).ready(function() {

      const preloadbg = document.createElement('img');
      preloadbg.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/timeline1.png';

      $('#searchfield').focus(function() {
        if ($(this).val() == 'Search contacts...') {
          $(this).val('');
        }
      });
      $('#searchfield').focusout(function() {
        if ($(this).val() == '') {
          $(this).val('Search contacts...');
        }
      });

      $('#sendmessage input').focus(function() {
        if ($(this).val() == 'Send message...') {
          $(this).val('');
        }
      });
      $('#sendmessage input').focusout(function() {
        if ($(this).val() == '') {
          $(this).val('Send message...');

        }
      });


      $('.friend').each(function() {
        $(this).click(function() {
          const childOffset = $(this).offset();
          const parentOffset = $(this).parent().parent().offset();
          const childTop = childOffset.top - parentOffset.top;
          const clone = $(this).find('img').eq(0).clone();
          const top = childTop + 12 + 'px';
        });
      });
    });
  }

  toMessgeBox(hm): void {
    this.msgId = hm.user_id || hm;
    this.chatUser = hm;
    this.getMessages();
    this.showMessageBox();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
