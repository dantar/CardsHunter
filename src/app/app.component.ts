import { AvailableGamesProvider } from './../providers/available-games/available-games';
import { SoundManagerProvider } from './../providers/sound-manager/sound-manager';
import { SharedStateProvider } from './../providers/shared-state/shared-state';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, shared: SharedStateProvider,
    private sound: SoundManagerProvider, private games: AvailableGamesProvider, orientation: ScreenOrientation) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Main app is built');
      statusBar.styleDefault();
      splashScreen.hide();
      sound.init();
      if (platform.is('cordova')) {
        orientation.lock(orientation.ORIENTATIONS.PORTRAIT);
      }
      shared.init();
      games.init();
    });
  }
}
