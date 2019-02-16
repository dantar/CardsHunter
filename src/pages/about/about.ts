import { EventManagerProvider, HuntEvent, HuntState, HeStart, HeOneItem, HeTwoItems } from './../../providers/event-manager/event-manager';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  state: HuntState;

  constructor(public navCtrl: NavController, private eventManager: EventManagerProvider) {
    this.state = new HuntState();
    const event = new HeStart();
    this.state = this.eventManager.handleEvent(this.state, event);
  }

  doOne(event) {
    this.state = this.eventManager.handleEvent(this.state, new HeOneItem('sword'));
  }

  doTwo(event) {
    this.state = this.eventManager.handleEvent(this.state, new HeTwoItems('sword', 'rock'));
  }

}
