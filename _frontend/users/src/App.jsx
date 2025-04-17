import React, { useState, useEffect,useRef } from 'react';
import { Form, Button, Table, Container, Row, Col  } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

const URL = "/api";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // State variables 
  // we will use the useState hook to manage the state of the application
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [editMode,setMode] = useState({mode:false,key:-1})
  const addKey=useRef(null)


  // Fetch all users on component mount
  // the server side app that we are running on Python/Flask will be responsible for returning the list of users
  
  useEffect(() => {
    axios.get(`${URL}/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Handle form submission for creating a new user
  const handleSubmit = (event) => {
    event.preventDefault();
    // to create a new user POST method is used
    axios.post(`${URL}/users`, { name, email })
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
      })
      .catch(error => {
        console.error(error);
      });
  };
  // Handle form submission for updating an existing user
  const handleUpdate = (user) => {
    if(editMode.mode===false){
      setMode({mode:true,key:user.id})
      setName(user.name)
      setEmail(user.email)
      addKey.current.setAttribute("disabled", true)
    }
    else{
      setMode({mode:false,key:-1})
      addKey.current.removeAttribute("disabled")
      // to update an existing user PUT method is used
      axios.put(`${URL}/users/${user.id}`, { name, email })
      .then(response => {
        setUsers(users.map(u =>{
            if(u.id===user.id){
              u.name=name;
              u.email=email;
              return u
            }
            else{
              return u
            }
        }))
        setName('');
        setEmail('');
      })
      .catch(error => {
        console.error(error);
      });
    }
  };

  // Handle deletion of a user
  const handleDelete = (user) => {
    // to delete a user DELETE method is used
    axios.delete(`${URL}/users/${user.id}`)
      .then(response => {
        if (response.status === 200) {
          setUsers(users.filter(u => u.id !== user.id));
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Container>
    
      <h1>Flask Based CRUD Application</h1>
      <Form onSubmit={handleSubmit}>
      <Row>
        <Col className='y-2'>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" value={name} onChange={event => setName(event.target.value)} />
        </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className='y-2'>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={event => setEmail(event.target.value)} />
          {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
        </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className='y-2'>
        <Button variant="primary" type="submit" ref={addKey} className='btn btn-primary'>
          Add User
        </Button>
        </Col>
      </Row>
      </Form>
      <Row>
      <Col className='y-2'>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="primary" onClick={() => handleUpdate(user)}>
                {editMode.key===user.id?<>OK</>:<>Edit</>}
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(user)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Col>
      </Row>
    </Container>
  );
}

export default App;

