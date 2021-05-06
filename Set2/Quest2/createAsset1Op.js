const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

// Keys for accounts to issue and receive the new asset
var receivingKeys = StellarSdk.Keypair.fromSecret(
  KEY1,
);
var issuingKeys = StellarSdk.Keypair.fromSecret(
  KEY2,
);
const signers = [receivingKeys];

var banana = new StellarSdk.Asset("Banana", issuingKeys.publicKey());

server.loadAccount(receivingKeys.publicKey())
.then (
  acc => {
    // console.log(acc);
    const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
                                                                 timebounds:  { minTime: "0" ,
                                                                                maxTime: "0" },
                                                                networkPassphrase: StellarSdk.Networks.TESTNET });
    transaction.addOperation(
                    StellarSdk.Operation.changeTrust({
                        asset: banana,
                        limit: "10000"
                    })
                );
    transaction.addOperation(
                      StellarSdk.Operation.payment({
                        destination: receivingKeys.publicKey(),
                        asset: banana,
                        amount: "1000",
                      })
    );
    const tx = transaction.build();
    tx.sign(receivingKeys);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! Account Created.') },
                    err => { console.log(err.response.data) }
                )
  }
)
// .then(
//   () => {
//      return server.loadAccount(issuingKeys.publicKey());
//   }
// )
// .then(
//   acc => {
//     const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
//                                                                timebounds:  { minTime: "0" ,
//                                                                               maxTime: "0" },
//                                                               networkPassphrase: StellarSdk.Networks.TESTNET });
//     transaction.addOperation(
//                       StellarSdk.Operation.payment({
//                         destination: receivingKeys.publicKey(),
//                         asset: banana,
//                         amount: "1000",
//                       })
//     );
//     const tx = transaction.build();
//     tx.sign(issuingKeys);
//     return server.submitTransaction(tx)
//                 .then(
//                     res => { console.log('Success! Account Created.') },
//                     err => { console.log(err.response.data) }
//                 );
//   }
// )
