import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechSynthesisComponent } from './speech-synthesis/speech-synthesis.component';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { SpeechVoiceComponent } from './speech-voice/speech-voice.component';

@NgModule({
  declarations: [SpeechSynthesisComponent, SpeechVoiceComponent, SpeechTextComponent],
  imports: [CommonModule, FormsModule],
  exports: [SpeechSynthesisComponent],
})
export class SpeechModule {}
