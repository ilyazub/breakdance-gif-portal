import React, { useCallback, useEffect, useState } from "react";
import { Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

import {
  createGifAccount,
  handleTip,
  handleUpvote,
  sendGif,
  getGifList,
} from "@/gif-portal";

import { GifItem } from "./GifItem";

import twitterLogo from "@/assets/twitter-logo.svg";
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
      await setGifList(gifList);
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

export default App;
