export interface Asset {
  token: string;
  amount: string;
}

export interface TxHistoryTransformed {
  pair: string;
  action: string;
  assets: Asset[];
}

export interface TransferTransformed {
  pairAddress: string;
  assets: {
    token: string;
    amount: string;
  };
}

export interface ProtocolTokenTransferTransformed {
  token: string;
  pool: string;
  amount: number;
}

export interface XAstroFeeTransformed {
  token: string;
  amount: number;
}

export interface XAstroMintTransformed {
  to: string;
  amount: number;
}

export interface vxAstroCreateLockTransformed {
  from: string;
  to: string;
  amount: number;
}
