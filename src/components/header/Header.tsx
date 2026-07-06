import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <>
      <h2>Hello I'm the header</h2>
      <Link to="/"> Home</Link>
      <Link to="/flight">Flight Form</Link>
      <Link to="/passenger">Passenger Form</Link>
      <Link to="/counter">Counter </Link>
    </>
  );
};
