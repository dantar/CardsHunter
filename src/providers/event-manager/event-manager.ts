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

  public static triggers: {[id: string]: (trigger: HuntTrigger, state: HuntState, event: HuntEvent) => boolean} = {};
  public static asks: {[id: string]: (ask: HuntAsk, state: HuntState, event: HuntEvent) => HuntState} = {};
  public static conditions: {[id: string]: (condition: HuntCondition, state: HuntState, event: HuntEvent) => boolean} = {};
  public static fires: {[id: string]: (consequence: HuntConsequence, state: HuntState, event: HuntEvent) => HuntState} = {};

  public static fire(effect: HuntConsequence, state: HuntState, event: HuntEvent): HuntState {
    return EventManagerProvider.fires[effect.code](effect, state, event);
  }

  public static checkTrigger(trigger: HuntTrigger, state: HuntState, event: HuntEvent): boolean {
    return EventManagerProvider.triggers[trigger.code](trigger, state, event);
  }

  public static checkCondition(condition: HuntCondition, state: HuntState, event: HuntEvent): boolean {
    return EventManagerProvider.conditions[condition.code](condition, state, event);
  }

  public static checkAnswer(ask: HuntAsk, state: HuntState, event: HuntEvent): HuntState {
    return EventManagerProvider.asks[ask.code](ask, state, event);
  }

  handleEvent(state: HuntState, event: HuntEvent): HuntState {
    if (state.ask) {
      EventManagerProvider.checkAnswer(state.ask, state, event);
    } else {
      this.rules.forEach(rule => {
        if (EventManagerProvider.checkTrigger(rule.trigger, state, event)) {
          EventManagerProvider.fire(rule.effect, state, event);
        }
      });
    }
    return state;
  }

  readMessages(state: HuntState): HuntState {
    state.log.push(state.messages.shift());
    return state;
  }

}

//
// Hunt artifacts
//

export class HuntGame {
  name: string;
  title: string;

  version: number;
  rules: HuntRules[];
}

export class HuntState {
  tags: string[] = [];
  items: {[item: string]: HuntItem} = {};
  ask: HuntAsk; 
  messages: HuntMessage[] = [];
  sounds: string[] = [];
  log: HuntMessage[] = [];
  score: {[item: string]: number} = {};
  runstate: string;
}

