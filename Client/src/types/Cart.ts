import type { CartProductEdit } from "./CartProduct";
import type { MessageResponse } from "./MessageReponse";

export interface Cart extends MessageResponse{
    cartId?: number;
    customerId?: string;
    cartProducts?: CartProductEdit[];
}