import { PayPalButton } from "react-paypal-button-v2";
import { socket } from "../../config/socket";

const PayPal = ({
  uid,
  paymentValue,
  numCoins,
  client_secret,
  handleSuccess,
  handlePermitionFail,
  idToken,
  tableId,
}) => {
  return (
    <div className="paypal-btn">
      <PayPalButton
        amount={paymentValue}
        shippingPreference="NO_SHIPPING"
        style={{ layout: "vertical", color: "blue" }}
        onSuccess={(details, data) => {
          // console.log(
            "Transaction completed by " + details.payer.name.given_name
          );
          // console.log("Transaction completed details " + details);
          socket.emit("addCoins", {
            userId: uid,
            tableId: tableId,
            amt: numCoins,
            usd: paymentValue,
            payMethod: "Paypal",
            cardNr: "Paypal",
          });
          handleSuccess();
          // OPTIONAL: Call your server to save the transaction
          return fetch("/paypal-transaction-complete", {
            method: "post",
            body: JSON.stringify({
              orderId: data.orderID,
            }),
          });
        }}
        options={{
          clientId:
            "AQkFl5zabASw8uupNCumRon-yuoDg10u8A92mhtMDNNSpkteln1ceS0F8bNFdvFVzJv3PgSd5GEApbXr&disable-funding=credit,card",
        }}
      />
    </div>
  );
};

export default PayPal;
