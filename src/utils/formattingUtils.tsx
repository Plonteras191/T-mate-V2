// Text formatting utility functions
import React from 'react';
import { Text } from 'react-native';
import type {
    MessageFormatting,
    TextRange,
    MentionData,
    LinkData,
} from '../types/chat.types';

/**
 * Apply formatting to selected text
 */
export const applyFormatting = (
    text: string,
    selection: TextRange,
    format: 'bold' | 'italic' | 'strikethrough'
): { text: string; cursorPosition: number } => {
    const markers: Record<typeof format, { start: string; end: string }> = {
        bold: { start: '**', end: '**' },
        italic: { start: '_', end: '_' },
        strikethrough: { start: '~', end: '~' },
    };

    const marker = markers[format];
    const before = text.slice(0, selection.start);
    const selected = text.slice(selection.start, selection.end);
    const after = text.slice(selection.end);

    const newText = `${before}${marker.start}${selected}${marker.end}${after}`;
    const cursorPosition = selection.end + marker.start.length + marker.end.length;

    return { text: newText, cursorPosition };
};

/**
 * Parse formatting markers from text
 */
export const parseFormatting = (
    text: string
): { cleanText: string; formatting: MessageFormatting } => {
    const formatting: MessageFormatting = {
        bold: [],
        italic: [],
        strikethrough: [],
        mentions: [],
        links: [],
    };

    let cleanText = text;
    let offset = 0;

    // Parse bold: **text**
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
        const start = match.index - offset;
        const content = match[1];
        formatting.bold!.push({ start, end: start + content.length });
        offset += 4; // Remove ** markers
    }
    cleanText = cleanText.replace(boldRegex, '$1');

    // Recalculate for italic
    offset = 0;
    const italicRegex = /_(.+?)_/g;
    while ((match = italicRegex.exec(cleanText)) !== null) {
        const start = match.index - offset;
        const content = match[1];
        formatting.italic!.push({ start, end: start + content.length });
        offset += 2; // Remove _ markers
    }
    cleanText = cleanText.replace(italicRegex, '$1');

    // Recalculate for strikethrough
    offset = 0;
    const strikeRegex = /~(.+?)~/g;
    while ((match = strikeRegex.exec(cleanText)) !== null) {
        const start = match.index - offset;
        const content = match[1];
        formatting.strikethrough!.push({ start, end: start + content.length });
        offset += 2; // Remove ~ markers
    }
    cleanText = cleanText.replace(strikeRegex, '$1');

    // Detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    while ((match = urlRegex.exec(cleanText)) !== null) {
        formatting.links!.push({
            url: match[1],
            start: match.index,
            end: match.index + match[1].length,
        });
    }

    // Detect mentions
    const mentionRegex = /@(\w+)/g;
    while ((match = mentionRegex.exec(cleanText)) !== null) {
        formatting.mentions!.push({
            userId: '', // Will be resolved later
            username: match[1],
            start: match.index,
            end: match.index + match[0].length,
        });
    }

    return { cleanText, formatting };
};

/**
 * Detect mentions in text
 */
export const detectMentions = (text: string): MentionData[] => {
    const mentions: MentionData[] = [];
    const mentionRegex = /@(\w+)/g;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push({
            userId: '',
            username: match[1],
            start: match.index,
            end: match.index + match[0].length,
        });
    }

    return mentions;
};

/**
 * Detect links in text
 */
export const detectLinks = (text: string): LinkData[] => {
    const links: LinkData[] = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        links.push({
            url: match[1],
            start: match.index,
            end: match.index + match[1].length,
        });
    }

    return links;
};

/**
 * Insert emoji at position
 */
export const insertEmoji = (text: string, emoji: string, position: number): string => {
    const before = text.slice(0, position);
    const after = text.slice(position);
    return `${before}${emoji}${after}`;
};

/**
 * Insert mention replacing partial @mention
 */
export const insertMention = (
    text: string,
    mention: string,
    start: number,
    end: number
): string => {
    const before = text.slice(0, start);
    const after = text.slice(end);
    return `${before}@${mention}${after}`;
};

/**
 * Check if position is within a range
 */
const isInRange = (position: number, range: TextRange): boolean => {
    return position >= range.start && position < range.end;
};

/**
 * Get all formatting at a position (for knowing which formats are active)
 */
export const getActiveFormatsAtPosition = (
    position: number,
    formatting: MessageFormatting | null
): { bold: boolean; italic: boolean; strikethrough: boolean } => {
    if (!formatting) {
        return { bold: false, italic: false, strikethrough: false };
    }

    return {
        bold: formatting.bold?.some((range) => isInRange(position, range)) || false,
        italic: formatting.italic?.some((range) => isInRange(position, range)) || false,
        strikethrough:
            formatting.strikethrough?.some((range) => isInRange(position, range)) || false,
    };
};
