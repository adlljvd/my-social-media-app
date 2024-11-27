// src/components/MyTabBar.js
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';

export default function MyTabBar(props) {
    return (
        <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            renderLabel={({ route, focused }) => (
                <Text style={[styles.label, focused ? styles.activeLabel : styles.inactiveLabel]}>
                    {route.title}
                </Text>
            )}
        />
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'black',
    },
    indicator: {
        backgroundColor: 'white',
        height: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    activeLabel: {
        color: 'white',
    },
    inactiveLabel: {
        color: 'gray',
    },
});
