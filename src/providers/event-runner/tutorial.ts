import { HuntRules, HtInitGame, HcMany, HcMessage, HcGainItem, HtWithItem, HtClickItem, HcSound, HtNoMessages, HcGainCountable, HcOnce, HcDropItem } from './../event-manager/event-manager';
export class Tutorial {

  rules: HuntRules[];

  initTutorial() {
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
        effect: new HcOnce(
          'sword-once',
          new HcMessage('What a shiny sword! Handle with care!'),
          new HcMessage('Ouch! It really is sharp!')
        ),
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

}
