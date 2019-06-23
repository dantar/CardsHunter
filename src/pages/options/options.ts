import { HttpClient } from '@angular/common/http';
import { SoundManagerProvider } from '../../providers/sound-manager/sound-manager';
import { EventManagerProvider, HeStart, HuntGame, HuntRules } from '../../providers/event-manager/event-manager';
import { SharedStateProvider } from '../../providers/shared-state/shared-state';
import { Component, EventEmitter } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { ScanQrPage } from '../scan-qr/scan-qr';

@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {

  keysof = Object.keys;
  scanned: string;
  gameurl = '';
  imgurl = 'http://sira2.hyperborea.com/hunter/assets/games/dice.png';
  availablegames: {[id: string]: HuntGame};

  scanqr: EventEmitter<string>;

  constructor(
    public navCtrl: NavController,
    public scanner: BarcodeScanner,
    public platform: Platform,
    private eventManager: EventManagerProvider,
    private sound: SoundManagerProvider,
    public shared: SharedStateProvider,
    private http: HttpClient,
    private storage: Storage) {
      this.scanqr = new EventEmitter<string>();
      this.storage.get('availablegames').then((availablegames: {[id: string]: HuntGame}) => {
        this.availablegames = availablegames;
      }).catch((exception) => {
        this.availablegames = {};
      });
  }

  scancode(event) {
    this.scanner.scan().then(
      (barcode) => {
        this.scanned = barcode.text;
      }
    );
  }

  loadgame(event) {
    this.http.get(this.gameurl).subscribe((game: HuntGame) => {
      this.availablegames[game.name] = game;
      this.storage.set('availablegames', this.availablegames);
    })
  }

  scangame(event) {
    this.navCtrl.push(ScanQrPage, {'done': this.scanqr});
    this.scanqr.subscribe((qrcode) => {
      this.gameurl = qrcode;
      this.loadgame(event);
    });
  }

  playgame (gamename: string) {
    this.eventManager.setGame(this.availablegames[gamename]);
    this.shared.resetState();
    this.shared.updateState(this.eventManager.handleEvent(this.shared.state, new HeStart()));
    this.shared.state.sounds.forEach(sound => {
      this.sound.play(sound)
    });
    this.shared.state.sounds = [];
  }
}
