import { useEffect } from "react";
import { EventName, events } from "zmp-sdk";
import { useNavigate } from "zmp-ui";

export const useHandlePayment = () => {
  const navigate = useNavigate();
  useEffect(() => {
    events.on(EventName.OpenApp, (data) => {
      if (data?.path) {
        navigate(data?.path, {
          state: data,
        });
      }
    });

    events.on(EventName.OnDataCallback, (resp) => {
      const { appTransID, eventType } = resp;
      if (appTransID || eventType === "PAY_BY_CUSTOM_METHOD") {
        navigate("/result", {
          state: resp,
        });
      }
    });

    events.on(EventName.PaymentClose, (data = {}) => {
      const { zmpOrderId } = data as { zmpOrderId?: string };
      navigate("/result", {
        state: { data: { zmpOrderId } },
      });
    });
  }, []);
};

