import { SharedStateProvider } from '../../providers/shared-state/shared-state';
import { Component, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HuntMessage, HeOneItem, HeTwoItems } from '../../providers/event-manager/event-manager';
import { ScanQrPage } from '../scan-qr/scan-qr';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})
export class DiaryPage {

  filter: string;
  scanqr: EventEmitter<string>;

  constructor(public navCtrl: NavController, public shared: SharedStateProvider) {
    this.scanqr = new EventEmitter();
  }

  filterMessages(): HuntMessage[] {
    return this.shared.state.log.filter((message: HuntMessage) => {
      if (! this.filter || this.filter.length === 0)
        return true;
      switch (message.event.code) {
        case 'one':
          return (message.event as HeOneItem).item === this.filter;
        case 'two':
          return (message.event as HeTwoItems).first === this.filter || (message.event as HeTwoItems).second === this.filter;
        default:
          return false;
      }
    });
  }

  scanFilter() {
    this.navCtrl.push(ScanQrPage, {'done': this.scanqr});
    this.scanqr.subscribe((qrcode) => {
      this.filter = qrcode;
    });
  }

}
