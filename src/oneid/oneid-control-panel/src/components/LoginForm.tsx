import { useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from 'react-oidc-context';

const cognitoCustomAttribute = 'custom:client_id';

export const LoginForm = () => {
  const {
    isAuthenticated,
    error,
    isLoading,
    signinRedirect,
    user,
    removeUser,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (
        user?.profile &&
        Object.hasOwn(user.profile, cognitoCustomAttribute) &&
        user.profile[cognitoCustomAttribute]
      ) {
        window.location.assign(
          `/dashboard/${user.profile[cognitoCustomAttribute]}`
        );
      } else {
        window.location.assign('/dashboard');
      }
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      return;
    }
    signinRedirect();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 3,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        OneIdentity Control Panel
      </Typography>
      {(error || !navigator.onLine) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error
            ? error.message
            : 'Network error. Please check your internet connection.'}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={!navigator.onLine || isLoading}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {!navigator.onLine ? 'Offline' : isLoading ? 'Logging in...' : 'Login'}
      </Button>
      {isAuthenticated && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={removeUser}
        >
          Logout
        </Button>
      )}
    </Box>
  );
};
