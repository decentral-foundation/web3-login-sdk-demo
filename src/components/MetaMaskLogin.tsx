import React, { useState } from 'react';
import lucia from "lucia-sdk";

interface MetaMaskLoginProps {
  onLogin: (account: string) => void;
}


import { ethers } from 'ethers';

interface MetaMaskLoginProps {
  onLogin: (account: string) => void;
}

const MetaMaskLogin: React.FC<MetaMaskLoginProps> = ({ onLogin }) => {
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        // Get network information
        const network = await provider.getNetwork();
        const chainIdHex = network.chainId.toString();
        const chainIdDec = parseInt(chainIdHex).toString();
        
        console.log('Connected address:', address, 'Chain ID:', chainIdDec);
        
        try {
          console.log("Sending wallet info to Lucia:", {
            address,
            chainId: parseInt(chainIdDec),
            wallet: 'Metamask'
          });
          await lucia.sendWalletInfo(address, parseInt(chainIdDec), 'Metamask');
          console.log('Successfully sent wallet info to Lucia');
        } catch (luciaError) {
          console.error('Failed to send wallet info to Lucia:', luciaError);
          // Continue with login even if Lucia tracking fails
        }
        
        // Complete the login process
        onLogin(address);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  return (
    <button onClick={connectWallet}>Connect with MetaMask</button>
  );
};


export default MetaMaskLogin;
