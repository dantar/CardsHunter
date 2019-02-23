import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SharedStateProvider } from './../../providers/shared-state/shared-state';
import { EventManagerProvider, HeStart, HeOneItem, HeTwoItems } from './../../providers/event-manager/event-manager';
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
    public platform: Platform) {
      this.nameOne = '';
      this.nameTwo = '';
    }

  doOne(event) {
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeOneItem(this.nameOne)));
    this.nameOne = '';
  }

  doTwo(event) {
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeTwoItems(this.nameOne, this.nameTwo)));
    this.nameOne = '';
    this.nameTwo = '';
  }

  readOk(event) {
    this.shared.updateState(this.eventManager.readMessages(this.shared.state));
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
