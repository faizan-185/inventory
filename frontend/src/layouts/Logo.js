import { ReactComponent as LogoDark } from "../assets/images/logos/adminpro.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
      <h4>Tawakkal Plai</h4>
    </Link>
  );
};

export default Logo;
