const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

const keypair = StellarSdk.Keypair.fromSecret(KEY1);
const keypar_payed = StellarSdk.Keypair.fromSecret(KEY2);
// const signers = [keypar_signer]
server.loadAccount(keypair.publicKey())
.then (
  acc => {
    // console.log(acc);
    const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
                                                                 timebounds:  { minTime: "0" ,
                                                                                maxTime: "0" },
                                                                networkPassphrase: StellarSdk.Networks.TESTNET });
    // transaction.addOperation(
    //                 StellarSdk.Operation.payment({
    //                     destination: keypar_payed.publicKey(),
    //                     asset: StellarSdk.Asset.native(),
    //                     amount: "10"
    //                 })
    //             );
    // transaction.addOperation(
    //                 StellarSdk.Operation.payment({
    //                     destination: keypar_payed.publicKey(),
    //                     asset: StellarSdk.Asset.native(),
    //                     amount: "10"
    //                 })
    //             );
    transaction.addOperation(
                    StellarSdk.Operation.bumpSequence({
                        bumpTo: BUMP_NUMBER
                    })
                );
    const tx = transaction.build();
    tx.sign(keypair);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! Account Created.') },
                    err => { console.log(err.response.data) }
                )
  }
)
// .then(
//   () => {
//      return server.loadAccount(keypair.publicKey());
//   }
// )
// .then(
//   acc => {
//     server.loadAccount(keypair.publicKey())
//     const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
//                                                                  timebounds:  { minTime: "0" ,
//                                                                                 maxTime: "0" },
//                                                                 networkPassphrase: StellarSdk.Networks.TESTNET });
//     transaction.addOperation(
//                     StellarSdk.Operation.bumpSequence({
//                         bumpTo: "3491310195441671"
//                     })
//                 );
//     const tx = transaction.build();
//     tx.sign(keypair);
//     return server.submitTransaction(tx)
//                 .then(
//                     res => { console.log('Success! Account Created.') },
//                     err => { console.log(err.response.data) }
//                 )
//   }
// );
