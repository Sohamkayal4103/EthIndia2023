import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { Button } from "@chakra-ui/react";
import { ethers } from "ethers";

export default function DAOStorage() {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY;

  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length === 0) {
          throw new Error("No accounts returned from Wallet.");
        }
        const signerAddress = accounts[0];
        const { message } = (await lighthouse.getAuthMessage(signerAddress))
          .data;
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, signerAddress],
        });
        return { signature, signerAddress };
      } catch (error) {
        console.error("Error signing message with Wallet", error);
        return null;
      }
    } else {
      console.log("Please install Wallet!");
      return null;
    }
  };

  // Function to upload the encrypted file
  const uploadEncryptedFile = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      // This signature is used for authentication with encryption nodes
      // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
      const encryptionAuth = await signAuthMessage();
      if (!encryptionAuth) {
        console.error("Failed to sign the message.");
        return;
      }

      const { signature, signerAddress } = encryptionAuth;

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        file,
        apiKey,
        signerAddress,
        signature
      );
      console.log("Encrypted File Status:", output);
      /* Sample Response
        {
          data: [
            Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
            Name: "izanami.jpeg",
            Size: "174111"
          ]
        }
      */
      // If successful, log the URL for accessing the file
      const hash = output.data[0].Hash;
      setCid(hash);

      console.log(
        `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
      );

      accessControl(hash);
    } catch (error) {
      console.error("Error uploading encrypted file:", error);
    }
  };

  const accessControl = async (cid) => {
    const conditions = [
      {
        id: 1,
        chain: "Calibration",
        method: "balanceOf",
        standardContractType: "ERC20",
        contractAddress: "0x45C5fC779aE3E05bd9403721E3482DFAE23261c6",
        returnValueTest: {
          comparator: ">=",
          value: "130",
        },
        parameters: [":userAddress"],
      },
    ];
    const aggregator = "([1])";

    const signedMessage = await signAuthMessage();
    console.log(cid);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const publicKey = accounts[0];
    const response = await lighthouse.applyAccessCondition(
      publicKey,
      cid,
      signedMessage.signature,
      conditions,
      aggregator
    );

    console.log(response);
  };

  const accessConditions = async () => {
    const cid = "QmcmyVSBaK3Z7fGdeinfizcuetFPC8bNk21NAmgTL2BBae"; // Replace with your file's CID
    const response = await lighthouse.getAccessConditions(cid);

    // Print the access conditions
    console.log(response);
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
      <Button onClick={uploadEncryptedFile} disabled={!file} m="2%">
        Upload Encrypted File
      </Button>
      <Button onClick={accessConditions} disabled={!file} m="2%">
        View conditions
      </Button>
    </div>
  );
}
