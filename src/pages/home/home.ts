import { AvailableGamesProvider } from './../../providers/available-games/available-games';
import { HttpClient } from '@angular/common/http';
import { SoundManagerProvider } from './../../providers/sound-manager/sound-manager';
import { EventManagerProvider, HeStart, HuntGame, HuntRules } from './../../providers/event-manager/event-manager';
import { SharedStateProvider } from './../../providers/shared-state/shared-state';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  keysof = Object.keys;
  scanned: string;
  gameurl = 'http://sira2.hyperborea.com/hunter/assets/games/tutorial.json';
  imgurl = 'http://sira2.hyperborea.com/hunter/assets/games/dice.png';
  availablegames: {[id: string]: HuntGame} = {};

  constructor(
    public navCtrl: NavController,
    public scanner: BarcodeScanner,
    public platform: Platform,
    private eventManager: EventManagerProvider,
    private sound: SoundManagerProvider,
    public shared: SharedStateProvider,
    private http: HttpClient,
    private storage: Storage,
    private games: AvailableGamesProvider) {
  }

  scancode(event) {
    this.scanner.scan().then(
      (barcode) => {
        this.scanned = barcode.text;
      }
    );
  }

  loadimg(event) {
    this.http.get(this.imgurl, {responseType:'blob'}).subscribe((png: Blob) => {
      this.games.storeBlob('dice.png', png);
    })
  }

  loadgame(event) {
    this.http.get(this.gameurl).subscribe((rules: HuntRules[]) => {
      this.availablegames = {}; //this.storage.get('availablegames');
      this.availablegames['tutorial'] = {name: 'tutorial', title: 'Tutorial game ('+rules.length+' rules)', rules: rules};
      this.storage.set('availablegames', this.availablegames);
    })
  }

  playgame (gamename: string) {
    this.eventManager.setRules(this.availablegames[gamename].rules);
    this.shared.resetState();
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeStart()));
    this.shared.state.sounds.forEach(sound => {
      this.sound.play(sound)
    });
    this.shared.state.sounds = [];
  }
}
