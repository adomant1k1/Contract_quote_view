import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {ContractItem, ContractListItem} from '../../../models/contract.model';
import {FakeDataProvider} from './fake-data-provider';

@Injectable({
    providedIn: 'root'
})
export class ContractService {

    constructor() {}

    loadContracts(): Observable<ContractListItem[]> {
        return of(FakeDataProvider.getContractList());
    }

    loadContractsQuotes(): Observable<ContractItem[]> {
        return of(FakeDataProvider.getContractsQuotesList());
    }

    loadContract(id: string): Observable<ContractItem> {
        return of(FakeDataProvider.getContractQuote(id));
    }
}
