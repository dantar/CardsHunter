import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ScanActivateTwoPage } from './../pages/scan-activate-two/scan-activate-two';
import { ScanActivateOnePage } from './../pages/scan-activate-one/scan-activate-one';
import { NativeAudio } from '@ionic-native/native-audio';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PlayPage } from '../pages/play/play';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { EventManagerProvider } from '../providers/event-manager/event-manager';
import { SharedStateProvider } from '../providers/shared-state/shared-state';
import { IonicStorageModule } from '@ionic/storage';
import { SoundManagerProvider } from '../providers/sound-manager/sound-manager';
import { EventRunnerProvider } from '../providers/event-runner/event-runner';
import { AvailableGamesProvider } from '../providers/available-games/available-games';
import { File } from '@ionic-native/file/ngx';
import { ScanQrPage } from '../pages/scan-qr/scan-qr';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    PlayPage,
    ContactPage,
    HomePage,
    TabsPage,
    ScanActivateOnePage,
    ScanActivateTwoPage,
    ScanQrPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlayPage,
    ContactPage,
    HomePage,
    TabsPage,
    ScanActivateOnePage,
    ScanActivateTwoPage,
    ScanQrPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    EventManagerProvider,
    SharedStateProvider,
    NativeAudio,
    SoundManagerProvider,
    EventRunnerProvider,
    HttpClient,
    AvailableGamesProvider,
    File,
    ScreenOrientation,
  ]
})
export class AppModule {}
