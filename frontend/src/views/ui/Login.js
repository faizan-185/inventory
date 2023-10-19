import react, {useEffect, useState} from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Alert
} from "reactstrap";
import {adminLogin, workerLogin, workerLoginRequest} from "../../api/auth";
import Loader from "../../layouts/loader/Loader";
import React from "react";
import {useNavigate} from "react-router-dom";
import io from 'socket.io-client';

const Login = () => {
  const [selectedOption, setSelectedOption] = useState('worker');
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [approved, setApproved] = useState(false);

  const navigate = useNavigate();

  const socket = io(process.env.REACT_APP_BACKEND_URL, {
    transports: ['websocket'],
  });

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
  const onDismiss5 = () => {
    setVisible5(false);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const loginUser = async (event) => {
    event.preventDefault();
    if (selectedOption === 'admin') {
      setIsLoading(true);
      await adminLogin(username, password).then(response => {
        setIsLoading(false);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          const user = {
            name: response.data.user.name,
            role: response.data.user.role,
            picture: response.data.user.picture
          }
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/starter')
        }
      }).catch(error => {
        setIsLoading(false);
        if (error.response.status === 401) {
          setVisible2(true);
          setTimeout(() => {
            setVisible2(false)
          }, 2000);
        } else {
          if (error.response.data === 'No Such User Found!') {
            setVisible(true);
            setTimeout(() => {
              setVisible(false)
            }, 2000);
          } else if (error.response.data === 'Incorrect Password!') {
            setVisible1(true);
            setTimeout(() => {
              setVisible1(false)
            }, 2000);
          }
        }
      })
    } else if(selectedOption === 'worker' && approved) {
      setIsLoading(true);
      workerLogin(username, password).then(response => {
        setIsLoading(false);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          const user = {
            name: response.data.user.name,
            role: response.data.user.role,
            picture: response.data.user.picture
          }
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/customers')
        }
      }).catch(error => {
        setIsLoading(false);
        if (error.response.status === 401) {
          setVisible2(true);
          setTimeout(() => {
            setVisible2(false)
          }, 2000);
        } else {
          if (error.response.data === 'No Such User Found!') {
            setVisible(true);
            setTimeout(() => {
              setVisible(false)
            }, 2000);
          } else if (error.response.data === 'Incorrect Password!') {
            setVisible1(true);
            setTimeout(() => {
              setVisible1(false)
            }, 2000);
          }
        }
      })
    } else {
      setIsLoading(true);
      await workerLoginRequest(username).then((response) => {
        if(response.status === 201) {
          setIsLoading(false);
          setVisible3(true);
          setTimeout(() => {
            setVisible3(false)
          }, 2000);
          socket.on('approved', (data) => {
            if (username === data.username) {
              setVisible5(true);
              setTimeout(() => {
                setVisible5(false)
              }, 2000);
              setApproved(true)
            }
          });
        } else if(response.status === 200) {
          setIsLoading(false);
          setVisible4(true);
          setTimeout(() => {
            setVisible4(false)
          }, 2000);
        }
      }).catch((error) => {
        setIsLoading(false);
        if (error.response.status === 404) {
          setVisible(true);
          setTimeout(() => {
            setVisible(false)
          }, 2000);
        } else {
          setVisible2(true);
          setTimeout(() => {
            setVisible2(false)
          }, 2000);
        }
      })
    }
  }

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {
        isLoading ? <Loader /> :
          <Row>
            <Alert style={{width: '320px', position: 'absolute', right: '20px', top: '20px'}} color="warning" isOpen={visible} toggle={onDismiss.bind(null)}>
              Invalid Username!
            </Alert>
            <Alert style={{width: '320px', position: 'absolute', right: '20px', top: '20px'}} color="danger" isOpen={visible1} toggle={onDismiss1.bind(null)}>
              Incorrect Password!
            </Alert>
            <Alert  style={{width: '320px', position: 'absolute', right: '20px', top: '20px'}} color="danger" isOpen={visible2} toggle={onDismiss2.bind(null)}>
              Un Known Error Occurred!
            </Alert>
            <Alert style={{width: '320px', position: 'absolute', right: '20px', top: '20px'}} color="success" isOpen={visible3} toggle={onDismiss3.bind(null)}>
              Login Request Sent!
            </Alert>
            <Alert style={{width: '320px', position: 'absolute', right: '20px', top: '20px'}} color="info" isOpen={visible4} toggle={onDismiss4.bind(null)}>
              Login Request Is Already Sent!
            </Alert>
            <Alert style={{width: '320px', position: 'absolute', right: '20px', top: '20px'}} color="success" isOpen={visible5} toggle={onDismiss5.bind(null)}>
              Login Request Approved!
            </Alert>
            <div className="d-flex pt-4 justify-content-center">
              <Card style={{minWidth: '320px'}}>
                <CardHeader>
                  <CardTitle>
                    <h3 className={'d-flex justify-content-center'}>LOGIN</h3>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <div>
                      <FormGroup check inline>
                        <Label check>
                          <input
                            type="radio"
                            id="radio1"
                            name="radioOptions"
                            value="worker"
                            checked={selectedOption === 'worker'}
                            onChange={handleOptionChange}
                          />{" "}
                          Worker
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <input
                            type="radio"
                            id="radio2"
                            name="radioOptions"
                            value="admin"
                            checked={selectedOption === 'admin'}
                            onChange={handleOptionChange}
                          /> {" "}
                          Admin
                        </Label>
                      </FormGroup>
                    </div>
                    <FormGroup>
                      <Label for="username">Username</Label>
                      <Input type="text" name="username" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" />
                    </FormGroup>
                    {
                      selectedOption === 'admin' || approved ?
                        <FormGroup>
                          <Label for="password">Password</Label>
                          <Input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
                        </FormGroup> : <></>
                    }
                    <Button
                      color="primary"
                      block
                      onClick={loginUser}
                    >{selectedOption === 'worker' ? 'Request For Login' : 'Login'}</Button>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </Row>
      }
    </div>
  );
}

export default Login;
