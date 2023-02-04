import React, {useState, useEffect, useMemo} from "react";
import { generatePrivateKey } from "../../utils/generateKeypair";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
import { Elusiv, TokenType } from "elusiv-sdk";
import styles from "../Elusiv/styles/ElusivLink.module.css";



const ElusivSetup = () => {
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
    
    async function topup() {
      //generate a keypair from the connected wallet
      // Get the public key
      console.log('topup starting', publicKey.toString(), userPW, connection);
      const seed = await Elusiv.hashPw('password');
    
      // Create the elusiv instance
      const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
      console.log('topup starting');
      var amount = topUpAmount * LAMPORTS_PER_SOL;
      var tokenType = 'LAMPORTS';
      console.log('topup amount', amount);
      const topupTxData = await elusiv.buildTopUpTx(amount, tokenType);
      console.log('topupTxData', topupTxData);
      // Sign it (only needed for topups, as we're topping up from our public key there)
      //instead of using keyPair, have the user sign the transaction
      topupTxData.tx = await signTransaction(topupTxData.tx);
      // Send it off
      elusiv.sendElusivTx(topupTxData)
    
      setTopUpSent(true);  
      return ;
    }

    async function checkPrivateBalance() {
        console.log('topup starting', publicKey.toString(), userPW, connection);
      // Helper function for generating the elusiv instance 
      // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
      const seed = await Elusiv.hashPw(userPW);
      const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
      console.log('checking private balance')

      console.log('querying private txns')
      const privateTxns = await elusiv.getPrivateTransactions();
      console.log('privateTxns', privateTxns)
      // Fetch our current private balance
      const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')
      console.log('Current private balance: ', privateBalance)
      //convert to sol
      const solBalance = parseFloat(privateBalance) / LAMPORTS_PER_SOL;
      setElusivBalance(solBalance);
      console.log('Current private balance in SOL: ', solBalance)
      // We have no private balance? Top up! (We can also top up if we already have a private balance of course)

      window.localStorage.setItem('elusivBalance', solBalance);
    }

    async function send() {
        const seed = await Elusiv.hashPw(userPW);
        const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
        const receiverPublicKey = recipient ? new PublicKey(recipient) : null;
        console.log('send starting with recipient', receiverPublicKey.toString());
        // await checkPrivateBalance();

        // if(elusivBalance < sendAmount) {
        //     alert('Not enough balance to send, top up your account');
        //     return;
        // }
        
        // Send half a SOL, privately 😎
        const sendTx = await elusiv.buildSendTx(sendAmount * LAMPORTS_PER_SOL, receiverPublicKey, 'LAMPORTS');
    
        const sendRes = await elusiv.sendElusivTx(sendTx);
        console.log(`Send initiated with sig ${sendRes.sig.signature}`);
        console.log('Ta-da!');
    } 

    const userDetails = useMemo(() => {
        return {
            publicKey: publicKey,
            password: userPW
        }
    }, [publicKey, userPW])

    const order = useMemo(() => {
        return {
            recipient: 'HZxkqBTnXtAYoFTg2puo9KyiNN42E8Sd2Kh1jq3vT29u'
        }
    }, [])

    const onSubmit = async(e) => {
        setLoading(true);
        e.preventDefault();
        console.log("submit");        
        const res = await send();
        console.log('res', res);
    }

    const onCheckBalance = async(e) => {
        setLoading(true);
        e.preventDefault();
        console.log("submit");
        const res = await checkPrivateBalance();
        console.log('res', res);
    }

    // const onChange = (e) => {
    //     console.log("change");
    //     setUserPW(e.target.value);
    // }

    const onRecChange = (e) => {
        console.log("change");
        setRecipient(e.target.value);
    }

    

    const onTopUpAmountChange = (e) => {
        console.log("change");
        setTopUpAmount(e.target.value);
    }

   

    const renderForm = () => {
        return (
            <div className={styles.parent_form_container}>
                 <div className={styles.background_blur}>
                    <div className={styles.create_product_container}>
                        <div className={styles.create_product_form}>
                            <div className={styles.form_container}>
                                <div className={styles.form_header}>
                                    <img
                                        src={"/tipjar_head_bg.png"}
                                    />
                                    {/* <img src="/tipjar_head_bg.png" /> */}
                                    <h1 className={styles.form_header_text}>
                                        Elusiv Wallet Balance: {elusivBalance} SOL
                                    </h1>
                                </div>
                                <form>
                                    <div className={styles.flex_row}>
                                        {/* <div className={styles.col_half}>
                                            <label className={styles.checkbox_text} htmlFor="password">Password</label>
                                            <input className={styles.input_name} type="password" onChange={onChange} name="password" id="password" />
                                        </div> */}
                                    </div>
                                    {userPW != null && userPW != '' && !topUpSent &&(
                                        <div className={styles.flex_row}>
                                            <div className={styles.col_half}>
                                                <label className={styles.checkbox_text} htmlFor="topup">Amount to Fund</label>
                                                <input className={styles.input_name} type="number" onChange={onTopUpAmountChange} name="topup" id="topup" />
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        className={styles.button}
                                        >click</button>
                                    <div className={styles.flex_row}>
                                        {/* {userPW != null && userPW != '' && !topUpSent &&(
                                        <>
                                            <div className={styles.col_half}>
                                                <button
                                                    className={styles.button}
                                                    type="submit"
                                                    onClick={onCheckBalance}
                                                >
                                                    Check Balance
                                                </button>
                                            </div>
                                            <div className={styles.col_half}>
                                                <button
                                                    className={styles.button}
                                                    // type="submit"
                                                    // onClick={() => topup()}
                                                    onClick={() => console.log('click')}
                                                >
                                                    Fund Private Wallet
                                                </button>
                                            </div>
                                        </>
                                        )} */}
                                        <button

                                                >
                                                    Fund Private Wallet
                                                </button>
                                        
                                    </div>
                                    {topUpSent && (
                                        <div className={styles.flex_row}>
                                            <div className={styles.col_half}>
                                                <p>Top up sent, checking balance in 15 seconds</p>
                                            </div>
                                        </div>
                                    )}
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if(!topUpSent) return;
        setTimeout(() => {
            setTopUpSent(false);
            checkPrivateBalance();
        }, 15000);
    }, [topUpSent])

    // useEffect(() => {
    //     if(publicKey) {
    //         checkPrivateBalance();
    //     }
    // }, [publicKey])

    return (
        <div style={{display:"flex", flexDirection: "column", alignContent:"center" }}>
            <h1 className={styles.form_header_text}>
                Elusiv Private Wallet Balance: {elusivBalance} SOL
            </h1>
            <div style={{display:"flex", flexDirection: "row", alignContent:"center", justifyContent:"center"}}>
                <button
                    className={styles.button}
                    type="submit"
                    onClick={checkPrivateBalance}
                >
                    Check Balance
                </button>
                {!topUpSent ? (
                    <input 
                        style={{
                            width: "100px",
                            height: "30px",
                            borderRadius: "5px",
                            border: "1px solid #000",
                            margin: "0 10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            //center the text
                            textAlign: "center",
                            fontSize: "16px",
                        }} 
                        type="number" 
                        placeholder="Amount"
                        onChange={onTopUpAmountChange} 
                        name="topup" 
                        id="topup" 
                    />
                ) : (
                    <p>Top up sent, checking balance in 15 seconds</p>
                )}
                <button
                    className={styles.button}
                    type="submit"
                    onClick={topup}
                >
                    Fund Private Wallet
                </button>
            </div>
        </div>
    )
}

export default ElusivSetup;