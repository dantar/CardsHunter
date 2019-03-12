import { HuntEvent, EventManagerProvider } from './../event-manager/event-manager';
import { SoundManagerProvider } from './../sound-manager/sound-manager';
import { SharedStateProvider } from './../shared-state/shared-state';
import { Injectable } from '@angular/core';

/*
  Generated class for the EventRunnerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventRunnerProvider {

  constructor(
    private shared: SharedStateProvider,
    private eventManager: EventManagerProvider,
    private sound: SoundManagerProvider,
    ) {
    console.log('Hello EventRunnerProvider Provider');
  }

  runEvent(huntevent: HuntEvent) {
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, huntevent));
    this.shared.state.sounds.forEach(sound => {
      this.sound.play(sound)
    });
    this.shared.state.sounds = [];
  }

}
