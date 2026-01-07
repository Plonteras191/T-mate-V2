// useFileDownload Hook - File download management
import { useState, useCallback } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { downloadFile as downloadFileService } from '../services/attachment.service';

interface UseFileDownloadReturn {
    download: (url: string, fileName: string) => Promise<void>;
    progress: number;
    status: 'idle' | 'downloading' | 'success' | 'error';
    localPath: string | null;
    error: string | null;
    openFile: () => Promise<void>;
    cancelDownload: () => void;
}

export const useFileDownload = (): UseFileDownloadReturn => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>(
        'idle'
    );
    const [localPath, setLocalPath] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const download = useCallback(
        async (url: string, fileName: string): Promise<void> => {
            try {
                setStatus('downloading');
                setProgress(0);
                setError(null);

                const path = await downloadFileService(url, fileName, (prog) => {
                    setProgress(prog);
                });

                setLocalPath(path);
                setStatus('success');
                setProgress(100);
            } catch (err) {
                setStatus('error');
                setError(err instanceof Error ? err.message : 'Download failed');
                console.error('Error downloading file:', err);
            }
        },
        []
    );

    const openFile = useCallback(async (): Promise<void> => {
        if (!localPath) return;

        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(localPath);
            } else {
                console.log('Sharing is not available on this device');
            }
        } catch (err) {
            console.error('Error opening file:', err);
        }
    }, [localPath]);

    const cancelDownload = useCallback(() => {
        setStatus('idle');
        setProgress(0);
        setError(null);
        setLocalPath(null);
    }, []);

    return {
        download,
        progress,
        status,
        localPath,
        error,
        openFile,
        cancelDownload,
    };
};
