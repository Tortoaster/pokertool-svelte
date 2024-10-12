export interface Config {
    api: 'Local' | Server;
}

export function configFromEnv(backendUrl: string): Config {
    if (backendUrl) {
        return { api: { backendUrl } }
    } else {
        return { api: 'Local' }
    }
}

export interface Server {
    backendUrl: string;
}
