import { useState, useEffect } from "react";
import "./App.css";
import { ethers, version } from "ethers";
import { Bridge, Customize } from "@socket.tech/plugin";
console.log("verson", version);

declare global {
  interface Window {
    ethereum: any;
  }
}

const getEthersV5Provider = async (provider: any) => {
  console.log("provider", provider);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const address = await signer.getAddress();

  console.log(signer ? "✅ Signer Present" : "❌ Signer absent", signer);
  console.log(
    network ? "✅ Network from Provider" : "❌ Network from provider not found",
    network
  );
  console.log(
    address ? "✅ Address from Signer" : "❌ Address from Signer not found",
    address
  );
};

const switchNetwork = async (provider: any) => {
  if (window.ethereum) {
    console.log("pp", provider, await provider.provider.nextId);
    // const formattedChainId = "0x76adf1"; // for zora - make sure it works well with plugin
    const formattedChainId = "0x64"; // for gnosis chain - make sure it works well with plugin
    await provider.send("wallet_switchEthereumChain", [
      { chainId: formattedChainId },
    ]);
  }
};

function App() {
  const [provider, setProvider] = useState<any>();
  const [userAddress, setUserAddress] = useState<string>();
  const [network, setNetwork] = useState<any>();

  const ethersMajorVersion = parseInt(version.split(".")[0]);

  const fetchWalletData = async () => {
    // for ethers v6
    const _provider = new ethers.BrowserProvider(window.ethereum, "any");
    // const _provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/5364614311034dba84b17a601691ad90")

    // for ethers v5
    // const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const signer = await _provider.getSigner();
    const userAddress = await signer.getAddress();
    const network = await _provider.getNetwork();

    if (_provider) {
      getEthersV5Provider(_provider);
      setProvider(_provider);
      setUserAddress(userAddress);
      setNetwork(network);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // for ethers v6
        const _provider = new ethers.BrowserProvider(window.ethereum, "any");
        // const _provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/5364614311034dba84b17a601691ad90")

        // for ethers v5
        // const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        await _provider.send("eth_requestAccounts", []);
        const signer = await _provider.getSigner();
        const userAddress = await signer.getAddress();

        setProvider(_provider);
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
  }, []);

  const btnStyle = {
    display: "flex",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "8px 20px",
    color: "black",
    fontWeight: "bold",
  };

  const customizeProperties: Customize = {
    width: 400,
    // responsiveWidth: true,
    primary: "rgb(9,9,10)",
    secondary: "rgba(38, 40, 42)",
    text: "rgb(255, 255, 255)",
    secondaryText: "rgb(145, 153, 167)",
    accent: "rgb(127, 231, 175)",
    onAccent: "rgb(30, 40, 42)",
    interactive: "rgb(51, 52, 53)",
    onInteractive: "rgb(255, 255, 255)",
    outline: "rgb(59, 61, 65)",
    borderRadius: 1.2,
  };

  const [showBridge, setShowBridge] = useState(false);
  const _destNetworks = [network?.chainId];
  const _defaultDestNetwork = _destNetworks[0];

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="flex justify-between w-full skt-w"
          style={{ padding: "30px", marginBottom: "50px" }}
        >
          <p className="skt-w font-medium" style={{ fontSize: "24px" }}>
            Socket Plugin Testing
          </p>
          {userAddress && (
            <button onClick={() => switchNetwork(provider)}>
              Switch to Optimism
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <p style={btnStyle}>
              {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
            </p>
            {userAddress ? (
              <button
                style={{
                  ...btnStyle,
                  marginLeft: "20px",
                }}
                className="skt-w skt-w-input skt-w-button"
                onClick={disconnectWallet}
              >
                Logout
              </button>
            ) : (
              <button
                style={{ ...btnStyle, marginLeft: "20px" }}
                onClick={connectWallet}
                className="skt-w skt-w-input skt-w-button"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        <button onClick={() => setShowBridge(!showBridge)}>Show/hide</button>
        {showBridge && (
          <Bridge
            API_KEY="72a5b4b0-e727-48be-8aa1-5da9d62fe635"
            customize={customizeProperties}
            provider={provider}
            enableRefuel={true}
            selectivelyShowRefuel={true}
            // singleTxOnly={true}
            // includeBridges={['hyphen']}
            // enableSameChainSwaps={true}
            defaultSourceNetwork={10}
            defaultDestNetwork={137}
            // defaultSourceToken="0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            // defaultDestToken="0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9"
            defaultSourceToken="0x94b008aa00579c1307b0ef2c499ad98a8ce58e58"
            // onSourceTokenChange={(value) => console.log('Source Token: ', value?.name)}
            // onDestinationTokenChange={(value) => console.log('Dest Token: ', value?.name)}
            // onSourceNetworkChange={(value) => console.log('Source Nw: ', value.name)}
            // onDestinationNetworkChange={(value) => console.log('Destination Nw: ', value.name)}
            // onBridgeSuccess={(value) => console.log('Route completed: ', value)}
            // onSubmit={(value) => console.log('Submitted: ', value)}

            // sourceNetworks={[10]}
            // destNetworks={[10]}
            // defaultSourceNetwork={10}
            // tokenList="https://gateway.ipfs.io/ipns/tokens.uniswap.org"
            // destNetworks={_destNetworks}
            // defaultDestNetwork={_defaultDestNetwork}
          />
        )}
      </header>
    </div>
  );
}

export default App;
