# Form Builder - React + Redux Application

A dynamic form builder application built with React, TypeScript, Redux Toolkit, and Material-UI. Users can create, configure, and manage dynamic forms with various field types, validation rules, and derived field functionality.

## Features

### 🏗️ Form Builder (/create)
- **Dynamic Field Creation**: Add fields of 7 different types:
  - Text, Number, Textarea, Select, Radio, Checkbox, Date
- **Field Configuration**: 
  - Custom labels and placeholders
  - Required field toggles
  - Default values
  - Comprehensive validation rules
- **Advanced Features**:
  - Derived fields with parent field dependencies
  - Custom JavaScript formulas for computed values
  - Drag & drop field reordering
  - Real-time field editing
- **Validation Rules**:
  - Required field validation
  - Minimum/maximum length constraints
  - Email format validation
  - Custom password rules (8+ chars, must contain number)

### 👀 Form Preview (/preview)
- **End-User Experience**: See exactly how your form will appear
- **Real-time Validation**: Instant feedback on field validation
- **Derived Field Updates**: Automatic computation based on parent field changes
- **Form Submission**: Test form submission with validation
- **Responsive Design**: Works seamlessly on all device sizes

### 📚 My Forms (/myforms)
- **Form Management**: View all saved forms with creation/update dates
- **Quick Actions**: Preview, edit, or delete existing forms
- **Form Statistics**: See field counts, required fields, and derived fields
- **Persistent Storage**: All forms saved to localStorage

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit for predictable state management
- **UI Framework**: Material-UI (MUI) for modern, responsive design
- **Routing**: React Router v6 for navigation
- **Storage**: localStorage for form persistence
- **Build Tool**: Create React App with TypeScript

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage Examples

### Creating a Simple Contact Form

1. Navigate to `/create`
2. Click "Add Field" to add form fields:
   - **Name**: Text field, required, placeholder "Enter your full name"
   - **Email**: Text field, required, email validation
   - **Message**: Textarea, required, placeholder "Enter your message"
3. Save the form with a name like "Contact Form"
4. Preview at `/preview` to test the form

### Creating a Derived Field Example

1. Add a "Date of Birth" field (Date type)
2. Add an "Age" field (Number type)
3. Mark "Age" as a derived field
4. Set parent field to "dateOfBirth"
5. Use formula: `new Date().getFullYear() - new Date(dateOfBirth).getFullYear()`
6. Age will automatically calculate when date of birth is selected

### Advanced Validation Example

1. Add a "Password" field (Text type)
2. Add validation rules:
   - Required: "Password is required"
   - Min Length: 8 characters
   - Password: "Must contain at least 8 characters and a number"
3. Test validation in preview mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── FieldConfigurator.tsx  # Field configuration dialog
│   └── FieldList.tsx   # Draggable field list
├── pages/              # Main application pages
│   ├── FormBuilder.tsx # Form creation interface
│   ├── FormPreview.tsx # Form preview and testing
│   └── MyForms.tsx     # Saved forms management
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   └── formBuilderSlice.ts  # Form state management
├── hooks/              # Custom React hooks
│   ├── useAppDispatch.ts
│   └── useAppSelector.ts
├── types/              # TypeScript type definitions
│   └── index.ts        # All interfaces and types
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Key Features Implementation

### State Management
- **Redux Toolkit**: Centralized state management for forms
- **Persistent Storage**: Automatic localStorage synchronization
- **Optimistic Updates**: Immediate UI feedback with state persistence

### Type Safety
- **TypeScript**: Full type safety throughout the application
- **Interface Definitions**: Comprehensive type definitions for all data structures
- **Generic Components**: Reusable components with proper typing

### User Experience
- **Responsive Design**: Mobile-first approach with Material-UI
- **Real-time Updates**: Instant feedback on all user actions
- **Intuitive Navigation**: Clear navigation between form building, preview, and management
- **Drag & Drop**: Visual field reordering for better UX

### Validation System
- **Client-side Validation**: Real-time validation feedback
- **Custom Rules**: Extensible validation rule system
- **Error Handling**: Graceful error display and recovery

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically build and deploy your app
3. Get a live URL for your form builder

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy and get your live URL

## Support

For support or questions, please open an issue in the GitHub repository.

---

**Note**: This application stores all form data in the browser's localStorage. No backend server is required, making it perfect for static hosting and demonstration purposes.
