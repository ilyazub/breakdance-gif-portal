import { PublicKey, Connection, ConfirmOptions } from "@solana/web3.js";
import { Program, Provider, Wallet, web3 } from "@project-serum/anchor";

import type { SolanaGifPortal } from "./solana_gif_portal";
import { IDL } from "./solana_gif_portal";
import idl from "./idl.json";
import kp from "./keypair.json";

const { SystemProgram, Keypair } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
let baseAccount = Keypair.fromSecretKey(secret);

const programID = new PublicKey(idl.metadata.address);

const opts = {
  preflightCommitment: "processed",
  commitment: "processed",
};

const getProvider = (connection: Connection, wallet: Wallet) => {
  const provider = new Provider(connection, wallet, opts as ConfirmOptions);

  return provider;
};

export const createGifAccount = async (
  connection: Connection,
  wallet: Wallet
) => {
  try {
    const provider = getProvider(connection, wallet);
    const program = new Program(IDL, programID, provider);
    console.log("ping");

    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    console.log(
      "Created a new BaseAccount w/ address:",
      baseAccount.publicKey.toString()
    );
  } catch (error) {
    console.error("Error creating BaseAccount:", error);
  }
};

export const sendGif = async (
  connection: Connection,
  wallet: Wallet,
  gifLink: string
) => {
  if (gifLink.length === 0) {
    console.log("Empty input. Try again.");
    return;
  }

  try {
    const provider = getProvider(connection, wallet);
    const program = new Program(IDL, programID, provider);

    await program.rpc.addGif(gifLink, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    console.log("GIF successfully sent to program:", gifLink);
  } catch (error) {
    console.error("Error sending GIF:", error);
  }

  console.log("GIF link:", gifLink);
};

export const handleUpvote = async (
  connection: Connection,
  wallet: Wallet,
  gifLink: string
) => {
  try {
    const provider = getProvider(connection, wallet);
    const program = new Program(IDL, programID, provider);

    await program.rpc.upvoteGif(gifLink, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    console.log("GIF successfully upvoted:", gifLink);
  } catch (error) {
    console.error("Error upvoting GIF:", error);
  }
};

export const handleTip = async (
  connection: Connection,
  wallet: Wallet,
  receiverPubkey: string,
  amount: number
) => {
  try {
    const provider = getProvider(connection, wallet);
    const program = new Program(IDL, programID, provider);

    // Number#toString is used to handle floats
    await program.rpc.tip(amount.toString(), {
      accounts: {
        from: provider.wallet.publicKey,
        to: receiverPubkey,
        systemProgram: SystemProgram.programId,
      },
    });
  } catch (error) {
    console.error("Error sending tip:", error);
  }
};

export const getGifList = async (
  connection: Connection,
  wallet: Wallet
): SolanaGifPortal.ItemStruct[] => {
  try {
    const provider = getProvider(connection, wallet);
    const program = new Program(IDL, programID, provider);
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );

    console.log("Got the account", account);

    return account.gifList;
  } catch (error) {
    console.error("Error while fetching gifs: ", error);
  }
};
