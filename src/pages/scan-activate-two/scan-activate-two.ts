import { HeTwoItems } from './../../providers/event-manager/event-manager';
import { EventRunnerProvider } from './../../providers/event-runner/event-runner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the ScanActivateTwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-activate-two',
  templateUrl: 'scan-activate-two.html',
})
export class ScanActivateTwoPage {

  one: string;
  two: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private scanner: BarcodeScanner,
    public platform: Platform,
    private runner: EventRunnerProvider) {
    if (platform.is('cordova')) {
      this.scanTwo();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanActivateTwoPage');
  }

  scanTwo() {
    this.scanner.scan().then(
      (barcode) => {
        this.one = barcode.text;
        if (this.one != null && this.one.length > 0) {
          this.scanner.scan().then(
            (barcode) => {
              this.two = barcode.text;
              if (this.two != null && this.two.length > 0) {
                this.doTwo();
              } else {
                this.navCtrl.pop();
              }
            }
          )
        } else {
          this.navCtrl.pop();
        }
      }
    );
  }

  doTwo() {
    if (this.one != null && this.two != null && this.one.length > 0 && this.two.length > 0) {
      this.runner.runEvent(new HeTwoItems(this.one, this.two));
    }
    this.navCtrl.pop();
  }

}
