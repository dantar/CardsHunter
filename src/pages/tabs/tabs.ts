import { Component } from '@angular/core';

import { PlayPage } from '../play/play';
import { DiaryPage } from '../diary/diary';
import { OptionsPage } from '../options/options';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = OptionsPage;
  tab2Root = PlayPage;
  tab3Root = DiaryPage;

  constructor() {

  }
}
