// js/tokenManager.js

const TOKEN_KEY = 'extinctionChallenge_token';

export class TokenManager {
    static generateToken() {
        return `token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    static getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    static setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}