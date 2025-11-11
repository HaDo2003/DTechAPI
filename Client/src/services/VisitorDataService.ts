import axios from "axios";
import { handleAxiosError } from "../utils/handleAxiosError";
import type { ServiceResponse } from "../types/Admin";

export const visitorDataService = {
    async updateVisitorCount(): Promise<ServiceResponse<null>> {
        try {
            const response = await axios.put<ServiceResponse<null>>(
                "/api/visitorData/update-visitor-count",
                null
            );
            return response.data;
        } catch (err: any) {
            return handleAxiosError(
                err,
                "Failed to update visitor count. Please try again."
            );
        }
    },
};
