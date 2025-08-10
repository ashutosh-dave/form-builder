import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, FormSchema, FormField } from '../types';

const initialState: FormBuilderState = {
  currentForm: null,
  savedForms: [],
  isFormModified: false,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    initializeForm: (state) => {
      if (!state.currentForm) {
        state.currentForm = {
          id: Date.now().toString(),
          name: '',
          fields: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
        state.isFormModified = true;
      }
    },
    
    updateField: (state, action: PayloadAction<{ fieldId: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.fieldId);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = { ...state.currentForm.fields[fieldIndex], ...action.payload.updates };
          state.isFormModified = true;
        }
      }
    },
    
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
        state.isFormModified = true;
      }
    },
    
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = [...state.currentForm.fields];
        const [removed] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, removed);
        
        // Update order property
        fields.forEach((field, index) => {
          field.order = index;
        });
        
        state.currentForm.fields = fields;
        state.isFormModified = true;
      }
    },
    
    saveForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        const formToSave = {
          ...state.currentForm,
          name: action.payload,
          updatedAt: new Date().toISOString(),
        };
        
        const existingIndex = state.savedForms.findIndex(f => f.id === formToSave.id);
        if (existingIndex !== -1) {
          state.savedForms[existingIndex] = formToSave;
        } else {
          state.savedForms.push(formToSave);
        }
        
        state.isFormModified = false;
      }
    },
    
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
        state.isFormModified = false;
      }
    },
    
    clearCurrentForm: (state) => {
      state.currentForm = null;
      state.isFormModified = false;
    },
    
    loadSavedForms: (state) => {
      const savedForms = localStorage.getItem('savedForms');
      if (savedForms) {
        try {
          state.savedForms = JSON.parse(savedForms);
        } catch (error) {
          console.error('Error loading saved forms:', error);
        }
      }
    },
    
    persistForms: (state) => {
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
    },
  },
});

export const {
  initializeForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  clearCurrentForm,
  loadSavedForms,
  persistForms,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
