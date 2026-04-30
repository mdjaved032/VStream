# VStream 🎬

VStream is a robust and scalable backend API for a video streaming platform. It provides the core infrastructure for video management, user authentication, channel subscriptions, and watch history.

## 🚀 Features

*   **User Authentication & Security:** Secure registration and login using JWT (Access & Refresh Tokens) and bcrypt for password hashing.
*   **Profile Management:** Update account details, change passwords, and upload/update avatars and cover images.
*   **Channel System:** View channel profiles, subscribe/unsubscribe to channels, and track subscriber counts.
*   **Media Handling:** Robust file upload system using Multer and Cloudinary for storing images and videos.
*   **Watch History:** Keep track of a user's viewing history utilizing MongoDB aggregation pipelines.

## 🛠 Tech Stack

*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
*   **Media Storage:** [Cloudinary](https://cloudinary.com/)
*   **Authentication:** JSON Web Tokens (JWT)
*   **File Uploads:** Multer

## 📦 Installation

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB Account (Atlas or local)
*   Cloudinary Account

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/vstream.git
    cd vstream
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and configure the following variables:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=http://localhost:3000 # Replace with your frontend URL; use * only for development
    
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=10d
    
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## 📚 API Endpoints (Users)

*   `POST /api/v1/user/register` - Register a new user
*   `POST /api/v1/user/login` - Login user
*   `POST /api/v1/user/logout` - Logout user (Requires Auth)
*   `POST /api/v1/user/refresh-token` - Refresh access token
*   `POST /api/v1/user/change-password` - Change current password (Requires Auth)
*   `GET /api/v1/user/current-user` - Get current user details (Requires Auth)
*   `PATCH /api/v1/user/update-account` - Update account details (Requires Auth)
*   `PATCH /api/v1/user/update-user-avatar` - Update user avatar (Requires Auth)
*   `PATCH /api/v1/user/update-user-coverImage` - Update user cover image (Requires Auth)
*   `GET /api/v1/user/c/:username` - Get user channel profile (Requires Auth)
*   `GET /api/v1/user/history` - Get user watch history (Requires Auth)

## 📄 License

This project is licensed under the ISC License.