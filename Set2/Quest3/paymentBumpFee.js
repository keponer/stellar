const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

const keypair = StellarSdk.Keypair.fromSecret(KEY1);
const keypar_pay = StellarSdk.Keypair.fromSecret(KEY2);
const keypar_fees = StellarSdk.Keypair.fromSecret(KEY3)
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
                        destination: keypar_pay.publicKey(),
                        asset: StellarSdk.Asset.native(),
                        amount: "10"
                    })
                );
    const tx = transaction.build();

    tx.sign(keypair);

    var bump = StellarSdk.TransactionBuilder.buildFeeBumpTransaction(keypar_fees,
                                                    "200",
                                                    tx,
                                                    StellarSdk.Networks.TESTNET)
    bump.sign(keypar_fees);
    return server.submitTransaction(bump)
                .then(
                    res => { console.log('Success! Account Created.') },
                    err => { console.log(err.response.data) }
                )
  }
);
