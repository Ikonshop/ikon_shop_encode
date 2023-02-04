/**
 * Constants used throughout the samples
 */

export const DEVNET_RPC_URL = 'https://api.devnet.solana.com';

/**
 * ONLY FOR SAMPLES NEVER EVER STORE YOUR/ANYONE'S PRIVATE KEY IN PLAIN TEXT
 * TODO: Insert your private key here
 */
export const PRIV_KEY = Uint8Array.from([156, 176, 174, 87, 68, 152, 0, 106, 44, 156, 44, 30, 103, 79, 236, 84, 185, 187, 7, 237, 161, 253, 29, 32, 108, 85, 242, 222, 133, 65, 27, 60, 215, 28, 247, 41, 64, 42, 172, 43, 248, 224, 223, 0, 34, 169, 197, 9, 85, 119, 127, 224, 114, 22, 220, 59, 174, 177, 199, 42, 151, 164, 41, 37]);

/**
 * Pin/Password to be collected from the user. Also possible to use a fixed string here for better UX, but STRONGLY DISCOURAGED.
 * Reason: If this string is publicly known, any other dapp can ask the user to sign it and regenerate the Elusiv seed.
 */
export const USER_PASSWORD = 'ElusivSandstorm'