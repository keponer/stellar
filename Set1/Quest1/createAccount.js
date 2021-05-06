const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); // const server = new StellarSdk.Server('https://horizon.stellar.org');

const starting_keypair = StellarSdk.Keypair.fromSecret(KEY1);
const creator_keypair = StellarSdk.Keypair.fromSecret(KEY2);
const signers = [creator_keypair]
server.loadAccount(creator_keypair.publicKey())
.then (
  acc => {
    // console.log(acc);
    const transaction = new StellarSdk.TransactionBuilder(acc, { fee: "100",
                                                                 timebounds:  { minTime: "0" ,
                                                                                maxTime: "0" },
                                                                networkPassphrase: StellarSdk.Networks.TESTNET });
    transaction.addOperation(
                    StellarSdk.Operation.createAccount({
                        destination: starting_keypair.publicKey(),
                        startingBalance: '1000' // xlm
                    })
                );
    const tx = transaction.build();
    tx.sign(...signers);
    return server.submitTransaction(tx)
                .then(
                    res => { console.log('Success! Account Created.') },
                    err => { console.log(err.response.data) }
                )
  }
);
