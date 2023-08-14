import React from "react";
import {
  Navbar,
  NavItem,
  Collapse,
  Nav,
  NavbarBrand,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import Logo from "./Logo";
import { ReactComponent as LogoWhite } from "../assets/images/logos/adminprowhite.svg";
import user1 from "../assets/images/users/user4.jpg";
import {Link} from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  return (
    <Navbar color="white" light expand="md" className="fix-header">
      <div className="d-flex align-items-center">
        <div className="d-lg-block d-none me-5 pe-3">
          <Logo />
        </div>
        <NavbarBrand href="/">
          <LogoWhite className="d-lg-none" />
        </NavbarBrand>
        {/*<Button*/}
        {/*  color="primary"*/}
        {/*  className=" d-lg-none"*/}
        {/*  onClick={() => showMobilemenu()}*/}
        {/*>*/}
        {/*  <i className="bi bi-list"></i>*/}
        {/*</Button>*/}
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to="/starter" className="nav-link">
              <strong>Home</strong>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/suppliers" className="nav-link">
              <strong>Suppliers</strong>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/customers" className="nav-link">
              <strong>Customers</strong>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/stock-in" className="nav-link">
              <strong>Stock in</strong>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/pricing" className="nav-link">
              <strong>Pricing</strong>
            </Link>
          </NavItem>
          {/*<UncontrolledDropdown inNavbar nav>*/}
          {/*  <DropdownToggle caret nav>*/}
          {/*    DD Menu*/}
          {/*  </DropdownToggle>*/}
          {/*  <DropdownMenu end>*/}
          {/*    <DropdownItem>Option 1</DropdownItem>*/}
          {/*    <DropdownItem>Option 2</DropdownItem>*/}
          {/*    <DropdownItem divider />*/}
          {/*    <DropdownItem>Reset</DropdownItem>*/}
          {/*  </DropdownMenu>*/}
          {/*</UncontrolledDropdown>*/}
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="transparent">
            <img
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem>My Account</DropdownItem>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>My Firm</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
    </Navbar>
  );
};

export default Header;
