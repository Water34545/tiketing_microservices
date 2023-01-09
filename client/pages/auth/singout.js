import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const SingOut = () => {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: '/api/users/singout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/')
  });

  useEffect( () => {
    void doRequest();
  }, [])

  return <div>Singing you out...</div>
}

export default SingOut;
