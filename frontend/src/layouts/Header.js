import React, { useState } from "react";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Logo from "./Logo";
import { ReactComponent as LogoWhite } from "../assets/images/logos/adminprowhite.svg";
import user1 from "../assets/images/users/user4.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { updateHomeIndication } from "../api/auth";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [homeDateRange, setHomeDateRange] = useState(null);
  const [dateToDisplayModal, setDateToDisplayModal] = useState([{
    startDate: new Date(),
    endDate: new Date(),
  }])

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const handleToggle = () => {
    setOpen(!open)
    setHomeDateRange(null)
    setDateToDisplayModal([{
      startDate: new Date(),
      endDate: new Date(),
    }])
  }

  const formatDate = (date, isEndDate = false) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    if (isEndDate) {
      hours = '23';
      minutes = '59';
      seconds = '59';
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleDateChangeModal = (item) => {
    setDateToDisplayModal([item.range1])
    const formattedStartDate = formatDate(item.range1.startDate);
    const formattedEndDate = formatDate(item.range1.endDate, true);

    const newState =
    {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }

    setHomeDateRange(newState);
  };

  const handleModalClick = () => {
    setLoading(true)
    updateHomeIndication(homeDateRange).then(res => {
      handleToggle()
      setIsOpen(!isOpen);
      setLoading(false)
    }).catch(error => {
      handleToggle()
      setLoading(false)
    })
  }
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
          {
            user && user?.role === 'admin' ?
              <NavItem>
                <Link to="/requests" className="nav-link">
                  <strong>Login Requests</strong>
                </Link>
              </NavItem> : <></>
          }

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
            {
              user ? user.name : ""
            } &ensp;
            <img
              src={
                (user && user?.picture) ? `${process.env.REACT_APP_BACKEND_URL}static/${user?.picture}` : user1
              }
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem>My Account</DropdownItem>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem onClick={() => setOpen(true)}>Set Home Indication Dates</DropdownItem>
            <DropdownItem divider />
            {
              user && user?.role === 'admin' ?
                <DropdownItem>
                  <Link to={'/workers'} className='nav-link'>My Staff</Link>
                </DropdownItem> : <></>
            }
            {
              user && user?.role === 'admin' ?
                <DropdownItem>
                  <Link to={'/profit'} className='nav-link'>Profit Calculation</Link>
                </DropdownItem> : <></>
            }
            {
              user && user?.role === 'admin' ?
                <DropdownItem>
                  <Link to={'/indications'} className='nav-link'>Indications</Link>
                </DropdownItem> : <></>
            }
            <DropdownItem onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>

      <Modal isOpen={open} toggle={handleToggle} contentClassName={"pricing-modal"}>
        <ModalHeader toggle={handleToggle}>
          <strong>Select Pricing</strong>
        </ModalHeader>
        <ModalBody style={{ padding: "50px" }}>
          <h1 style={{ fontSize: "24px", color: "black" }}>Select Dates For &ensp; H O M E &ensp; Indications</h1>
          <div style={{ display: "flex", gap: " 25px", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <DateRange
              editableDateInputs={true}
              onChange={item => handleDateChangeModal(item)}
              moveRangeOnFirstSelection={false}
              ranges={dateToDisplayModal}
              maxDate={new Date()}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Button className={"btn btn-success"} onClick={handleModalClick} disabled={!homeDateRange}>
              Set home indication dates
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Navbar>
  );
};

export default Header;
