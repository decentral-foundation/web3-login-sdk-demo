import React, { useState, useEffect } from 'react';
import MetaMaskLogin from './components/MetaMaskLogin';
import TradingInterface from './components/TradingInterface';
import LuciaSDK from 'lucia-sdk';

LuciaSDK.init({
  debugURL: import.meta.env.VITE_LUCIA_BASE_URL,
  apiKey: import.meta.env.VITE_LUCIA_API_KEY,
});


const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
const etherscanApiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;


const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  const handleLogin = (connectedAccount: string) => {
    console.log(`Attempting to log in with account: ${connectedAccount}`);
    setAccount(connectedAccount);
  };

  useEffect(() => {
    console.log('Account state updated:', account);
  }, [account]);

  return (
    <div>
      <h1>Wallet Login</h1>
      
      {!account ? (
        <MetaMaskLogin onLogin={handleLogin} />
      ) : (
        <>
          <TradingInterface account={account} />
        </>
      )}
    </div>
  );
};

export default App;
