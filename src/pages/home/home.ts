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
  }

}
