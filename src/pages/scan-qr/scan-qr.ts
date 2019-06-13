import { Component, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the ScanQrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-qr',
  templateUrl: 'scan-qr.html',
})
export class ScanQrPage {

  emitdone: EventEmitter<string>;
  text: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public scanner: BarcodeScanner,
    ) {
    this.emitdone = this.navParams.get('done');
    if (platform.is('cordova')) {
      this.scanner.scan().then(
        (barcode) => {
          this.text = barcode.text;
          this.doneAndClose();
        }
      );
    }
  }

  doneAndClose() {
    this.emitdone.emit(this.text);
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanQrPage');
  }

}
