// js/database.js

const DB_KEY = 'extinctionChallenge_users';

export class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    }

    _commit() {
        localStorage.setItem(DB_KEY, JSON.stringify(this.users));
    }

    saveUser(token, userData) {
        const initialProgress = {};
        for (let i = 1; i <= 9; i++) {
            const speciesId = `0${i}`.slice(-2);
            initialProgress[`QR_${speciesId}_Completado`] = false;
        }

        this.users[token] = {
            ...userData,
            ...initialProgress,
            createdAt: new Date().toISOString()
        };
        this._commit();
    }

    getUser(token) {
        return this.users[token] || null;
    }

    updateProgress(token, qrId, completed = true) {
        if (this.users[token]) {
            this.users[token][qrId] = completed;
            this._commit();
            return true;
        }
        return false;
    }
}