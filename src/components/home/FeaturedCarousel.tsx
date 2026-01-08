import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import type { StudyGroupWithDetails } from '../../services/groups.service';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

// Mock data for featured groups matching StudyGroupWithDetails structure
const FEATURED_GROUPS: Partial<StudyGroupWithDetails & { color: string[] }>[] = [
    {
        id: 'featured-1',
        subject: 'Mathematics',
        description: 'Advanced Calculus study group focusing on integration techniques and differential equations.',
        meeting_schedule: new Date(Date.now() + 86400000).toISOString(),
        meeting_location: 'Central Library, Room 304',
        max_capacity: 15,
        member_count: 12,
        is_full: false,
        creator: {
            id: 'mock-creator-1',
            full_name: 'Sarah Chen',
            profile_photo_url: null,
        },
        color: ['#4F46E5', '#818CF8'], // Indigo
    },
    {
        id: 'featured-2',
        subject: 'Computer Science',
        description: 'React Native workshop for beginners. Building real-world apps with Expo.',
        meeting_schedule: new Date(Date.now() + 172800000).toISOString(),
        meeting_location: 'Tech Hub, Lab 2',
        max_capacity: 30,
        member_count: 24,
        is_full: false,
        creator: {
            id: 'mock-creator-2',
            full_name: 'Alex Rivera',
            profile_photo_url: null,
        },
        color: ['#059669', '#34D399'], // Emerald
    },
    {
        id: 'featured-3',
        subject: 'Physics',
        description: 'Finals preparation for Physics 101. Mechanics and Thermodynamics review.',
        meeting_schedule: new Date(Date.now() + 259200000).toISOString(),
        meeting_location: 'Science Block, Hall B',
        max_capacity: 10,
        member_count: 8,
        is_full: false,
        creator: {
            id: 'mock-creator-3',
            full_name: 'Mike Johnson',
            profile_photo_url: null,
        },
        color: ['#DC2626', '#F87171'], // Red
    },
];

export const FeaturedCarousel: React.FC = () => {
    const navigation = useNavigation<any>();

    const handlePress = (group: any) => {
        navigation.navigate('Groups', {
            screen: 'GroupDetails',
            params: {
                groupId: group.id,
                initialData: group,
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Featured Groups 🔥</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + spacing[4]}
            >
                {FEATURED_GROUPS.map((group) => (
                    <TouchableOpacity
                        key={group.id}
                        activeOpacity={0.9}
                        onPress={() => handlePress(group)}
                    >
                        <LinearGradient
                            colors={group.color as [string, string, ...string[]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.card}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{group.subject}</Text>
                                </View>

                                <Text style={styles.cardTitle} numberOfLines={2}>
                                    {group.description}
                                </Text>

                                <View style={styles.cardFooter}>
                                    <View style={styles.infoRow}>
                                        <Feather name="users" size={14} color="rgba(255,255,255,0.9)" />
                                        <Text style={styles.infoText}>{group.member_count} members</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Feather name="map-pin" size={14} color="rgba(255,255,255,0.9)" />
                                        <Text style={styles.infoText}>{group.meeting_location}</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing[6],
    },
    header: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[3],
    },
    title: {
        ...typography.h4,
        color: colors.text.primary,
    },
    scrollContent: {
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[4],
    },
    card: {
        width: CARD_WIDTH,
        height: 160,
        borderRadius: borderRadius.xl,
        marginRight: spacing[4],
        ...shadows.md,
    },
    cardContent: {
        flex: 1,
        padding: spacing[4],
        justifyContent: 'space-between',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
    },
    badgeText: {
        ...typography.caption,
        color: '#FFF',
        fontWeight: '600',
    },
    cardTitle: {
        ...typography.h3,
        color: '#FFF',
        marginTop: spacing[2],
        fontSize: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: spacing[4],
        marginTop: 'auto',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
    },
    infoText: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.9)',
    },
});
