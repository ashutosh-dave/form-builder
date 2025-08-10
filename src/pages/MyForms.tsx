import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { loadForm, clearCurrentForm, persistForms } from '../store/formBuilderSlice';
import { FormSchema, FormField } from '../types';
import { RootState } from '../store';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedForms } = useAppSelector((state: RootState) => state.formBuilder);

  const handleViewForm = (form: FormSchema) => {
    dispatch(loadForm(form.id));
    navigate('/preview');
  };

  const handleEditForm = (form: FormSchema) => {
    dispatch(loadForm(form.id));
    navigate('/create');
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      // Remove from saved forms
      const updatedForms = savedForms.filter((f: FormSchema) => f.id !== formId);
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
      
      // Reload the page to refresh the state
      window.location.reload();
    }
  };

  const handleCreateNewForm = () => {
    dispatch(clearCurrentForm());
    navigate('/create');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFormStats = (form: FormSchema) => {
            const totalFields = form.fields.length;
        const requiredFields = form.fields.filter((f: FormField) => f.required).length;
        const derivedFields = form.fields.filter((f: FormField) => f.isDerived).length;
    
    return { totalFields, requiredFields, derivedFields };
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Forms
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No forms created yet
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Start building your first form to get started
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreateNewForm}
        >
          Create Your First Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNewForm}
        >
          Create New Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        {savedForms.map((form: FormSchema) => {
          const stats = getFormStats(form);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={form.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {form.name}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Created: {formatDate(form.createdAt)}
                  </Typography>
                  
                  {form.updatedAt !== form.createdAt && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Updated: {formatDate(form.updatedAt)}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${stats.totalFields} Fields`}
                      size="small"
                      color="primary"
                    />
                    {stats.requiredFields > 0 && (
                      <Chip
                        label={`${stats.requiredFields} Required`}
                        size="small"
                        color="error"
                      />
                    )}
                    {stats.derivedFields > 0 && (
                      <Chip
                        label={`${stats.derivedFields} Derived`}
                        size="small"
                        color="secondary"
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="textSecondary">
                    {form.fields.length > 0 
                      ? `Field types: ${Array.from(new Set(form.fields.map((f: FormField) => f.type))).join(', ')}`
                      : 'No fields configured'
                    }
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleViewForm(form)}
                      title="Preview Form"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditForm(form)}
                      title="Edit Form"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteForm(form.id)}
                    color="error"
                    title="Delete Form"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {savedForms.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Total Forms: {savedForms.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MyForms;
