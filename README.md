# DTech
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-9.0-blue)](https://dotnet.microsoft.com/en-us/apps/aspnet)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-TS-blue?logo=react&logoColor=61DAFB)](https://reactjs.org/)

DTech is a modern web-based e-commerce platform built with ASP.NET Core. It enables users to browse and purchase technology products seamlessly while providing administrators with tools to manage inventory, orders, and users.

## 🔧 Technologies Used

- **Frontend**: React, Typescript, Bootrap
- **Backend**: ASP.NET Core API
- **Database**: PostgreSQL
- **Real-Time Updates**: SignalR
- **Authentication**: ASP.NET Core Identity
- **Payment Integration**: VNPay
- **Image Hosting**: Cloudinary
- **Containerization**: Docker
- **Others**: Entity Framework Core, HtmlSanitizer

## 🌟 Features

### 🔐 Authentication & Authorization
- Register/Login with email
- Role-based access (Admin & User)
- Profile management

### 🛒 E-Commerce Functionality
- Product listing with sorting and filtering (by category and brand)
- Product detail view
- Shopping cart with quantity management
- Order checkout process
- Order history for users

### ⚙️ Admin Panel
- Dashboard overview
- Manage products (CRUD)
- Manage categories and brands
- Manage users and roles
- View orders and update status

### 💳 Payment System
- VNPay integration for secure online transactions

### 📡 Real-Time Features
- SignalR to help customer contact admin via direct chat

## 🚀 Getting Started

### Prerequisites
- [.NET SDK](https://dotnet.microsoft.com/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)
- [Cloudinary Account](https://cloudinary.com/)
- VNPay Sandbox Account

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/HaDo2003/DTech.git
   cd DTech
2. **Configure database:**
   ```bash
   Update appsettings.json with your SQL Server connection string.
3. **Add Migration and Update Database:**
   ```bash
   ADD-MIGRATION <Migration Name>
   UPDATE-DATABASE
4. **Run the application:**
   ```bash
   dotnet run
