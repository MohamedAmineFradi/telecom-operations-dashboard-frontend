'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from './types';

interface RoleContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    permissions: {
        canViewTraffic: boolean;
        canViewCongestion: boolean;
        canViewMobility: boolean;
        canViewAlerts: boolean;
        canViewAdmin: boolean;
    };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const rolePermissions: Record<UserRole, RoleContextType['permissions']> = {
    director: {
        canViewTraffic: true,
        canViewCongestion: true,
        canViewMobility: true,
        canViewAlerts: true,
        canViewAdmin: true,
    },
    network_engineer: {
        canViewTraffic: true,
        canViewCongestion: true,
        canViewMobility: true,
        canViewAlerts: true,
        canViewAdmin: false,
    },
    sys_admin: {
        canViewTraffic: false,
        canViewCongestion: false,
        canViewMobility: false,
        canViewAlerts: true,
        canViewAdmin: true,
    },
};

export function RoleProvider({ children }: { children: ReactNode }) {
    // Default to director for initial ease of use, could be loaded from localStorage
    const [role, setRoleState] = useState<UserRole>('director');

    useEffect(() => {
        const savedRole = localStorage.getItem('user-role') as UserRole;
        if (savedRole && ['director', 'network_engineer', 'sys_admin'].includes(savedRole)) {
            setRoleState(savedRole);
        }
    }, []);

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        localStorage.setItem('user-role', newRole);
    };

    const permissions = rolePermissions[role];

    return (
        <RoleContext.Provider value={{ role, setRole, permissions }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}
