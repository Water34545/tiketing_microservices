const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are singed in</h1> : <h1>You are NOT singed in</h1>;
};
export default LandingPage;
