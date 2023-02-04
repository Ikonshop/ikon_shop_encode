import {Keypair} from '@solana/web3.js';

export function generatePrivateKey() : void{
    const kp = Keypair.generate();
    console.log('Private key (add this to constants.ts):')
    console.log(kp.secretKey);
    console.log('Public key (airdrop some sol to this):')
    console.log(kp.publicKey.toBase58());
}