export class HuntMessage {
  text: string;
  sound: string;
  event: HuntEvent;
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

//
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
EventManagerProvider.triggers['start'] = HtInitGame.check;

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
EventManagerProvider.triggers['click'] = HtClickItem.check;

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
EventManagerProvider.triggers['with'] = HtWithItem.check;

export class HtNoMessages extends HuntTrigger {
  code: string = 'nomsg';
  static check(trigger: HtNoMessages, state: HuntState, event: HuntEvent): boolean {
    return (state.messages.length === 0);
  }
}
EventManagerProvider.triggers['nomsg'] = HtNoMessages.check;

//
// Hunt CONDITIONS
//

export class HuntCondition extends TypedBase {
  type: string = 'condition';
  code: string;
}

export class HcHaveItem extends HuntCondition {
  code: string = 'have';
  item: string;
  constructor(item: string) {
    super();
    this.item = item;
  }
  static check(condition: HcHaveItem, state: HuntState, event: HuntEvent): boolean {
    return state.tags.indexOf(condition.item) >= 0;
  }
}
EventManagerProvider.conditions['have'] = HcHaveItem.check;

export class HcScoreRange extends HuntCondition {
  code: string = 'range';
  minval: number;
  maxval: number;
  item : string;
  constructor(item: string, minval: number, maxval: number) {
    super();
    this.item = item;
    this.minval = minval;
    this.maxval = maxval;
  }
  static check(condition: HcScoreRange, state: HuntState, event: HuntEvent): boolean {
    let score = 0;
    Object.keys(state.score).forEach(key => {
      if (key === condition.item) {
        score = state.score[key];
      }
    })
    return (condition.minval === null || score >= condition.minval) && 
      (condition.maxval === null || score <= condition.maxval) 
  }
}
EventManagerProvider.conditions['range'] = HcScoreRange.check;

export class HcAndOf extends HuntCondition {
  code: string = 'and';
  conditions: HuntCondition[];
  constructor(conditions: HuntCondition[]) {
    super();
    this.conditions = conditions;
  }
  static check(condition: HcAndOf, state: HuntState, event: HuntEvent): boolean {
    let result = true;
    condition.conditions.forEach(c => {
      result = result && EventManagerProvider.checkCondition(c, state, event);
    });
    return result;
  }
}
EventManagerProvider.conditions['and'] = HcAndOf.check;

export class HcOrOf extends HuntCondition {
  code: string = 'or';
  conditions: HuntCondition[];
  constructor(conditions: HuntCondition[]) {
    super();
    this.conditions = conditions;
  }
  static check(condition: HcOrOf, state: HuntState, event: HuntEvent): boolean {
    let result = false;
    condition.conditions.forEach(c => {
      result = result || EventManagerProvider.checkCondition(c, state, event);
    });
    return result;
  }
}
EventManagerProvider.conditions['or'] = HcOrOf.check;

export class HcNotOf extends HuntCondition {
  code: string = 'not';
  condition: HuntCondition;
  constructor(condition: HuntCondition) {
    super();
    this.condition = condition;
  }
  static check(condition: HcNotOf, state: HuntState, event: HuntEvent): boolean {
    return ! EventManagerProvider.checkCondition(condition.condition, state, event);
  }
}
EventManagerProvider.conditions['not'] = HcNotOf.check;

//
// Hunt CONSEQUENCES
//

export class HuntConsequence extends TypedBase {
  type: string = 'consequence';
  code: string;
}

export class HcWhenThen extends HuntConsequence {
  code: string = 'when';
  condition: HuntCondition;
  effect: HuntConsequence;
  static fire(consequence: HcWhenThen, state: HuntState, event: HuntEvent): HuntState {
    if (EventManagerProvider.checkCondition(consequence.condition, state, event)) {
      EventManagerProvider.fire(consequence.effect, state, event);
    }
    return state;
  }
}
EventManagerProvider.fires['when'] = HcWhenThen.fire;

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

export class HuntAsk extends TypedBase {
  type = 'ask';
  code: string;
  effects: {[answer: string]: HuntConsequence};
}

export class HaCode extends HuntAsk {
  code = 'code';
  static answer(ask: HaCode, state: HuntState, event: HuntEvent): HuntState {
    if (event.code === 'answer') {
      state.ask = null;
      let answer = (event as HeAnswer).answer;
      if (!(answer in ask.effects)) {
        answer = 'else';
      } 
      let effect = ask.effects[answer];
      return EventManagerProvider.fires[effect.code](effect, state, event);
    }
  }
}
EventManagerProvider.asks['code'] = HaCode.answer;

export class HcAskCode extends HuntConsequence {
  code: string = 'askcode';
  ask: HuntAsk;
  constructor(ask: HuntAsk) {
    super();
    this.ask = ask;
  }
  static fire(consequence: HcAskCode, state: HuntState, event: HuntEvent): HuntState {
    state.ask = JSON.parse(JSON.stringify(consequence.ask));
    return state;
  }
}
EventManagerProvider.fires['askcode'] = HcAskCode.fire;

export class HcMessage extends HuntConsequence {
  code: string = 'message';
  message: HuntMessage;
  text: string; // deprecated
  constructor(text: string) {
    super();
    this.text = text;
  }
  static fire(consequence: HcMessage, state: HuntState, event: HuntEvent): HuntState {
    let msg: HuntMessage;
    if (consequence.message) {
      msg = JSON.parse(JSON.stringify(consequence.message));
    } else {
      msg = new HuntMessage(consequence.text);
    }
    for (let item in state.score) {
      msg.text = msg.text.replace('#' + item, '' + state.score[item]);
    };
    msg.event = JSON.parse(JSON.stringify(event));
    state.messages.push(msg);
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

export class HeAnswer extends HuntEvent {
  code = 'answer';
  answer: string;
  constructor(answer: string) {
    super();
    this.answer = answer;
  }
}