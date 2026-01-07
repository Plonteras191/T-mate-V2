import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { shadows, spacing, borderRadius } from '../../theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const getIcon = () => {
                        const color = isFocused ? colors.primary.main : colors.text.tertiary;
                        const size = 24;

                        switch (route.name) {
                            case 'Home':
                                return <Feather name="home" size={size} color={color} />;
                            case 'Groups':
                                return <Feather name="search" size={size} color={color} />;
                            case 'Calendar':
                                return <Feather name="calendar" size={size} color={color} />;
                            case 'MyGroups':
                                return <Feather name="book" size={size} color={color} />;
                            case 'Profile':
                                return <Feather name="user" size={size} color={color} />;
                            default:
                                return <Feather name="home" size={size} color={color} />;
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabItem}
                        >
                            <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
                                {getIcon()}
                            </View>
                            {isFocused && (
                                <Text style={styles.label}>
                                    {typeof label === 'string' ? label : route.name}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: spacing[4],
        paddingTop: 0,
    },
    content: {
        flexDirection: 'row',
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.xl,
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-around',
        ...shadows.lg,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: Platform.OS === 'ios' ? 0 : spacing[4], // Floating effect on Android
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconContainer: {
        padding: spacing[2],
        borderRadius: borderRadius.full,
    },
    iconContainerFocused: {
        backgroundColor: colors.primary.light + '20', // 20% opacity
    },
    label: {
        fontSize: 10,
        color: colors.primary.main,
        fontWeight: '600',
        marginTop: 2,
    },
});
