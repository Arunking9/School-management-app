import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { UserData, GoogleUser } from '../../types';
import { saveUserData } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    grade_level: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1])) as GoogleUser;
      setGoogleUser(decoded);
      setLoading(false);
    } catch (error) {
      setError('Failed to process Google login');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
    setLoading(false);
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return false;
    }
    if (!formData.grade_level) {
      setError('Please select your grade level');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!googleUser) {
      setError('Please sign in with Google first');
      setLoading(false);
      return;
    }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userData: UserData = {
        username: formData.username.trim(),
        grade_level: formData.grade_level,
        email: googleUser.email,
        google_id: googleUser.sub,
      };

      await saveUserData(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Student Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
            />
          </Box>

          {googleUser && (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                error={!!error && !formData.username.trim()}
                helperText={error && !formData.username.trim() ? error : ''}
              />
              <FormControl fullWidth margin="normal" error={!!error && !formData.grade_level}>
                <InputLabel id="grade-level-label">Grade Level</InputLabel>
                <Select
                  labelId="grade-level-label"
                  id="grade_level"
                  name="grade_level"
                  value={formData.grade_level}
                  label="Grade Level"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="1">Grade 1</MenuItem>
                  <MenuItem value="2">Grade 2</MenuItem>
                  <MenuItem value="3">Grade 3</MenuItem>
                  <MenuItem value="4">Grade 4</MenuItem>
                  <MenuItem value="5">Grade 5</MenuItem>
                  <MenuItem value="6">Grade 6</MenuItem>
                  <MenuItem value="7">Grade 7</MenuItem>
                  <MenuItem value="8">Grade 8</MenuItem>
                  <MenuItem value="9">Grade 9</MenuItem>
                  <MenuItem value="10">Grade 10</MenuItem>
                  <MenuItem value="11">Grade 11</MenuItem>
                  <MenuItem value="12">Grade 12</MenuItem>
                </Select>
                {error && !formData.grade_level && (
                  <Typography color="error" variant="caption">
                    {error}
                  </Typography>
                )}
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Continue'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 