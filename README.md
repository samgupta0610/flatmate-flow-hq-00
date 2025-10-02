# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/544dff35-205c-4b6c-9d3e-3191cd333d4e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/544dff35-205c-4b6c-9d3e-3191cd333d4e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- **Material UI v7** (Material Design 3) - Primary design system
- shadcn-ui (being migrated to MUI)
- Tailwind CSS
- Supabase (Backend & Auth)

## 🎨 Design System

This project uses **Material Design 3** with Material UI as the primary design system.

### Key Features:
- 🎨 Material Design 3 aesthetics (rounded corners, modern shadows)
- 🎯 Custom theme with brand colors (Emerald Green, Midnight Blue)
- 📱 Fully responsive components
- ♿ Enhanced accessibility
- 🌙 Dark mode support (coming soon)

### Documentation:
- **[Migration Guide](./MIGRATION_TO_MUI.md)** - Complete guide for migrating components
- **[Quick Reference](./MUI_QUICK_REFERENCE.md)** - Cheat sheet for MUI components
- **[Migration Status](./MUI_MIGRATION_STATUS.md)** - Current progress tracker
- **[Theme Config](./src/theme/muiTheme.ts)** - Material Design 3 theme

### Getting Started with MUI:
```tsx
// Import components
import { Button, TextField, Dialog } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Use with sx prop for styling
<Button 
  variant="contained" 
  startIcon={<Add />}
  sx={{ borderRadius: 2, px: 3 }}
>
  Create
</Button>
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/544dff35-205c-4b6c-9d3e-3191cd333d4e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
