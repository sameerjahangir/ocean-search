
## 🚀 Getting Started

### Step 1: Clone the Repository

Clone the repository to your local machine by running the following command in your terminal:

```bash
git clone [https://github.com/username/repository-name.git](https://github.com/CherkashinEgor/ocean-search.git)
cd ocean-search
```

### Step 2: Install Dependencies

Navigate into the project directory and install all required dependencies using **npm** or **yarn**:

```bash
# With npm
npm install

# Or with yarn
yarn install
```

### Step 3: Set Up Environment Variables

For security and functionality, you’ll need to configure environment variables. 

1. **In `next.config.mjs` for Local Development:**  
   Add your environment variables to the `next.config.mjs` file under the `env` key. This allows Next.js to access the variables in development mode.

    ```javascript
    // next.config.mjs
    const nextConfig = {
      env: {
        YOUR_API_KEY: 'your-api-key',
        ANOTHER_ENV_VARIABLE: 'value',
      },
      // other configurations...
    };

    export default nextConfig;
    ```

2. **In Vercel for Production Deployment:**  
   When deploying to Vercel, go to your project settings and add the same environment variables under the **Environment Variables** section.

---

### Step 4: Run the Development Server

Start the development server by running:

```bash
# With npm
npm run dev

# Or with yarn
yarn dev
```

This will start your project at [http://localhost:3000](http://localhost:3000).

---

## 🎉 You’re All Set!

Visit [http://localhost:3000](http://localhost:3000) to view the project in action.
