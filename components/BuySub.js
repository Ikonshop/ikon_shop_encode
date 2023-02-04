import React, { useEffect, useState, useMemo } from "react";
import { Keypair, Transaction, Connection } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from "../styles/Product.module.css";
import { AddSubOrder, GetSubById, fetchItem } from "../lib/api";
import Loading from "./Loading";

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};

export default function Buy({ sub }) {
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const { publicKey, sendTransaction } = useWallet();

  const { id, name, lifeCycleDays, price, owner, token } = sub;

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

  const [showEmail, setShowEmail] = useState(false); // Whether to show the email input form
  const [email, setEmail] = useState(""); // Email address of the user

  const [showShipping, setShowShipping] = useState(false); // Whether to show the shipping input form
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  }); // Shipping address of the user
  const [shippingInfo, setShippingInfo] = useState(""); // Shipping info of the user in string form

  // Current Date and time
  const currentDateAndTime = new Date().toLocaleString();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentSecond = new Date().getSeconds();

  const expirationDayCount = lifeCycleDays;

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
  // console.log("current Dat and Time", currentDateAndTime);
  const currentDateAndTimeISO = new Date(currentDateAndTime).toISOString();

  // Expiration Date and Time is equal to currentDateAndTimeISO + lifeCycleDays
  const expirationDateAndTime = new Date(currentDateAndTimeISO);
  // console.log("this is the expirationDateTime", expirationDateAndTime);
  // console.log("expieration day count", expirationDayCount);
  expirationDateAndTime.setDate(
    expirationDateAndTime.getDate() + expirationDayCount
  );
  // console.log("this is the expirationDateTime", expirationDateAndTime);

  // expirationDateTime.setDate(expirationDateTime.getDate() + lifeCycleDays);

  // console.log("this is the expirationDateTime", expirationDateAndTime);
  // convert expirationDateTime from a date and time into a ISO format
  const expirationDateAndTimeISO = expirationDateAndTime.toISOString();

  // Fetch the transaction object from the server (done to avoid tampering)
  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch("../api/createSubTransaction", {
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
      id: id,
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      purchasePrice: price,
      token: token,
      owner: owner,
      email: email,
      subID: id,
      shippingInfo: shippingInfo,
      purchaseDate: currentDateAndTimeISO,
      expireDate: expirationDateAndTimeISO,
    }),
    [publicKey, orderID, owner, token, id, email, shippingInfo]
  );
  // console.log("this is the ORDER", order);
  // useEffect(() => {
  //   try {
  //     async function checkPurchased() {
  //       if (publicKey.toString() != "") {
  //         const purchased = await getBuyerOrders(publicKey);
  //         if (purchased.subOrders.length > 0) {
  //           for (let i = 0; i < purchased.orders[0].productid.length; i++) {
  //             if (purchased.orders[0].productid[i].id === id) {
  //               setStatus(STATUS.Paid);
  //               const item = await fetchItem(id);
  //               setItem(item);
  //             }
  //           }
  //         }
  //       }
  //     }
  //     checkPurchased(id);
  //     async function getItem(id) {
  //       const item = await fetchItem(id);
  //       // console.log("item", item.product.type)
  //     }
  //     getItem(id);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, [publicKey]);

  // inspect item for userRequireEmail and userRequireShipping when item is present
  useEffect(() => {
    // async function that awaits the results of getSingleProductBySku
    async function getReqs(id) {
      const reqs = await GetSubById(id);
      // console.log("reqs", reqs);

      if (reqs.sub) {
        // console.log("reqs are", reqs);
        // console.log("require email?", reqs.sub.reqUserEmail);
        // console.log("require shipping info?", reqs.sub.reqUserShipping);
        if (reqs.sub.reqUserEmail === false) {
          setInfoCaptured(true);
          if (reqs.sub.reqUserShipping === false) {
            setShippingCaptured(true);
          }
          // console.log("", infoCaptured);
        }
        if (reqs.sub.reqUserEmail === true) {
          setInfoCaptured(false);
          setShowEmail(true);
        }
        if (reqs.sub.reqUserShipping === true) {
          setShippingCaptured(false);
          setShowShipping(true);
        }
        if (reqs.sub.type === "tipjar") {
          setTipJar(true);
        }
      }
    }
    getReqs(id);
  }, [id]);

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
        AddSubOrder(order);
        alert("Thank you for your purchase!");
      };
    }

    async function getItem(id) {
      const item = await fetchItem(id);
      setItem(item);
    }

    if (status === STATUS.Paid) {
      getItem(id);
    }
  }, [status]);

  // render form to capture user email
  const renderEmailForm = () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const handleChange = (e) => {
      setEmail(e.target.value);
      // console.log("email", email);
    };
    return (
      <div className={styles.emailForm}>
        <label>Email</label>
        <div className={styles.input_field}>
          <input
            type="email"
            placeholder="jim@gmail.com"
            value={email}
            onChange={handleChange}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => {
            if (email !== "" && validRegex.test(email)) {
              setEmail(email);
              // console.log("Email captured", email);
              setShowEmail(false);
              setInfoCaptured(true);
            } else {
              alert("Please enter a valid email");
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };

  // render form to capture user shipping info
  const renderShippingForm = () => {
    return (
      <div className={styles.shippingForm}>
        <label>Shipping Address</label>
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="Name"
            value={shipping.name}
            onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
          />
        </div>
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="Address"
            value={shipping.address}
            onChange={(e) =>
              setShipping({ ...shipping, address: e.target.value })
            }
          />
        </div>

        <div className={styles.form_row}>
          <div className={styles.col_half}>
            <div className={styles.input_field}>
              <input
                type="text"
                placeholder="City"
                value={shipping.city}
                onChange={(e) =>
                  setShipping({ ...shipping, city: e.target.value })
                }
              />
            </div>
          </div>
          <div className={styles.col_half}>
            <div className={styles.input_field}>
              <input
                type="text"
                placeholder="Zip"
                value={shipping.zip}
                onChange={(e) =>
                  setShipping({ ...shipping, zip: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="State"
            value={shipping.state}
            onChange={(e) =>
              setShipping({ ...shipping, state: e.target.value })
            }
          />
        </div>

        <button
          className={styles.saveBtn}
          onClick={() => {
            if (
              shipping.name !== "" &&
              shipping.address !== "" &&
              shipping.city !== "" &&
              shipping.state !== "" &&
              shipping.zip !== ""
            ) {
              setShipping(shipping);
              // console.log("Shipping info captured", shipping);
              setShowShipping(false);
              setShippingCaptured(true);
              // setShippingInfo as a string of only the values from the shipping not the key's
              setShippingInfo(
                `${shipping.name}, ${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`
              );
              // console.log("Shipping info,", shippingInfo);
            } else {
              alert("Please fill out all shipping fields");
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };

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
      {/* Display either buy button or IPFSDownload component based on if Hash exists */}
      {showEmail ? renderEmailForm() : null}
      {showShipping ? renderShippingForm() : null}
      {infoCaptured && email ? <p>Email Captured: {email}</p> : null}
      {infoCaptured && shipping ? (
        <p>
          {shipping.name} {shipping.address} {shipping.city} {shipping.state}{" "}
          {shipping.zip}
        </p>
      ) : null}
      {item ? (
        <>
          <h3 className="purchased">Purchase Complete!</h3>

          {/* <button
                disabled={loading || !infoCaptured || !shippingCaptured}
                className="buy-button"
                onClick={processTransaction}
              >
                Buy Again
              </button> */}
        </>
      ) : (
        <>
          <button
            disabled={loading || !infoCaptured || !shippingCaptured}
            className="buy-button"
            onClick={processTransaction}
          >
            Pay Now
          </button>
        </>
      )}
    </div>
  );
}
