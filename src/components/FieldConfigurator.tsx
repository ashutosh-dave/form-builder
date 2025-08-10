import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  IconButton,
  Grid,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FormField, FieldType, ValidationRule, SelectOption } from '../types';

interface FieldConfiguratorProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
}

const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({ open, onClose, onSave }) => {
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [isDerived, setIsDerived] = useState(false);
  const [parentFields, setParentFields] = useState<string[]>([]);
  const [derivedFormula, setDerivedFormula] = useState('');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');

  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
  ];

  const validationTypes = [
    { type: 'required', label: 'Required', needsValue: false },
    { type: 'minLength', label: 'Min Length', needsValue: true },
    { type: 'maxLength', label: 'Max Length', needsValue: true },
    { type: 'email', label: 'Email Format', needsValue: false },
    { type: 'password', label: 'Password Rules', needsValue: false },
  ];

  const resetForm = () => {
    setFieldType('text');
    setLabel('');
    setRequired(false);
    setDefaultValue('');
    setPlaceholder('');
    setIsDerived(false);
    setParentFields([]);
    setDerivedFormula('');
    setOptions([]);
    setValidationRules([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!label.trim()) return;

    const field: FormField = {
      id: Date.now().toString(),
      type: fieldType,
      label: label.trim(),
      required,
      defaultValue: defaultValue || undefined,
      validationRules,
      isDerived,
      parentFields: isDerived ? parentFields : undefined,
      derivedFormula: isDerived ? derivedFormula : undefined,
      options: ['select', 'radio'].includes(fieldType) ? options : undefined,
      placeholder: placeholder || undefined,
      order: 0, // Will be set by the parent component
    };

    onSave(field);
  };

  const addValidationRule = (type: string) => {
    const rule: ValidationRule = {
      type: type as any,
      message: `Please enter a valid ${type}`,
    };

    if (type === 'minLength' || type === 'maxLength') {
      rule.value = 0;
    }

    setValidationRules([...validationRules, rule]);
  };

  const removeValidationRule = (index: number) => {
    setValidationRules(validationRules.filter((_, i) => i !== index));
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...validationRules];
    newRules[index] = { ...newRules[index], ...updates };
    setValidationRules(newRules);
  };

  const addOption = () => {
    if (newOptionLabel.trim() && newOptionValue.trim()) {
      setOptions([...options, { label: newOptionLabel.trim(), value: newOptionValue.trim() }]);
      setNewOptionLabel('');
      setNewOptionValue('');
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const isFormValid = label.trim() && (!isDerived || (parentFields.length > 0 && derivedFormula.trim()));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Configure Field</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={fieldType}
                label="Field Type"
                onChange={(e) => setFieldType(e.target.value as FieldType)}
              >
                {fieldTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter field label"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Enter placeholder text"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Default Value"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="Enter default value"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={required} onChange={(e) => setRequired(e.target.checked)} />}
              label="Required Field"
            />
          </Grid>

          {['select', 'radio'].includes(fieldType) && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Label"
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="Option label"
                  size="small"
                />
                <TextField
                  label="Value"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder="Option value"
                  size="small"
                />
                <Button variant="outlined" onClick={addOption} startIcon={<AddIcon />}>
                  Add
                </Button>
              </Box>
              {options.map((option, index) => (
                <Chip
                  key={index}
                  label={`${option.label} (${option.value})`}
                  onDelete={() => removeOption(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={isDerived} onChange={(e) => setIsDerived(e.target.checked)} />}
              label="Derived Field"
            />
          </Grid>

          {isDerived && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Parent Fields (comma-separated)"
                  value={parentFields.join(', ')}
                  onChange={(e) => setParentFields(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="e.g., dateOfBirth, currentDate"
                  helperText="Enter the field IDs that this field depends on"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Derived Formula"
                  value={derivedFormula}
                  onChange={(e) => setDerivedFormula(e.target.value)}
                  placeholder="e.g., Calculate age from dateOfBirth: new Date().getFullYear() - new Date(dateOfBirth).getFullYear()"
                  helperText="Enter JavaScript code to compute the derived value"
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Validation Rules
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {validationTypes.map((validation) => (
                <Button
                  key={validation.type}
                  variant="outlined"
                  size="small"
                  onClick={() => addValidationRule(validation.type)}
                  disabled={validationRules.some(r => r.type === validation.type)}
                >
                  {validation.label}
                </Button>
              ))}
            </Box>
            {validationRules.map((rule, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <Chip label={rule.type} size="small" />
                {rule.value !== undefined && (
                  <TextField
                    size="small"
                    type="number"
                    value={rule.value}
                    onChange={(e) => updateValidationRule(index, { value: Number(e.target.value) })}
                    sx={{ width: 100 }}
                  />
                )}
                <TextField
                  size="small"
                  value={rule.message}
                  onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                  placeholder="Error message"
                  sx={{ flexGrow: 1 }}
                />
                <IconButton size="small" onClick={() => removeValidationRule(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!isFormValid}>
          Add Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldConfigurator;
