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
    private sharedState: SharedStateProvider) {
      this.sharedState.init();
      this.sharedState.updateState(this.eventManager.handleEvent(this.sharedState.state, new HeStart()));
    }

  doOne(event) {
    this.sharedState.updateState(this.eventManager.handleEvent(this.sharedState.state, new HeOneItem('sword')));
  }

  doTwo(event) {
    this.sharedState.updateState(this.eventManager.handleEvent(this.sharedState.state, new HeTwoItems('sword', 'rock')));
  }

}
