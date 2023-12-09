# Social-Media-API
# Overview
The Social Media API is a RESTful service that allows users to perform basic operations related to users and their posts. This API provides endpoints for user management and post interactions.

# Table of Contents
- Features
- Getting Started
- Prerequisites
- Installation
- API Endpoints
- User Management
- Post Interactions

# Features
> User Management:

- Create a new user
- Retrieve user information
- Update user details
- Delete a user account
> Post Interactions:

- Create a new post
- Retrieve posts for a user
- Update a post
- Delete a post
# Getting Started
# Prerequisites
> Node.js
> MongoDB (or any other preferred database)
> npm or yarn
> Installation
- Clone the repository:
git clone https://github.com/your-username/social-media-api.git
- Install dependencies:
cd social-media-api
npm install
- Configure environment variables:
Create a .env file based on the provided .env.example and set your environment variables.
- Start the server:
npm start
> API Endpoints
- User Management
1. Create a new user:
POST /api/users/signup
2. Retrieve user information:
GET /api/users/profile/:username
3. Update user details:
POST /api/users/update/:id
4. Login a user account:
POST /api/users/login
5. Logout a user account:
POST /api/users/logout
6. Follow/Unfollow a user account:
POST /api/users/follow/:id

- Post Interactions
1. Create a new post:
POST /api/posts/create
2. Retrieve posts for a user:
GET /api/posts/:postId
3. Like/Unlike a post:
POST /api/posts/like/:postId
4. Delete a post:
DELETE /api/posts/:postId
5. Reply to a post:
POST /api/posts/reply/:postId
6. Get Feed
GET /api/posts/feed
