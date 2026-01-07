import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

interface FeaturedGroup {
    id: string;
    title: string;
    subject: string;
    members: number;
    location: string;
    color: string[];
}

// Mock data for featured groups - in real app could come from props or API
const FEATURED_GROUPS: FeaturedGroup[] = [
    {
        id: '1',
        title: 'Advanced Calculus Study',
        subject: 'Mathematics',
        members: 12,
        location: 'Central Library',
        color: ['#4F46E5', '#818CF8'],
    },
    {
        id: '2',
        title: 'React Native Workshop',
        subject: 'Computer Science',
        members: 24,
        location: 'Tech Hub',
        color: ['#059669', '#34D399'],
    },
    {
        id: '3',
        title: 'Physics Finals Prep',
        subject: 'Physics',
        members: 8,
        location: 'Science Block',
        color: ['#DC2626', '#F87171'],
    },
];

export const FeaturedCarousel: React.FC = () => {
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
                    <TouchableOpacity key={group.id} activeOpacity={0.9}>
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
                                    {group.title}
                                </Text>

                                <View style={styles.cardFooter}>
                                    <View style={styles.infoRow}>
                                        <Feather name="users" size={14} color="rgba(255,255,255,0.9)" />
                                        <Text style={styles.infoText}>{group.members} members</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Feather name="map-pin" size={14} color="rgba(255,255,255,0.9)" />
                                        <Text style={styles.infoText}>{group.location}</Text>
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
        paddingBottom: spacing[4], // For shadow
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
