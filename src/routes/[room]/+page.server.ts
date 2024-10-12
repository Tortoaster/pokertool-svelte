import {v4 as uuidv4} from "uuid";
import {BACKEND_URL} from '$env/static/private';
import {type Config, configFromEnv} from "$lib/config";
import {getClient} from "$lib/client";

const USER_COOKIE = 'user';

export interface MyPageData {
    userId: string;
    roomId: string,
    config: Config,
}

export async function load({cookies, params}): Promise<MyPageData> {
    let userId = cookies.get(USER_COOKIE);

    if (!userId) {
        userId = uuidv4();
        cookies.set(USER_COOKIE, userId!, {path: '/'});
    }

    const config = configFromEnv(BACKEND_URL);
    const client = getClient(userId!, config);

    const roomId = params.room;

    await client.registerUser(roomId);

    return {
        userId: userId!,
        roomId,
        config
    };
}
