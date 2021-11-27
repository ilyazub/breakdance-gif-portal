const fs = require("fs");
const anchor = require("@project-serum/anchor");

const account = anchor.web3.Keypair.generate();

fs.writeFileSync(__dirname + "/keypair.json", JSON.stringify(account));
