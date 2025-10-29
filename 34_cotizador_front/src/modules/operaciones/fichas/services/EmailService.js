import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

export const EmailService = {
  sendEmailForGetAQuote: async (data) => {
    try {
      const url = `/v1/emails/send-email-for-get-a-quote`;
      const { data: response } = await api.post(url, data);
      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  },
};
