import { HuntState } from './../event-manager/event-manager';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the SharedStateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedStateProvider {

  state: HuntState;

  constructor(private storage: Storage) {
    console.log('Hello SharedStateProvider Provider');
    this.state = new HuntState();
  }

  init() {
    this.storage.get('savegame').then((state) => {
      if (state !== null) {
        this.state = state;
      }
    });
  }

  updateState(state: HuntState) {
    this.state = state;
    this.storage.set('savegame', this.state);
  }

  resetState() {
    this.updateState(new HuntState());
  }

}
