// import { Bridge } from '@socket.tech/widget';
import { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import { Bridge } from '@socket.tech/widget';

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [provider, setProvider] = useState<any>();
  const [userAddress, setUserAddress] = useState<string>();
  const [chain, setChain] = useState<number>();

  const fetchWalletData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const chain = await signer.getChainId();

    if (provider) {
      setProvider(provider);
      setUserAddress(userAddress);
      setChain(chain);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const chain = await signer.getChainId();
        setProvider(provider);
        setUserAddress(userAddress);
        setChain(chain);
      } else {
        alert("Web3 wallet not detected");
      }
    } catch (e) {
      alert("Error in connecting wallet");
      console.log(e);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      fetchWalletData();

      window.ethereum.on("chainChanged", () => {
        fetchWalletData();
      });

      window.ethereum.on("accountsChanged", () => {
        fetchWalletData();
      });
    }
  }, [window.ethereum]);
  return (
    <div className="App">
      <header className="App-header">
        <Bridge API_KEY='645b2c8c-5825-4930-baf3-d9b997fcd88c' customize={{
          primary: 'rgb(20,24,25)',
          secondary: 'rgb(7,10,10)',
          accent: 'rgb(130,218,192)',
          onAccent: 'rgb(0,0,0)',
          text: 'rgb(255,255,255)',
          secondaryText: 'rgb(183, 191, 201)',
          interactive: 'rgb(20,24,25)',
          onInteractive: 'rgb(183,191,201)',
          // borderRadius: 0
        }}
        provider={provider}
        // sourceNetworks={[1,10]}
        // destNetworks={[1,10]}
        // defaultSourceNetwork={10}
        // tokenList="https://gateway.ipfs.io/ipns/tokens.uniswap.org"
        />
      </header>
    </div>
  );
}

export default App;
