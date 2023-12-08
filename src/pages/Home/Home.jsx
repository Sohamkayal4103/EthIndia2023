import { useContext } from "react";
import { AuthContext } from "../../context/auth";

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
