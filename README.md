# HR Pro Toolbox - Lucky Draw Daily II

A modern React application for HR professionals to manage participants, perform lucky draws, and organize team groupings.

## Features

- **Participant Management**: Easily add, edit, and list participants.
- **Lucky Draw**: Interactive tool to pick winners from the participant list.
- **Auto Grouping**: Automatically divide participants into balanced teams.
- **AI Integration**: Powered by Google Gemini for intelligent features.

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lwhtyk0121/luckydraw_dailyII.git
   cd luckydraw_dailyII
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Development

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build

To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist` folder.

## Deployment

This project is configured to deploy automatically to **GitHub Pages** via GitHub Actions.

1. Go to your GitHub repository **Settings > Secrets and variables > Actions**.
2. Add a new repository secret named `GEMINI_API_KEY`.
3. Push your changes to the `main` branch, and the deployment will trigger automatically.

## License

Private.
