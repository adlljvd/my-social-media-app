import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import profile from "../assets/profile.jpg";

export default function FollowersFollowingScreen({ route }) {
    const { followers, following } = route.params;

    const Followers = () => (
        <FlatList
            data={followers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <View style={styles.userCard}>
                    <Image source={profile} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userUsername}>@{item.username}</Text>
                    </View>
                    <Text style={styles.actionText}>Follows you</Text>
                </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No followers yet.</Text>}
        />
    );

    const Following = () => (
        <FlatList
            data={following}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <View style={styles.userCard}>
                    <Image source={profile} style={styles.avatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userUsername}>@{item.username}</Text>
                    </View>
                    <Text style={styles.actionText}>Following</Text>
                </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Not following anyone yet.</Text>}
        />
    );

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "followers", title: "Followers" },
        { key: "following", title: "Following" },
    ]);

    const renderScene = SceneMap({
        followers: Followers,
        following: Following,
    });

    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get("window").width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: "#90306f" }} // Change the indicator color here
                        style={{ backgroundColor: "black" }} // Change the tab bar background color
                        activeColor="#90306f" // Change the active tab text color
                        inactiveColor="gray"
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#1a1a1a",
        borderRadius: 8,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    userUsername: {
        color: "gray",
        marginBottom: 5,
    },
    actionText: {
        color: "#fff",
        backgroundColor: "#90306f",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    emptyText: {
        color: "gray",
        textAlign: "center",
        marginTop: 20,
    },
});
