import { useNavigation } from "@react-navigation/native";
import AuthContext from "../contexts/AuthContext.js"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { GET_POSTS } from './HomeScreen.js';


const LOGIN = gql`
    mutation Login($user: LoginInput) {
    login(user: $user) {
        access_token
    }
}
`

export default function Login() {
    const navigation = useNavigation()
    const authContext = useContext(AuthContext)
    const [loginFn, { data, loading, error }] = useMutation(LOGIN, {
        refetchQueries: [GET_POSTS]
    })

    console.log(data, "<< login data")
    console.log(loading, "<< login loading")

    useEffect(() => {
        const access_token = SecureStore.getItem("access_token")
        // console.log(access_token, "<<<accesstoken")
        if (access_token) {
            authContext.setIsLogin(true)
        }
    }, [])

    useEffect(() => {
        if (data) {
            SecureStore.setItem("access_token", data.login.access_token)
            authContext.setIsLogin(true)
        }
    }, [data])

    const [input, setInput] = useState({
        username: "",
        password: ""
    })

    const handleLogin = () => {
        loginFn({
            variables: {
                user: input
            }
        })
    }

    return (
        < View style={styles.container} >
            <Text style={styles.title}>Log in to X</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={input.username}
                onChangeText={(text) => {
                    setInput({
                        ...input,
                        username: text
                    })
                }}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={input.password}
                onChangeText={(text) => {
                    setInput({
                        ...input,
                        password: text
                    })
                }}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            {error && <Text style={{ color: 'red', marginTop: 10 }}>Error: {error.message}</Text>}

            <View style={styles.bottomBanner}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerBannerText}>Don't have an account? Register</Text>
                </TouchableOpacity>
            </View>

        </View >

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: "flex-start",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50
    },
    input: {
        width: '100%',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    loginButton: {
        backgroundColor: '#90306f',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#c17388',
        marginTop: 15,
        fontSize: 14,
    },
    bottomBanner: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 50
    },
    registerBannerText: {
        color: '#90306f',
        fontSize: 16,
        fontWeight: 'bold',
    },
});