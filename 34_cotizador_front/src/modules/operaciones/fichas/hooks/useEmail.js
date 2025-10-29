import { useMutation } from "@tanstack/react-query";
import { EmailService } from "../services/EmailService";
import { notify } from "../../../../utils/notifications";

export const useEmail = () => {
  const {
    mutate: sendEmailForGetAQuoteMutate,
    isPending: isSendingEmailForGetAQuote,
  } = useMutation({
    mutationFn: EmailService.sendEmailForGetAQuote,
    onSuccess: (message) => {
      notify.success(message);
    },
    onError: (error) => {
      notify.error(error);
    },
  });

  return {
    sendEmailForGetAQuoteMutate,
    isSendingEmailForGetAQuote,
  };
};
