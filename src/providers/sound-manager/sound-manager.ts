import { NativeAudio } from '@ionic-native/native-audio';
import { Injectable } from '@angular/core';

/*
  Generated class for the SoundManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SoundManagerProvider {

  constructor(private nativeAudio: NativeAudio) {
    console.log('Hello SoundManagerProvider Provider');
  }

  init() {
    this.nativeAudio.preloadComplex('pizzicato', 'assets/mp3/pizzicato.mp3', 1, 1, 0).then(
      (event) => {
        console.log('pizzicato preload ok', event);
        this.nativeAudio.loop('pizzicato').then(
          (event) => {
            console.log('pizzicato loop ok', event);
          },
          (event) => {
            console.log('pizzicato loop error', event);
          }
        );
      }, (event) => {
        console.log('pizzicato preload error', event);
      }
    );
  }

}
