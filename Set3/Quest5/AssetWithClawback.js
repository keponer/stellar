const StellarSdk = require("stellar-sdk");

let server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

const A = StellarSdk.Keypair.fromSecret("SABBG4UGEFASF7V6COLFQMZ7WCTDJDOL536OZXUCHECX5SU7GIQ6K6QW");
const B = StellarSdk.Keypair.fromSecret("SACHZTVTHVJLDTO6IW7UNFILU66BPUKRYV2T4T4COBWGRWV7VGAFKVVR");
const C = StellarSdk.Keypair.fromSecret("SDQIXUBO7FIV234ISRFMHIOBATZYS4UAGGEP7S5WG3QPDHVKOBQTB65A");

const ASSET = new StellarSdk.Asset("MariusLenk", A.publicKey());

console.log("A")
/// Enables AuthClawbackEnabledFlag on an account.
function enableClawback(account, keys) {
console.log("A")
  return server.submitTransaction(buildTx(
    account, keys, [
      StellarSdk.Operation.setOptions({
        setFlags: StellarSdk.AuthClawbackEnabledFlag | StellarSdk.AuthRevocableFlag,
      }),
    ],
  ));
}

console.log("B")
/// Establishes a trustline for `recipient` for ASSET (from above).
const establishTrustline = function (recipient, key) {
console.log("B")
  return server.submitTransaction(buildTx(
    recipient, key, [
      StellarSdk.Operation.changeTrust({
        asset: ASSET,
        limit: "5000", // arbitrary
      }),
    ],
  ));
};


console.log("C")
/// Retrieves latest account info for all accounts.
function getAccounts() {
console.log("C")
  return Promise.all([
    server.loadAccount(A.publicKey()),
    server.loadAccount(B.publicKey()),
    server.loadAccount(C.publicKey()),
  ]);
}

console.log("D")
/// Enables clawback on A, and establishes trustlines from C, B -> A.
function preamble() {
console.log("D")
  return getAccounts().then(function (accounts) {
    let [ accountA, accountB, accountC ] = accounts;
    return enableClawback(accountA, A)
      .then(Promise.all([
        establishTrustline(accountB, B),
        establishTrustline(accountC, C),
      ])
    );
  });
}

console.log("E")
/// Helps simplify creating & signing a transaction.
function buildTx(source, signer, ops) {
console.log("E")
  var tx = new StellarSdk.TransactionBuilder(source, {
    fee: 100,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });
  ops.forEach((op) => tx.addOperation(op));
  tx = tx.setTimeout(30).build();
  tx.sign(signer);
  return tx;
}

/// Prints the balances of a list of accounts.
function showBalances(accounts) {
  accounts.forEach((acc) => {
    console.log(`${acc.accountId().substring(0, 5)}: ${getBalance(acc)}`);
  });
}

preamble();
