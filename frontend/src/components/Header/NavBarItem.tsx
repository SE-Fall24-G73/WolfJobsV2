/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";

const NavBarItem = (props: {
  link: string;
  text: string;
  setMobileMenuOpen?: any;
  mobileMenuOpen?: boolean;
}) => {
  const { link, text, setMobileMenuOpen, mobileMenuOpen } = props;
  return (
    <>
      <li onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Link to={link} className="hover:text-slate-500">
          {text}
        </Link>
      </li>
    </>
  );
};

export default NavBarItem;