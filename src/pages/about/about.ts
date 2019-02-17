import { SharedStateProvider } from './../../providers/shared-state/shared-state';
import { EventManagerProvider, HuntEvent, HuntState, HeStart, HeOneItem, HeTwoItems } from './../../providers/event-manager/event-manager';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController,
    private eventManager: EventManagerProvider,
    private shared: SharedStateProvider) {
      this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeStart()));
    }

  doOne(event) {
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeOneItem('sword')));
  }

  doTwo(event) {
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeTwoItems('sword', 'rock')));
  }

  readOk(event) {
    this.shared.updateState(this.eventManager.readMessages(this.shared.state));
  }

}
