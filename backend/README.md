
# Family Tree Backend API

A NodeJS/Express backend for the Family Tree application with MongoDB database integration.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in .env file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/familytree
   JWT_SECRET=your_secret_token
   ```
4. Start development server:
   ```
   npm run dev
   ```
5. Build for production:
   ```
   npm run build
   ```
6. Start production server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/me` - Update user profile

### Family Trees
- `GET /api/trees` - Get all trees for current user
- `POST /api/trees` - Create a new family tree
- `GET /api/trees/:id` - Get a specific family tree
- `PATCH /api/trees/:id` - Update a family tree
- `DELETE /api/trees/:id` - Delete a family tree

### Family Members
- `GET /api/trees/:treeId/members` - Get all members for a tree
- `POST /api/trees/:treeId/members` - Add a member to a tree
- `PATCH /api/members/:id` - Update a family member
- `DELETE /api/members/:id` - Delete a family member
