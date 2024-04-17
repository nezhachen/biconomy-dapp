import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import {
  createSmartAccountClient,
  BiconomySmartAccountV2
} from "@biconomy/account";
import { ethers } from "ethers";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);

  const bundlerUrl = "https://bundler.biconomy.io/api/v2/42161/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
  const paymasterApiKey = "paymasterApiKey";

  const connect = async () => {
    // @ts-ignore
    const { ethereum } = window;
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
      setProvider(provider);
      const signer = provider.getSigner();
      let biconomySmartAccount = await createSmartAccountClient({
        signer,
        bundlerUrl,
        biconomyPaymasterApiKey: paymasterApiKey,
      });
      setAddress(await biconomySmartAccount.getAccountAddress());
      setSmartAccount(biconomySmartAccount);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Session Keys</title>
        <meta name="description" content="Build a dApp powered by session keys" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Session Keys Demo</h1>
        <h2>Connect and transfer ERC20 tokens without signing on each transfer</h2>
        {!loading && !address && <button onClick={connect} className={styles.connect}>Connect to Web3</button>}
        {loading && <p>Loading Smart Account...</p>}
        {address && <h2>Smart Account: {address}</h2>}
      </main>
    </>
  );
}
