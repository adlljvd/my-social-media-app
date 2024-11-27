// src/screens/CreatePost.js
import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { GET_POSTS } from './HomeScreen.js'
import { useNavigation } from "@react-navigation/native";



const ADD_POST = gql`
    mutation AddPost($newPost: PostInput!) {
        addPost(newPost: $newPost) {
            message
        }
    }
`;

export default function CreatePost() {
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const navigation = useNavigation();

    const [addPost, { data, loading, error }] = useMutation(ADD_POST, {
        refetchQueries: [{ query: GET_POSTS }], // Ensure the query matches
        onCompleted: () => {
            navigation.navigate("Home");
        },
    });

    const handleAdd = () => {
        addPost({
            variables: {
                newPost: {
                    content,
                    tags: tags.split(" "),
                    imgUrl,
                },
            },
        });
    };

    useEffect(() => {
        if (data) {
            Alert.alert(
                "Post Added Successfully!",
                "",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Home"),
                    },
                ]
            );
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Content:</Text>
            <TextInput
                style={[styles.input, styles.inputContent]}
                placeholder="Write your post content..."
                value={content}
                onChangeText={setContent}
                multiline
            />

            <Text style={styles.label}>Tags (separated by spaces):</Text>
            <TextInput
                style={styles.input}
                placeholder="#example #tag"
                value={tags}
                onChangeText={setTags}
            />

            <Text style={styles.label}>Image URL:</Text>
            <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={imgUrl}
                onChangeText={setImgUrl}
            />

            <TouchableOpacity style={styles.postButton} onPress={handleAdd}>
                <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>

            {error && <Text style={styles.error}>Error: {error.message}</Text>}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#000",
        justifyContent: 'flex-start',

    },
    label: {
        color: "#fff",
        marginVertical: 10,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#1a1a1a",
        color: "#fff",
        marginBottom: 20,
    },
    inputContent: {
        height: 60
    },
    error: {
        color: "red",
        marginTop: 10,
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    postButton: {
        backgroundColor: "#90306f",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    postButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        alignItems: "center",
    }
});
