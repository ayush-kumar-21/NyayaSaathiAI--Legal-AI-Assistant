// Registry Automator Service - Skill 19
import { adminApi } from './api';
import {
    ScrutinyResponse,
    FeeCalculationResponse,
    FilingType,
} from '../types/registry';

class RegistryService {
    // ===== API Methods =====

    async scrutinizeDocument(documentUrl: string, filingType?: FilingType): Promise<ScrutinyResponse> {
        const response = await adminApi.registry.scrutinize(documentUrl);
        return response.data;
    }

    async calculateFees(filingType: FilingType, valueInDispute: number): Promise<FeeCalculationResponse> {
        const response = await adminApi.registry.calculateFees({
            filing_type: filingType,
            value_in_dispute: valueInDispute,
        });
        return response.data;
    }

    async testScrutiny(): Promise<ScrutinyResponse> {
        const response = await adminApi.registry.test();
        return response.data;
    }

    // ===== Utility Methods =====

    getSeverityColor(severity: string): string {
        const colors: Record<string, string> = {
            critical: 'bg-red-500/20 text-red-400 border-red-500/30',
            major: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            minor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        };
        return colors[severity] || colors['minor'];
    }

    getStatusColor(status: string): string {
        return status === 'COMPLIANT'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-red-500/20 text-red-400 border-red-500/30';
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    }
}

export const registryService = new RegistryService();
