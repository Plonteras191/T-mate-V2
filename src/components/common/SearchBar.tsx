// SearchBar Component
import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
    autoFocus = false,
}) => {
    const handleClear = () => {
        onChangeText('');
        onClear?.();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.text.tertiary}
                autoFocus={autoFocus}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {value.length > 0 && (
                <TouchableOpacity
                    onPress={handleClear}
                    style={styles.clearButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing[3],
        height: 44,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: spacing[2],
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text.primary,
        paddingVertical: spacing[2],
    },
    clearButton: {
        padding: spacing[1],
    },
    clearIcon: {
        fontSize: 14,
        color: colors.text.tertiary,
    },
});
