// src/core/auth/credentials.ts
// Updated to use real backend API
import { UserRole, UserProfile } from './AuthContext';
import api from '../services/api';

export interface CredentialUser extends UserProfile {
    username: string;
    password: string;
}

// Keep mock users as fallback for demo/development
export const MOCK_USERS: CredentialUser[] = [
    {
        username: 'admin',
        password: 'password',
        name: 'System Administrator',
        id: 'ADM-001',
        role: 'ADMIN',
        department: 'Ministry of Law & Justice',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    {
        username: 'police',
        password: 'password',
        name: 'Inspector Vikram Singh',
        id: 'DL-PS-101',
        role: 'POLICE',
        station: 'Connaught Place PS',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Police'
    },
    {
        username: 'judge',
        password: 'password',
        name: 'Hon. Justice R.K. Sharma',
        id: 'DHC-J-001',
        role: 'JUDGE',
        courtId: 'Delhi High Court',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Judge'
    },
    {
        username: 'citizen',
        password: 'password',
        name: 'Rajesh Kumar',
        id: 'CIT-9876543210',
        role: 'CITIZEN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citizen'
    }
];

interface LoginResponse {
    tokens: {
        access_token: string;
        refresh_token: string;
    };
    user: {
        id: number;
        email: string;
        full_name: string;
        role: string;
        google_profile_picture?: string;
    };
}

export const verifyCredentials = async (
    role: UserRole,
    identifier: string,
    password: string,
    metadata?: {
        name?: string;
        station?: string;
        courtId?: string;
        department?: string;
        badgeNumber?: string;
        judgeId?: string;
    }
): Promise<UserProfile & { tokens?: { access_token: string; refresh_token: string } } | null> => {
    // Normalize inputs
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();
    
    // First try mock credentials for demo purposes
    const idBeforeAt = cleanId.split('@')[0];
    const mockUser = MOCK_USERS.find(u =>
        u.role === role &&
        (u.username === cleanId ||
            u.username === idBeforeAt ||
            u.id === cleanId)
    );

    if (mockUser && mockUser.password === cleanPass) {
        // Return profile without sensitive auth data
        const { password: _pw, username: _un, ...profile } = mockUser;
        return profile;
    }

    // Try real backend authentication
    try {
        // Map role to backend role format
        const backendRole = role.toLowerCase();
        
        // Build request data
        const requestData: any = {
            email: cleanId.includes('@') ? cleanId : `${cleanId}@demo.local`,
            password: cleanPass,
            role: backendRole,
            full_name: metadata?.name || cleanId
        };

        // Add role-specific fields
        if (role === 'POLICE') {
            requestData.badge_number = metadata?.badgeNumber || metadata?.judgeId || 'PENDING';
            requestData.station_id = metadata?.station || 'PENDING';
        } else if (role === 'JUDGE') {
            requestData.court_id = metadata?.courtId || 'PENDING';
        }

        // Attempt login first
        try {
            const loginResponse = await api.post<LoginResponse>('/auth/login', {
                email: requestData.email,
                password: cleanPass
            });

            if (loginResponse.data) {
                const { tokens, user } = loginResponse.data;
                
                // Store tokens
                localStorage.setItem('token', tokens.access_token);
                localStorage.setItem('refreshToken', tokens.refresh_token);

                return {
                    name: user.full_name,
                    email: user.email,
                    id: String(user.id),
                    role: user.role.toUpperCase() as UserRole,
                    avatar: user.google_profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`,
                    station: metadata?.station,
                    courtId: metadata?.courtId,
                    department: metadata?.department,
                    tokens
                };
            }
        } catch (loginError: any) {
            // If login fails, try signup (for demo purposes)
            if (loginError.response?.status === 401) {
                try {
                    const signupResponse = await api.post<LoginResponse>('/auth/signup', requestData);
                    
                    if (signupResponse.data) {
                        const { tokens, user } = signupResponse.data;
                        
                        // Store tokens
                        localStorage.setItem('token', tokens.access_token);
                        localStorage.setItem('refreshToken', tokens.refresh_token);

                        return {
                            name: user.full_name,
                            email: user.email,
                            id: String(user.id),
                            role: user.role.toUpperCase() as UserRole,
                            avatar: user.google_profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`,
                            station: metadata?.station,
                            courtId: metadata?.courtId,
                            department: metadata?.department,
                            tokens
                        };
                    }
                } catch (signupError) {
                    console.error('Signup failed:', signupError);
                }
            }
        }
    } catch (error) {
        console.error('Backend authentication error:', error);
    }

    return null;
};

export const refreshToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
        const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken
        });

        if (response.data) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('refreshToken', response.data.refresh_token);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear tokens on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    return false;
};

export const logout = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && refreshToken) {
        try {
            await api.post('/auth/logout', {
                refresh_token: refreshToken
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
};
