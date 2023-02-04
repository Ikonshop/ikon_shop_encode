import React, {useState, useEffect, useMemo} from "react";
import { generatePrivateKey } from "../../utils/generateKeypair";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
import { Elusiv, TokenType } from "elusiv-sdk";
import styles from "../Elusiv/styles/ElusivLink.module.css";



const RecentTxns = () => {
    const [loading, setLoading] = useState(false);
    // const [userPW, setUserPW] = useState(null);
    const userPW = 'IkonShopEncodeHackathon'
    const [sendAmount, setSendAmount] = useState(null);
    const [topUpAmount, setTopUpAmount] = useState(null);
    const [topUpSent, setTopUpSent] = useState(false);
    const [recipient, setRecipient] = useState(null);
    const [elusivBalance, setElusivBalance] = useState(null);
    const { publicKey, signTransaction } = useWallet();
    const USER_PASSWORD = 'password';
    const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
    const MAINNET_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
    const connection = new Connection(DEVNET_RPC_URL);
    
    async function getRecentTxns() {
              //generate a keypair from the connected wallet
        // Get the public key
        console.log('topup starting', publicKey.toString(), userPW, connection);
        const seed = await Elusiv.hashPw('password');
    
        // Create the elusiv instance
        const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
        // Fetch our most recent private transactions of any token type
        const mostRecentPrivTx = await elusiv.getPrivateTransactions(1);
    
        console.log("Our most recent private transaction:\n");
        console.log(mostRecentPrivTx);
    
        // Fetch our last 5 private transactions using Sol (if we only have 1 it will only return 1 of course)
        const last5PrivTxs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');
    
        console.log("Our last 5 private transactions:\n");
        console.log(last5PrivTxs);
    }

    const dummyTxns = [
        {
            "id": "1",
            "amount": "100",
            "type": "LAMPORTS",
            "recipient": "2",
            "sender": "1",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "2",
            "amount": "100",
            "type": "LAMPORTS",
            "recipient": "2",
            "sender": "1",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "3",
            "amount": "100",
            "type": "LAMPORTS",
            "recipient": "2",
            "sender": "1",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "4",
            "amount": "100",
            "type": "LAMPORTS",
            "recipient": "2",
            "sender": "1",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "5",
            "amount": "100",
            "type": "LAMPORTS",
            "recipient": "2",
            "sender": "1",
            "timestamp": "2021-08-01T00:00:00.000Z"
        }
    ]

    return (
        // return two containers, the first container shows the most recent txn, the second container shows the last 5 txns in table format
        <div className={styles.container}>
            <div className={styles.recentTxns}>
                <h2 className={styles.form_header_text}>Most Recent Transaction</h2>
                <div className={styles.txn}>
                    <div className={styles.txnInfo}>
                        <p><span>Amount:</span> {dummyTxns[0].amount}</p> 
                        <p><span>Type:</span> {dummyTxns[0].type}</p>
                        <p><span>Recipient: </span>{dummyTxns[0].recipient}</p>
                        <p><span>Sender:</span> {dummyTxns[0].sender}</p>
                        <p><span>Timestamp:</span> {new Date(dummyTxns[0].timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div className={styles.last5Txns}>
                <h2 className={styles.table_header_text}>Last 5 Transactions</h2>
                <table className={styles.sub_table}>
                    <tr>
                        <th>Amount</th> 
                        <th>Type</th>
                        <th>Recipient</th>
                        <th>Sender</th>
                        <th>Timestamp</th>
                    </tr>
                    {dummyTxns.map((txn) => (
                        <tr>
                            <td>{txn.amount}</td>
                            <td>{txn.type}</td>
                            <td>{txn.recipient}</td>
                            <td>{txn.sender}</td>
                            <td>{new Date(txn.timestamp).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default RecentTxns;