import React, { useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Collapse,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { updateField, deleteField, reorderFields } from '../store/formBuilderSlice';
import { FormField, FieldType, ValidationRule } from '../types';
import { RootState } from '../store';

const FieldList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((state: RootState) => state.formBuilder);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

  if (!currentForm || currentForm.fields.length === 0) {
    return null;
  }

  const handleDragStart = (index: number) => {
    setDragStartIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (dragStartIndex !== null && dragStartIndex !== index) {
      dispatch(reorderFields({ fromIndex: dragStartIndex, toIndex: index }));
    }
    setDragStartIndex(null);
  };

  const handleEditField = (fieldId: string) => {
    setEditingField(fieldId);
  };

  const handleSaveField = (fieldId: string, updates: Partial<FormField>) => {
    dispatch(updateField({ fieldId, updates }));
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(fieldId));
    }
  };

  const toggleFieldExpansion = (fieldId: string) => {
    setExpandedField(expandedField === fieldId ? null : fieldId);
  };

  const renderFieldEditor = (field: FormField) => (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Label"
            value={field.label}
            onChange={(e) => handleSaveField(field.id, { label: e.target.value })}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={field.type}
              label="Type"
              onChange={(e) => handleSaveField(field.id, { type: e.target.value as FieldType })}
            >
              {['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'].map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Placeholder"
            value={field.placeholder || ''}
            onChange={(e) => handleSaveField(field.id, { placeholder: e.target.value })}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Default Value"
            value={field.defaultValue || ''}
            onChange={(e) => handleSaveField(field.id, { defaultValue: e.target.value })}
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.required}
                onChange={(e) => handleSaveField(field.id, { required: e.target.checked })}
              />
            }
            label="Required Field"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={field.isDerived}
                onChange={(e) => handleSaveField(field.id, { isDerived: e.target.checked })}
              />
            }
            label="Derived Field"
          />
        </Grid>
        {field.isDerived && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Parent Fields (comma-separated)"
                value={field.parentFields?.join(', ') || ''}
                onChange={(e) => handleSaveField(field.id, { 
                  parentFields: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                })}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Derived Formula"
                value={field.derivedFormula || ''}
                onChange={(e) => handleSaveField(field.id, { derivedFormula: e.target.value })}
                size="small"
              />
            </Grid>
          </>
        )}
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setEditingField(null)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => setEditingField(null)}
        >
          Done
        </Button>
      </Box>
    </Box>
  );

  const renderFieldPreview = (field: FormField) => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip label={field.type} size="small" color="primary" />
        {field.required && <Chip label="Required" size="small" color="error" />}
        {field.isDerived && <Chip label="Derived" size="small" color="secondary" />}
      </Box>
      
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {field.placeholder && `Placeholder: ${field.placeholder}`}
        {field.defaultValue && ` | Default: ${field.defaultValue}`}
      </Typography>

      {field.validationRules.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Validations: {field.validationRules.map(r => r.type).join(', ')}
          </Typography>
        </Box>
      )}

      {field.isDerived && field.parentFields && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Depends on: {field.parentFields.join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Paper>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Form Fields</Typography>
        <Typography variant="body2" color="textSecondary">
          Drag and drop to reorder fields
        </Typography>
      </Box>
      
      <List>
        {currentForm.fields.map((field: FormField, index: number) => (
          <ListItem
            key={field.id}
            sx={{
              border: '1px solid #e0e0e0',
              margin: '8px',
              borderRadius: 1,
              backgroundColor: dragStartIndex === index ? '#f5f5f5' : 'white',
            }}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <IconButton
                size="small"
                sx={{ mr: 1, cursor: 'grab' }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <DragIcon />
              </IconButton>
              
              <ListItemText
                primary={field.label}
                secondary={renderFieldPreview(field)}
                sx={{ flexGrow: 1 }}
              />
              
              <ListItemSecondaryAction>
                <IconButton
                  size="small"
                  onClick={() => toggleFieldExpansion(field.id)}
                >
                  {expandedField === field.id ? <CollapseIcon /> : <ExpandIcon />}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEditField(field.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteField(field.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default FieldList;
