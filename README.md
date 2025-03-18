🌍 Compare Your Air

A web application to compare air quality data from various locations using OpenAQ API.

🚀 Setup Instructions

1️⃣ Clone the Repository

First, clone the repository to your local machine and navigate into the project folder:

git clone https://github.com/jesuscabrera/compare-your-air.git
cd compare-your-air

2️⃣ Switch to the Development Branch

By default, the repository may be on the main branch. To work in development mode, switch to the dev branch:

git checkout dev

3️⃣ Install Dependencies

Install all necessary dependencies:

npm install

4️⃣ Start the Development Server

Run the following command to launch the local development server:

npm run dev

This will start the project in development mode using the code from the dev branch.

🔥 Important Notes

Ensure you are on the dev branch when working locally (git branch to check your current branch).

The main branch is used for production deployment on Vercel, so do not push development changes to main unless they are ready for deployment.

When finished with development, push changes to the dev branch:

git add .
git commit -m "Your commit message"
git push origin dev

📡 API Configuration

To use the OpenAQ API, you need an API key. 
Sign up for an OpenAQ API key at https://explore.openaq.org. 
After signing up, find your API key in your settings. Use this key to authenticate requests.

Create a .env.local file in the root of your project and add:

VITE_OPENAQ_API_KEY=your-api-key-here

Then restart the development server.

🎉 Now you’re ready to develop and test locally on the dev branch! 🚀

🛠 Technologies Used

Vite - Fast front-end tooling

React 

TypeScript 

OpenAQ API for air quality data

Vercel for production deployment
