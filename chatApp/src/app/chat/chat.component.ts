import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { Socket, io } from 'socket.io-client';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  currUser;
  channelName;
  groupName;
  roomName;
  msgText = '';
  selectedImage: string | ArrayBuffer | null = null;
  alreadyConnected;

  messages = [];
  activeUsers = [];
  isVideoChat;
  routerSubscription: Subscription;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    private ws: WebsocketService
  ) {}

  ngOnInit(): void {
    //get and parse initial details for sending messages
    this.route.paramMap.subscribe((params) => {
      this.channelName = params.get('channelName');
      this.groupName = params.get('name');
      this.roomName = this.groupName + this.channelName;
    });

    //get the current user
    this.user.user$.subscribe((val) => {
      this.currUser = val;
      // console.log(this.currUser.avatar);
    });

    //get connection status
    this.ws.isConnected$.subscribe((val) => {
      this.alreadyConnected = val;
    });

    if (!this.alreadyConnected) {
      this.ws.connect();
      this.ws.setupListeners(this.currUser, this.roomName);
      this.subscriptions.add(
        this.ws.activeUsers$.subscribe((u) => {
          this.activeUsers = u;
        })
      );
    }

    this.subscriptions.add(
      this.ws.messages$.subscribe((m) => {
        this.messages = m;
      })
    );

    // this.ws.connect();
    // this.ws.setupListeners(this.currUser, this.roomName);
    // this.subscriptions.add(
    //   this.ws.activeUsers$.subscribe((u) => {
    //     this.activeUsers = u;
    //   })
    // );

    // this.subscriptions.add(
    //   this.ws.messages$.subscribe((m) => {
    //     this.messages = m;
    //   })
    // );
  }

  //cleanup logic -> disconnect socket and emit leave event
  ngOnDestroy(): void {
    console.log(this.isVideoChat);
    if (!this.isVideoChat) {
      this.subscriptions.unsubscribe();
      this.ws.disconnect(this.currUser, this.roomName);
    } else console.log('navigating to video chat component');
  }

  startVideoChat() {
    this.isVideoChat = true;
    this.router.navigate([
      'groups',
      this.groupName,
      this.channelName,
      this.roomName,
      'video-chat',
    ]);
  }

  leaveChannel() {
    this.router.navigateByUrl('/groups');
  }

  //parse message object
  parseMessage(content, type) {
    const time = new Date();
    let hours = `${time.getHours()}`;
    let minutes = `${time.getMinutes()}`;
    if (minutes.length < 2) minutes = `0${minutes}`;

    if (hours.length < 2) hours = `0${hours}`;

    const msgObject = {
      content,
      time: `${hours}:${minutes}`,
      from: this.currUser.id,
      username: this.currUser.username,
      room: this.roomName,
      avatar: this.currUser.avatar,
      type,
    };

    return msgObject;
  }

  //send message when btn clicked
  sendMessage() {
    if (!this.msgText.trim()) alert('please enter some text to send!');

    this.ws.sendMessage(this.msgText, this.currUser, this.roomName);
    this.msgText = '';
  }

  checkEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.ws.sendMessage(this.msgText, this.currUser, this.roomName);
      this.msgText = '';

      event.preventDefault(); // Prevents any default behavior like form submission
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        // Store the Base64-encoded image
        this.selectedImage = reader.result;

        this.sendImage();
      };
      reader.readAsDataURL(file); // Convert to Base64
    }
  }

  sendImage() {
    if (this.selectedImage) {
      this.ws.sendImage(this.selectedImage, this.currUser, this.roomName);

      // Clear the selected image after sending
      this.selectedImage = null;
    }
  }
}
