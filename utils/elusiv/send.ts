import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Elusiv, TokenType } from "elusiv-sdk";
import { getParams } from "../../components/Elusiv/boilerplate";

async function main(req: any, res: any) {
    // Get the recipient from the request
    const recipient = req.body.recipient;
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair } = await getParams();
    const receiverPublicKey = recipient ? new PublicKey(recipient) : keyPair.publicKey;
    // Fetch our current private balance
    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')

    console.log('Current private balance: ', privateBalance)

    // Can't send without a private balance
    if(privateBalance > BigInt(0)){
        // Send half a Sol
        const res = await send(elusiv, keyPair, 0.5 * LAMPORTS_PER_SOL, 'LAMPORTS', receiverPublicKey);
        

        // Wait for the send to be confirmed (have your UI do something else here, this takes a little)
        
        console.log('Send complete!');
    }
    else{
        throw new Error('Can\'t send from an empty private balance');
    }

}

async function send(elusiv: Elusiv, keyPair: Keypair, amount: number, tokenType : TokenType, receiverPublicKey: PublicKey) {

    // Top up our private balance with 1 SOL
    // const topupTxData = await elusiv.buildTopUpTx(LAMPORTS_PER_SOL, 'LAMPORTS');

    // // Since this the topup, the funds still come from our original wallet. This is just
    // // a regular Solana transaction in this case.
    // topupTxData.tx = signTx(topupTxData.tx);

    // const storeRes = await elusiv.sendElusivTx(topupTxData);

    // Send half a SOL, privately 😎
    const sendTx = await elusiv.buildSendTx(0.5 * LAMPORTS_PER_SOL, receiverPublicKey, 'LAMPORTS');

    const sendRes = await elusiv.sendElusivTx(sendTx);
    console.log(`Send initiated with sig ${sendRes}`);
    console.log('Ta-da!');
}   

// Run main when invoking this file
main(
    {},
    {},
).then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
