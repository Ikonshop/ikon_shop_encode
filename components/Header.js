import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "../styles/Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ApplyToSell from "./ApplyToSell";
import "bootstrap/dist/css/bootstrap.min.css";
import { CheckForWallet, CreateWallet } from "../lib/api";
import Cart from "./Cart/cart";
import { check } from "prettier";
import { LogoDiscord, LogoTwitter } from "react-ionicons";
import dynamic from "next/dynamic";
import { getCollectionOwner } from "../lib/api";
import { IoSwapHorizontalOutline } from "react-icons/io5";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import {
  Connection,
  GetTokenAccountsByOwnerConfig,
  PublicKey,
  getTokenAccountsByOwner,
} from "@solana/web3.js";

// import Head from "next/head";

export default function HeaderComponent() {
  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  const { publicKey, connected } = useWallet();
  const wallet = useWallet();
  const router = useRouter();
  const currentPath = router.pathname;
  const [merchant, setMerchant] = useState(false);

  // MERCHANT HEADER CONSTANTS
  const [isMultiStoreOwner, setIsMultiStoreOwner] = useState(false);
  const [multiStoreArray, setMultiStoreArray] = useState(null);
  const [currentStore, setCurrentStore] = useState(null);
  const [nftData, setNftData] = useState(null);

  //wallet check
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );

  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  //Get Token balances for wallet
  const getTokenBalances = async () => {
    const usdcAddress = new PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );
    const slabzTokenAddress = new PublicKey(
      "4SSjVmxXvAmxe5SdTohsg1ESqGjtHpMKdn5Hh2SHScxh"
    );
    if (!wallet.connected) {
      return;
    }
    try {
      const tokenBalances = await connection.getTokenAccountsByOwner(
        wallet.publicKey,
        {
          mint: usdcAddress,
        }
      );

      // console.log('tokenBalances: ', tokenBalances)

      if (tokenBalances.value.length > 0) {
        const balance = await connection.getTokenAccountBalance(
          tokenBalances.value[0].pubkey
        );
        const balance_to_string = balance.value.uiAmountString;
        console.log("token balance: ", balance_to_string);
      } else {
        console.log("no balance");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNfts = async () => {
    if (!wallet.connected) {
      return;
    }
    try {
      const nfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: wallet.publicKey });
      console.log("nfts: ", nfts);
      let nftData = [];
      for (let i = 0; i < nfts.length; i++) {
        if (nfts[i].uri) {
          let fetchResult = await fetch(nfts[i].uri);
          let json = await fetchResult.json();
          nftData.push(json);
        }
      }

      setNftData(nftData);
      console.log("nftData: ", nftData);
      const wallet_tokens = await metaplex
        .walletTokens()
        .findAllByOwner({ owner: wallet.publicKey });
      console.log("wallet_tokens: ", wallet_tokens);
    } catch (error) {
      console.log(error);
    }
  };

  const renderMultiStoreSelection = () => {
    // console.log('multiStoreArray: ', multiStoreArray)
    return (
      <div
        style={{
          marginRight: "50px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
          width: "20vw",
          fontSize: "12px",
        }}
      >
        <div>
          <img
            // src="/ikons.gif"
            src={currentStore.banner}
            alt={currentStore.projectName}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: "12px",
            paddingTop: "20px",
          }}
        >
          {/* <p
            style={{
              color: "#130B46",
              fontWeight: "700",
              fontSize: "20px",
            }}
          >
            Ikons Store
          </p> */}
          <p
            style={{
              color: "#130B46",
              fontWeight: "700",
              fontSize: "20px",
            }}
          >
            {currentStore.projectName}
          </p>
          <p
            style={{
              color: "#8E8E8E",
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            Welcome Fren!
          </p>
        </div>
        <NavDropdown
          // title={currentStore.projectName}
          title=""
          id="basic-nav-dropdown"
          style={{
            fontSize: "18px",
          }}
        >
          {multiStoreArray.map((store, index) => {
            console.log("store: ", store);
            return (
              <NavDropdown.Item
                key={index}
                onClick={() => {
                  //trigger window event to update header for listenting components
                  const event = new CustomEvent("active_store_changed", {
                    detail: multiStoreArray[index],
                  });
                  localStorage.setItem(
                    "active_store",
                    JSON.stringify(multiStoreArray[index].symbol)
                  );
                  window.dispatchEvent(event);
                  setCurrentStore(multiStoreArray[index]);
                }}
              >
                <img
                  // src="/ikons.gif"
                  src={store.banner}
                  alt={store.projectName}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                {store.projectName}
              </NavDropdown.Item>
            );
          })}

          <Nav.Link
            onClick={() => {
              router.push("/user/dashboard");
            }}
            className="menu_link"
            style={{
              border: "none",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <IoSwapHorizontalOutline
              style={{ marginRight: "5px", fontSize: "14px" }}
            />
            <p style={{ border: "none", fontSize: "16px", marginTop: "10px" }}>
              Switch to User
            </p>
          </Nav.Link>
        </NavDropdown>
      </div>
    );
  };

  useEffect(() => {
    if (!publicKey) return;
    // fetchNfts();
    getTokenBalances();
    setIsMultiStoreOwner(false);
    setMultiStoreArray(null);
    (async () => {
      // check local storage for store_owner_array, if it does not exist then create it
      if (localStorage.getItem("store_owner_array") === null) {
        localStorage.setItem("store_owner_array", JSON.stringify([]));
      }
      // check local storage for active_store, if it does not exist then create it
      if (localStorage.getItem("active_store") === null) {
        localStorage.setItem("active_store", JSON.stringify());
      }
      const store = await getCollectionOwner(publicKey);
      if (store.collections.length) {
        console.log("store: ", store.collections);
        const store_symbols = store.collections.map((item) => item.symbol);

        const store_selection = store_symbols;
        setMultiStoreArray(store.collections);
        setCurrentStore(store.collections[0]);
        // console.log('new multiStoreArray: ', multiStoreArray);
        localStorage.setItem(
          "store_owner_array",
          JSON.stringify(store_symbols)
        );
        localStorage.setItem("active_store", JSON.stringify(store_symbols[0]));
        setIsMultiStoreOwner(true);
      }
    })();
  }, [publicKey, merchant]);

  return (
    <>
      <Navbar expand="lg">
        <Container>
          {/* DYNAMIC PATH RENDER HERE FOR MERCHANT DASHBOARD*/}
          {currentPath === "/merchant/dashboard" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Navbar.Brand className="menu_link" style={{ border: "none" }}>
                  <img
                    src="/newlogo.png"
                    style={{ cursor: "pointer", maxWidth: "160px" }}
                    className="logo_header"
                  />
                </Navbar.Brand>
                {isMultiStoreOwner && (
                  <Navbar.Brand className="" style={{ border: "none" }}>
                    {renderMultiStoreSelection()}
                  </Navbar.Brand>
                )}
              </div>
              <Nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Nav.Link>
                  <WalletMultiButton className="disconnect-button wallet_button" />
                </Nav.Link>
              </Nav>
            </>
          )}

          {currentPath !== "/merchant/dashboard" && (
            <>
              <Navbar.Brand
                onClick={() => router.push("/")}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/newlogo.png"
                  style={{ cursor: "pointer", maxWidth: "160px" }}
                  className="logo_header"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav">
                <FontAwesomeIcon icon={faBars} style={{ color: "#000" }} />
              </Navbar.Toggle>
              <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-end"
              >
                <Nav
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {merchant && (
                    <Nav.Link
                      href="/merchant/dashboard"
                      className="menu_link nav-link nav-link-fade-up"
                      style={{ border: "none" }}
                    >
                      Merchant
                    </Nav.Link>
                  )}
                  <Nav.Link
                    href="/user/dashboard"
                    className="menu_link nav-link nav-link-fade-up"
                    style={{ border: "none" }}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    href="https://forms.gle/Hufp94teN3h1QdAw5"
                    className="menu_link nav-link nav-link-fade-up"
                    style={{ border: "none" }}
                  >
                    Apply Now
                  </Nav.Link>
                  <Nav.Link
                    href="https://ikons.io"
                    className="menu_link nav-link nav-link-fade-up"
                    style={{ border: "none" }}
                  >
                    NFT
                  </Nav.Link>

                  <Nav.Link
                    href="https://twitter.com/IkonShopApp"
                    className="menu_link"
                    style={{ border: "none" }}
                  >
                    <LogoTwitter />
                  </Nav.Link>

                  <Nav.Link
                    href="https://discord.gg/ikons"
                    className="menu_link"
                    style={{ border: "none" }}
                  >
                    <LogoDiscord />
                  </Nav.Link>

                  <Nav.Link>
                    <WalletMultiButton className="disconnect-button wallet_button" />
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
}
