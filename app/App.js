import client from "./src/config/graphql.js";
import AuthContext from './src/contexts/AuthContext.js';
import useIsSignedOut from "./src/hooks/useIsSignedOut.js";
import useIsSignedIn from "./src/hooks/useIsSignedIn.js";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStaticNavigation } from "@react-navigation/native";
import { ApolloProvider } from "@apollo/client";
import LoginScreen from "./src/screens/LoginScreen.js"
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisterScreen from './src/screens/RegisterScreen.js';
import HomeScreen from './src/screens/HomeScreen.js'
import { useState } from 'react';
import CreatePostScreen from './src/screens/CreatePostScreen.js'
import PostDetailScreen from "./src/screens/PostDetailScreen.js";
import SearchUserScreen from "./src/screens/SearchUserScreen.js";
import FollowersFollowingScreen from "./src/screens/FollowersFollowingScreen.js";
import UserProfileScreen from "./src/screens/UserProfileScreen.js";



const StackNavigator = createNativeStackNavigator({
  screens: {
    Login: {
      if: useIsSignedOut,
      screen: LoginScreen,
      options: {
        title: "Login",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      },
    },
    Register: {
      if: useIsSignedOut,
      screen: RegisterScreen,
      options: {
        title: "Register",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      },
    },
    Home: {
      if: useIsSignedIn,
      screen: HomeScreen,
      options: {
        title: "Home",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerBackVisible: false
      },
    },
    CreatePost: {
      if: useIsSignedIn,
      screen: CreatePostScreen,
      options: {
        title: "Create Post",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      }
    },
    PostDetail: {
      if: useIsSignedIn,
      screen: PostDetailScreen,
      options: {
        title: "Post",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      }
    },
    SearchUsers: {
      if: useIsSignedIn,
      screen: SearchUserScreen,
      options: {
        title: "Search",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      }
    },
    UserProfile: {
      if: useIsSignedIn,
      screen: UserProfileScreen,
      options: {
        title: "User Profile",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      }
    },
    FollowList: {
      if: useIsSignedIn,
      screen: FollowersFollowingScreen,
      options: {
        title: "Follow List",
        headerTintColor: "white",
        headerBackground: () => (
          <LinearGradient
            colors={['#c17388', '#90306f']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      }
    },

  }
})


const Navigation = createStaticNavigation(StackNavigator);

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          isLogin,
          setIsLogin,
        }}
      >
        <Navigation />
      </AuthContext.Provider>
    </ApolloProvider>
  );
}


