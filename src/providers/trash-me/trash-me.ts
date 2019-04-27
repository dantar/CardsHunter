import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the TrashMeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TrashMeProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TrashMeProvider Provider');
    this.http.get('../assets/tutorial.json').subscribe(
      data => {
        console.log('PLAIN', data);
      });
  }

}
