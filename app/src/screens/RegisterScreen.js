import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const REGISTER = gql`
    mutation Register($newUser: RegisterInput) {
        register(newUser: $newUser) {
            message
        }
    }
`;

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [register, { data, loading, error }] = useMutation(REGISTER);

    const [input, setInput] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const handleRegister = () => {
        register({
            variables: {
                newUser: input,
            },
        });
    };

    useEffect(() => {
        if (data) {
            Alert.alert(
                "Registration Successful",
                "Please login!",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Login"),
                    },
                ]
            );
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#aaa"
                value={input.name}
                onChangeText={(text) =>
                    setInput({
                        ...input,
                        name: text,
                    })
                }
            />

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={input.username}
                onChangeText={(text) =>
                    setInput({
                        ...input,
                        username: text,
                    })
                }
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={input.email}
                onChangeText={(text) =>
                    setInput({
                        ...input,
                        email: text,
                    })
                }
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={input.password}
                onChangeText={(text) =>
                    setInput({
                        ...input,
                        password: text,
                    })
                }
                secureTextEntry
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {error && <Text style={{ color: 'red', marginTop: 10 }}>Error: {error.message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    registerButton: {
        backgroundColor: '#90306f',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
