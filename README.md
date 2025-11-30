# IntegrationAI Builder

IntegrationAI Builder is a powerful tool designed to automate the creation of API integration code. By simply providing a URL to API documentation, developers can generate production-ready integration code in seconds, significantly reducing the time and effort required to connect with third-party services.

## 🚀 Features

*   **Automated Code Generation**: Scrapes API documentation and uses AI to generate complete client libraries.
*   **Multi-Language Support**: Currently supports Java (Spring Boot), with Python and Node.js planned.
*   **Customizable Output**: Options to include authentication, error handling, pagination, and logging.
*   **Interactive Sandbox**: A safe environment to test the generated code against mock endpoints before deployment.
*   **Modern UI**: A clean, responsive, and user-friendly interface built with React and Material UI.

## 🛠️ Tech Stack

### Backend
*   **Java 17** & **Spring Boot 3.x**: Robust and scalable backend framework.
*   **Jsoup**: For efficient web scraping of API documentation.
*   **OpenAI API (Mocked for Demo)**: Simulates the intelligence behind code generation.

### Frontend
*   **React 18**: Dynamic and responsive user interface.
*   **Vite**: Fast build tool and development server.
*   **Material UI (MUI)**: Professional and accessible component library.
*   **Monaco Editor**: VS Code-like code editing experience in the browser.

## 📦 Project Structure

*   `backend/`: Spring Boot application source code.
*   `frontend/`: React application source code.

## 🏃‍♂️ Getting Started

### Prerequisites
*   Java 17+
*   Maven
*   Node.js & npm

### Running the Backend
```bash
cd backend
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## 📝 Usage Flow

1.  **Input**: Enter the URL of the API documentation you want to integrate (e.g., `https://developer.calendly.com`).
2.  **Configure**: Select your desired options (Auth, Error Handling, etc.).
3.  **Generate**: Click "Generate Code" to receive a complete Java client.
4.  **Test**: Use the "Test in Sandbox" feature to validate the integration in a safe environment.
5.  **Deploy**: Download the code and integrate it into your project.

## ⚠️ Note

This project is currently in a **Demonstration Mode**. The AI generation and Sandbox execution are mocked to showcase the application flow and UI/UX without requiring live API keys or external dependencies during the demo.
