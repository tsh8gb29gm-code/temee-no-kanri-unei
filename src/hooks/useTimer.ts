import { useState, useCallback } from 'react';
import { useSessions } from './useSessions';
import type { Session } from '../models/Session';

interface UseTimerReturn {
    runningSession: Session | null;
    handleItemClick: (itemId: string) => Promise<void>;
    showSwitchDialog: boolean;
    switchDialogData: { currentItemId: string; newItemId: string } | null;
    confirmSwitch: () => Promise<void>;
    cancelSwitch: () => void;
}

export function useTimer(): UseTimerReturn {
    const { runningSession, addSession, endSession } = useSessions();
    const [showSwitchDialog, setShowSwitchDialog] = useState(false);
    const [switchDialogData, setSwitchDialogData] = useState<{
        currentItemId: string;
        newItemId: string;
    } | null>(null);

    const handleItemClick = useCallback(
        async (itemId: string) => {
            // Case 1: No running session - start new session
            if (!runningSession) {
                await addSession({ itemId });
                return;
            }

            // Case 2: Same item clicked - end session
            if (runningSession.itemId === itemId) {
                await endSession(runningSession.id);
                return;
            }

            // Case 3: Different item clicked - show confirmation dialog
            setSwitchDialogData({
                currentItemId: runningSession.itemId,
                newItemId: itemId,
            });
            setShowSwitchDialog(true);
        },
        [runningSession, addSession, endSession]
    );

    const confirmSwitch = useCallback(async () => {
        if (!runningSession || !switchDialogData) return;

        // End current session and start new one
        await endSession(runningSession.id);
        await addSession({ itemId: switchDialogData.newItemId });

        setShowSwitchDialog(false);
        setSwitchDialogData(null);
    }, [runningSession, switchDialogData, endSession, addSession]);

    const cancelSwitch = useCallback(() => {
        setShowSwitchDialog(false);
        setSwitchDialogData(null);
    }, []);

    return {
        runningSession,
        handleItemClick,
        showSwitchDialog,
        switchDialogData,
        confirmSwitch,
        cancelSwitch,
    };
}
