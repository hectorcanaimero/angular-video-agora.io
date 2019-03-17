import { Component } from '@angular/core';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Video Call';
  localStream: Stream;
  remoteCalls: any = [];
  constructor(
    private agora: AngularAgoraRtcService
  ) {
    this.agora.createClient();
  }

  private subcribeToStreams() {
    this.localStream.on('accessAllowed', () => {
      console.log('Paso => AccessAllowed');
    });

    this.localStream.on('accessDenied', () => {
      console.log('Paso => AccessDenied');
    });

    this.localStream.init(() => {
      console.log('getUserMediaa Succesfully');
      this.localStream.play('agora_local');
      this.agora.client.publish(this.localStream, function(err) {
        console.log(`Publish local stream error ${err}`);
      });
      this.agora.client.on('stream-published', function(evt) {
        console.log('Publish local stream successfully');
      });
    }, function(err) {
      console.log("getUserMedia failed", err);
    });

    this.agora.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agora.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });

    this.agora.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agora.client.subscribe(stream, (err) => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.agora.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    // Add
    this.agora.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

    // Add
    this.agora.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });

  }

  startCall() {
    this.agora.client.join(null, '1000', null, (uid) => {
      this.localStream = this.agora.createStream(uid, true, null, null, true, false);
      this.localStream.setVideoProfile('720p_3');
      this.subcribeToStreams();
    })
  }
}
