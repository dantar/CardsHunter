import { NativeAudio } from '@ionic-native/native-audio';
import { Injectable } from '@angular/core';

/*
  Generated class for the SoundManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SoundManagerProvider {

  musicVolume = 100;

  constructor(private nativeAudio: NativeAudio) {
    console.log('Hello SoundManagerProvider Provider');
  }

  init() {
    this.nativeAudio.preloadComplex('music', 'assets/mp3/quirky.mp3', 1, 1, 0).then(
      (event) => {
        console.log('music preload ok', event);
        this.onSuccessDefault(event);
        this.nativeAudio.loop('music').then(
          (event) => {
            console.log('music loop ok', event);
            this.onSuccessDefault(event);
            this.loopMusic();
          },
          (event) => {
            console.log('music loop error', event);
          }
        );
      }, (event) => {
        console.log('music preload error', event);
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

  onSuccessDefault(event) {
    console.log('success', event)
  }

  onErrorDefault(event) {
    console.log('error', event)
  }

  loopMusic() {
    this.nativeAudio.loop('music').then(
      (event) => {
        console.log('music loop ok', event);
      },
      (event) => {
        console.log('music loop error', event);
      }
    );
  }

  updateMusicVolume() {
    this.nativeAudio.setVolumeForComplexAsset('music', this.musicVolume / 100).then(this.onSuccessDefault, this.onErrorDefault);
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
