# Full Stack E-Commerce Application

This repository contains a complete full-stack e-commerce solution built using **Spring Boot** for the backend and **Angular** for the frontend. The project is designed to handle product management, customer orders, secure checkout, and user authentication.

## Repository Structure

* **`BackEnd/`**: Contains the Spring Boot REST API application.
* **`FrontEnd/`**: Contains the Angular client-side application.
* **`Practice/`**: Contains training modules and practice code for TypeScript and Angular basics.

---

## Features

* **Product Catalog**: Browse products by category (Books, Coffee Mugs, etc.) with pagination and search functionality.
* **Shopping Cart**: Add items to cart, update quantities, and calculate totals in real-time.
* **Secure Checkout**: Purchase processing including shipping/billing address capture and credit card handling.
* **User Authentication**: Login/Logout functionality and protected routes (likely integrated with **Okta** based on the file structure).
* **Order History**: Logged-in users can view their past orders.
* **Secure Communication**: Configured for HTTPS/SSL on both frontend and backend.

---

## Technology Stack

### Backend

* **Language**: Java
* **Framework**: Spring Boot (Spring Data JPA, Spring Data REST, Spring Security)
* **Database**: MySQL
* **Build Tool**: Maven
* **Security**: OAuth2 / OIDC (Okta Integration)

### Frontend

* **Framework**: Angular
* **Styling**: Bootstrap 5, CSS
* **Language**: TypeScript
* **Package Manager**: NPM

---

## Setup & Installation

### Prerequisites

* Node.js & Angular CLI
* Java JDK (Version 11 or higher recommended)
* Maven
* MySQL Server

### 1. Backend Setup (Spring Boot)

1. Navigate to the `BackEnd/spring-boot-eCommerce` directory.
2. Create a MySQL database (e.g., `full-stack-ecommerce`).
3. Update `src/main/resources/application.properties` with your database credentials.
4. **SSL Configuration**: The project uses a keystore (`skullZues-keystore.p12`). Ensure you have the correct password configured in your properties file to enable HTTPS on port `8443`.
5. Run the application:
```bash
mvn spring-boot:run

```



### 2. Frontend Setup (Angular)

1. Navigate to the `FrontEnd/angular-ecommerce` directory.
2. Install dependencies:
```bash
npm install

```


3. **SSL Configuration**: The project expects to run on HTTPS. Ensure your local SSL certificates are located in `ssl-localhost/`.
4. Start the development server:
```bash
npm start

```


*(Note: The `start` script is likely configured to run `ng serve --ssl`)*.
5. Open your browser and navigate to `https://localhost:4200/`.

---

## 🧪 Running Tests

* **Backend**: Run `mvn test` in the backend directory.
* **Frontend**: Run `ng test` in the frontend directory to execute Karma unit tests.
