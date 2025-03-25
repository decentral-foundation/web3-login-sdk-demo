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
  LuciaSDK.pageView("Splash Page");
  console.log("expect splash page to be tracked");
  const handleLogin = (connectedAccount: string) => {
    console.log(`Attempting to log in with account: ${connectedAccount}`);
    setAccount(connectedAccount);
  };

  const handleLogout = () => {
    setAccount(null);
    LuciaSDK.buttonClick("logout button called");
    console.log('Logged out');
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
          <TradingInterface account={account} onLogout={handleLogout} />
        </>
      )}
    </div>
  );
};

export default App;
