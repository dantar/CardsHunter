import { SharedStateProvider } from '../../providers/shared-state/shared-state';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HuntMessage, HeOneItem, HeTwoItems } from '../../providers/event-manager/event-manager';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})
export class DiaryPage {

  filter: string;

  constructor(public navCtrl: NavController, public shared: SharedStateProvider) {

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

}
