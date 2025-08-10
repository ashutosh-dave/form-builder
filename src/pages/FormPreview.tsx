import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormHelperText,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import { useAppSelector } from '../hooks/useAppSelector';
import { FormField, ValidationRule, FormSchema } from '../types';
import { RootState } from '../store';

const FormPreview: React.FC = () => {
  const { currentForm } = useAppSelector((state: RootState) => state.formBuilder);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentForm) {
      // Initialize form data with default values
      const initialData: Record<string, any> = {};
      currentForm.fields.forEach((field: FormField) => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        } else {
          // Set appropriate default values based on field type
          switch (field.type) {
            case 'checkbox':
              initialData[field.id] = false;
              break;
            case 'select':
            case 'radio':
              initialData[field.id] = '';
              break;
            default:
              initialData[field.id] = '';
          }
        }
      });
      setFormData(initialData);
    }
  }, [currentForm]);

  useEffect(() => {
    if (currentForm) {
      // Calculate derived fields whenever parent fields change
      const derivedFields = currentForm.fields.filter((f: FormField) => f.isDerived);
      derivedFields.forEach((field: FormField) => {
        if (field.parentFields && field.derivedFormula) {
          try {
            const parentValues = field.parentFields.map(parentId => formData[parentId]);
            if (parentValues.every(val => val !== undefined && val !== '')) {
              // Create a safe evaluation context
              const context = {
                ...parentValues.reduce((acc, val, index) => {
                  acc[field.parentFields![index]] = val;
                  return acc;
                }, {} as Record<string, any>),
                // Add utility functions
                Date: Date,
                Math: Math,
                parseInt: parseInt,
                parseFloat: parseFloat,
              };
              
              // Evaluate the derived formula
              const derivedValue = new Function(...Object.keys(context), `return ${field.derivedFormula}`)(
                ...Object.values(context)
              );
              
              setFormData(prev => ({
                ...prev,
                [field.id]: derivedValue
              }));
            }
          } catch (error) {
            console.error(`Error calculating derived field ${field.label}:`, error);
          }
        }
      });
    }
  }, [currentForm, formData]);

  const validateField = (field: FormField, value: any): string[] => {
    const fieldErrors: string[] = [];

    field.validationRules.forEach(rule => {
      switch (rule.type) {
        case 'required':
          if (field.required && (value === undefined || value === null || value === '')) {
            fieldErrors.push(rule.message || 'This field is required');
          }
          break;
        case 'minLength':
          if (rule.value !== undefined && value && value.toString().length < rule.value) {
            fieldErrors.push(rule.message || `Minimum length is ${rule.value} characters`);
          }
          break;
        case 'maxLength':
          if (rule.value !== undefined && value && value.toString().length > rule.value) {
            fieldErrors.push(rule.message || `Maximum length is ${rule.value} characters`);
          }
          break;
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            fieldErrors.push(rule.message || 'Please enter a valid email address');
          }
          break;
        case 'password':
          if (value && (value.length < 8 || !/\d/.test(value))) {
            fieldErrors.push(rule.message || 'Password must be at least 8 characters and contain a number');
          }
          break;
      }
    });

    return fieldErrors;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value };
    setFormData(newFormData);

    // Validate the field
    const field = currentForm?.fields.find((f: FormField) => f.id === fieldId);
    if (field) {
      const fieldErrors = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: fieldErrors
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const allErrors: Record<string, string[]> = {};
    let hasErrors = false;

    currentForm?.fields.forEach((field: FormField) => {
      const fieldErrors = validateField(field, formData[field.id]);
      if (fieldErrors.length > 0) {
        allErrors[field.id] = fieldErrors;
        hasErrors = true;
      }
    });

    setErrors(allErrors);

    if (!hasErrors) {
      // Form is valid, you can handle submission here
      console.log('Form submitted successfully:', formData);
      alert('Form submitted successfully!');
    }

    setIsSubmitting(false);
  };

  const renderField = (field: FormField) => {
    const fieldValue = formData[field.id];
    const fieldErrors = errors[field.id] || [];
    const hasError = fieldErrors.length > 0;

    const commonProps = {
      fullWidth: true,
      error: hasError,
      helperText: fieldErrors.join(', '),
      disabled: field.isDerived,
      value: fieldValue || '',
      onChange: (e: any) => handleFieldChange(field.id, e.target.value),
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextField
            {...commonProps}
            type={field.type}
            label={field.label}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={4}
            label={field.label}
            required={field.required}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={hasError} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={fieldValue || ''}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={field.isDerived}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{fieldErrors.join(', ')}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl error={hasError} required={field.required}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label} {field.required && '*'}
            </Typography>
            <RadioGroup
              value={fieldValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={field.isDerived} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {hasError && <FormHelperText>{fieldErrors.join(', ')}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldValue || false}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                disabled={field.isDerived}
              />
            }
            label={field.label}
          />
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            type="date"
            label={field.label}
            required={field.required}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No form to preview. Please create a form first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Form Preview
      </Typography>
      
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {currentForm.name || 'Untitled Form'}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            This is how your form will appear to end users
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {currentForm.fields.map((field: FormField) => (
              <Grid item xs={12} key={field.id}>
                <Box sx={{ position: 'relative' }}>
                  {renderField(field)}
                  {field.isDerived && (
                    <Chip
                      label="Derived Field"
                      size="small"
                      color="secondary"
                      sx={{ position: 'absolute', top: -8, right: 0 }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setFormData({})}
            >
              Reset Form
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default FormPreview;
