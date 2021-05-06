const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

const keypair = StellarSdk.Keypair.fromSecret(KEY1);
const keypar_fees = StellarSdk.Keypair.fromSecret(KEY2);
const keypar_CustomerAccount = StellarSdk.Keypair.fromSecret(KEY3);
// const signers = [keypar_signer]
server.loadAccount(keypar_fees.publicKey())
.then (
  acc => {
    // console.log(acc);
    const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
                                                                 timebounds:  { minTime: "0" ,
                                                                                maxTime: "0" },
                                                                networkPassphrase: StellarSdk.Networks.TESTNET });
    transaction.addOperation(
                    StellarSdk.Operation.payment({
                        destination: keypar_CustomerAccount.publicKey(),
                        asset: StellarSdk.Asset.native(),
                        amount: "10",
                        source: keypair.publicKey()
                    })
                );
    const tx = transaction.build();
    tx.sign(keypair);
    tx.sign(keypar_fees);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! Payment sent.') },
                    err => { console.log(err.response.data) }
                )
  }
).catch (
  err => {
    console.log(err);
  }
);
