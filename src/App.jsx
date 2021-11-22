import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'ilyazub_';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://media.giphy.com/media/w6ovaV3maxsMDLJLd3/giphy.gif",,
  "https://media.giphy.com/media/JiqSKO2Wfdqe83RUob/giphy-downsized.gif",
  "https://media.giphy.com/media/ubd3YFbbktwGUJtXey/giphy-downsized.gif",
  "https://media.giphy.com/media/F9DN13Svu0verbakMp/giphy-downsized.gif",
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log("Phantom wallet found!");

        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(`Connected with Public Key:`, response.publicKey.toString());

        setWalletAddress(response.publicKey.toString());
      } else {
        alert("window.solana object not found! Get a Phantom Wallet.")
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    }

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");

      // TODO: Call Solana program

      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log(`Connected with Public Key:`, response.publicKey.toString());

      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button"
      onClick={connectWallet}>Connect to wallet</button>
  )

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  }

  const submitGif = () => {
    if (inputValue.length > 0) {
      console.log("GIF link:", inputValue);
    } else {
      console.log("Empty input. Try again.")
    }
  }

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form onSubmit={(event) => {
        event.preventDefault();
        submitGif();
      }}>
        <input type="text" placeholder="Enter GIF link" value={inputValue} onChange={onInputChange} required />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>

      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">Breakdance GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!!walletAddress ? renderConnectedContainer() : renderNotConnectedContainer()}
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
