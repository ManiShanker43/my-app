import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram,PublicKey,Transaction ,sendAndConfirmTransaction} from "@solana/web3.js";
import { useState } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

function App() {
  const [toadd, setToadd] = useState('');
  const [fromadd, setFromadd] = useState('');
  const [KeyPair, setKeyPair] = useState(null);

  const con = new Connection(clusterApiUrl('devnet', 'confirmed'));

  const CreateKeyPair = async () => {
    try {
      const keyPair = Keypair.generate();
      setKeyPair(keyPair);
      setFromadd(keyPair.publicKey.toBase58());
      await con.requestAirdrop(new PublicKey(keyPair.publicKey), 2 * LAMPORTS_PER_SOL);
      console.log("Airdropped 2 Sol");
    } catch (err) {
      console.error(err);
    }
  }

  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        setToadd(response.publicKey.toString());
        console.log(`wallet Connected : ${toadd}`);
      } catch (err) {
        console.log(err);
        alert(err);
      }
    }
  };

  const TransferSOL = async () => {
    console.log("Transfer method invoked");
    if (fromadd && toadd && KeyPair) {
      console.log(` 
      trying a transaction ...............
          From Wallet : ${fromadd}
          To Wallet   : ${toadd} 
          amount      : 1 SOL 
      `)
      try {
        const transaction = new Transaction();
        const instruction = SystemProgram.transfer({
          fromPubkey: new PublicKey(fromadd),
          toPubkey: new PublicKey(toadd),
          lamports: 1 * LAMPORTS_PER_SOL,
        });
        transaction.add(instruction);

        const signature = await sendAndConfirmTransaction(
          con,
          transaction,
          [KeyPair], // Assuming KeyPair contains the private key for signing
          {
            commitment: 'confirmed', // or 'processed'
          }
        );

        console.log('Transaction Signature:', signature);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("FromAdd or ToAdd fields are null");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button type="submit" onClick={CreateKeyPair}>Create a new Solana account</button>
        <button type="submit" onClick={connectWallet}>Connect to Phantom Wallet</button>
        <button type="submit" onClick={TransferSOL}>Transfer SOL to New Wallet</button>
      </header>
    </div>
  );
}

export default App;
