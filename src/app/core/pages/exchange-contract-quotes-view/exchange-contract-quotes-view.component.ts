import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {combineLatest, noop, Subject} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {sumBy} from 'lodash';

import {ContractItem, ContractListItem, ContractExtended, Quote} from '../../models/contract.model';
import {ContractService} from './api/contract.service';
import {FakeDataProvider} from './api/fake-data-provider';


@Component({
    selector: 'app-exchange-contract-quotes-view',
    templateUrl: './exchange-contract-quotes-view.component.html',
    styleUrls: ['./exchange-contract-quotes-view.component.css']
})
export class ExchangeContractQuotesViewComponent implements OnInit {
    contracts: Partial<ContractExtended>[] = [];
    contractsQuotes: ContractItem[] = [];

    filtersForm: FormGroup;


    constructor(private api: ContractService) {}

    loadContract$ = new Subject();
    contracts$ = this.loadContract$.pipe(
        switchMap(() => this.api.loadContracts().pipe(
            tap(
                (contracts) => {
                    if (contracts) {
                        if (contracts.length > 1) {
                            contracts.map((contract: ContractListItem) => {
                                this.handleUpdateContractList(contract);
                            });
                        } else if (contracts.length === 1) {
                            this.handleUpdateContractList(contracts[0]);
                        }
                    }
                }),
            map(() => this.contracts)
        ))
    );

    loadQuotes$ = new Subject();
    contractsQuotes$ = this.loadQuotes$.pipe(
        switchMap(() => this.api.loadContractsQuotes().pipe(
            tap((contractsQuotes) => {
                if (contractsQuotes) {
                    if (contractsQuotes.length > 1) {
                        contractsQuotes.map((contractsQuote: ContractItem) => {
                            this.handleUpdateQuoteList(contractsQuote);
                        });
                    } else if (contractsQuotes.length === 1) {
                        this.handleUpdateQuoteList(contractsQuotes[0]);
                    }
                }
            }),
            map(() => this.contractsQuotes)
        ))
    );

    loadContractQuote$ = new Subject<string>();
    contractQuote$ = this.loadContractQuote$.pipe(
        switchMap((id) => this.api.loadContract(id).pipe(
            tap((contractQuote) => {
                this.handleUpdateQuoteList(contractQuote);
            })
        ))
    );

    vm$ = combineLatest([
        this.contracts$,
        this.contractsQuotes$,
        this.contractQuote$,
    ]).pipe(
        startWith([], [], {})
    );

    get avg(): AbstractControl{
        return this.filtersForm ? this.filtersForm.get('avg') : null;
    }

    ngOnInit(): void {
        this.buildForm();
        this.emulateLoading();
    }

    buildForm(): void {
        this.filtersForm = new FormGroup({
            avg: new FormControl(false)
        });
    }

    getContractQuotes(id: string): string[] {
        const contractQuotes = this.contractsQuotes ? this.contractsQuotes.filter(x => x.contractId === id) : [];
        return contractQuotes.length > 0 ? contractQuotes.map(x => `Price: ${x.quote.price}, Volume: ${x.quote.volume}`) : [''];
    }

    handleUpdateContractList(contract: ContractListItem): void {
        if (this.isExist(contract.id)) {
            if (contract.removed) {
                this.deleteContract(contract.id);
            }
        } else {
            this.contracts.push(contract);
        }
    }

    handleUpdateQuoteList(contractQuote: ContractItem): void {
        this.contractsQuotes.push(contractQuote);
        this.updateContractProps(contractQuote);
    }

    isExist(id: string): boolean {
        return this.contracts.findIndex(x => x.id === id) !== -1;
    }

    deleteContract(id: string): void {
        const idx = this.contracts.findIndex(x => x.id === id);
        this.contracts.splice(idx, 1);
    }

    protected updateContractProps(contractQuote: ContractItem): void {
        if (this.isExist(contractQuote.contractId)) {
            const idx = this.contracts.findIndex(x => x.id === contractQuote.contractId);
            let contract = this.contracts[idx];
            contract = Object.assign({}, contract, {
                price: contractQuote.quote.price,
                avgPrice: this.getAvgPrice(contractQuote.contractId, contractQuote.quote)
            });
            this.contracts[idx] = contract;
        }
    }

    getAvgPrice(id: string, quote: Quote): number {
        const quotes = this.contractsQuotes.filter(x => x.contractId === id);
        const positions = quotes.map((x) => [x.quote.volume, x.quote.price]);

        const total = sumBy(quotes.map(x => x.quote), 'volume');
        return Math.round(this.getWVAP(total, quote.price, ...positions));
    }

    identify(index: number, item: ContractExtended): string {
        return item.id;
    }

    protected getWVAP(total: number, currPrice: number, ...positions: number[][]): number {
        return ((positions.reduce((acc, next) => acc + (next[0] * next[1]), 0) / total) / currPrice) * 100;
    }

    protected emulateLoading(): void {
        let contractInt = setInterval(() => {
            this.loadContract$.next();
        }, 300);
        let quotesInt = setInterval(() => {
            this.loadQuotes$.next();
        }, 350);
        setTimeout(() => noop(), 200);
        let contractQuoteInt = setInterval(() => {
            const randIdx = Math.floor(Math.random() * FakeDataProvider.contracts.length);
            const id = FakeDataProvider.contracts[randIdx] ? FakeDataProvider.contracts[randIdx].id : null;
            if (id) {
                this.loadContractQuote$.next(id);
            }
        }, 325);
    }
}
