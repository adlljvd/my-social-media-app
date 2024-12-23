import { useContext } from "react";
import AuthContext from "../contexts/AuthContext.js";

export default function useIsSignedOut() {
    const authContext = useContext(AuthContext);

    return !authContext.isLogin;
}
