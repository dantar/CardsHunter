import { NativeAudio } from '@ionic-native/native-audio';
import { Injectable } from '@angular/core';

@Injectable()
export class SoundManagerProvider {

  musicVolume = 100;
  soundVolume = 100;
  soundEnabled = true;

  musics = ['play', 'menu'];
  sounds = ['applause', 'click'];

  constructor(private nativeAudio: NativeAudio) {
    console.log('Hello SoundManagerProvider Provider');
  }

  init() {
    let channel = 1;
    this.musics.forEach((music) => {
      this.nativeAudio.preloadComplex(music, 'assets/mp3/'+music+'.mp3', this.musicVolume / 100, channel++, 0)
        .then((event) => {
          if (music === 'play') {this.loopMusic('play')};
        }, this.onErrorDefault);
    });
    this.sounds.forEach((sound) => {
      this.nativeAudio.preloadComplex(sound, 'assets/mp3/'+sound+'.mp3', this.musicVolume / 100, channel++, 0)
        .then(this.onSuccessDefault, this.onErrorDefault);
    });
    this.loopMusic('play');
  }

  onSuccessDefault(event) {
    console.log('success', event)
  }

  onErrorDefault(event) {
    console.log('error', event)
  }

  loopMusic(music) {
    this.nativeAudio.loop(music).then(this.onSuccessDefault, this.onErrorDefault);
  }

  updateMusicVolume() {
    this.musics.forEach((music: string) => {
      this.nativeAudio.setVolumeForComplexAsset(music, this.musicVolume / 100).then(this.onSuccessDefault, this.onErrorDefault);
    });
  }

  updateSoundVolume() {
    this.sounds.forEach((sound: string) => {
      this.nativeAudio.setVolumeForComplexAsset(sound, this.soundVolume / 100).then(this.onSuccessDefault, this.onErrorDefault);
    });
  }

  play(sound: string) {
    if (this.soundEnabled) {
      this.nativeAudio.play(sound).then(this.onSuccessDefault, this.onErrorDefault);
    }
  }

}
