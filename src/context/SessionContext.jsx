import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { seedSessions } from '../data/seedData';
import { v4 as uuidv4 } from 'uuid';

const SessionContext = createContext();

const STORAGE_KEY = 'peptide_sessions';

const sessionReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SESSIONS':
            return { ...state, sessions: action.payload };
        case 'ADD_SESSION':
            return { ...state, sessions: [...state.sessions, action.payload] };
        case 'UPDATE_SESSION':
            return {
                ...state,
                sessions: state.sessions.map(s =>
                    s.id === action.payload.id ? action.payload : s
                ),
            };
        case 'DELETE_SESSION':
            return {
                ...state,
                sessions: state.sessions.filter(s => s.id !== action.payload),
            };
        case 'UPDATE_STATUS':
            return {
                ...state,
                sessions: state.sessions.map(s =>
                    s.id === action.payload.id ? { ...s, status: action.payload.status } : s
                ),
            };
        default:
            return state;
    }
};

export const SessionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(sessionReducer, {
        sessions: loadFromStorage(STORAGE_KEY, seedSessions),
    });

    useEffect(() => {
        saveToStorage(STORAGE_KEY, state.sessions);
    }, [state.sessions]);

    const activeSession = useMemo(() => {
        return state.sessions.find(s => s.status === 'active') || null;
    }, [state.sessions]);

    const addSession = (session) => {
        const newSession = {
            ...session,
            id: uuidv4(),
            status: 'draft',
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_SESSION', payload: newSession });
        return newSession;
    };

    const updateSession = (session) => {
        dispatch({ type: 'UPDATE_SESSION', payload: session });
    };

    const deleteSession = (id) => {
        dispatch({ type: 'DELETE_SESSION', payload: id });
    };

    const updateStatus = (id, status) => {
        dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
    };

    return (
        <SessionContext.Provider value={{
            sessions: state.sessions,
            activeSession,
            addSession,
            updateSession,
            deleteSession,
            updateStatus,
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessions = () => {
    const context = useContext(SessionContext);
    if (!context) throw new Error('useSessions must be used within SessionProvider');
    return context;
};
