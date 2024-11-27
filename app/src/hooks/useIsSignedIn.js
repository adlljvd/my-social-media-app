import { useContext } from "react";
import AuthContext from "../contexts/AuthContext.js";

export default function useIsSignedIn() {
    const authContext = useContext(AuthContext);

    return authContext.isLogin;
}
