import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <h1>Hello this is home</h1>
      <Link to="/flight">flight form</Link>
      <Link to="/passenger">passenger form</Link>
      <Link to="/flightlist">flight list</Link>
    </>
  );
};
