import {v4 as uuidv4} from "uuid";
import {BACKEND_URL} from '$env/static/private';
import {redirect} from "@sveltejs/kit";
import {getClient} from "$lib/client";
import {configFromEnv} from "$lib/config";

const USER_COOKIE = 'user';

export async function load({cookies}) {
    let userId = cookies.get(USER_COOKIE);

    if (!userId) {
        userId = uuidv4();
        cookies.set(USER_COOKIE, userId!, {path: '/'});
    }

    const config = configFromEnv(BACKEND_URL);
    const client = getClient(userId!, config);
    const roomId = await client.createRoom();

    redirect(303, `/${roomId}`);
}
