# Notes App

A full-stack notes application with a React frontend and Express.js backend. Create, edit, delete, and manage your notes with support for file attachments and markdown preview. The app includes dark/light theme toggle for a personalized experience.

## Features

- ✏️ **Create & Edit Notes** - Create new notes and edit existing ones with ease
- 📎 **File Attachments** - Attach files to your notes (up to 25MB per file)
- 🎨 **Markdown Preview** - Preview notes in markdown format
- 🌓 **Dark/Light Theme** - Toggle between dark and light themes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🚀 **RESTful API** - Well-structured backend API for all note operations
- 💾 **MongoDB Database** - Persistent data storage

## Tech Stack

### Frontend
- **React 19.2** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server with auto-reload

## Project Structure

```
NotesApp/
├── notesbackend/
│   └── NotesAppBackend-main/
│       ├── app.js                 # Express app configuration
│       ├── index.js               # Server entry point
│       ├── package.json           # Backend dependencies
│       ├── config/
│       │   ├── db.js             # Database connection
│       │   ├── env.js            # Environment variables
│       │   ├── paths.js          # Path configurations
│       │   └── upload.js         # Upload configuration
│       ├── Controllers/
│       │   ├── note.controller.js   # Note CRUD operations
│       │   └── upload.controller.js # File upload handling
│       ├── models/
│       │   └── note.models.js    # Note schema
│       ├── Routes/
│       │   ├── note.route.js     # Note API endpoints
│       │   └── upload.route.js   # Upload API endpoints
│       ├── uploads/              # Uploaded files storage
│       └── utils/
│           └── fileStorage.js    # File storage utilities
│
├── notesfrontend/
│   ├── index.html               # HTML entry point
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── public/                  # Static assets
│   └── src/
│       ├── App.jsx              # Main App component
│       ├── main.jsx             # React entry point
│       ├── App.css              # App styles
│       ├── index.css            # Global styles
│       ├── api/
│       │   └── Url.js          # API endpoint configuration
│       ├── assets/              # Image and media assets
│       ├── components/
│       │   ├── Navbar.jsx      # Navigation bar
│       │   ├── Notecard.jsx    # Note card component
│       │   ├── Noteform.jsx    # Note form component
│       │   ├── NoteEditor.jsx  # Note editor
│       │   ├── AttachmentList.jsx  # Attachment list
│       │   ├── MarkdownPreview.jsx # Markdown preview
│       │   ├── ThemeToggle.jsx # Dark/light theme toggle
│       │   └── Fotter.jsx      # Footer component
│       ├── context/
│       │   ├── noteContext.js   # Note context
│       │   ├── Notecontext.jsx  # Note provider
│       │   ├── themeContext.js  # Theme context
│       │   └── ThemeContext.jsx # Theme provider
│       ├── pages/
│       │   ├── Home.jsx        # Home page - list notes
│       │   └── CreateNote.jsx  # Create/Edit note page
│       └── utils/
│           ├── markdown.js     # Markdown utilities
│           └── noteHelpers.js  # Note helper functions
│
└── README.md                    # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd notesbackend/NotesAppBackend-main
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesapp
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

4. Start the backend server:
```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd notesfrontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API endpoint in `src/api/Url.js` if needed:
```javascript
// Default is http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Notes
- **GET** `/api/v1/notes` - Get all notes
- **GET** `/api/v1/notes/:id` - Get a specific note
- **POST** `/api/v1/notes` - Create a new note
- **PUT** `/api/v1/notes/:id` - Update a note
- **DELETE** `/api/v1/notes/:id` - Delete a note

### Uploads
- **POST** `/api/v1/uploads` - Upload a file
- **GET** `/uploads/:filename` - Access uploaded file

### Health Check
- **GET** `/api/health` - Check if backend is running

## Usage

1. **Access the Application**
   - Open `http://localhost:5173` in your browser

2. **Create a Note**
   - Click the "Create" or "New Note" button
   - Enter the title and content
   - Optionally attach files
   - Save the note

3. **View Notes**
   - All notes are displayed on the Home page
   - Click on a note to view details
   - Preview markdown content using the preview button

4. **Edit a Note**
   - Click on a note to open it
   - Edit the content as needed
   - Save changes

5. **Delete a Note**
   - Click the delete button on a note
   - Confirm the deletion

6. **Toggle Theme**
   - Use the theme toggle button in the navbar
   - Switch between dark and light modes

## Scripts

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

### Backend Configuration Files
- **config/db.js** - MongoDB connection setup
- **config/env.js** - Environment variable management
- **config/paths.js** - Project path configurations
- **config/upload.js** - File upload size limits and settings

### Frontend Configuration
- **vite.config.js** - Vite build configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **eslint.config.js** - ESLint rules

## File Upload Limits

- Maximum file size per attachment: **25 MB**
- Uploads are stored in the `notesbackend/NotesAppBackend-main/uploads/` directory

## Error Handling

The application includes comprehensive error handling:
- Backend returns appropriate HTTP status codes
- Frontend displays user-friendly error messages
- File size validation (413 error for oversized files)
- Database connection error handling
- CORS error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication and authorization
- Note categories/tags
- Search functionality
- Collaborative notes
- Note history/versioning
- Export notes to PDF or other formats
- Cloud storage integration

## Troubleshooting

### Backend not connecting to MongoDB
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify database credentials

### Frontend cannot reach backend
- Ensure backend server is running on port 5000
- Check `CLIENT_URL` in backend `.env` matches frontend
- Verify API endpoint in `src/api/Url.js`

### File upload fails
- Check file size (max 25 MB)
- Ensure `uploads/` directory exists
- Verify `multer` configuration in backend

### Styling issues
- Rebuild Tailwind CSS: `npm run build`
- Clear browser cache
- Restart development server


## Author

Star90lord

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note:** This is a full-stack application requiring both frontend and backend to be running simultaneously for full functionality.
