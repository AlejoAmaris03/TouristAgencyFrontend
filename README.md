# 🌍 Tourist Agency Frontend (Angular)

This is the frontend application for the **Tourist Agency Management System**, built with **Angular**. It connects to a Spring Boot backend to allow users (customers and employees) to browse, purchase and manage tourism services and packages.

> 🔗 Backend available here: [Tourist Agency Backend (Spring Boot)](https://github.com/AlejoAmaris03/TouristAgencyBackend)

---

## 📌 Features

- 👤 User authentication (JWT)
  - Roles: `Customer`, `Employee`, `Admin`
- 🧳 View and buy tourism **services** and **packages**
- 🛒 Purchase history for customers
- 🛠️ Admin panel to manage services and packages
- 🔒 Route guards based on roles
- 📲 Responsive design

---

## ⚙️ Tech Stack

- **Angular 19+**
- **TypeScript**
- **RxJS**
- **Angular Router**
- **HttpClient** (for API integration)
- **SweetAlert2/Toastr** for feedback alerts

---

### 🖼️ Screenshots
Here are some images of the project in action:
![image](https://github.com/user-attachments/assets/f785b513-b595-42ce-acf8-2a5ed1e955c7)




## 📁 Project Structure
![Home Page](https://github.com/user-attachments/assets/a59c515d-662d-4c20-940a-5232505f5af9)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/AlejoAmaris03/TouristAgencyFrontend.git
   cd TouristAgencyFrontend-main

2. Install dependencies
   ```bash
   npm install

3. Run the dev server
   ```bash
   ng serve

4. Navigate to http://localhost:4200/ in your browser.

5. **Backend Connection**
- Make sure your backend Spring Boot app is running at http://localhost:8080.
