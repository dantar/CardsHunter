import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EventManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventManagerProvider {

  game: HuntGame;
  rules: HuntRules[];

  constructor(
    private http: HttpClient,
    ) {
    console.log('Hello EventManagerProvider Provider');
    this.setGame({name: 'nogame', title: '', version: 1, rules: []});
  }

  setGame(game: HuntGame) {
    this.game = game;
    this.rules = game.rules;
  };

  public static checks: {[id: string]: (trigger: HuntTrigger, state: HuntState, event: HuntEvent) => boolean} = {};
  public static fires: {[id: string]: (consequence: HuntConsequence, state: HuntState, event: HuntEvent) => HuntState} = {};

  public static fire(effect: HuntConsequence, state: HuntState, event: HuntEvent): HuntState {
    return EventManagerProvider.fires[effect.code](effect, state, event);
  }

  handleEvent(state: HuntState, event: HuntEvent): HuntState {
    this.rules.forEach(rule => {
      if (EventManagerProvider.checks[rule.trigger.code](rule.trigger, state, event)) {
        EventManagerProvider.fire(rule.effect, state, event);
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

export class HuntGame {
  name: string;
  title: string;
  version: number;
  rules: HuntRules[];
}

export class HuntState {
  tags: string[] = [];
  items: {[item: string]: HuntItem} = {};
  messages: HuntMessage[] = [];
  sounds: string[] = [];
  log: HuntMessage[] = [];
  score: {[item: string]: number} = {};
  runstate: string;
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
}

export class HtInitGame extends HuntTrigger {
  code: string = 'start';
  static check(trigger: HtInitGame, state: HuntState, event: HuntEvent): boolean {
    return event.code === 'start';
  }
}
EventManagerProvider.checks['start'] = HtInitGame.check;

export class HtClickItem extends HuntTrigger {
  code: string = 'click';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
  static check(trigger: HtClickItem, state: HuntState, event: HuntEvent): boolean {
    return event.code === 'one' && (<HeOneItem> event).item === trigger.item;
  }
}
EventManagerProvider.checks['click'] = HtClickItem.check;

export class HtWithItem extends HuntTrigger {
  code: string = 'with';
  first: string;
  second: string;
  constructor(first: string, second: string) {
    super();
    this.first = first;
    this.second = second;
  }
  static check(trigger: HtWithItem, state: HuntState, event: HeTwoItems): boolean {
    if (event.code !== 'two') {
      return false;
    }
    return (event.first === trigger.first && event.second === trigger.second) || (event.second === trigger.first && event.first === trigger.second);
  }
}
EventManagerProvider.checks['with'] = HtWithItem.check;

export class HtNoMessages extends HuntTrigger {
  code: string = 'nomsg';
  static check(trigger: HtNoMessages, state: HuntState, event: HuntEvent): boolean {
    return (state.messages.length === 0);
  }
}
EventManagerProvider.checks['nomsg'] = HtNoMessages.check;

//
// Hunt CONSEQUENCES
//

export class HuntConsequence extends TypedBase {
  type: string = 'consequence';
  code: string;
}


export class HcEndGame extends HuntConsequence {
  code: string = 'end';
  static fire(consequence: HuntConsequence, state: HuntState, event: HuntEvent): HuntState {
    state.runstate = 'end';
    return state;
  }
}
EventManagerProvider.fires['end'] = HcEndGame.fire;

export class HcSound extends HuntConsequence {
  code: string = 'sound';
  sound: string;
  constructor(sound: string) {
    super();
    this.sound = sound;
  }
  static fire(consequence: HcSound, state: HuntState, event: HuntEvent): HuntState {
    state.sounds.push(consequence.sound);
    return state;
  }
}
EventManagerProvider.fires['sound'] = HcSound.fire;

export class HcGainItem extends HuntConsequence {
  code: string = 'gain';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
  static fire(consequence: HcGainItem, state: HuntState, event: HuntEvent): HuntState {
    if (state.tags.indexOf(consequence.item) < 0) {
      state.tags.push(consequence.item);
    };
    return state;
  }
}
EventManagerProvider.fires['gain'] = HcGainItem.fire;

export class HcGainCountable extends HuntConsequence {
  code: string = 'score';
  item: string;
  value: number;
  constructor(item: string, value: number) {
    super();
    this.item = item;
    this.value = value;
  }
  static fire(consequence: HcGainCountable, state: HuntState, event: HuntEvent): HuntState {
    if (state.tags.indexOf(consequence.item) < 0) {
      state.tags.push(consequence.item);
    };
    if (state.score[consequence.item]) {
      state.score[consequence.item] = state.score[consequence.item] + consequence.value;
    } else {
      state.score[consequence.item] = consequence.value;
    };
    return state;
  }
}
EventManagerProvider.fires['score'] = HcGainCountable.fire;

export class HcDropItem extends HuntConsequence {
  code: string = 'drop';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
  static fire(consequence: HcDropItem, state: HuntState, event: HuntEvent): HuntState {
    state.tags.splice(state.tags.indexOf(consequence.item));
    return state;
  }
}
EventManagerProvider.fires['drop'] = HcDropItem.fire;

export class HcMessage extends HuntConsequence {
  code: string = 'message';
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
  static fire(consequence: HcMessage, state: HuntState, event: HuntEvent): HuntState {
    var msg = consequence.text;
    for (let item in state.score) {
      msg = msg.replace('#' + item, '' + state.score[item]);
    };
    state.messages.push(new HuntMessage(msg));
    return state;
  }
}
EventManagerProvider.fires['message'] = HcMessage.fire;

export class HcOnce extends HuntConsequence {
  code: string = 'once';
  item: string;
  first: HuntConsequence;
  others: HuntConsequence;
  constructor(item: string, first: HuntConsequence, others: HuntConsequence) {
    super();
    this.item = item;
    this.first = first;
    this.others = others;
  }
  static fire(consequence: HcOnce, state: HuntState, event: HuntEvent): HuntState {
    if (state.tags.indexOf(consequence.item) < 0) {
      state.tags.push(consequence.item);
      return EventManagerProvider.fire(consequence.first, state, event);
    } else {
      return EventManagerProvider.fire(consequence.others, state, event);
    }
  }
}
EventManagerProvider.fires['once'] = HcOnce.fire;

export class HcMany extends HuntConsequence {
  code: string = 'many';
  list: HuntConsequence[];
  constructor(list: HuntConsequence[]) {
    super();
    this.list = list;
  }
  static fire(consequence: HcMany, state: HuntState, event: HuntEvent): HuntState {
    let current: HuntState = state;
    consequence.list.forEach(hc => {
      current = EventManagerProvider.fire(hc, current, event);
    });
    return current;
  }
}
EventManagerProvider.fires['many'] = HcMany.fire;

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
