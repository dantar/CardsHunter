import { SoundManagerProvider } from './../sound-manager/sound-manager';
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
    ) {
    console.log('Hello EventManagerProvider Provider');
    this.rules = [
      {
        trigger: new HtInitGame(),
        effect: new HcMany([
          new HcMessage('Ciao! Benvenuto in questo tutorial del gioco.'),
          new HcMessage('Prendi il mazzo di carte, ma non guardarle. Tienilo a portata di mano.'),
          new HcMessage('Via via che affronti il gioco ti verrà detto quali carte scoprire e quando. ' +
            'Per cercare una carta da scoprire scorri il mazzo coperto e trova la carta giusta dalle indicazioni sul dorso. ' +
            'Scopri solo le carte che ti vengono indicate.'),
          new HcMessage('Il gioco si svolge attivando le carte. '),
          new HcMessage('Ad ogni mossa del gioco potrai decidere se attivare una o due carte fra quelle che hai scoperte. '),
          new HcMessage('Per attivare una carta, clicca "Attiva 1 carta" e inquadra il suo codice.'),
          new HcMessage('Per attivare una combinazione di due carte, clicca "Attiva 2 carte" e inquadra il loro codice, una carta per volta. ' +
            'Non è importante in che ordine attivi le due carte della combinazione. '),
          new HcMessage('In bocca al lupo!'),
          new HcMessage('Scopri la carta A.'),
          new HcGainItem('ship'),
        ]),
      },
      {
        trigger: new HtClickItem('tree'),
        effect: new HcMany([
          new HcGainCountable('apple', 1),
          new HcMessage('You pick one apple from the tree! Now you have #apple apples!'),
        ]),
      },
      {
        trigger: new HtClickItem('sword'),
        effect: new HcMany([
          new HcGainItem('sword'),
          new HcMessage('You got the sword!'),
        ]),
      },
      {
        trigger: new HtWithItem('bridge', 'orcs'),
        effect: new HcMany([
          new HcDropItem('sword'),
          new HcMessage('You broke the sword!'),
        ]),
      },
      {
        trigger: new HtWithItem('bridge', 'orcs'),
        effect: new HcMany([
          new HcDropItem('sword'),
          new HcMessage('You broke the sword!'),
        ]),
      },
      {
        trigger: new HtClickItem('ship'),
        effect: new HcMany([
          new HcMessage('Esplori la nave pirata abbandonata e trovi una vecchia mappa.'),
          new HcMessage('Nella cabina del capitano trovi anche un sacchetto di cracker.'),
          new HcMessage('Scopri le carte B e C'),
          new HcGainItem('map'),
          new HcGainItem('cracker'),
        ]),
      },
      {
        trigger: new HtClickItem('map'),
        effect: new HcMany([
          new HcMessage('La mappa indica il luogo preciso dove si trova il tesoro. Vicino ad un albero, poco sotto la sabbia, trovi uno scrigno chiuso a chiave.'),
          new HcMessage('Scopri le carte D e E'),
          new HcGainItem('parrot'),
          new HcGainItem('chest'),
        ]),
      },
      {
        trigger: new HtWithItem('cracker', 'parrot'),
        effect: new HcMany([
          new HcMessage('Il pappagallo prende con il becco il cracker e lascia cadere la chiave, quindi se ne svolazza via contento.'),
          new HcMessage('Scopri le carta F'),
          new HcGainItem('key'),
        ]),
      },
      {
        trigger: new HtWithItem('key', 'chest'),
        effect: new HcMany([
          new HcMessage('Con un "clack" la chiave apre il lucchetto dello scrigno!'),
          new HcMessage('Complimenti, hai trovato il tesoro: hai completato questo tutorial!'),
          new HcSound('applause'),
          //new HcEndGame('key'),
        ]),
      },
      {
        trigger: new HtClickItem('parrot'),
        effect: new HcMessage('Il pappagallo tiene una vecchia chiave ben salda nel becco. Chissà dove l\'ha trovata.'),
      },
      {
        trigger: new HtClickItem('chest'),
        effect: new HcMessage('Il forziere è chiuso a chiave. Non hai speranza di aprirlo con le unghie o a morsi.'),
      },
      {
        trigger: new HtClickItem('cracker'),
        effect: new HcMessage('Assaggi un cracker. Buono! Ma non bisogna esagerare che poi viene sete.'),
      },
      {
        trigger: new HtClickItem('key'),
        effect: new HcMessage('Una chiave di metallo, lucida di bava di pappagallo sopra... urgh!'),
      },
      {
        trigger: new HtNoMessages(),
        effect: new HcMessage('Non accade nulla...'),
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
    return event.code === 'one' && (<HeOneItem> event).item === this.item;
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
    if (event.code !== 'two') {
      return false;
    }
    const two: HeTwoItems = <HeTwoItems> event;
    return (two.first === this.first && two.second === this.second) || (two.second === this.first && two.first === this.second);
  }
}

export class HtNoMessages extends HuntTrigger {
  code: string = 'nomsg';
  check(state: HuntState, event: HuntEvent): boolean {
    return (state.messages.length === 0);
  }
}

// Hunt CONSEQUENCES

export class HuntConsequence extends TypedBase {
  type: string = 'consequence';
  fire(state: HuntState): HuntState {
    return state;
  }
}

export class HcEndGame extends HuntConsequence {
  code: string = 'end';
  fire(state: HuntState): HuntState {
    state.runstate = 'end';
    return state;
  }
}

export class HcSound extends HuntConsequence {
  code: string = 'sound';
  sound: string;
  constructor(sound: string) {
    super();
    this.sound = sound;
  }
  fire(state: HuntState): HuntState {
    state.sounds.push(this.sound);
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
    if (state.tags.indexOf(this.item) < 0) {
      state.tags.push(this.item);
    };
    return state;
  }
}

export class HcGainCountable extends HuntConsequence {
  code: string = 'score';
  item: string;
  value: number;
  constructor(item: string, value: number) {
    super();
    this.item = item;
    this.value = value;
  }
  fire(state: HuntState): HuntState {
    if (state.tags.indexOf(this.item) < 0) {
      state.tags.push(this.item);
    };
    if (state.score[this.item]) {
      state.score[this.item] = state.score[this.item] + this.value;
    } else {
      state.score[this.item] = this.value;
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
    state.tags.splice(state.tags.indexOf(this.item));
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
    var msg = this.text;
    for (let item in state.score) {
      msg = msg.replace('#' + item, '' + state.score[item]);
    };
    state.messages.push(new HuntMessage(msg));
    return state;
  }
}

export class HcOnce extends HuntConsequence {
  code: string = 'message';
  item: string;
  first: HuntConsequence;
  others: HuntConsequence
  constructor(item: string, first: HuntConsequence, others: HuntConsequence) {
    super();
    this.item = item;
    this.first = first;
    this.others = others;
  }
  fire(state: HuntState): HuntState {
    return state;
  }
}

export class HcMany extends HuntConsequence {
  code: string = 'many';
  list: HuntConsequence[];
  constructor(list: HuntConsequence[]) {
    super();
    this.list = list;
  }
  fire(state: HuntState): HuntState {
    this.list.forEach(hc => {
      hc.fire(state);
    });
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
