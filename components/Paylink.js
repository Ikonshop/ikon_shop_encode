import React, { useState } from "react";
import styles from "../styles/Paylink.module.css";
import Buy from "../components/Buy";
import { useWallet } from "@solana/wallet-adapter-react";
import SendElusiv from "./Elusiv/send";
import ElusivSetup from "./Elusiv/userSetUp";

export default function PaylinkComponent(product) {
  const {
    id,
    name,
    price,
    description,
    owner,
    token,
    type,
  } = product.product;
  const [tipAmount, setTipAmount] = useState("");
  const [tokenType, setTokenType] = useState("sol");
  const [showElusiv, setShowElusiv] = useState(false);
  const { publicKey } = useWallet();

  const renderTokenTypeInput = () => {
    return (
      <div className={styles.split}>
        <label className={styles.product_details_price}>Token Type</label>
        {/* <select
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="tokenType"
          onChange={(e) => setTokenType(e.target.value)}
          style={{
            width: "180px",
          }}
        >
          <option value="sol">SOL</option>
          <option value="usdc">USDC</option>
          <option value="groar">GROAR</option>
          <option value="dust">DUST</option>
          <option value="creck">CRECK</option>
          <option value="pesky">PESKY</option>
          <option value="gmt">GMT</option>
          <option value="gore">GORE</option>
        </select> */}
        SOL
      </div>
    );
  };

  return (
    <>
      <div className={styles.paylink_page}>
        <div className={styles.pay_container}>
          <div className={styles.img}>
            <img
              src={
                type === "tipjar"
                  ? "/tipjar_head_bg.png"
                  : "/paylink_head_bg.png"
              }
            />
          </div>
          <div className={styles.shipping_details_flex}>
            <div className={styles.pay_content}>
              <p className={styles.pay_title}>{name}</p>
              <p className={styles.pay_copy}>{description}</p>
              <div className={styles.split}>
                <p>
                  Owner:{" "}
                </p>
                <p>
                  <strong>{owner.slice(0, 4) + "..." + owner.slice(-4)}</strong>
                </p>
              </div>
              <div className={styles.price_pricebtn}>
                <div className={styles.split}>
                  <p>
                    Token:{" "}
                  </p>
                  <p>
                    <strong>SOL</strong>
                  </p>
                </div>
                {type != "tipjar" && (
                  <div className={styles.split}>
                    <p>Amount:</p>
                    <p
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {price} {token.toUpperCase()}
                    </p>
                  </div>
                )}
                <div className={styles.split}>
                  {type == "tipjar" && (
                    <div className={styles.product_details_price}>
                      Enter {tokenType.toUpperCase()} Tip
                    </div>
                  )}
                  {type == "tipjar" && (
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      onChange={(e) => setTipAmount(e.target.value)}
                      style={{
                        width: "125px",
                      }}
                    />
                  )}
                </div>

                {type === "tipjar" && tipAmount ? (
                  <div className={styles.product_details_price}>
                    Tip Amount: {tipAmount} {tokenType.toUpperCase()}
                  </div>
                ) : null}

                  <div className={styles.product_details_price}>
                    <input
                      style={{ marginRight: "5px" }}
                      type="checkbox"
                      id="elusiv"
                      name="elusiv"
                      value="elusiv"
                      onChange={(e) => setShowElusiv(e.target.checked)}
                    />
                    <label for="elusiv">Send Privately w/ Elusiv</label>
                  </div>
                  {publicKey && showElusiv && tipAmount && (
                    <SendElusiv
                      className={styles.pay_btn}
                      id={id}
                      price={tipAmount}
                      token={tokenType}
                      owner={owner}
                    />
                  )}
                  {publicKey && showElusiv && !tipAmount && (
                    <SendElusiv
                      className={styles.pay_btn}
                      id={id}
                      price={price}
                      token={tokenType}
                      owner={owner}
                    />
                  )}
                  {publicKey && !showElusiv && tipAmount && (
                    <Buy
                      className={styles.pay_btn}
                      id={id}
                      price={tipAmount}
                      token={tokenType}
                      owner={owner}
                    />
                  )}
                  {publicKey && !showElusiv && type != "tipjar" ? (
                    <Buy
                      className={styles.pay_btn}
                      id={id}
                      price={price}
                      token={token}
                      owner={owner}
                    />
                  ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.shipping_flex}>
          {publicKey && showElusiv && (
            <ElusivSetup />
          )}
        </div>
      </div>
    </>
  );
}
