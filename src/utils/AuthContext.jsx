import React, { createContext, useState, useEffect, useContext } from 'react'
import { account } from '../appwriteConfig';
import { useNavigate } from 'react-router-dom';
import {ID} from 'appwrite';


const AuthContext = createContext();
export const AuthProvider = ({children}) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const userDetails = await account.get();
      setUser(userDetails);
    } catch (err) {
      console.log(err);
    }
    setLoading(false)
  }

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();

    try {
      const response = await account.createEmailSession(credentials.email, credentials.password);
      console.log("Logged In: ", response);
      const userDetails = await account.get();
      setUser(userDetails);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }

  const handleUserLogout = async () => {
    await account.deleteSession('current');
    setUser(null);
  }

  const handleUserRegister = async (e, credentials) => {
      e.preventDefault();

      if(credentials.password1 !== credentials.password2){
        alert("passwords do not match !!")
      }

      try {
        let response = await account.create(
          ID.unique(),
          credentials.email,
          credentials.password1,
          credentials.name
        );
        
        await account.createEmailSession(credentials.email, credentials.password);
        const userDetails = await account.get();
        setUser(userDetails);
        console.log("Register: ", response);
        navigate('/')

      } catch (err) {
        console.error(err);
      }
  }

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  }

  return (
    <AuthContext.Provider value={contextData}>
        {loading ? <p>loading...</p> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => { return useContext(AuthContext) }

export default AuthContext;