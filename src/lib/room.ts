import type {User} from "$lib/user";

export interface Room {
  roomId: string,
  revealed: boolean,
  hostUserId: string,
  users: User[],
}
