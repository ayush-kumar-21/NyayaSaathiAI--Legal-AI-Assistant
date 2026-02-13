import api from '../services/api';
import {
    InvestigationPlan,
    CreatePlanRequest,
    CreateTaskRequest,
    UpdateTaskRequest,
    InvestigationTask
} from '../types/investigation';

class InvestigationService {
    /**
     * Create Plan
     */
    async createPlan(data: CreatePlanRequest): Promise<InvestigationPlan> {
        const response = await api.post<InvestigationPlan>('/police/investigation/plan', data);
        return response.data;
    }

    /**
     * Get Plan by Case
     */
    async getPlanByCase(caseId: string): Promise<InvestigationPlan> {
        const response = await api.get<InvestigationPlan>(`/police/investigation/case/${caseId}`);
        return response.data;
    }

    /**
     * Add Task
     */
    async addTask(data: CreateTaskRequest): Promise<InvestigationTask> {
        const response = await api.post<InvestigationTask>('/police/investigation/task', data);
        return response.data;
    }

    /**
     * Update Task
     */
    async updateTask(taskId: string, data: UpdateTaskRequest): Promise<InvestigationTask> {
        const response = await api.put<InvestigationTask>(`/police/investigation/task/${taskId}`, data);
        return response.data;
    }
}

export default new InvestigationService();
