import * as mpl from "@metaplex-foundation/mpl-token-metadata";
import * as web3 from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';

export function loadWalletKey(keypairFile: string): web3.Keypair {
    const fs = require("fs");
    const loaded = web3.Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())),
    );
    return loaded;
}

const INITIALIZE = false;

async function main() {
    console.log("let's name some tokens!");
    const myKeypair = loadWalletKey("milkTeaCoin/4GdSRE4Sjhmv1cJUWTBCsmutH63zsMjKCwZBCqCDn7tK.json");
    const mint = new web3.PublicKey("B96wMxdg5LWvRy9fhXdVS4hhyUYokPKnwN4xvQNuts57");
    const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
    const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());
    const seed3 = Buffer.from(mint.toBytes());
    const [metadataPDA, _bump] = web3.PublicKey.findProgramAddressSync([seed1, seed2, seed3], mpl.PROGRAM_ID);
    const accounts = {
        metadata: metadataPDA,
        mint,
        mintAuthority: myKeypair.publicKey,
        payer: myKeypair.publicKey,
        updateAuthority: myKeypair.publicKey,
    }
    const dataV2 = {
        name: "Milk Tea Coin",
        symbol: "MTC",
        uri: "https://gateway.pinata.cloud/ipfs/QmetuHg3GAtu7QFWsBxbqsGXjW6REe1FtC3mPVe3J8PXFw",
        // we don't need that
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
    }
    let ix;
    if (INITIALIZE) {
        const args = {
            createMetadataAccountArgsV2: {
                data: dataV2,
                isMutable: true
            }
        };
        ix = mpl.createCreateMetadataAccountV2Instruction(accounts, args);
    } else {
        const args = {
            updateMetadataAccountArgsV2: {
                data: dataV2,
                isMutable: true,
                updateAuthority: myKeypair.publicKey,
                primarySaleHappened: true
            }
        };
        ix = mpl.createUpdateMetadataAccountV2Instruction(accounts, args)
    }
    console.log(ix);
    const tx = new web3.Transaction().add(ix);
    const connection = new web3.Connection("https://api.testnet.solana.com");
    const txid = await web3.sendAndConfirmTransaction(connection, tx, [myKeypair]);
    console.log(txid);

}

main();