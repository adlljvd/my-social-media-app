import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import profile from '../assets/profile.jpg'

const ADD_COMMENT = gql`
mutation AddComment($newComment: CommentInput) {
  addComment(newComment: $newComment) {
    message
  }
}
`

const GET_POST_BY_ID = gql`
query PostById($postByIdId: String) {
  postById(id: $postByIdId) {
    _id
    content
    tags
    imgUrl
    authorId
    author {
      _id
      username
      name
      email
    }
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`

export default function PostDetailScreen({ route }) {
    const { postId } = route.params;
    const [comment, setComment] = useState("");

    const { data, loading, error } = useQuery(GET_POST_BY_ID, {
        variables: { postByIdId: postId },
    });

    const [addComment, { data: commentData, loading: commentLoading, error: commentError }] = useMutation(ADD_COMMENT, {
        refetchQueries: [{ query: GET_POST_BY_ID, variables: { postByIdId: postId } }],
        // refetchQueries: [{ query: GET_POSTS }],
    });



    const handleAddComment = () => {
        addComment({
            variables: {
                newComment: {
                    postId: postId,
                    content: comment,
                },
            },
        });
        setComment("");
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    const { postById } = data;

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.header}>
                <Image
                    source={profile}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.authorName}>{postById.author.name}</Text>
                    <Text style={styles.username}>
                        @{postById.author.username} ·{" "}
                        {/* {formatDistanceToNow(new Date(postById.createdAt), { addSuffix: true })} */}
                    </Text>
                </View>
            </View>

            <Text style={styles.postContent}>{postById.content}</Text>
            <Text style={styles.postContent}>{postById.tags}</Text>
            {postById.imgUrl && (
                <Image
                    source={{ uri: postById.imgUrl }}
                    style={styles.postImage} // Add this style
                />
            )}

            <FlatList
                data={postById.comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Text style={styles.commentUser}>{item.username}</Text>
                        <Text style={styles.commentContent}>{item.content}</Text>
                    </View>
                )}
            />

            <View style={styles.commentInputContainer}>
                <Image
                    source={{
                        profile
                    }}
                    style={styles.commentAvatar}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#666"
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAddComment}
                    disabled={commentLoading}
                >
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    authorName: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    username: {
        color: "gray",
    },
    postContent: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 15,
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    comment: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#1a1a1a",
        borderRadius: 8,
    },
    commentUser: {
        color: "#fff",
        fontWeight: "bold",
        marginRight: 10,
    },
    commentContent: {
        color: "#fff",
    },
    commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#333",
        paddingTop: 10,
        marginBottom: 30
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: "#1a1a1a",
        color: "#fff",
        height: 40,
    },
    button: {
        marginLeft: 10,
        backgroundColor: "#90306f",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});