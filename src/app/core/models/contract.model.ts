export interface ContractListItem {
  id: string;
  name?: string;
  removed?: boolean;
}

export interface ContractItem {
  contractId: string;
  quote: Quote;
}

export interface ContractExtended extends ContractListItem {
    price: number;
    avgPrice: string;
}

export interface Quote {
  price: number;
  volume: number;
}
