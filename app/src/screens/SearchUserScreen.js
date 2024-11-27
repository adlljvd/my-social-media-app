import React, { useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";



const SEARCH_USERS = gql`
    query SearchUsers($keyword: String) {
        searchUsers(keyword: $keyword) {
            _id
            name
            username
            email
            followerDetails {
            _id
            name
            username
            }
            followingDetails {
            _id
            name
            username
            }
        }
    }
`

const FOLLOW_USER = gql`
    mutation FollowUser($followingId: ID!) {
        followUser(followingId: $followingId) {
            message
        }
    }
`;

const MY_PROFILE = gql`
    query myProfile {
        myProfile {
            _id
            name
            username
            email
            followingDetails {
                _id
                username
            }
        }
    }
`;

export default function SearchUserScreen() {
    const [keyword, setKeyword] = useState("");
    const { data: myProfileData, loading: myProfileLoading, error: myProfileError } = useQuery(MY_PROFILE, {
        fetchPolicy: "network-only"
    });
    const navigation = useNavigation();
    console.log(myProfileData, "profile data di search")
    console.log(myProfileLoading, "profile loading di search")
    console.log(myProfileError, "profile error di search")
    const [searchUsers, { loading, data, error }] = useLazyQuery(SEARCH_USERS);
    const [followUser, { data: followData, loading: followLoading, error: followError }] = useMutation(FOLLOW_USER, {
        onCompleted: (data) => {
            if (data.followUser.message) {
                alert(data.followUser.message);
            }
        },
        refetchQueries: [{ query: SEARCH_USERS, variables: { keyword } }],
    })

    const handleSearch = () => {
        if (keyword.trim() === "") return;
        searchUsers({ variables: { keyword } });
    };

    const handleFollow = (userIdToFollow) => {
        followUser({
            variables: { followingId: userIdToFollow },
            refetchQueries: [{ query: SEARCH_USERS, variables: { keyword } }, { query: MY_PROFILE }],
        }).catch((err) => {
            console.error(err);
            alert(err.message || "An error occurred while trying to follow the user.");
        });
    };

    const handleUserClick = (userId) => {
        navigation.navigate("UserProfile", { userId });
    };

    console.log(followError, "<<<follow error")
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for users..."
                value={keyword}
                onChangeText={setKeyword}
                onSubmitEditing={handleSearch}
            />
            {loading && <Text style={styles.loadingText}>Loading...</Text>}
            {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

            <FlatList
                data={data?.searchUsers || []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleUserClick(item._id)}
                    >
                        <View style={styles.userCard}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userUsername}>@{item.username}</Text>
                            <Text style={styles.details}>
                                Followers: {item.followerDetails?.length || 0} | Following: {item.followingDetails?.length || 0}
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.followButton,
                                    myProfileData?.myProfile?.followingDetails.some(f => f._id === item._id) && styles.followedButton,
                                ]}
                                onPress={() => {
                                    if (!myProfileData?.myProfile?.followingDetails.some(f => f._id === item._id)) {
                                        handleFollow(item._id);
                                    }
                                }}
                            >
                                <Text style={styles.followButtonText}>
                                    {myProfileData?.myProfile?.followingDetails.some(f => f._id === item._id) ? "Followed" : "Follow"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !loading && keyword.trim() && <Text>No users found.</Text>
                }

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#000",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: "#fff",
        backgroundColor: "#1a1a1a",
    },
    loadingText: {
        color: "#fff",
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        marginTop: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    userCard: {
        padding: 15,
        backgroundColor: "#1a1a1a",
        marginBottom: 10,
        borderRadius: 8,
    },
    userName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    userUsername: {
        color: "gray",
        marginBottom: 5,
    },
    userEmail: {
        color: "gray",
        marginBottom: 5,
    },
    details: {
        color: "#fff",
        fontSize: 14,
    },
    followButton: {
        backgroundColor: "#90306f",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 5
    },
    followedButton: {
        backgroundColor: "#c17388",
    },
    followButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
