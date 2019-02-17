import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EventManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventManagerProvider {

  rules: HuntRules[];

  constructor(
    //public http: HttpClient
    ) {
    console.log('Hello EventManagerProvider Provider');
    this.rules = [
      {
        trigger: new HtInitGame(),
        effect: new HcGainItem('shield'),
      },
      {
        trigger: new HtClickItem('sword'),
        effect: new HcGainItem('sword'),
      },
    ];
  }

  handleEvent(state: HuntState, event: HuntEvent): HuntState {
    this.rules.forEach(rule => {
      if (rule.trigger.check(state, event)) {
        rule.effect.fire(state);
      }
    });
    return state;
  }

  readMessages(state: HuntState): HuntState {
    state.messages.forEach(message => state.log.push(message));
    state.messages = [];
    return state;
  }

}

export class HuntState {
  items: HuntItem[] = [];
  messages: HuntMessage[] = [];
  log: HuntMessage[] = [];
}

export class HuntMessage {
  text: string;
  constructor(text: string) {
    this.text = text;
  }
}

export class HuntRules {
  trigger: HuntTrigger;
  effect: HuntConsequence;
}

export class TypedBase {
  type: string;
}

// Hunt ITEMS

export class HuntItem extends TypedBase {
  type: string = 'item';
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
}

// Hunt TRIGGERS

export class HuntTrigger extends TypedBase {
  type: string = 'trigger';
  code: string;
  check(state: HuntState, event: HuntEvent): boolean {
    return false;
  }
}

export class HtInitGame extends HuntTrigger {
  code: string = 'start';
  check(state: HuntState, event: HuntEvent): boolean {
    return event.code === 'start';
  }
}

export class HtClickItem extends HuntTrigger {
  code: string = 'click';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
  check(state: HuntState, event: HuntEvent): boolean {
    return event.code === 'one';
  }
}

export class HtWithItem extends HuntTrigger {
  code: string = 'with';
  first: string;
  second: string;
  constructor(first: string, second: string) {
    super();
    this.first = first;
    this.second = second;
  }
  check(state: HuntState, event: HuntEvent): boolean {
    return event.code === 'two';
  }
}

// Hunt CONSEQUENCES

export class HuntConsequence extends TypedBase {
  type: string = 'consequence';
  fire(state: HuntState): HuntState {
    return state;
  }
}

export class HcGainItem extends HuntConsequence {
  code: string = 'gain';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
  fire(state: HuntState): HuntState {
    const found =  state.items.filter(item => item.name === this.item);
    if (found.length === 0) {
      state.items.push(new HuntItem(this.item));
    };
    return state;
  }
}

export class HcDropItem extends HuntConsequence {
  code: string = 'drop';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
  fire(state: HuntState): HuntState {
    state.items =  state.items.filter(item => item.name !== this.item);
    return state;
  }
}

export class HcMessage extends HuntConsequence {
  code: string = 'message';
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
  fire(state: HuntState): HuntState {
    state.messages.push(new HuntMessage(this.text));
    return state;
  }
}

// Hunt EVENTS

export class HuntEvent extends TypedBase {
  type: string = 'event';
  code: string;
}

export class HeStart extends HuntEvent {
  code: string = 'start';
}

export class HeOneItem extends HuntEvent {
  code: string = 'one';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
}

export class HeTwoItems extends HuntEvent {
  code: string = 'two';
  first: string;
  second: string;
  constructor(first: string, second: string) {
    super();
    this.first = first;
    this.second = second;
  }
}