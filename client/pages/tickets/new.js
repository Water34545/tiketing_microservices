import { useState  } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: () => router.push('/'),
  });

  const onSubmit = async e => {
    e.preventDefault();
    await doRequest();
    setTitle('');
    setPrice('');
  }

  const onBlur = () => {
    const value = parseFloat(price);
    if(!isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  return <div>
    <h1>Create new Ticket</h1>
    <form onSubmit={onSubmit}>
      <div className='form-group mb-3'>
        <label>title</label>
        <input
          type='text'
          className='form-control'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className='form-group mb-3'>
        <label>Price</label>
        <input
          type='number'
          className='form-control'
          onBlur={onBlur}
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Submit</button>
    </form>
  </div>
};

export default NewTicket;
