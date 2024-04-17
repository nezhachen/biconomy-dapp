import {
    Hex,
    createWalletClient,
    encodeFunctionData,
    http,
    parseAbi,
    zeroAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { createSmartAccountClient } from "@biconomy/account";

const bundlerUrl =
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"; // Found at https://dashboard.biconomy.io

const privateKey = process.env.PRIVATE_KEY;

export const createAccountAndMintNft = async () => {
    // ----- 1. Generate EOA from private key
    const account = privateKeyToAccount(`0x${privateKey}`);
    const client = createWalletClient({
        account,
        chain: polygonMumbai,
        transport: http(),
    });
    const eoa = client.account.address;
    console.log(`EOA address: ${eoa}`);

    // ------ 2. Create biconomy smart account instance
    const smartAccount = await createSmartAccountClient({
        signer: client,
        bundlerUrl,
    });
    const saAddress = await smartAccount.getAccountAddress();
    console.log("SA Address", saAddress);
};
createAccountAndMintNft();