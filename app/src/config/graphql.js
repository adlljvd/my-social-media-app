import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { setContext } from "@apollo/client/link/context";


const httpLink = createHttpLink({
    // uri: "https://26c0-27-50-29-117.ngrok-free.app",
    uri: "https://x-app.adellajava.tech/",
});

const authLink = setContext((_, { headers }) => {
    const access_token = SecureStore.getItem("access_token");

    return {
        headers: {
            ...headers,
            authorization: access_token ? `Bearer ${access_token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;

// import { ApolloClient, InMemoryCache } from "@apollo/client";

// const client = new ApolloClient({
//     uri: "https://e03c-27-50-29-117.ngrok-free.app",
//     cache: new InMemoryCache(),
// });

// export default client;
