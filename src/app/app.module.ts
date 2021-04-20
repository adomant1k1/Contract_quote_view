import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {ExchangeContractQuotesViewComponent} from './core/pages/exchange-contract-quotes-view/exchange-contract-quotes-view.component';


@NgModule({
    declarations: [
        AppComponent,
        ExchangeContractQuotesViewComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        ScrollingModule,
        NgbModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
