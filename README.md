# Learn and Hustle — PEKOM Code Fest Hackathon Project

Welcome to our **Learn and Hustle** project for the **PEKOM Code Fest Hackathon**
## Project Info

## Running the Project Locally

To run this project on your machine, just follow these steps:

### **Prerequisites**

* Ensure **Node.js** and **npm** are installed.
* If needed, install using **nvm**: [https://github.com/nvm-sh/nvm#installing-and-updating](https://github.com/nvm-sh/nvm#installing-and-updating)

### **Setup**

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate into the project directory
cd <YOUR_PROJECT_NAME>

# 3. Install dependencies
npm i

# 4. Start the development servers

# Start the frontend (Vite)
npm run dev

# In a separate terminal: start the backend (FastAPI)
cd backend

python -m venv venv # Create a new virtual environment

venv\Scripts\activate #Run the virtual environment (Windows)

pip install -r requirements.txt # install all packages for this venv

python main.py # run the server

## Technologies Used

* Vite
* TypeScript
* React
* shadcn-ui
* Tailwind CSS