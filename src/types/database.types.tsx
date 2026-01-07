// Database types matching Supabase schema

export interface User {
    id: string;
    email: string;
    full_name: string;
    bio: string | null;
    profile_photo_url: string | null;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface StudyGroup {
    id: string;
    creator_id: string;
    subject: string;
    description: string;
    meeting_schedule: string;
    meeting_location: string;
    max_capacity: number | null;
    is_full: boolean;
    created_at: string;
    updated_at: string;
}

export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    joined_at: string;
}

export interface Message {
    id: string;
    group_id: string;
    sender_id: string;
    message_text: string | null;
    message_type: 'text' | 'image' | 'file';
    formatting: Record<string, unknown> | null;
    created_at: string;
}

export interface MessageAttachment {
    id: string;
    message_id: string;
    attachment_type: 'image' | 'document' | 'video' | 'audio';
    file_url: string;
    file_name: string;
    file_size: number;
    thumbnail_url: string | null;
    created_at: string;
}

export interface Report {
    id: string;
    reporter_id: string;
    reported_user_id: string | null;
    reported_group_id: string | null;
    reported_message_id: string | null;
    reason: string;
    description: string | null;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    created_at: string;
}

// Database type for Supabase client
export interface Database {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: Omit<User, 'created_at' | 'updated_at'> & {
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Omit<User, 'id'>>;
            };
            study_groups: {
                Row: StudyGroup;
                Insert: Omit<StudyGroup, 'id' | 'created_at' | 'updated_at' | 'is_full'> & {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    is_full?: boolean;
                };
                Update: Partial<Omit<StudyGroup, 'id'>>;
            };
            group_members: {
                Row: GroupMember;
                Insert: Omit<GroupMember, 'id' | 'joined_at'> & {
                    id?: string;
                    joined_at?: string;
                };
                Update: Partial<Omit<GroupMember, 'id'>>;
            };
            messages: {
                Row: Message;
                Insert: Omit<Message, 'id' | 'created_at'> & {
                    id?: string;
                    created_at?: string;
                };
                Update: Partial<Omit<Message, 'id'>>;
            };
            message_attachments: {
                Row: MessageAttachment;
                Insert: Omit<MessageAttachment, 'id' | 'created_at'> & {
                    id?: string;
                    created_at?: string;
                };
                Update: Partial<Omit<MessageAttachment, 'id'>>;
            };
            reports: {
                Row: Report;
                Insert: Omit<Report, 'id' | 'created_at' | 'status'> & {
                    id?: string;
                    created_at?: string;
                    status?: Report['status'];
                };
                Update: Partial<Omit<Report, 'id'>>;
            };
        };
    };
}
