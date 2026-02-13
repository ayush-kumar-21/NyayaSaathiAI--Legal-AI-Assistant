// src/core/services/listingService.ts
import { adminApi } from './api';
import {
    CaseListing,
    OptimizedSchedule,
    CaseType,
    Urgency
} from '../types/listing';

class ListingService {
    // ===== API Methods =====
    async getCurrentCauseList(courtId: string): Promise<CaseListing[]> {
        const response = await adminApi.listing.getCauseList(courtId);
        return response.data;
    }

    async optimizeSchedule(cases: CaseListing[]): Promise<OptimizedSchedule> {
        const response = await adminApi.listing.optimize(cases);
        return response.data;
    }

    async testOptimize(): Promise<OptimizedSchedule> {
        const response = await adminApi.listing.test();
        return response.data;
    }

    // ===== Utility Methods =====
    formatDuration(minutes: number): string {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
    }

    formatTime(timeStr: string): string {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes || '00'} ${ampm}`;
    }

    getUrgencyColor(urgency: Urgency | string): string {
        const colors: Record<string, string> = {
            'Urgent': 'bg-red-500/20 text-red-400 border-red-500/30',
            'High': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            'Normal': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Low': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        };
        return colors[urgency] || colors['Normal'];
    }

    getCaseTypeColor(caseType: CaseType | string): string {
        const colors: Record<string, string> = {
            'bail_application': 'red',
            'writ': 'purple',
            'criminal': 'orange',
            'civil': 'blue',
            'appeal': 'green',
        };
        return colors[String(caseType).toLowerCase()] || 'gray';
    }
}

export const listingService = new ListingService();
