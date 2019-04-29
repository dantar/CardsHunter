import { EventManagerProvider } from '../../providers/event-manager/event-manager';
import { ScanActivateTwoPage } from '../scan-activate-two/scan-activate-two';
import { ScanActivateOnePage } from '../scan-activate-one/scan-activate-one';
import { SharedStateProvider } from '../../providers/shared-state/shared-state';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  constructor(
    public navCtrl: NavController,
    public shared: SharedStateProvider,
    private eventManager: EventManagerProvider,
    ) {
  }

  pageScanOne(event) {
    this.navCtrl.push(ScanActivateOnePage);
  }

  pageScanTwo(event) {
    this.navCtrl.push(ScanActivateTwoPage);
  }

  readOk(event) {
    this.shared.updateState(this.eventManager.readMessages(this.shared.state));
  }

}
