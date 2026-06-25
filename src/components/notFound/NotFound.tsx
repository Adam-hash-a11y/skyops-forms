import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <h2>404 - Page Not Found</h2>
      <Link to="/flight">Back to Home</Link>
    </>
  );
};
