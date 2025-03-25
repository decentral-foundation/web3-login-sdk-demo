import React, { useState, useEffect } from 'react';
import styles from './TradingInterface.module.css';
import lucia from "lucia-sdk";
import { ethers } from 'ethers';


interface TradingInterfaceProps {
  account: string;
  onLogout: () => void;
}

type TicketType = 'EARLY_BIRD' | 'GA' | 'VIP';

interface TicketOption {
  type: TicketType;
  name: string;
  price: number;
}

const TICKET_OPTIONS: TicketOption[] = [
  { type: 'EARLY_BIRD', name: 'Early Bird', price: 0.01 },
  { type: 'GA', name: 'General Admission', price: 100 },
  { type: 'VIP', name: 'VIP', price: 750 },
];

const NETWORK_NAMES: { [key: string]: string } = {
  '1': 'Ethereum Mainnet',
  '5': 'Goerli Testnet',
  '1135': 'Lisk Mainnet',
  '4202': 'Lisk Testnet',
  '137': 'Polygon Mainnet',
  '80002': 'Polygon Amoy Testnet', // New Polygon testnet replacing Mumbai
  '1337': 'Local Network',
};

const TradingInterface: React.FC<TradingInterfaceProps> = ({ account, onLogout }) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketType>('GA');
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<string>('');
  const [networkName, setNetworkName] = useState<string>('');

  useEffect(() => {
    const trackPage = async () => {
      console.log("expect trading interface page to be tracked");
      await lucia.pageView("Trading Interface");
    };
    trackPage();
  }, []);

  useEffect(() => {
    const getNetworkInfo = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          const chainIdHex = network.chainId.toString();
          const chainIdDec = parseInt(chainIdHex).toString();
          setChainId(chainIdDec);
          setNetworkName(NETWORK_NAMES[chainIdDec] || 'Unknown Network');
          
          // Adjust balance display for Polygon networks
          const currency = ['137', '80002'].includes(chainIdDec) ? 'MATIC' : 'ETH';
          const balanceWei = await provider.getBalance(account);
          const balanceFormatted = ethers.formatEther(balanceWei);
          setBalance(`${parseFloat(balanceFormatted).toFixed(4)} ${currency}`);
        } catch (error) {
          console.error('Error fetching network:', error);
          setChainId('Error');
          setNetworkName('Unknown');
        }
      }
    };

    const getBalance = async () => {
      // Balance is now handled in getNetworkInfo to show correct currency
      return;
    };

    getNetworkInfo();
    getBalance();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        getNetworkInfo();
        getBalance();
      });
      window.ethereum.on('accountsChanged', () => {
        getNetworkInfo();
        getBalance();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {
          getNetworkInfo();
          getBalance();
        });
        window.ethereum.removeListener('accountsChanged', () => {
          getNetworkInfo();
          getBalance();
        });
      }
    };
  }, [account]);

  const handleSupport = async () => {
    console.log("expect lucia sdk call to be made");
    await lucia.buttonClick("support button called");

    // Create email content
    const subject = `Support Request - ${networkName} Network`;
    const body = `
      Account: ${account}
      Network: ${networkName}
      Chain ID: ${chainId}
      Balance: ${balance}

      Please describe your issue here:`;

    // Encode the subject and body for the mailto link
    const mailtoLink = `mailto:team@luciaprotocol.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open default email client
    window.location.href = mailtoLink;
  };

  const handleStake = async () => {
    console.log("expect lucia sdk call to be made for stake button");
    await lucia.buttonClick("stake button called");
    
    const ticket = TICKET_OPTIONS.find(t => t.type === selectedTicket);
    console.log(`Staking $${ticket?.price} for ${ticket?.name} ticket`);
    await lucia.trackConversion("checkout", ticket?.price, ticket?.name);
    
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Create NFT Ticket</h2>
        <button onClick={onLogout} className={`${styles.button} ${styles.logoutButton}`}>
          Logout
        </button>
      </div>
      <p className={styles.account}>Connected account: {account}</p>
      <p className={styles.network}>Network: {networkName} (Chain ID: {chainId})</p>
      <p className={styles.balance}>Balance: {balance} ETH</p>
      <div className={styles.inputContainer}>
        <select
          value={selectedTicket}
          onChange={(e) => setSelectedTicket(e.target.value as TicketType)}
          className={styles.select}
        >
          {TICKET_OPTIONS.map((ticket) => (
            <option key={ticket.type} value={ticket.type}>
              {ticket.name} - ${ticket.price}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleStake} className={styles.button}>
          Stake Amount
        </button>
        <button onClick={handleSupport} className={styles.button}>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default TradingInterface;
