const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

// Keys for accounts to issue and receive the new asset
var issuingKeys = StellarSdk.Keypair.fromSecret(
  KEY1,
);
var receivingKeys = StellarSdk.Keypair.fromSecret(
  KEY2,
);
const signers = [receivingKeys];

var banana = new StellarSdk.Asset("Banana2", issuingKeys.publicKey());

server.loadAccount(receivingKeys.publicKey())
.then (
  acc => {
    // console.log(acc);
    const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
                                                                 timebounds:  { minTime: "0" ,
                                                                                maxTime: "0" },
                                                                networkPassphrase: StellarSdk.Networks.TESTNET });
    transaction.addOperation(
                    StellarSdk.Operation.manageSellOffer({
                        selling: banana,
                        buying: StellarSdk.Asset.native(),
                        amount: "2",
                        price: {
                          n: 1,
                          d: 2
                        }
                    })
                );
    const tx = transaction.build();
    tx.sign(receivingKeys);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! Sell created.') },
                    err => { console.log(err.response.data) }
                )
  }
);
