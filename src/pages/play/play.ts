import { EventManagerProvider } from '../../providers/event-manager/event-manager';
import { ScanActivateTwoPage } from '../scan-activate-two/scan-activate-two';
import { ScanActivateOnePage } from '../scan-activate-one/scan-activate-one';
import { SharedStateProvider } from '../../providers/shared-state/shared-state';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SoundManagerProvider } from '../../providers/sound-manager/sound-manager';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  constructor(
    public navCtrl: NavController,
    public shared: SharedStateProvider,
    private eventManager: EventManagerProvider,
    private sound: SoundManagerProvider,
    ) {
  }

  pageScanOne(event) {
    this.sound.play('click');
    this.navCtrl.push(ScanActivateOnePage);
  }

  pageScanTwo(event) {
    this.sound.play('click');
    this.navCtrl.push(ScanActivateTwoPage);
  }

  readOk(event) {
    this.sound.play('click');
    this.shared.updateState(this.eventManager.readMessages(this.shared.state));
  }

  messageTextParts(): string[] {
    return this.shared.state.messages[0].text.split('\n');
  }

}
