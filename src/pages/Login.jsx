import React, {useEffect, useState} from 'react'
import { useAuth } from '../utils/AuthContext'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import '../index.css'


const LoginPage = () => {
    const {user, handleUserLogin} = useAuth();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
      email:'',
      password: ''
    })
    useEffect(() => {
        if (user){
            navigate('/')
        }
    }, [])

    const handleInputChange = (e) =>  {
        let name = e.target.name;
        let value = e.target.value;

        setCredentials({...credentials, [name]:value})
        // reason of using [name] instead name is we want to access
        // dynamic value means if name change this value will also change
    }


  return (

      <div className="auth--container">
          <div className="form--wrapper">
            <form onSubmit={(e) => {handleUserLogin(e, credentials)}}>
                <div className="field--wrapper">
                  <label>Email:</label>
                  <input 
                  required
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  value={credentials.email}
                  onChange={(e) => {handleInputChange(e)}}
                  />
                </div>

                <div  className="field--wrapper">
                  <label>Password:</label>
                  <input 
                  required
                  type="password"
                  name="password"
                  placeholder="Enter password..."
                  value={credentials.password}
                  onChange={(e) => {handleInputChange(e)}}
                  />
                </div>

                <div className="field--wrapper">

                  <input 
                  type="submit"
                  value="Login"
                  className="btn btn--lg btn--main"
                  />

                </div>
            </form>

            <p>Dont have an account? Register <Link to="/register">here</Link></p>
          </div>
      </div>

  )
}

export default LoginPage