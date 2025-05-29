# Project Setup

To quickly generate the project file structure, run these commands in your terminal:

````bash
# Create src directory structure
mkdir -p src/controllers src/routes src/services src/config
touch src/app.ts src/server.ts
touch src/controllers/health.controller.ts
touch src/routes/health.routes.ts
touch src/services/health.service.ts
touch src/config/env.ts

# Create tests directory structure
mkdir -p __tests__/controllers __tests__/services __tests__/routes
touch __tests__/controllers/health.controller.test.ts
touch __tests__/services/health.service.test.ts
touch __tests__/routes/health.routes.test.ts

# Create configuration and other files
touch .env .env.example .eslintrc.js .prettierrc.js jest.config.js sonar-project.properties tsconfig.json package.json README.md .gitignore

# Create husky directory and files
mkdir .husky
touch .husky/pre-commit .husky/post-commit

# Make husky hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/post-commit ```

````

after above commands runs below code
git add .gitignore
git commit -m "Add .gitignore file"

```

## Notes:

- The commands assume you're running Linux/macOS or WSL on Windows.
- Files will be created empty - you'll need to populate them with your actual code.
```
