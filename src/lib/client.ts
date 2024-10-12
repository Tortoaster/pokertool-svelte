import type {Room} from "$lib/room";
import {v4 as uuidv4} from 'uuid';
import type {Config} from "$lib/config";

export function getClient(userId: string, config: Config): Client {
    switch (config.api) {
        case 'Local': return new MockClient(userId);
        default: return new ApiClient(userId, config.api.backendUrl);
    }
}

export interface Client {
    createRoom(): Promise<string>;

    registerUser(roomId: string): Promise<string>;

    getRoom(roomId: string): Promise<Room>;

    reveal(roomId: string): Promise<string>;

    conceal(roomId: string): Promise<string>;

    submitCard(roomId: string, card: number): Promise<string>;

    reset(roomId: string): Promise<string>;
}

export class MockClient implements Client {
    private state: Room = {
        roomId: uuidv4(),
        revealed: false,
        hostUserId: uuidv4(),
        users: [],
    };

    constructor(private userId: string) {
        this.state.hostUserId = userId;
    }

    createRoom(): Promise<string> {
        return new Promise((resolve, _reject) => resolve(this.state.roomId));
    }

    registerUser(roomId: string): Promise<string> {
        this.state.users.push({
            roomId,
            userId: this.userId,
            card: '',
        });
        this.state.hostUserId = this.userId;
        return new Promise((resolve, _reject) => resolve(this.userId));
    }

    getRoom(_roomId: string): Promise<Room> {
        return new Promise((resolve, _reject) => resolve(this.state));
    }

    reveal(_roomId: string): Promise<string> {
        this.state.revealed = true;
        return new Promise((resolve, _reject) => resolve(''));
    }

    conceal(_roomId: string): Promise<string> {
        this.state.revealed = false;
        return new Promise((resolve, _reject) => resolve(''));
    }

    submitCard(_roomId: string, card: number): Promise<string> {
        this.state.users = this.state.users.map(user => user.userId === this.userId ? { ...user, card: `${card}` } : user);
        return new Promise((resolve, _reject) => resolve(''));
    }

    reset(_roomId: string): Promise<string> {
        this.state.users = this.state.users.map(user => user.userId === this.userId ? { ...user, card: '' } : user);
        this.state.revealed = false;
        return new Promise((resolve, _reject) => resolve(''));
    }
}

export class ApiClient implements Client {
    constructor(private userId: string, private backendUrl: string) {
    }

    async createRoom(): Promise<string> {
        let roomId = uuidv4();
        return fetch(`${this.backendUrl}/rooms/${roomId}`, {method: "POST", body: this.userId})
            .then(response => response.text());
    }

    async registerUser(roomId: string): Promise<string> {
        return fetch(`${this.backendUrl}/rooms/${roomId}/users/${this.userId}`, {method: "POST"})
            .then(response => response.text());
    }

    async getRoom(roomId: string): Promise<Room> {
        return fetch(`${this.backendUrl}/rooms/${roomId}`).then(response => response.json());
    }

    async reveal(roomId: string): Promise<string> {
        return fetch(`${this.backendUrl}/rooms/${roomId}/reveal`, {method: "POST"})
            .then(response => response.text());
    }

    async conceal(roomId: string): Promise<string> {
        return fetch(`${this.backendUrl}/rooms/${roomId}/conceal`, {method: "POST"})
            .then(response => response.text());
    }

    async submitCard(roomId: string, card: number): Promise<string> {
        return fetch(`${this.backendUrl}/rooms/${roomId}/users/${this.userId}`, {method: "PUT", body: `${card}`})
            .then(response => response.text());
    }

    async reset(roomId: string): Promise<string> {
        return fetch(`${this.backendUrl}/rooms/${roomId}/reset`, {method: "POST"})
            .then(response => response.text());
    }
}
