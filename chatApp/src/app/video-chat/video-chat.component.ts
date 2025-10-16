import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import Peer from 'peerjs';
import { WebsocketService } from '../services/websocket.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css'],
  encapsulation: ViewEncapsulation.Emulated, // This is the default
})
export class VideoChatComponent implements OnInit, OnDestroy {
  peer: Peer;
  localStream: MediaStream;
  roomName;
  peers: any = {}; // To store connected peers
  currUser;
  groupName;
  isRoom;
  channelName;
  private newPeerSubscription: Subscription;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public ws: WebsocketService,
    public user: UserService
  ) {}

  ngOnInit(): void {
    this.user.user$.subscribe((u) => {
      this.currUser = u;
    });

    this.route.paramMap.subscribe((params) => {
      this.groupName = params.get('name');
      this.channelName = params.get('channelName');
      this.roomName = params.get('roomName');
      console.log(this.groupName);
      console.log(this.channelName);
    });

    this.ws.joinVideoRoom(this.currUser, this.roomName);

    // Initialize PeerJS
    this.peer = new Peer();

    this.newPeerSubscription = this.ws.onNewPeerJoined().subscribe((data) => {
      console.log(data.peerId);
      this.callNewPeer(data);
    });

    // Get the local video and audio stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;

        // Display the local video
        const localVideo = document.querySelector(
          '.local-video'
        ) as HTMLVideoElement;
        localVideo.srcObject = stream;
        localVideo.play();

        // Get the peer ID once the connection is established
        this.peer.on('open', (id) => {
          this.ws.emitPeerId(this.currUser, id, this.roomName);
        });

        // Handle incoming calls from other peers
        this.peer.on('call', (call) => {
          call.answer(this.localStream); // Answer with the local stream

          // When receiving the remote stream, display it
          call.on('stream', (remoteStream) => {
            console.log(remoteStream);
            this.addRemoteStream(call.peer, remoteStream); // Show remote video
          });
        });
      });
  }

  ngOnDestroy(): void {
    if (!this.isRoom) {
      this.ws.disconnect(this.currUser, this.roomName);
    }
    if (this.newPeerSubscription) {
      this.newPeerSubscription.unsubscribe();
    }
  }

  navigateBack() {
    this.isRoom = true;
    this.ws.leaveVideoRoom(this.currUser, this.roomName);
    this.router.navigate(['groups', this.groupName, this.channelName]);
  }

  // Call a new peer who just joined the room
  callNewPeer(data) {
    const call = this.peer.call(data.peerId, this.localStream); // Call the new peer with the local stream

    call.on('stream', (remoteStream) => {
      this.addRemoteStream(data, remoteStream); // Display the remote video
    });

    // Store the peer connection to manage later (e.g., when someone leaves)
    this.peers[data.peerId] = call;
  }

  // // Add remote stream to the HTML by creating a new video element
  addRemoteStream(data, remoteStream: MediaStream) {
    const videoContainer = document.querySelector('.videos');
    let remoteVideo = document.getElementById(
      `remote-video-${data.peerId}`
    ) as HTMLVideoElement;

    // Check if video element already exists
    if (!remoteVideo) {
      let videoDiv = document.createElement('div');
      videoDiv.classList.add('video-container');

      let heading = document.createElement('h4');
      videoDiv.appendChild(heading);
      if (data?.user?.username) {
        heading.textContent = data.user.username;
      } else heading.textContent = 'other users';

      remoteVideo = document.createElement('video');
      remoteVideo.classList.add('video');
      remoteVideo.id = `remote-video-${data.peerId}`;
      remoteVideo.autoplay = true;

      videoDiv.appendChild(remoteVideo);

      videoContainer.appendChild(videoDiv); // Append new video element for the remote peer
    }

    // Set the source for the remote video stream and play
    remoteVideo.srcObject = remoteStream;
    let playPromise = remoteVideo.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
  }

  // // Call this function when someone leaves the video call
  removePeerVideo(peerId: string) {
    const videoElement = document.getElementById(`remote-video-${peerId}`);
    if (videoElement) {
      videoElement.remove(); // Remove the video element when the peer leaves
    }

    // Also clean up the peer connection
    if (this.peers[peerId]) {
      this.peers[peerId].close(); // Close the connection
      delete this.peers[peerId]; // Remove from the list of active peers
    }
  }
}
