import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Tooltip } from 'react-tooltip';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from './Firebase';
import { Slide, toast } from 'react-toastify';

const SignInOut = () => {
  const [user] = useAuthState(auth);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const getInitials = (name) => {
    const nameParts = name?.split(' ');
    const firstNameInitial = nameParts[0]?.charAt(0).toUpperCase();
    const secondNameInitial = nameParts[1]?.charAt(0).toUpperCase() || firstNameInitial;
    return `${firstNameInitial} ${secondNameInitial}`;
  };

  useEffect(() => {
    console.log(user);
    if (user) {
      toast.success(`Welcome! ${user.displayName}`, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [user]); // This will run whenever the user changes

  return (
    <div>
      {user ? (
          <button className='logoutIcon' onClick={handleSignOut}data-tooltip-id="my-tooltip" data-tooltip-content={`Hello! ${user.displayName}`} data-tooltip-place="top">
            <h1>{getInitials(user.displayName)}</h1>
          </button>
      ) : (
          <button className='loginIcon'  onClick={handleGoogleSignIn} data-tooltip-id="my-tooltip" data-tooltip-content="Click to Sign in" data-tooltip-place="top">
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '2rem' }} />
          </button>
      )}
      <Tooltip id="my-tooltip" />
    </div>
  );
};

export default SignInOut;
