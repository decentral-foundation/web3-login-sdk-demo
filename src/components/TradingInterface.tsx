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
  '1337': 'Local Network',
};

const TradingInterface: React.FC<TradingInterfaceProps> = ({ account, onLogout }) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketType>('GA');
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<string>('');
  const [networkName, setNetworkName] = useState<string>('');

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
        } catch (error) {
          console.error('Error fetching network:', error);
          setChainId('Error');
          setNetworkName('Unknown');
        }
      }
    };

    const getBalance = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balanceWei = await provider.getBalance(account);
          const balanceEth = ethers.formatEther(balanceWei);
          setBalance(parseFloat(balanceEth).toFixed(4));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('Error');
        }
      }
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

  const handleSupport = () => {
    console.log("expect lucia sdk call to be made");
    const ticket = TICKET_OPTIONS.find(t => t.type === selectedTicket);
    console.log(`Staking $${ticket?.price} for ${ticket?.name} ticket from account ${account}`);
  };

  const handleApprove = () => {
    const ticket = TICKET_OPTIONS.find(t => t.type === selectedTicket);
    console.log(`Approving $${ticket?.price} for ${ticket?.name} ticket`);
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
        <button onClick={handleApprove} className={styles.button}>
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
