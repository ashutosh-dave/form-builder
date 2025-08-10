import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { initializeForm, addField, saveForm, persistForms } from '../store/formBuilderSlice';
import FieldConfigurator from '../components/FieldConfigurator';
import FieldList from '../components/FieldList';
import { FormField, FieldType } from '../types';
import { RootState } from '../store';

const FormBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm, isFormModified } = useAppSelector((state: RootState) => state.formBuilder);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [showFieldConfig, setShowFieldConfig] = useState(false);

  useEffect(() => {
    dispatch(initializeForm());
  }, [dispatch]);

  const handleSaveForm = () => {
    if (formName.trim()) {
      dispatch(saveForm(formName.trim()));
      dispatch(persistForms());
      setShowSaveDialog(false);
      setFormName('');
    }
  };

  const handleAddField = (field: FormField) => {
    dispatch(addField(field));
    setShowFieldConfig(false);
  };

  if (!currentForm) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Form Builder
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => setShowSaveDialog(true)}
          disabled={!isFormModified || currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </Box>

      {currentForm.fields.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No fields added yet
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Start building your form by adding fields
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowFieldConfig(true)}
            sx={{ mt: 2 }}
          >
            Add First Field
          </Button>
        </Paper>
      )}

      {currentForm.fields.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <FieldList />
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Form Summary
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Fields: {currentForm.fields.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Required Fields: {currentForm.fields.filter((f: FormField) => f.required).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Derived Fields: {currentForm.fields.filter((f: FormField) => f.isDerived).length}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowFieldConfig(true)}
                fullWidth
                sx={{ mt: 2 }}
              >
                Add Field
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter a name for your form"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained" disabled={!formName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Configuration Dialog */}
      <FieldConfigurator
        open={showFieldConfig}
        onClose={() => setShowFieldConfig(false)}
        onSave={handleAddField}
      />
    </Box>
  );
};

export default FormBuilder;
