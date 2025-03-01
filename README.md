
---

# Social Network Project Tiktour - Frontend

![Project Logo](TiktourLogo.png)

**Link to backend app:** [TikTour-Server](https://github.com/Romihia/TikTour-Server)

## Project Description
The frontend for the Tiktour social network project is designed to provide a user-friendly interface for interacting with the backend services. It allows users to register, log in, view and interact with posts, manage their profiles, and connect with other users.

## Technologies Used
- **React.js** for building the user interface.
- **Material-UI** for user interface components and styling.
- **Redux** for state management.
- **React Router** for handling routing and navigation.
- **Axios** for making HTTP requests.

## Setting Up the Project
1. **Clone the Project**: Clone the repository from GitHub.
    ```bash
    git clone https://github.com/Romihia/TikTour-Client.git
    ```

2. **Install Dependencies**: Navigate to the project directory and install all dependencies specified in `package.json`.
    ```bash
    cd frontend
    npm install
    ```

3. **Environment Variables**: Create a `.env` file in the root directory of the project. Configure the environment variables required for the frontend to connect to the backend. Example `.env` file *(Pay attention to activate the backend and see the port that works for it, you will arrange accordingly):*
    ```dotenv
    REACT_APP_API_URL=http://localhost:3001
    ```

4. **Start the Development Server**: Run the development server using the following command:
    ```bash
    npm start
    ```
    This will start the development server and open the application in your default web browser.

## Usage

### Register a User

1. Navigate to the registration page.
2. Fill in the registration form with the required details and submit it.
3. The application will send a POST request to `http://localhost:3001/auth/register` for exsample.

### Log in a User

1. Navigate to the login page.
2. Enter your credentials and submit the form.
3. The application will send a POST request to `http://localhost:3001/auth/login` for exsample.

### Viewing and Interacting with Posts

1. After logging in, you can view posts on the main feed.
2. You can create, edit, and delete posts as per your permissions.
3. Interact with posts by liking or commenting.



## Further Development

- **Enhancements**: Improve the user interface and user experience based on feedback.
- **Integrations**: Connect with additional backend endpoints for new features.
- **Testing**: Implement automated testing for components and interactions.
- **Deployment**: Configure and deploy the frontend to a hosting platform.
