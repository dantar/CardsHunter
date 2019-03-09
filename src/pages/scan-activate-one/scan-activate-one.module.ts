import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanActivateOnePage } from './scan-activate-one';

@NgModule({
  declarations: [
    ScanActivateOnePage,
  ],
  imports: [
    IonicPageModule.forChild(ScanActivateOnePage),
  ],
})
export class ScanActivateOnePageModule {}
