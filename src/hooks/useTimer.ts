import { useState, useCallback } from 'react';
import { useSessions } from './useSessions';
import { useItems } from './useItems';
import type { Session } from '../models/Session';

interface UseTimerReturn {
    runningSession: Session | null;
    handleItemClick: (itemId: string) => Promise<void>;
    showSwitchDialog: boolean;
    switchDialogData: { currentItemId: string; newItemId: string } | null;
    confirmSwitch: () => Promise<void>;
    cancelSwitch: () => void;
    handleStopNative: () => void;
}

export function useTimer(): UseTimerReturn {
    const { runningSession, addSession, endSession } = useSessions();
    const { getItemById } = useItems();
    const [showSwitchDialog, setShowSwitchDialog] = useState(false);
    const [switchDialogData, setSwitchDialogData] = useState<{
        currentItemId: string;
        newItemId: string;
    } | null>(null);

    const notifyNative = useCallback((action: 'start' | 'stop', itemName: string = '', startTime: string | null = null) => {
        if ((window as any).webkit?.messageHandlers?.timerHandler) {
            (window as any).webkit.messageHandlers.timerHandler.postMessage({
                action,
                itemName,
                startTime
            });
        }
    }, []);

    const startTimer = useCallback(async (itemId: string) => {
        const session = await addSession({ itemId });
        const itemName = getItemById(itemId)?.name ?? '';
        notifyNative('start', itemName, session.startAt);
    }, [addSession, getItemById, notifyNative]);

    const handleItemClick = useCallback(
        async (itemId: string) => {
            // Case 1: No running session - start new session
            if (!runningSession) {
                await startTimer(itemId);
                return;
            }

            // Case 2: Same item clicked - end session
            if (runningSession.itemId === itemId) {
                await endSession(runningSession.id);
                notifyNative('stop');
                return;
            }

            // Case 3: Different item clicked - show confirmation dialog
            setSwitchDialogData({
                currentItemId: runningSession.itemId,
                newItemId: itemId,
            });
            setShowSwitchDialog(true);
        },
        [runningSession, endSession, startTimer, notifyNative]
    );

    const confirmSwitch = useCallback(async () => {
        if (!runningSession || !switchDialogData) return;

        // End current session and start new one
        await endSession(runningSession.id);
        notifyNative('stop');
        await startTimer(switchDialogData.newItemId);

        setShowSwitchDialog(false);
        setSwitchDialogData(null);
    }, [runningSession, switchDialogData, endSession, startTimer, notifyNative]);

    const cancelSwitch = useCallback(() => {
        setShowSwitchDialog(false);
        setSwitchDialogData(null);
    }, []);

    const handleStopNative = useCallback(() => {
        notifyNative('stop');
    }, [notifyNative]);

    return {
        runningSession,
        handleItemClick,
        showSwitchDialog,
        switchDialogData,
        confirmSwitch,
        cancelSwitch,
        handleStopNative,
    };
}
