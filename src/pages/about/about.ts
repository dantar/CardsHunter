import { ScanActivateOnePage } from './../scan-activate-one/scan-activate-one';
import { SoundManagerProvider } from './../../providers/sound-manager/sound-manager';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SharedStateProvider } from './../../providers/shared-state/shared-state';
import { EventManagerProvider, HeOneItem, HeTwoItems, HuntEvent } from './../../providers/event-manager/event-manager';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  nameOne: string;
  nameTwo: string;

  constructor(public navCtrl: NavController,
    private eventManager: EventManagerProvider,
    private shared: SharedStateProvider,
    private scanner: BarcodeScanner,
    private sound: SoundManagerProvider,
    public platform: Platform) {
      this.nameOne = '';
      this.nameTwo = '';
    }

  runEvent(huntevent: HuntEvent) {
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, huntevent));
    this.shared.state.sounds.forEach(sound => {
      this.sound.play(sound)
    });
    this.shared.state.sounds = [];
  }

  doOne(event) {
    this.runEvent(new HeOneItem(this.nameOne));
    this.nameOne = '';
  }

  doTwo(event) {
    this.runEvent(new HeTwoItems(this.nameOne, this.nameTwo));
    this.nameOne = '';
    this.nameTwo = '';
  }

  readOk(event) {
    this.shared.updateState(this.eventManager.readMessages(this.shared.state));
  }

  pageScanOne(event) {
    this.navCtrl.push(ScanActivateOnePage);
  }

  scanOne(event) {
    this.scanner.scan().then(
      (barcode) => {
        this.nameOne = barcode.text;
        this.doOne(event);
      }
    );
  }

  scanTwo(event) {
    this.scanner.scan().then(
      (barcode) => {
        this.nameOne = barcode.text;
        this.scanner.scan().then(
          (barcode) => {
            this.nameTwo = barcode.text;
            this.doTwo(event);
          }
        );
      }
    );
  }

}
