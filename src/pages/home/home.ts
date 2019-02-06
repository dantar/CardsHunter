import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  scanned: string;

  constructor(public navCtrl: NavController, public scanner: BarcodeScanner) {

  }

  scancode(event) {
    this.scanner.scan().then(
      (barcode) => {
        this.scanned = barcode.text;
      }
    );
  }

}
