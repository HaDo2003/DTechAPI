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
- [.NET SDK 9](https://dotnet.microsoft.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)
- [Cloudinary Account](https://cloudinary.com/)
- VNPay Sandbox Account

### Installation

#### 1. Clone the Repository
You can obtain the source code using Git CLI or GitHub Desktop.

**Option 1: Using Git (Command Line)**

1. Verify Git installation:
   ```bash
   git --version
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/HaDo2003/DTech.git
   ```

3. Navigate to the project folder:
   ```bash
   cd DTech
   ```

**Option 2: Using GitHub Desktop**

1. Install [GitHub Desktop](https://desktop.github.com/).
2. Open the application and sign in.
3. Select **File → Clone Repository**.
4. Paste the repository URL: `https://github.com/HaDo2003/DTech.git`
5. Choose a local folder and click **Clone**.

---

#### 2. Backend Setup (ASP.NET Core)

**2.1. Install .NET SDK**

Download and install [.NET SDK 9](https://dotnet.microsoft.com/download/dotnet/9.0) from the official Microsoft website.

Verify installation:
```bash
dotnet --version
```

**2.2. Open the Backend Project**

Open `DTech.sln` using Visual Studio 2022 or newer.

**2.3. Restore Dependencies**

```bash
dotnet restore
```

**2.4. Configure Environment Variables**

Create a `.env` file in the backend root directory and add:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_KEY=your_jwt_secret_key
```

**2.5. Configure Database Connection**

Update `appsettings.json`:

```json
"ConnectionStrings": {
  "DTech": "Host=localhost;Database=DTech;Username=postgres;Password=your-password"
}
```

**2.6. Apply Database Migrations**

**Option 1: Command Line**

1. Ensure EF Core tools are installed:
   ```bash
   dotnet tool install --global dotnet-ef
   ```

2. Apply migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

**Option 2: Visual Studio Package Manager Console**

```powershell
Add-Migration InitialCreate -Project DTech.Infrastructure -StartupProject DTech.API
Update-Database
```

**2.7. Run the Backend Server**

Can run on terminal using command:
```bash
dotnet run
```

Or run by clicking the **Run** button in Visual Studio 2022.

Backend API will be available at: `https://localhost:7094`

---

#### 3. Frontend Setup (React + TypeScript)

**3.1. Open the frontend folder:**

```bash
cd Client
```

**3.2. Configure Environment Variables**

Create a `.env` file in the frontend root directory and add:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_client_id
```

**3.3. Install dependencies:**

```bash
npm install
```

**3.4. Build the project:**

```bash
npm run build
```

**3.5. Start the development server:**

```bash
npm run dev
```

**3.6. Open the application:**

Navigate to: `http://localhost:5173`