import React, { useState } from 'react';
import styles from './TradingInterface.module.css';

interface TradingInterfaceProps {
  account: string;
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

const TradingInterface: React.FC<TradingInterfaceProps> = ({ account }) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketType>('GA');

  const handleSwap = () => {
    const ticket = TICKET_OPTIONS.find(t => t.type === selectedTicket);
    console.log(`Staking $${ticket?.price} for ${ticket?.name} ticket from account ${account}`);
  };

  const handleApprove = () => {
    const ticket = TICKET_OPTIONS.find(t => t.type === selectedTicket);
    console.log(`Approving $${ticket?.price} for ${ticket?.name} ticket`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create NFT Ticket</h2>
      <p className={styles.account}>Connected account: {account}</p>
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
        <button onClick={handleSwap} className={styles.button}>
          Swap to DAI
        </button>
      </div>
    </div>
  );
};

export default TradingInterface;
