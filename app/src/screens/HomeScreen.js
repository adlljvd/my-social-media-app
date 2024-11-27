import React, { useContext, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap } from 'react-native-tab-view';
import MyTabBar from '../components/MyTabBar';
import AuthContext from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatDistanceToNow } from 'date-fns';
import profile from "../assets/profile.jpg";

const GET_POSTS = gql`
    query Posts {
        posts {
            _id
            content
            tags
            imgUrl
            author {
                _id
                username
                name
            }
            comments {
                content
            }
            likes {
                username
            }
            createdAt
        }
    }
`;

const ADD_LIKE = gql`
    mutation addLike($newLike: LikeInput) {
    addLike(newLike: $newLike) {
        message
    }
}
`

const MY_PROFILE = gql`
query myProfile($myProfileId: String) {
    myProfile(id: $myProfileId) {
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


const PostList = ({ data, handleAddLike, navigation, myProfileData }) => {
    const renderItem = ({ item }) => {
        // Convert createdAt date to relative time
        // const relativeTime = formatDistanceToNow(new Date(item.createdAt).toISOString(), { addSuffix: true })

        return (
            <TouchableOpacity onPress={() => navigation.navigate("PostDetail", { postId: item._id })}>
                <View style={styles.postContainer}>
                    <View style={styles.postHeader}>
                        <View style={styles.userInfo}>
                            <Image source={profile} style={styles.avatar} />
                            <View>
                                <Text style={styles.user}>{item.author.name}</Text>
                                {/* <Text style={styles.username}>{item.author.username} · {relativeTime}</Text> */}
                                <Text style={styles.username}>{item.author.username}</Text>
                            </View>
                        </View>
                        <Ionicons name="ellipsis-horizontal" size={20} color="gray" />
                    </View>
                    <Text style={styles.content}>{item.content}</Text>
                    <Text style={styles.actionText}>{item.tags}</Text>
                    {item.imgUrl && <Image source={{ uri: item.imgUrl }} style={styles.postImage} />}
                    <View style={styles.postActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("PostDetail", { postId: item._id })}>
                            <Ionicons name="chatbubble-outline" size={20} color="gray" />
                            <Text style={styles.actionText}>{item.comments.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="repeat" size={20} color="gray" />
                            <Text style={styles.actionText}>6K</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAddLike(item._id)} style={styles.likeButton}>
                            <Ionicons name="heart-outline" size={20} color={item.likes.some((like) => like.username === myProfileData.myProfile.username) ? "red" : "gray"} />
                            <Text style={styles.actionText}>{item.likes.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="eye-outline" size={20} color="gray" />
                            <Text style={styles.actionText}>23K</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item._id} />;
};



export default function HomeScreen() {
    const navigate = useNavigation();
    const authContext = useContext(AuthContext);
    const { data, loading, error } = useQuery(GET_POSTS, {
        fetchPolicy: "network-only",
    });

    const [addLike] = useMutation(ADD_LIKE, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const { data: myProfileData, loading: myProfileLoading, error: myProfileError } = useQuery(MY_PROFILE, {
        refetchQueries: [GET_POSTS],
        fetchPolicy: "network-only"
    })
    // console.log(myProfileData.myProfile.username, "<<<my profile")
    if (myProfileData && myProfileData.myProfile) {
        console.log(myProfileData.myProfile.username, "<<myProfile");
    } else {
        console.log("myProfileData is undefined or loading");
    }

    console.log(myProfileLoading, "<<my profile loading")
    console.log(myProfileError, "<<my profile error")

    const MyProfile = () => {
        if (myProfileLoading) return <Text>Loading...</Text>;
        if (myProfileError) return <Text>Error: {myProfileError.message}</Text>;

        const { myProfile } = myProfileData;

        return (
            <View style={styles.profileContainer}>
                <Image source={profile} style={styles.profileAvatar} />
                <Text style={styles.profileName}>{myProfile.name}</Text>
                <Text style={styles.profileUsername}>@{myProfile.username}</Text>
                <Text style={styles.profileEmail}>{myProfile.email}</Text>
                <View style={styles.profileStats}>
                    <TouchableOpacity
                        onPress={() =>
                            navigate.navigate("FollowList", {
                                followers: myProfile.followerDetails,
                                following: myProfile.followingDetails,
                            })
                        }
                    >
                        <Text style={styles.profileStatText}>
                            Followers
                        </Text>
                        <Text style={styles.profileFollowText}>
                            {"       "}{myProfile.followerDetails?.length || 0}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            navigate.navigate("FollowList", {
                                followers: myProfile.followerDetails,
                                following: myProfile.followingDetails,
                            })
                        }
                    >
                        <Text style={styles.profileStatText}>
                            Following
                        </Text>
                        <Text style={styles.profileFollowText}>
                            {"       "}{myProfile.followingDetails?.length || 0}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const layout = Dimensions.get('window').width;
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'forYou', title: 'For you' },
        { key: 'myProfile', title: 'My Profile' },
    ]);

    const renderScene = SceneMap({
        forYou: () => loading ? <Text>Loading...</Text> : <PostList data={data?.posts} handleAddLike={handleAddLike} navigation={navigate} myProfileData={myProfileData} />,
        myProfile: MyProfile,
    });



    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync("access_token");
            authContext.setIsLogin(false);
            console.log("Logged out and token deleted");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleAddLike = (postId) => {
        addLike({
            variables: {
                newLike: { postId },
            },
        });

    };



    if (error) {
        return <Text>Error loading posts: {error.message}</Text>;
    }

    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout }}
                renderTabBar={(props) => <MyTabBar {...props} />}
            />
            <View style={styles.bottomNav}>
                <TouchableOpacity>
                    <Ionicons name="home-outline" size={24} color={index === 0 ? "white" : "gray"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate("SearchUsers")}>
                    <Ionicons name="search-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.floatingButton} onPress={() => navigate.navigate("CreatePost")}>
                <Ionicons name="add-outline" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    postContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    user: {
        color: 'white',
        fontWeight: 'bold',
    },
    username: {
        color: 'gray',
    },
    content: {
        color: 'white',
        marginVertical: 5,
    },
    postImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginTop: 10,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        color: 'gray',
        marginLeft: 5,

    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: 'gray',
        backgroundColor: '#000',
        marginBottom: 20,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#90306f',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        alignItems: "center",
        padding: 20,
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
    logoutButton: {
        backgroundColor: "#90306f",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    logoutButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});
