import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);

  const findTimeLeft = () => {
    const msLeft = new Date(order.expiresAt) - new Date();
    setTimeLeft(Math.round(msLeft/1000));
  };

  useEffect(() => {
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, []);

  const { errors, doRequest } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => router.push('/orders')
  });

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return <div>
    <h1>Ticket {order.ticket.title}</h1>
    <h4>Time left to pay: {timeLeft} seconds</h4>
    <StripeCheckout
      token={({ id }) => doRequest({token: id})}
      stripeKey="pk_test_51MRVXVE02hh7Ns4vbNu5Y8wPaSK2Ly6gKYuOKqWYLCRZNVUchjhbmr6hVETw6jqcAYyexdym4Qh4kpR78SlH7EHr00hU6kmBxn"
      amount={order.ticket.price*100}
      email={currentUser.email}
    />
    {errors}
  </div>
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
