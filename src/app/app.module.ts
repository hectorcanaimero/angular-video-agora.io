import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const agoraConfig: AgoraConfig = {
  AppID: '576447d3e9174dd2b32d05145ffb7196'
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularAgoraRtcModule.forRoot(agoraConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
