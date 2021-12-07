import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Wallet } from "@project-serum/anchor";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
  getTorusWallet,
} from "@solana/wallet-adapter-wallets";

import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { clusterApiUrl, Connection } from "@solana/web3.js";

import {
  createGifAccount,
  handleTip,
  handleUpvote,
  sendGif,
  getGifList,
} from "./gif-portal";

import "@solana/wallet-adapter-react-ui/styles.css";

import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

const TWITTER_HANDLE = "ilyazub_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const onInputChange = useCallback(async (event) => {
    const { value } = event.target;
    setInputValue(value);
  }, []);

  const updateGifList = async (connection: Connection, wallet: Wallet) => {
    if (wallet?.publicKey) {
      console.log("Fetching GIF list...");

      const gifList = await getGifList(connection, wallet);
      setGifList(gifList);
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await sendGif(connection, wallet as Wallet, inputValue);

      updateGifList(connection, wallet as Wallet);
    },
    [connection, wallet, inputValue]
  );

  const handleInitializationClick = useCallback(
    async (event) => {
      await createGifAccount(connection, wallet as Wallet);
      updateGifList(connection, wallet as Wallet);
    },
    [connection, wallet]
  );

  const handleUpvoteWithWallet = useCallback(
    async (gifLink: string) => {
      handleUpvote(connection, wallet as Wallet, gifLink);

      updateGifList(connection, wallet as Wallet);
    },
    [connection, wallet]
  );

  const handleTipWithWallet = (userAddress: string, tipValue: number) => {
    handleTip(connection, wallet as Wallet, userAddress, tipValue);
    updateGifList(connection, wallet as Wallet);
  };

  const renderConnectedContainer = () => {
    if (gifList == null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={handleInitializationClick}
          >
            Do one-time initialization for GIF program account
          </button>
        </div>
      );
    }

    const renderGif = (item, index: number) => (
      <GifItem
        {...item}
        handleUpvote={handleUpvoteWithWallet}
        handleTip={handleTipWithWallet}
        key={index}
      />
    );

    return (
      <div className="connected-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter GIF link"
            value={inputValue}
            onChange={onInputChange}
            required
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>

        <div className="gif-grid">{gifList.map(renderGif)}</div>
      </div>
    );
  };

  useEffect(() => {
    updateGifList(connection, wallet as Wallet);
  }, [connection, wallet]);

  return (
    <div className="App">
      <div className={wallet?.publicKey ? "authed-container" : "container"}>
        <div>
          <WalletMultiButton />
        </div>

        <div className="header-container">
          <p className="header">Breakdance GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {wallet?.publicKey && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

function GifItem({ userAddress, gifLink, upvotes, handleUpvote, handleTip }) {
  const [tipValue, setTipValue] = useState(1.337);

  const onClick = useCallback(async (event) => {
    handleUpvote(gifLink);
  }, []);

  const onClickTip = useCallback(
    async (event) => {
      handleTip(userAddress, tipValue);
    },
    [userAddress, tipValue]
  );

  const onTipValueChange = useCallback(async (event) => {
    event.preventDefault();
    setTipValue(Number.parseFloat(event.target.value));
  }, []);

  return (
    <div className="gif-item">
      <span className="gif-address-text">
        Added by {userAddress.toString()}
      </span>
      <img src={gifLink} alt={gifLink} />

      <div className="buttons">
        <p
          className="button"
          onClick={onClick}
          title={`${upvotes.toString()} upvotes`}
        >
          {upvotes.toString()} &#x2B06;
        </p>
        <p className="button">
          Tip <input placeholder={tipValue} onChange={onTipValueChange} /> SOL
          <input
            type="button"
            value="&#x1F4B0;"
            onClick={onClickTip}
            required
          />
        </p>
      </div>
    </div>
  );
}

const AppWithWallet = () => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getTorusWallet({
        options: { clientId: "Get a client ID @ https://developer.tor.us" },
      }),
      getLedgerWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default AppWithWallet;
