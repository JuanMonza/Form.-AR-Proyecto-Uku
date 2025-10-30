// js/tokenManager.js - Refactored to SessionManager

const SESSION_KEY = 'extinctionChallenge_session_telefono';

export class SessionManager {
    static saveSession(telefono) {
        localStorage.setItem(SESSION_KEY, telefono);
    }

    static getSession() {
        return localStorage.getItem(SESSION_KEY);
    }

    static clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }
}