const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

const keypair = StellarSdk.Keypair.fromSecret(KEY);
const signers = [keypair]
server.loadAccount(keypair.publicKey())
.then (
  acc => {
    // console.log(acc);
    const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
                                                                 timebounds:  { minTime: "0" ,
                                                                                maxTime: "0" },
                                                                networkPassphrase: StellarSdk.Networks.TESTNET });
    transaction.addOperation(
                    StellarSdk.Operation.setOptions({
                        signer:  {
                          sha256Hash: HAS1,
                          weight: 0
                        }
                    })
                );
    const tx = transaction.build();
    // tx.sign(keypair);
    tx.signHashX(HASH2);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! Signer added') },
                    err => { console.log(err.response.data) }
                )
  }
);
