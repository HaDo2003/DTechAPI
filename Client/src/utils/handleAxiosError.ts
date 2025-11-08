import axios from "axios";
import type { ServiceResponse } from "../types/Admin";

export function handleAxiosError(err: any, defaultMessage: string): ServiceResponse<any> {
    if (axios.isAxiosError(err)) {
        let message = defaultMessage;
        if (typeof err.response?.data === "string") {
            message = err.response.data;
        } else if (typeof err.response?.data?.message === "string") {
            message = err.response.data.message;
        } else if (err.response?.data) {
            message = JSON.stringify(err.response.data);
        }
        return { success: false, message };
    }
    return { success: false, message: "Unexpected error occurred" };
}