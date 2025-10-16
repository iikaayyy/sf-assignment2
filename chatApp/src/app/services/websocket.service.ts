import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private activeUsersSubject = new BehaviorSubject<string[]>([]);
  private messagesSubject = new BehaviorSubject<any[]>([]);
  private isConnected = new BehaviorSubject<Boolean>(false);
  private newPeer = new Subject<any>();

  activeUsers$ = this.activeUsersSubject.asObservable();
  messages$ = this.messagesSubject.asObservable();
  isConnected$ = this.isConnected.asObservable();

  socket: Socket;
  activeUsers = [];
  messages = [];

  constructor() {}

  connect() {
    this.socket = io('http://localhost:3000'); //initialize socket
    this.isConnected.next(true);
  }

  //LISTENERS
  setupListeners(user, room) {
    this.socket.on('connect', () => {
      console.log('connected');
      const msgObject = this.parseMessage(
        `UPDATE: ${user.username} joined the channel`,
        'status',
        user,
        room
      );

      this.socket.emit('join-room', msgObject);
      // this.activeUsers.push(user.username);
      this.addActiveUser(user.username);
    });

    //receive msg event
    this.socket.on('receive-msg', (m) => {
      // if (!this.activeUsers.includes(m.username)) {
      //   this.activeUsers.push(m.username);
      // }

      // if (m.type === 'status' && m.content.split(' ').includes('left')) {
      //   const idx = this.activeUsers.findIndex((u) => u === m.username);
      //   idx != -1 ? this.activeUsers.splice(idx, 1) : 'not found';
      // }

      // this.messages.push(m);

      this.addActiveUser(m.username);
      this.messagesSubject.next([...this.messagesSubject.getValue(), m]);
    });

    //when new peer joins for vidoe chat
    this.socket.on('new-peer', (data) => {
      console.log(`new peer`, data);
      this.newPeer.next(data);
    });
  }

  //helper method
  onNewPeerJoined() {
    return this.newPeer.asObservable();
  }

  //EMITTING FOR VIDEO
  emitPeerId(user, peerId, room) {
    const data = { user, peerId, room };
    this.socket.emit('new-peer', data);
  }

  //EMITTING FOR CHAT
  sendMessage(content, user, room) {
    const msgObject = this.parseMessage(content, 'message', user, room);

    // this.messages.push(msgObject);
    this.messagesSubject.next([...this.messagesSubject.getValue(), msgObject]);
    this.socket.emit('message', msgObject);
  }

  //SENDING IMAGE
  sendImage(img, user, room) {
    // console.log('called');
    const msgObject = this.parseMessage(img, 'image', user, room);

    this.messagesSubject.next([...this.messagesSubject.getValue(), msgObject]);
    this.socket.emit('imageMessage', msgObject);
  }

  //DISCONNECTING
  disconnect(user, room) {
    console.log('disconnected');
    const msgObject = this.parseMessage(
      `UPDATE: ${user.username} left the channel`,
      'status',
      user,
      room
    );

    this.removeActiveUser(user.username);
    this.isConnected.next(false);
    this.messagesSubject.next([]);
    this.activeUsersSubject.next([]);

    this.socket.emit('leave-room', msgObject);
    this.socket.disconnect();
  }

  //JOINING VIDEO ROOM
  joinVideoRoom(user, room) {
    const msgObject = this.parseMessage(
      `${user.username} has joined video chat room`,
      'status',
      user,
      room
    );

    // console.log(msgObject);
    this.socket.emit('join-video-room', msgObject);
  }

  //LEAVING VIDEO ROOM
  leaveVideoRoom(user, room) {
    const msgObject = this.parseMessage(
      `${user.username} has left video chat room`,
      'status',
      user,
      room
    );

    // console.log(msgObject);
    this.socket.emit('leave-video-room', msgObject);
  }

  //PRIVATE Methods
  //add active user to users array
  private addActiveUser(username: string) {
    const activeUsers = this.activeUsersSubject.getValue();
    if (!activeUsers.includes(username)) {
      activeUsers.push(username);
      this.activeUsersSubject.next(activeUsers);
    }
  }
  //remove active user from users array
  private removeActiveUser(username: string) {
    const activeUsers = this.activeUsersSubject.getValue();
    const index = activeUsers.indexOf(username);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      this.activeUsersSubject.next(activeUsers);
    }
  }

  //helper function for sending messages
  public parseMessage(content, type, user, room) {
    const time = new Date();
    let hours = `${time.getHours()}`;
    let minutes = `${time.getMinutes()}`;
    if (minutes.length < 2) minutes = `0${minutes}`;

    if (hours.length < 2) hours = `0${hours}`;

    const msgObject = {
      content,
      time: `${hours}:${minutes}`,
      from: user.id,
      username: user.username,
      room,
      avatar: user.avatar,
      type,
    };

    return msgObject;
  }
}
