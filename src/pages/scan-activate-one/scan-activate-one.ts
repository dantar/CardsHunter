import { HeOneItem } from './../../providers/event-manager/event-manager';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { EventRunnerProvider } from '../../providers/event-runner/event-runner';

/**
 * Generated class for the ScanActivateOnePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-activate-one',
  templateUrl: 'scan-activate-one.html',
})
export class ScanActivateOnePage {

  one: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private scanner: BarcodeScanner,
    public platform: Platform,
    private runner: EventRunnerProvider) {
    if (platform.is('cordova')) {
      this.scanOne();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanActivateOnePage');
  }

  scanOne() {
    this.scanner.scan().then(
      (barcode) => {
        this.one = barcode.text;
        this.doOne();
      }
    );
  }

  doOne() {
    if (this.one != null && this.one.length > 0) {
      this.runner.runEvent(new HeOneItem(this.one));
    }
    this.navCtrl.pop();
  }

}
