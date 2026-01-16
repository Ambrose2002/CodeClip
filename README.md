# CodeClip

A Chrome extension for saving, organizing, and searching code snippets across the web. Save code with a single right-click and access your library anytime.

## Features

- **Save Snippets**: Right-click any code on the web and save it to CodeClip
- **Organize**: Tag snippets by language, source, and custom titles
- **Smart Search**: Semantic search to find snippets by meaning, not just keywords
- **Beautiful Dashboard**: Modern, intuitive interface for managing your snippets
- **Syntax Highlighting**: View code with proper formatting
- **Easy Access**: Quick access modal from browser context menu

## Tech Stack

**Frontend:**

- React + Vite
- React Router for navigation
- CSS with modern design system

**Backend:**

- Flask (Python)
- SQLite database
- Sentence Transformers for semantic search

**Browser:**

- Chrome Extension API
- Content scripts for web integration

## Installation

### Prerequisites

- Node.js 20+ (for frontend)
- Python 3.10+ (for backend)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:

```
FLASK_SECRET_KEY=your_secret_key_here
```

5. Start the Flask server:

```bash
python src/app.py
```

The API will be running at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Build the extension:

```bash
npm run build
```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `frontend/build` directory

## Usage

### Saving a Snippet

1. Highlight any code on a webpage
2. Right-click and select "Save snippet to CodeClip"
3. Add a title and language
4. Click "Save Snippet"

### Accessing Your Library

1. Click the CodeClip extension icon in your browser
2. Click "Open CodeClip Library"
3. Browse or search your snippets

### Searching Snippets

- Use the search bar to find snippets by keywords
- Semantic search understands the meaning of your queries

### Editing Snippets

1. Click on a snippet in your library
2. Click the "Edit" button
3. Make changes and save

### Deleting Snippets

1. Open a snippet
2. Click the "Delete" button

## API Documentation

For detailed API documentation, see [API_DOC.md](backend/docs/API_DOC.md)

### Key Endpoints

- `POST /signup` - Create user account
- `POST /login` - Login user
- `GET /me` - Get current user
- `GET /get/clips` - Fetch all snippets
- `POST /post/clip` - Save new snippet
- `POST /clip/edit/<id>` - Update snippet
- `DELETE /delete/clip/<id>` - Delete snippet
- `POST /clip/query` - Search snippets

## Development

### Frontend Development

```bash
cd frontend
npm run dev
```

Start the Vite dev server for hot reloading.

### Build for Production

```bash
npm run build
```

Creates optimized build in `frontend/build/`

### Linting

```bash
npm run lint
```

## Notes

- Make sure the Flask backend is running before using the extension
- The extension requires login/signup before use
- Snippets are stored in SQLite (local) or PostgreSQL (production)
