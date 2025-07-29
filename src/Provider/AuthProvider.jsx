import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "../Firebase/firebase.config";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    return signOut(auth);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();
  const googleLogIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const gitHubProvider = new GithubAuthProvider();
  const gitHubLogIn = () => {
    return signInWithPopup(auth, gitHubProvider);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email) {
        const userData = { email: currentUser.email };
        setUser(currentUser);
        setLoading(false);
        axios
          .post(`${import.meta.env.VITE_API_LINK}/jwt`, userData)
          .then((res) => {
            const token = res.data.token;
            localStorage.setItem("token", token);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.email]);

  const authData = {
    createUser,
    user,
    setUser,
    logOut,
    signInUser,
    loading,
    setLoading,
    googleLogIn,
    gitHubLogIn,
    updateUser,
    location,
    setLocation,
  };
  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
