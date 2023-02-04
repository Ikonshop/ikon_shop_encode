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

    return (
       <div>

       </div>
    )
}

export default RecentTxns;