import React, { useState } from 'react';
import {
    Calendar,
    CheckSquare,
    Clock,
    Plus,
    AlertCircle,
    User,
    MoreHorizontal,
    Flag,
    Search
} from 'lucide-react';
import investigationService from '../../../core/services/investigationService';
import {
    InvestigationPlan,
    InvestigationTask,
    TaskStatus,
    TaskPriority,
    CreateTaskRequest
} from '../../../core/types/investigation';

const InvestigationPlanner: React.FC = () => {
    const [caseId, setCaseId] = useState('');
    const [plan, setPlan] = useState<InvestigationPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // New Task Modal State
    const [showNewTask, setShowNewTask] = useState(false);
    const [newTask, setNewTask] = useState<Partial<CreateTaskRequest>>({
        priority: TaskPriority.MEDIUM,
        title: '',
        description: ''
    });

    const fetchPlan = async () => {
        if (!caseId) return;
        setIsLoading(true);
        try {
            const data = await investigationService.getPlanByCase(caseId);
            setPlan(data);
        } catch (error) {
            // If 404, we might want to prompt to create one. For now, just log.
            console.error("Fetch failed", error);
            setPlan(null);
        } finally {
            setIsLoading(false);
        }
    };

    const createDefaultPlan = async () => {
        if (!caseId) return;
        setIsLoading(true);
        try {
            const data = await investigationService.createPlan({
                case_id: caseId,
                title: `Investigation Plan: ${caseId}`
            });
            setPlan(data);
        } catch (error) {
            console.error("Create failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (!plan || !newTask.title || !newTask.description) return;
        try {
            const task = await investigationService.addTask({
                plan_id: plan.id,
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority || TaskPriority.MEDIUM
            });

            // Refresh plan locally
            const updatedTasks = [...plan.tasks, task];
            setPlan({
                ...plan,
                tasks: updatedTasks,
                total_tasks: plan.total_tasks + 1,
                progress_percentage: (plan.completed_tasks / (plan.total_tasks + 1)) * 100
            });
            setShowNewTask(false);
            setNewTask({ priority: TaskPriority.MEDIUM, title: '', description: '' });
        } catch (error) {
            console.error("Add task failed", error);
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
        try {
            const updatedTask = await investigationService.updateTask(taskId, { status: newStatus });

            if (plan) {
                const updatedTasks = plan.tasks.map(t => t.id === taskId ? updatedTask : t);
                const completed = updatedTasks.filter(t => t.status === TaskStatus.COMPLETED).length;

                setPlan({
                    ...plan,
                    tasks: updatedTasks,
                    completed_tasks: completed,
                    progress_percentage: (completed / plan.total_tasks) * 100
                });
            }
        } catch (error) {
            console.error("Update task failed", error);
        }
    };

    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
            case TaskPriority.CRITICAL: return 'text-red-500 bg-red-500/10';
            case TaskPriority.HIGH: return 'text-orange-500 bg-orange-500/10';
            case TaskPriority.MEDIUM: return 'text-blue-500 bg-blue-500/10';
            default: return 'text-slate-500 bg-slate-500/10';
        }
    };

    const StatusColumn = ({ status, label, tasks }: { status: TaskStatus, label: string, tasks: InvestigationTask[] }) => (
        <div className="flex-1 bg-slate-800/50 rounded-lg p-4 min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-300 uppercase text-xs tracking-wider">{label}</h3>
                <span className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>

            <div className="space-y-3">
                {tasks.map(task => (
                    <div key={task.id} className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-sm hover:border-indigo-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                            <button className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                        <h4 className="font-bold text-sm text-slate-200 mb-1">{task.title}</h4>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-600 border border-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                                    IO
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                                {status !== TaskStatus.COMPLETED && (
                                    <button
                                        onClick={() => handleStatusChange(task.id, TaskStatus.COMPLETED)}
                                        className="text-green-500 hover:bg-green-500/10 p-1 rounded"
                                        title="Mark Complete"
                                    >
                                        <CheckSquare className="w-4 h-4" />
                                    </button>
                                )}
                                {status === TaskStatus.PENDING && (
                                    <button
                                        onClick={() => handleStatusChange(task.id, TaskStatus.IN_PROGRESS)}
                                        className="text-blue-500 hover:bg-blue-500/10 p-1 rounded"
                                        title="Start Task"
                                    >
                                        <Clock className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white overflow-x-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <Calendar className="w-8 h-8 text-indigo-400" />
                    Investigation Planner (Rakshak)
                </h1>
                <p className="text-slate-400 mt-2">
                    Manage case timelines, assign tasks, and track investigation progress.
                </p>
            </header>

            <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter Case ID (e.g., FIR-2025-001)"
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-64 text-white"
                    />
                    <button
                        onClick={fetchPlan}
                        className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" /> Load Plan
                    </button>
                </div>

                {!plan && caseId && (
                    <button
                        onClick={createDefaultPlan}
                        className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors font-semibold"
                    >
                        Initialize New Plan
                    </button>
                )}

                {plan && (
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase font-bold">Progress</div>
                            <div className="text-lg font-bold text-white">{plan.progress_percentage.toFixed(0)}%</div>
                        </div>
                        <button
                            onClick={() => setShowNewTask(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Task
                        </button>
                    </div>
                )}
            </div>

            {plan ? (
                <div className="flex gap-6 overflow-x-auto pb-6">
                    <StatusColumn
                        status={TaskStatus.PENDING}
                        label="To Do"
                        tasks={plan.tasks.filter(t => t.status === TaskStatus.PENDING)}
                    />
                    <StatusColumn
                        status={TaskStatus.IN_PROGRESS}
                        label="In Progress"
                        tasks={plan.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS)}
                    />
                    <StatusColumn
                        status={TaskStatus.BLOCKED}
                        label="Blocked/Waiting"
                        tasks={plan.tasks.filter(t => t.status === TaskStatus.BLOCKED || t.status === TaskStatus.DEFERRED)}
                    />
                    <StatusColumn
                        status={TaskStatus.COMPLETED}
                        label="Completed"
                        tasks={plan.tasks.filter(t => t.status === TaskStatus.COMPLETED)}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-slate-500">
                    <Calendar className="w-20 h-20 mb-6 opacity-20" />
                    <h2 className="text-2xl font-bold mb-2">No Plan Loaded</h2>
                    <p>Enter a Case ID to load or create an investigation plan.</p>
                </div>
            )}

            {/* New Task Modal */}
            {showNewTask && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
                        <h3 className="text-xl font-bold mb-4">Add New Task</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white min-h-[100px]"
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                                >
                                    <option value={TaskPriority.LOW}>Low</option>
                                    <option value={TaskPriority.MEDIUM}>Medium</option>
                                    <option value={TaskPriority.HIGH}>High</option>
                                    <option value={TaskPriority.CRITICAL}>Critical</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowNewTask(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTask}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-bold"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestigationPlanner;
