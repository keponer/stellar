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
                    StellarSdk.Operation.pathPaymentStrictSend({
                        destination: keypar_signer.publicKey(),
                        sendAsset: StellarSdk.Asset.native(),
                        sendAmount: "100",
                        destAsset: new StellarSdk.Asset(ASSET_NAME, PUBLIC_KEY),
                        destMin: "10",
                        path: [StellarSdk.Asset.native(), new StellarSdk.Asset(ASSET_NAME, PUBLIC_KEY)]
                    })
                );
    const tx = transaction.build();
    tx.sign(...signers);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! pathPaymentStrictSend.') },
                    err => { console.log(err.response.data.extras) }
                )
  }
);
