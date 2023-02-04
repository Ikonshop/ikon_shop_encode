import React, { useEffect, useState, useMemo } from "react";
import { Keypair, Transaction, Connection } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  addOrder,
  getBuyerOrders,
  updateProductCounts,
  checkForAssetId,
  getAssetById,
  findProduct,
  addBuyAllOrder,
} from "../../lib/api";
import Loading from "../Loading";
// import { hasPurchased } from "../../services/index";
// import styles from "../styles/Product.module.css";

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};

export default function BuyCart({
  allProductIds,
  owner,
  token,
  symbol,
  price,
  description,
  imageUrl,
  name,
  tokenids,
}) {
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order
  const [orderComplete, setOrderComplete] = useState(false);
  const [tipJar, setTipJar] = useState(false);
  const [tipTokenType, setTipTokenType] = useState();
  const [tipAmount, setTipAmount] = useState();
  const [item, setItem] = useState(null); // IPFS hash & filename of the purchased item
  const [loading, setLoading] = useState(false); // Loading state of all above
  const [infoCaptured, setInfoCaptured] = useState(true); // Whether the info has been grabbed from the user
  const [shippingCaptured, setShippingCaptured] = useState(true); // Whether the shipping info has been grabbed from the user
  const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status

  // Current Date and time
  const currentDateAndTime = new Date().toLocaleString();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentSecond = new Date().getSeconds();

  const clearCart = async () => {
    localStorage.removeItem("cart");
    window.location.reload();
  };

  // concat all of date objects into year-month-day hour:minute:second
  const currentDateTime =
    currentYear +
    "-" +
    currentMonth +
    "-" +
    currentDay +
    " " +
    currentHour +
    ":" +
    currentMinute +
    ":" +
    currentSecond;
  // convert currentDateTime into ISO format
  const currentDateTimeISO = new Date(currentDateAndTime).toISOString();

  // Fetch the transaction object from the server (done to avoid tampering)
  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const txData = await txResponse.json();
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));

    // Attempt to send the transaction to the network
    try {
      // await sendTransaction and catch any error it returns

      const txHash = await sendTransaction(tx, connection);
      // Wait for the transaction to be confirmed

      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=mainnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
      if (error.code === 4001) {
        alert("Transaction rejected by user");
      }
      if (error.code === -32603 || error.code === -32003) {
        alert(
          "Transaction failed, probably due to one of the wallets not having this token"
        );
      }
      if (error.code === -32000) {
        alert("Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const order = useMemo(
    () => ({
      id: allProductIds,
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      // if product is a tip jar set the price to tip amount and set the token type to the tip jar token type
      token: token,
      price: price.toString(),
      owner: owner,
      token: token,
      purchaseDate: currentDateTimeISO,
    }),
    [publicKey, orderID, owner, token, allProductIds, price, currentDateTimeISO]
  );
  // console.log("this is the ORDER", order);

  useEffect(() => {
    // Check if transaction was confirmed
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log("Finding tx reference", result.confirmationStatus);
          if (
            result.confirmationStatus === "confirmed" ||
            result.confirmationStatus === "finalized"
          ) {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            await addBuyAllOrder(order);
            // when result2 is returned, clear the cart
            await clearCart();
            // updateProductCounts(order.id);
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error("Unknown error", e);
        }
      }, 1000);
      return () => {
        setLoading(false);
        clearInterval(interval);
        alert("Thank you for your purchase!");
        // window.location.reload();
      };
    }
  }, [status]);

  if (!publicKey) {
    return (
      <div>
        <p>Connect to app to buy!</p>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {item ? (
        <>
          <>
            <h3 className="purchased">Purchase Complete!</h3>

            {/* <a href={item.asset.url} target="_blank">Download</a> */}
          </>
        </>
      ) : (
        <>
          <button
            disabled={loading}
            className="buy-button"
            onClick={processTransaction}
          >
            Buy Cart
          </button>
        </>
      )}
    </div>
  );
}
