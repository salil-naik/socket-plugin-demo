// import { Bridge } from '@socket.tech/widget';
import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import { Bridge } from "@socket.tech/widget";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [provider, setProvider] = useState<any>();
  const [userAddress, setUserAddress] = useState<string>();

  const fetchWalletData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    if (provider) {
      setProvider(provider);
      setUserAddress(userAddress);
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
        setProvider(provider);
        setUserAddress(userAddress);
      } else {
        alert("Web3 wallet not detected");
      }
    } catch (e) {
      alert("Error in connecting wallet");
      console.log(e);
    }
  };

  const disconnectWallet = () => {
    setUserAddress("");
    setProvider(null);
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

  const btnStyle = {
    display: "flex",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "8px 20px",
    color: "black",
    fontWeight: "bold",
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="flex justify-between w-full"
          style={{ padding: "30px", marginBottom: "50px" }}
        >
          <p className="font-medium" style={{ fontSize: "24px" }}>
            Socket Plugin Testing
          </p>
          <div style={{ display: "flex" }}>
            <p style={btnStyle}>
              {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
            </p>
            {userAddress ? (
              <button
                style={{
                  ...btnStyle,
                  marginLeft: "20px",
                }}
                onClick={disconnectWallet}
              >
                Logout
              </button>
            ) : (
              <button style={{ ...btnStyle, marginLeft: "20px" }} onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        <Bridge
          API_KEY="645b2c8c-5825-4930-baf3-d9b997fcd88c"
          customize={{
            primary: "rgb(20,24,25)",
            secondary: "rgb(7,10,10)",
            accent: "rgb(130,218,192)",
            onAccent: "rgb(0,0,0)",
            text: "rgb(255,255,255)",
            secondaryText: "rgb(183, 191, 201)",
            interactive: "rgb(20,24,25)",
            onInteractive: "rgb(183,191,201)",
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
