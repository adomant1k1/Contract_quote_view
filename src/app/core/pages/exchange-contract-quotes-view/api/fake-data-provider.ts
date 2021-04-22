import * as Faker from 'faker';

import {ContractItem, ContractListItem} from '../../../models/contract.model';
import {isTrue} from '../../../utils/util';

export class FakeDataProvider {
    static contracts: ContractListItem[] = [];

    constructor() {}

    static getContractList(): ContractListItem[] {
        return isTrue() ?
            ([this.generateFakeContract(), this.generateFakeContract()])
            : (isTrue() ? [this.generateFakeContract()] : [this.generateRemovedContract()]);
    }

    static getContractsQuotesList(): ContractItem[] {
        if (this.contracts.length < 10) {
            return [1, 1].map(() => this.generateFakeContractQuote());
        } else if (this.contracts.length > 10 && this.contracts.length < 50) {
            return [1, 1, 1].map(() => this.generateFakeContractQuote());
        } else if (this.contracts.length > 50) {
            return [1, 1, 1, 1].map(() => this.generateFakeContractQuote());
        }
    }

    static getContractQuote(id: string): ContractItem {
        return {
            contractId: id,
            quote: {
                price: this.getFakePrice(-5000, 10000),
                volume: this.getFakeVolume(500)
            }
        };
    }

    protected static generateRemovedContract(): ContractListItem {
        const randIdx = Faker.datatype.number({min: 0, max: FakeDataProvider.contracts.length - 1});
        const target = FakeDataProvider.contracts[randIdx];
        return Object.assign({}, target, { removed: true });
    }

    protected static generateFakeContract(): ContractListItem {
        let uniqName = Faker.company.companyName();
        let flag = true;
        while (flag) {
            const x = this.contracts.find(it => it.name === uniqName);
            if (!x) {
                flag = false;
            } else {
                uniqName = Faker.company.companyName();
            }
        }
        const fakeContract: ContractListItem = {
            id: Faker.datatype.uuid(),
            name: uniqName
        };
        this.contracts.push(fakeContract);

        return fakeContract;
    }

    protected static generateFakeContractQuote(): ContractItem {
        const id = this.contracts[Math.floor(Math.random() * this.contracts.length)].id;
        const price = this.getFakePrice(-5000, 10000);
        const volume = this.getFakeVolume(500);

        return {
            contractId: id,
            quote: {
                price,
                volume
            }
        };
    }

    protected static getFakePrice(min: number, max: number): number {
        return Faker.datatype.number({ min, max});
    }

    protected static getFakeVolume(max: number): number {
        return Faker.datatype.number(max);
    }
}
