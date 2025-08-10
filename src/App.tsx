import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { useAppDispatch } from './hooks/useAppDispatch';
import { loadSavedForms, persistForms } from './store/formBuilderSlice';
import Layout from './components/Layout';
import FormBuilder from './pages/FormBuilder';
import FormPreview from './pages/FormPreview';
import MyForms from './pages/MyForms';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSavedForms());
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(persistForms());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/create" element={<FormBuilder />} />
      <Route path="/preview" element={<FormPreview />} />
      <Route path="/myforms" element={<MyForms />} />
      <Route path="/" element={<Navigate to="/create" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
