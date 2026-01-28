import { useMemo } from 'react';
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
} from 'date-fns';
import type { Session } from '../models/Session';

export type PeriodType = 'day' | 'week' | 'month' | 'year' | 'all';

interface AggregationResult {
    byItemSeconds: Map<string, number>;
    totalSeconds: number;
    sessionCount: number;
    topItemId: string | null;
}

export function getPeriodRange(
    periodType: PeriodType,
    referenceDate: Date,
    weekStartsOn: 0 | 1 = 1
): { start: Date; end: Date } {
    switch (periodType) {
        case 'day':
            return {
                start: startOfDay(referenceDate),
                end: endOfDay(referenceDate),
            };
        case 'week':
            return {
                start: startOfWeek(referenceDate, { weekStartsOn }),
                end: endOfWeek(referenceDate, { weekStartsOn }),
            };
        case 'month':
            return {
                start: startOfMonth(referenceDate),
                end: endOfMonth(referenceDate),
            };
        case 'year':
            return {
                start: startOfYear(referenceDate),
                end: endOfYear(referenceDate),
            };
        case 'all':
            return {
                start: new Date(0),
                end: new Date(8640000000000000), // Max date
            };
    }
}

export function aggregateSessions(
    sessions: Session[],
    rangeStart: Date,
    rangeEnd: Date
): AggregationResult {
    const byItemSeconds = new Map<string, number>();
    let totalSeconds = 0;
    let sessionCount = 0;
    const now = new Date();

    for (const session of sessions) {
        const sStart = new Date(session.startAt);
        const sEnd = session.endAt ? new Date(session.endAt) : now;

        const effectiveStart = new Date(Math.max(sStart.getTime(), rangeStart.getTime()));
        const effectiveEnd = new Date(Math.min(sEnd.getTime(), rangeEnd.getTime()));

        if (effectiveEnd <= effectiveStart) {
            continue;
        }

        const seconds = Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / 1000);

        const currentSeconds = byItemSeconds.get(session.itemId) ?? 0;
        byItemSeconds.set(session.itemId, currentSeconds + seconds);
        totalSeconds += seconds;
        sessionCount += 1;
    }

    // Find top item
    let topItemId: string | null = null;
    let maxSeconds = 0;
    for (const [itemId, seconds] of byItemSeconds.entries()) {
        if (seconds > maxSeconds) {
            maxSeconds = seconds;
            topItemId = itemId;
        }
    }

    return {
        byItemSeconds,
        totalSeconds,
        sessionCount,
        topItemId,
    };
}

export function formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export function formatDurationWithSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
}

export function useAggregation(
    sessions: Session[],
    periodType: PeriodType,
    referenceDate: Date,
    weekStartsOn: 0 | 1 = 1
) {
    return useMemo(() => {
        const { start, end } = getPeriodRange(periodType, referenceDate, weekStartsOn);
        return aggregateSessions(sessions, start, end);
    }, [sessions, periodType, referenceDate, weekStartsOn]);
}
