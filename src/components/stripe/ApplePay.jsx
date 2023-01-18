import React, { useEffect, useState, useMemo } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";
import { socket } from "../../config/socket";

const useOptions = (paymentRequest) => {
  const options = useMemo(
    () => ({
      paymentRequest,
      style: {
        paymentRequestButton: {
          theme: "dark",
          height: "38px",
          type: "buy",
        },
      },
    }),
    [paymentRequest]
  );

  return options;
};

const usePaymentRequest = ({
  options,
  client_secret,
  handleSuccess,
  handlePermitionFail,
  uid,
  paymentValue,
  idToken,
  numCoins,
  tableId,
}) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest(options);
      setPaymentRequest(pr);
    }
  }, [stripe, options, paymentRequest]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest.canMakePayment().then((res) => {
        if (res && subscribed) {
          setCanMakePayment(true);
        }
      });
    }

    return () => {
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.on("paymentmethod", async (ev) => {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            client_secret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          ev.complete("fail");
          handlePermitionFail();
        } else if (paymentIntent) {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete("success");
          if (paymentIntent.status === "succeeded") {
            socket.emit("addCoins", {
              userId: uid,
              tableId: tableId,
              amt: numCoins,
              usd: paymentValue,
              payMethod: "Apple Pay",
              cardNr: "Apple Pay",
            });
            handleSuccess();
          }
          if (paymentIntent.code === "card_declined") {
            handlePermitionFail("Card Declined");
          }
          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11"
          // instead check for: `paymentIntent.status === "requires_source_action"`.
        }
      });
    }
    return () => {
      if (paymentRequest) {
        paymentRequest.off("paymentmethod");
      }
    };
  }, [
    paymentRequest,
    client_secret,
    handlePermitionFail,
    handleSuccess,
    idToken,
    paymentValue,
    uid,
    stripe,
    numCoins,
    tableId,
  ]);

  return canMakePayment ? paymentRequest : null;
};

const ApplePay = ({
  uid,
  paymentValue,
  numCoins,
  client_secret,
  handleSuccess,
  handlePermitionFail,
  idToken,
  tableId,
}) => {
  const paymentRequest = usePaymentRequest({
    options: {
      country: "US",
      currency: "usd",
      total: {
        label: "Apple Pay",
        amount: paymentValue,
      },
    },
    client_secret,
    handleSuccess,
    handlePermitionFail,
    uid,
    paymentValue,
    idToken,
    numCoins,
    tableId,
  });
  const options = useOptions(paymentRequest);
  if (!paymentRequest) {
    return null;
  }

  return (
    <>
      <h1>Apple Pay</h1>
      <PaymentRequestButtonElement
        className="PaymentRequestButton"
        options={options}
        onReady={() => {
          // console.log("PaymentRequestButton [ready]");
        }}
        onClick={(event) => {
          // console.log("PaymentRequestButton [click]", event);
        }}
        onBlur={() => {
          // console.log("PaymentRequestButton [blur]");
        }}
        onFocus={() => {
          // console.log("PaymentRequestButton [focus]");
        }}
      />
    </>
  );
};

export default ApplePay;
