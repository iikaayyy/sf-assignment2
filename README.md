# Chat Application

A role-based chat application built using **Angular** for the frontend and **Node.js/Express** for the backend. The app allows multiple users to join groups and channels, request group memberships, and interact based on their role (Super Admin, Group Admin, Chat User).

## Features

- **User Roles**:

  - **Super Admin (SU)**: Manage all groups, approve/deny user requests, and manage users.
  - **Group Admin (GA)**: Manage assigned groups, add/remove users from their groups.
  - **Chat User (CA)**: Join groups and channels, send messages, and share images.

- **Group Management**:

  - Users can join existing groups or request to join.
  - Group Admins can approve or deny user requests.
  - Channels for group chats like "Main" and "Announcements".

- **Authentication**:

  - Users can sign up, log in, and request to join groups.

- **Image Sending and Receiving**:
  - Users can send and receive images in group chats.

## API Endpoints

### Authentication

- `POST /login`  
  Login a user by validating their username and password.

- `POST /sign-up`  
  Sign up a user and send their request for approval.

### Group Requests

- `POST /join-group`  
  Request to join a group.

- `GET /join-group-reqs`  
  Retrieve all group join requests.

- `POST /modify-group-request`  
  Approve or deny group join requests.

### User Management

- `GET /users`  
  Retrieve all users.

- `POST /delete-user`  
  Delete a user and remove them from their associated groups.

- `POST /remove-user`  
  Remove a user from a specific group.

### Group Management

- `GET /groups`  
  Retrieve all available groups.

- `POST /create-group`  
  Create a new group with channels and assign an admin.

### Request Management

- `GET /requests`  
  Retrieve all user sign-up requests.

- `POST /modify-request`  
  Approve or deny user sign-up requests.

## Client Side Routes

The application has the following routes defined for navigation:

1. **Login Route (`/login`)**: Navigate to the `LoginComponent` for user authentication.
2. **Sign Up Route (`/sign-up`)**: Allow users to sign up and send a request for approval.
3. **Groups Route (`/groups`)**: Access the `DashboardComponent` to view and manage user groups.
4. **Group Chat Route (`/groups/:name`)**: Enter the `GroupChatComponent` for discussions in a specific group.
5. **Channel Chat Route (`/groups/:name/:channelName`)**: Use the `ChatComponent` for communication in a specific channel within a group.
6. **Profile Route (`/profile`)**: View and edit personal information in the `ProfileComponent`.
7. **Admin Panel Route (`/admin-panel`)**: Manage users and groups via the `AdminPanelComponent`.
8. **Chat Route (`/chat`)**: Access the `ChatComponent` for general chat functionalities.
9. **Video Chat Route (`/groups/:name/:channelName/:roomName/video-chat`)**: Engage in video communication in the `VideoChatComponent`.

## Installation

### Prerequisites

- **Node.js** (v16 or above)
- **Angular CLI** (for frontend development)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   ```
2. Install the dependencies:
   ```bash
   cd chat-app/server
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../chatApp
   ```
2. Install Angular dependencies:
   ```bash
   npm install
   ```
3. Start the Angular frontend:
   ```bash
   ng serve
   ```
   The frontend will run on `http://localhost:4200`.

## Testing

To run tests for the server, use the following command:

```bash
npm start
```
