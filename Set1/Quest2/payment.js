const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

const keypair = StellarSdk.Keypair.fromSecret(KEY1);
const keypar_signer = StellarSdk.Keypair.fromSecret(KEY2);
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
                    StellarSdk.Operation.payment({
                        destination: keypar_signer.publicKey(),
                        asset: StellarSdk.Asset.native(),
                        amount: "10"
                    })
                );
    const tx = transaction.build();
    tx.sign(...signers);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! Payed.') },
                    err => { console.log(err.response.data) }
                )
  }
);
