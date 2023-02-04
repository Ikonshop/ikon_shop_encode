import { IncompleteCommitment } from 'elusiv-cryptojs';
import { PublicKey, Transaction, ConfirmedSignatureInfo, Connection } from '@solana/web3.js';
import { SendQuadraProof } from 'elusiv-circuits';

type TokenType = 'LAMPORTS' | 'USDC' | 'USDT';

type Fee = {
    readonly tokenType: TokenType;
    readonly txFee: number;
    readonly privacyFee: number;
    readonly solPerToken?: number;
};

type TxTypes = 'TOPUP' | 'SEND';

type WardenInfo = {
    url: string;
    pubKey: PublicKey;
};

declare abstract class SharedTxData {
    readonly txType: TxTypes;
    protected readonly fee: Fee;
    readonly tokenType: TokenType;
    readonly lastNonce: number;
    readonly commitment: IncompleteCommitment;
    readonly merkleStartIndex: number;
    readonly wardenInfo: WardenInfo;
    constructor(txType: TxTypes, fee: Fee, tokenType: TokenType, lastNonce: number, commitment: IncompleteCommitment, merkleStartIndex: number, wardenInfo: WardenInfo);
    getTotalFee(): Fee;
}

declare class SendTxData extends SharedTxData {
    readonly proof: SendQuadraProof;
    constructor(fee: Fee, tokenType: TokenType, lastNonce: number, commitment: IncompleteCommitment, merkleStartIndex: number, wardenInfo: WardenInfo, proof: SendQuadraProof);
}

declare class TopupTxData extends SharedTxData {
    tx: Transaction;
    private signed;
    readonly hashAccIndex: number;
    readonly mergeTxProof?: SendQuadraProof;
    readonly mergeFee?: Fee;
    constructor(fee: Fee, tokenType: TokenType, lastNonce: number, commitment: IncompleteCommitment, merkleStartIndex: number, wardenInfo: WardenInfo, tx: Transaction, hashAccIndex: number, mergeTxProof?: SendQuadraProof, mergeFee?: Fee);
    getTotalFee(): Fee;
    setSignedTx(tx: Transaction): void;
    isSigned(): boolean;
}

type ElusivTxData = SendTxData | TopupTxData;

type TransactionStatus = 'PENDING' | 'PROCESSED' | 'CONFIRMED';

type PrivateTxWrapperShared = {
    readonly txType: TxTypes;
    readonly amount: number;
    readonly sig: ConfirmedSignatureInfo;
    readonly tokenType: TokenType;
    transactionStatus?: TransactionStatus;
};
type SendTxWrapper = PrivateTxWrapperShared & {
    readonly recipient: PublicKey | undefined;
};
type TopUpTxWrapper = PrivateTxWrapperShared;
type PrivateTxWrapper = TopUpTxWrapper | SendTxWrapper;

declare class Elusiv {
    private connection;
    private ownerKey;
    private txManager;
    private feeManager;
    private commManager;
    private treeManager;
    private recipientManager;
    private txSender;
    private constructor();
    static hashPw(password: string): string;
    static getElusivInstance(seed: Uint8Array, owner: PublicKey, connection: Connection): Promise<Elusiv>;
    buildTopUpTx(amount: number, tokenType: TokenType, wardenInfo?: WardenInfo): Promise<TopupTxData>;
    buildWithdrawTx(amount: number, tokenType: TokenType, wardenInfo?: WardenInfo): Promise<SendTxData>;
    buildSendTx(amount: number, recipient: PublicKey, tokenType: TokenType, refKey?: PublicKey, memo?: string, wardenInfo?: WardenInfo): Promise<SendTxData>;
    sendElusivTx(txData: ElusivTxData): Promise<{
        sig: ConfirmedSignatureInfo;
        isConfirmed: Promise<boolean>;
    }>;
    getPrivateTransactions(count: number, tokenType?: TokenType): Promise<PrivateTxWrapper[]>;
    getLatestPrivateBalance(tokenType: TokenType): Promise<bigint>;
}

export { SharedTxData as BaseTxData, Elusiv, ElusivTxData, Fee, PrivateTxWrapper, PrivateTxWrapperShared, SendTxData, SendTxWrapper, TokenType, TopUpTxWrapper, TopupTxData, TransactionStatus, TxTypes, WardenInfo };
