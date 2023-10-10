import react, {useState, useEffect} from "react";
import io from 'socket.io-client';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Alert, Input,
} from "reactstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import Loader from "../../layouts/loader/Loader";
import {getAllLogins, deleteLogins, updateLogin} from '../../api/auth'
import React from "react";


function LoginRequests() {
  const { SearchBar } = Search;
  const [logins, setLogins] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [selected, setSelected] = useState([])

  const onDismiss = () => {
    setVisible(false);
  };
  const onDismiss1 = () => {
    setVisible1(false);
  };
  const onDismiss2 = () => {
    setVisible2(false);
  };
  const onDismiss3 = () => {
    setVisible3(false);
  };
  const onDismiss4 = () => {
    setVisible4(false);
  };

  const socket = io(process.env.REACT_APP_BACKEND_URL, {
    transports: ['websocket'],
  });

  const approveRequest = async (row) => {
    setLoading(true);
    const status = true
    const expiration_hours = row.expiration_hours
    const expiration_minutes = row.expiration_minutes
    const username = row.user.username
    const data ={
      expiration_hours, expiration_minutes, status, username
    }
    await updateLogin(row.id, data).then(response => {
      setLoading(false);
      setVisible3(true);
      setTimeout(() => {
        setVisible3(false)
      }, 2000);
      setLogins(logins.filter(login => login.id !== row.id));
    }).catch(err => {
      setLoading(false);
      setVisible1(true);
      setTimeout(() => {
        setVisible1(false)
      }, 2000);
    })
  }

  const deleteRequest = async (row) => {
    setLoading(true);
    await deleteLogins([row.id]).then(response => {
      setLoading(false);
      setLogins(logins.filter(login => login.id !== row.id));
      setVisible2(true);
      setTimeout(() => {
        setVisible2(false)
      }, 2000);
    }).catch(err => {
      setLoading(false);
      setVisible1(true);
      setTimeout(() => {
        setVisible1(false)
      }, 2000);
    })
  }

  const ActionButtonFormatter = (cell, row) => {
    return (
      <div className={'d-flex justify-content-center'}>
        <Button className={"btn btn-sm btn-success"} onClick={(event) => approveRequest(row)}>Approve</Button>
      </div>
    );
  };

  const DeclineButtonFormatter = (cell, row) => {
    return (
      <div className={'d-flex justify-content-center'}>
        <Button className={"btn btn-sm btn-warning"} onClick={(event) => deleteRequest(row)}>Decline</Button>
      </div>
    );
  };

  const PickerFormatter = (cell, row) => {
    return (
      <div className={'d-flex justify-content-center'}>
        <Button
          className={"btn btn-sm btn-info"}
          onClick={() => {
            const imageUrl = `${process.env.REACT_APP_BACKEND_URL}static/${cell}`;
            window.open(imageUrl, '_blank');
          }}
        >
          View
        </Button>
      </div>
    )
  }

  const CreatedAtFormatter = (cell, row) => {
    const date = new Date(cell);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    const formattedDate = `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return (
      <p>
        {formattedDate}
      </p>
    )
  }

  function PasswordColumn({ password }) {
    const [visible, setVisible] = useState(false);

    return (
      <div className={'d-flex flex-row justify-content-between'}>
        <span>{visible ? password : '****'}</span>
        <i
          className={`bi bi-eye${visible ? '-slash' : ''}`}
          style={{ cursor: 'pointer', marginLeft: '10px' }}
          onClick={() => setVisible(!visible)}
        ></i>
      </div>
    );
  }

  const updateHoursForLogin = (loginId, newHours) => {
    logins.forEach((login) => {
      if (login.id === loginId) {
          login.expiration_hours = newHours;
      }
    })
    setLogins(logins);
  };

  const updateMinutesForLogin = (loginId, newMins) => {
    logins.forEach((login) => {
      if (login.id === loginId) {
        login.expiration_minutes = newMins;
      }
    })
    setLogins(logins);
  };

  function ExpireHours({ loginId, initialHours, onHoursChange }) {
    const [hours, setHours] = useState(initialHours);

    const handleHoursChange = (e) => {
      const newHours = parseInt(e.target.value, 10);
      setHours(newHours);

      onHoursChange(loginId, newHours);
    };

    return (
      <div className={'d-flex flex-row justify-content-between'} style={{width: '100px'}}>
        <Input
          type="number"
          value={hours}
          onChange={handleHoursChange}
          required
          min="0"
        />
      </div>
    );
  }

  function ExpireMinutes({ loginId, initialMinutes, onMinsChange }) {
    const [mins, setMins] = useState(initialMinutes);

    const handleMinsChange = (e) => {
      const newMins = parseInt(e.target.value, 10);
      setMins(newMins);

      onMinsChange(loginId, newMins);
    };
    return (
      <div className={'d-flex flex-row justify-content-between'} style={{width: '100px'}}>
        <Input
          required={true}
          min="0"
          type={"number"}
          value={mins}
          onChange={handleMinsChange}
        />
      </div>
    );
  }

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      sort: true
    }, {
      dataField: 'user.name',
      text: 'Name',
      sort: true
    }, {
      dataField: 'user.username',
      text: 'Username',
      sort: true
    }, {
      dataField: 'user.picture',
      text: 'Picture',
      formatter: PickerFormatter
    }, {
      dataField: 'createdAt',
      text: 'Created At',
      formatter: CreatedAtFormatter
    }, {
      dataField: 'expiration_hours',
      text: 'Expire Hours',
      formatter: (cell, row) => <ExpireHours loginId={row.id} onHoursChange={updateHoursForLogin} initialHours={row.expiration_hours} />
    }, {
      dataField: 'expiration_minutes',
      text: 'Expire Mins',
      formatter: (cell, row) => <ExpireMinutes loginId={row.id} onMinsChange={updateMinutesForLogin} initialMinutes={row.expiration_minutes} />
    }, {
      dataField: 'approve',
      text: 'Approve',
      formatter: ActionButtonFormatter,
    }, {
      dataField: 'decline',
      text: 'Decline',
      formatter: DeclineButtonFormatter,
    },
  ]

  const onSelect = (row, isSelect) => {
    if (isSelect) {
      setSelected([...selected, row.id])
    } else {
      setSelected(selected.filter(x => x !== row.id))
    }
  }

  const onSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      setSelected(ids);
    } else {
      setSelected([])
    }
  }

  const selectRow = {
    mode: 'checkbox',
    selected: selected,
    onSelect: onSelect,
    onSelectAll: onSelectAll
  }

  // Listen for login request updates from the admin
  useEffect(() => {
    setLoading(true);
    getAllLogins().then(response => {
      setLoading(false);
      if (response.status === 200) {
        setLogins(response.data)
      }
    }).catch(err => {
      setLoading(false);

    })

    socket.on('request', (data) => {
      const finalObject = {
        ...data.record,
        user: { ...data.user },
      };
      setLogins((prevLogins) => [...prevLogins, finalObject]);
      setVisible4(true);
      setTimeout(() => {
        setVisible4(false)
      }, 2000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {
        loading ? <Loader /> :
          <Row>
            <Alert color="danger" isOpen={visible1} toggle={onDismiss1.bind(null)}>
              Un Known Error Occurred!
            </Alert>
            <Alert color="warning" isOpen={visible2} toggle={onDismiss2.bind(null)}>
              Login Request Deleted!
            </Alert>
            <Alert color="success" isOpen={visible3} toggle={onDismiss3.bind(null)}>
              Login Request Approved!
            </Alert>
            <Alert color="info" isOpen={visible4} toggle={onDismiss4.bind(null)}>
              A New Login Request!
            </Alert>
            <Col sm={12}>
              <Card>
                <CardTitle tag="h5" className="border-bottom p-3 mb-0">
                  <i className="bi bi-card-text me-2"> </i>
                  Login Requests
                </CardTitle>
                <CardBody className="">
                  <ToolkitProvider
                    keyField={'id'}
                    columns={columns}
                    data={logins}
                    search
                  >
                    {
                      props => (
                        <div>
                          <SearchBar { ...props.searchProps }  />
                          <hr />
                          <BootstrapTable
                            pagination={paginationFactory()}
                            { ...props.baseProps }
                          />
                        </div>
                      )
                    }
                  </ToolkitProvider>
                </CardBody>
              </Card>
            </Col>
          </Row>
      }
    </div>
  );
}

export default LoginRequests;