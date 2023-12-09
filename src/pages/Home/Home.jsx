import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import Safe, { SafeFactory, EthersAdapter } from "@safe-global/protocol-kit";

const Home = () => {
  const {
    safeAuthPack,
    safeAuthSignInResponse,
    setSafeAuthSignInResponse,
    setIsAuthenticated,
  } = useContext(AuthContext);

  const login = async () => {
    const signInInfo = await safeAuthPack?.signIn();

    setSafeAuthSignInResponse(signInInfo);
    setIsAuthenticated(true);

    if (signInInfo?.eoa) {
      console.log("Deploying Safe");
      deploySafe(signInInfo?.eoa);
    }
  };

  console.log(safeAuthSignInResponse);

  const logout = async () => {
    await safeAuthPack?.signOut();

    setSafeAuthSignInResponse(null);
  };

  const deploySafe = async (owner) => {
    console.log(owner);
    const provider = new ethers.providers.Web3Provider(
      safeAuthPack?.getProvider()
    );

    const signer = provider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const owners = [owner];

    const threshold = 1;

    const safeAccountConfig = {
      owners,
      threshold,
    };

    const safe = await safeFactory.deploySafe({
      safeAccountConfig,
    });

    console.log(safe);
    console.log("Safe deployed");

    const safeAddress = await safe.getAddress();

    const safeAmount = ethers.parseUnits("0.01", "ether").toHexString();

    const transactionParameters = {
      to: safeAddress,
      value: safeAmount,
    };

    const owner1Signer = new ethers.Wallet(
      new ethers.Wallet(import.meta.env.VITE_OWNER_1_PRIVATE_KEY, provider)
    );

    const tx = await owner1Signer.sendTransaction(transactionParameters);

    console.log(tx);
  };

  return (
    <>
      <div>
        {safeAuthSignInResponse?.eoa ? (
          <>
            <button onClick={logout}>Sign Out</button>
            <p>{safeAuthSignInResponse?.eoa}</p>
          </>
        ) : (
          <button onClick={login}>Sign In</button>
        )}
      </div>
      <div>
        <ConnectButton
          label="Sign In "
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>
    </>
  );
};

export default Home;
