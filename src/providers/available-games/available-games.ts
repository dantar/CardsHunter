import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';

/*
  Generated class for the AvailableGamesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AvailableGamesProvider {

  constructor(private file: File, private platform: Platform) {
    console.log('Hello AvailableGamesProvider Provider');
  }

  init() {
    if (this.platform.is('cordova')) {
      console.log('Cordova files!', this.file);
    } else {
      console.log('Browser files.', this.file);
    }
  }

  storeBlob(filename: string, blob: Blob) {
    let ccc:any = cordova;
    console.log('DATADIR1:', ccc.file);
    console.log('DATADIR2:', ccc.file.dataDirectory);
    const replace = true;
    this.file.createFile(ccc.file.dataDirectory, filename, replace)
      .then((entry: FileEntry) => {
        console.log('storeBlob', entry);
      })
      .catch((error: any) => {
        console.log('storeBlob ERRROR: ', error);
      });
  }

}
