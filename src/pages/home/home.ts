import { SoundManagerProvider } from './../../providers/sound-manager/sound-manager';
import { NativeAudio } from '@ionic-native/native-audio';
import { EventManagerProvider, HeStart } from './../../providers/event-manager/event-manager';
import { SharedStateProvider } from './../../providers/shared-state/shared-state';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  scanned: string;

  constructor(
    public navCtrl: NavController,
    public scanner: BarcodeScanner,
    public platform: Platform,
    private eventManager: EventManagerProvider,
    private sound: SoundManagerProvider,
    public shared: SharedStateProvider) {
  }

  scancode(event) {
    this.scanner.scan().then(
      (barcode) => {
        this.scanned = barcode.text;
      }
    );
  }

  reset(event) {
    this.shared.resetState();
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeStart()));
    this.shared.state.sounds.forEach(sound => {
      this.sound.play(sound)
    });
    this.shared.state.sounds = [];
  }

}
