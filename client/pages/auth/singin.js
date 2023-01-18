import { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => router.push('/')
  });

  const onSubmit = async e => {
    e.preventDefault();

    await doRequest();
    setEmail('');
    setPassword('');
  }

  return <form onSubmit={onSubmit}>
    <h1>Sign In</h1>
    <div className='form-group mb-3'>
      <label>E-mail address</label>
      <input
        className='form-control'
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </div>
    <div className='form-group mb-3'>
      <label>Password</label>
      <input
        className='form-control'
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </div>
    {errors}
    <button className='btn btn-primary'>Sign In</button>
  </form>
}

export default SignUp;
