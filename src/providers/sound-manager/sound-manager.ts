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
            this.loopMusic();
          },
          (event) => {
            console.log('pizzicato loop error', event);
          }
        );
      }, (event) => {
        console.log('pizzicato preload error', event);
      }
    );
    this.nativeAudio.preloadSimple('applause', 'assets/mp3/applause.mp3').then(
      (event) => {
        console.log('applause preload ok', event);
      }, (event) => {
        console.log('applause preload error', event);
      }
    );
  }

  loopMusic() {
    this.nativeAudio.loop('pizzicato').then(
      (event) => {
        console.log('pizzicato loop ok', event);
      },
      (event) => {
        console.log('pizzicato loop error', event);
      }
    );
  }

  play(sound: string) {
    this.nativeAudio.play(sound).then(
      (event) => {
        console.log(sound + ' play ok', event);
      },
      (event) => {
        console.log(sound + ' play error', event);
      }
    );
  }

}
