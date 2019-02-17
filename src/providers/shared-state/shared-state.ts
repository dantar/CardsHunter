import { HuntState } from './../event-manager/event-manager';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SharedStateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedStateProvider {

  state: HuntState;

  constructor() {
    console.log('Hello SharedStateProvider Provider');
    this.state = new HuntState();
  }

  init() {
  }

  updateState(state: HuntState) {
    this.state = state;
  }

}
