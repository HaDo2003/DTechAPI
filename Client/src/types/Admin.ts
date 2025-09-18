import type { MessageResponse } from "./MessageReponse";

export interface Admin extends MessageResponse{
    avatar?: string;
    userName?: string;
    createDate?: string;
}