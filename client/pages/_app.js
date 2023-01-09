import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const App = ({ Component, pageProps }) => {
  return <div>
    <Header currentUser={pageProps.currentUser}/>
    <Component {...pageProps} />
  </div>
};

App.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {...data};

  if(appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { pageProps };
};

export default App;
