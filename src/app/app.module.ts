import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, WelcomeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule,
    FlashMessagesModule.forRoot(),
    BrowserAnimationsModule],
  providers: [FlashMessagesService],
  bootstrap: [AppComponent]
})
export class AppModule {}
