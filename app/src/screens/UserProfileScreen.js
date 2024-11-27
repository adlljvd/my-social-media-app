import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import profile from "../assets/profile.jpg";

const GET_USER_PROFILE = gql`
    query UserProfile($userId: String!) {
        userProfile(id: $userId) {
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
`;

export default function UserProfileScreen({ route }) {
    const { userId } = route.params;
    const navigation = useNavigation();
    const { data, loading, error } = useQuery(GET_USER_PROFILE, {
        variables: { userId },
    });

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    const { userProfile } = data;
    console.log(userProfile, "<<<user prfile")

    return (
        <View style={styles.profileContainer}>
            <Image source={profile} style={styles.profileAvatar} />
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileUsername}>@{userProfile.username}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            <View style={styles.profileStats}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("FollowList", {
                            followers: userProfile.followerDetails,
                            following: userProfile.followingDetails,
                        })
                    }
                >
                    <Text style={styles.profileStatText}>
                        Followers
                    </Text>
                    <Text style={styles.profileFollowText}>
                        {"       "}{userProfile.followerDetails?.length || 0}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("FollowList", {
                            followers: userProfile.followerDetails,
                            following: userProfile.followingDetails,
                        })
                    }
                >
                    <Text style={styles.profileStatText}>
                        Following
                    </Text>
                    <Text style={styles.profileFollowText}>
                        {"       "}{userProfile.followingDetails?.length || 0}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "black",
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    profileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    profileUsername: {
        fontSize: 16,
        color: "gray",
        marginBottom: 10,
    },
    profileEmail: {
        fontSize: 14,
        color: "gray",
        marginBottom: 20,
    },
    profileStats: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 20,
    },
    profileStatText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    profileFollowText: {
        fontSize: 16,
        color: "#fff",
        justifyContent: "center",
        alignContent: "center"
    },
});
