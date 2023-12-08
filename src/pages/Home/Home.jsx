import { useContext } from "react";
import { ethers } from "ethers";
import { AuthContext } from "../../context/auth";
import Safe, { SafeFactory, EthersAdapter } from "@safe-global/protocol-kit";

const Home = () => {
  const {
    safeAuthPack,
    safeAuthSignInResponse,
    setSafeAuthSignInResponse,
    setIsAuthenticated,
  } = useContext(AuthContext);

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
  };

  const login = async () => {
    const signInInfo = await safeAuthPack?.signIn();

    setSafeAuthSignInResponse(signInInfo);
    setIsAuthenticated(true);

    console.log("Deploying Safe");
    const res = await deploySafe(signInInfo?.eoa);
    console.log(res);
  };

  const logout = async () => {
    await safeAuthPack?.signOut();

    setSafeAuthSignInResponse(null);
  };
  return (
    <>
      {safeAuthSignInResponse?.eoa ? (
        <>
          <button onClick={logout}>Sign Out</button>
          <p>{safeAuthSignInResponse?.eoa}</p>
        </>
      ) : (
        <button onClick={login}>Sign In</button>
      )}
    </>
  );
};

export default Home;
