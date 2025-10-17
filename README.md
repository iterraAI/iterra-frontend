# Bug Resolve 🐛✨

An AI-powered platform that automatically solves GitHub issues using advanced AI models with human validation. Built with a 70% AI + 30% human approach for optimal code quality.

## 🌟 Features

- **GitHub Integration**: Seamless OAuth authentication and repository access
- **Multiple AI Models**: Choose from GPT-4, Claude 3, and more
- **Issue Analysis**: AI analyzes issues with full repository context
- **Solution Generation**: Automatically generates code solutions with explanations
- **Human Validation**: Review, approve, or modify AI solutions before deployment
- **Auto PR Creation**: Creates pull requests with validated solutions
- **Real-time Tracking**: Monitor the entire workflow from issue to PR

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- React Query for state management
- React Router for navigation

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB for data persistence
- Passport.js for GitHub OAuth
- Octokit for GitHub API integration

**AI Integration:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic Claude (Opus, Sonnet)

### Project Structure

```
bug-resolve/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   └── server.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # State management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- GitHub OAuth App credentials
- OpenAI API key (optional)
- Anthropic API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   cd bug-resolve
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Configure GitHub OAuth**
   
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create a new OAuth App with:
     - Homepage URL: `http://localhost:5173`
     - Callback URL: `http://localhost:5000/api/auth/github/callback`
   - Copy Client ID and Client Secret to `.env`

5. **Set up MongoDB**
   
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env`

6. **Add AI API Keys**
   
   - Get OpenAI API key from [platform.openai.com](https://platform.openai.com)
   - Get Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
   - Add them to `.env`

### Running the Application

**Development mode (runs both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 📖 Usage Guide

### 1. Connect GitHub Account
- Click "Connect with GitHub" on the landing page
- Authorize the application to access your repositories

### 2. Sync Repositories
- Navigate to the Repositories page
- Click "Refresh" to sync your GitHub repos
- Click "Fetch Issues" on any repository

### 3. Solve an Issue
- Go to the Issues page
- Click "Solve with AI" on any issue
- Select an AI model (GPT-4, Claude, etc.)
- Click "Generate Solution"
- Wait for AI to analyze and generate the solution

### 4. Validate Solution
- Navigate to Validations page
- Review the AI-generated solution:
  - Read the analysis
  - Check proposed changes
  - Review modified files
- Options:
  - **Approve**: If solution looks good
  - **Modify**: Edit files manually if needed
  - **Reject**: If solution is not suitable

### 5. Create Pull Request
- After approval, the system creates a PR automatically
- View PR status on Pull Requests page
- Click "View on GitHub" to see the actual PR

## 🔧 Configuration

### Environment Variables

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bug-resolve

# JWT & Sessions
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here

# AI APIs
OPENAI_API_KEY=your_openai_api_key          # Optional
ANTHROPIC_API_KEY=your_anthropic_api_key    # Optional

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🎯 Workflow

```
1. User connects GitHub account
   ↓
2. System fetches repositories and issues
   ↓
3. User selects issue to solve
   ↓
4. AI analyzes issue with repo context
   ↓
5. AI generates solution with code changes
   ↓
6. Human validates and optionally modifies (30% human intervention)
   ↓
7. System creates branch and commits changes
   ↓
8. PR is created automatically
   ↓
9. User reviews PR on GitHub
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Repositories
- `GET /api/github/repositories` - List user repos
- `POST /api/github/repositories/:owner/:repo/sync` - Sync repo
- `GET /api/github/repositories/:owner/:repo/issues` - Fetch issues

### Issues
- `GET /api/issues` - List all issues
- `GET /api/issues/:issueId` - Get issue details
- `POST /api/issues/:issueId/analyze` - Analyze issue

### AI
- `GET /api/ai/models` - List available AI models
- `POST /api/ai/generate-solution` - Generate solution

### Validations
- `GET /api/validations/pending` - Get pending validations
- `POST /api/validations/:solutionId/validate` - Validate solution
- `POST /api/validations/:solutionId/modify` - Modify solution

### Pull Requests
- `POST /api/prs/create` - Create PR
- `GET /api/prs` - List all PRs
- `GET /api/prs/:prId/status` - Get PR status

## 🗄️ Database Schema

### User
- GitHub ID, username, email, avatar
- Access token for GitHub API

### Repository
- GitHub repo ID, name, owner
- Default branch, language

### Issue
- Issue number, title, body
- Labels, assignees, status

### Solution
- AI model used, analysis, proposed solution
- Files changed with content
- Status, confidence score

### Validation
- Solution reference
- Validator, status, comments
- Modifications made

### PullRequest
- PR number, branch names
- GitHub PR ID, HTML URL
- Status tracking

## 🤖 AI Models

The platform supports multiple AI models:

1. **GPT-4 Turbo** - Most capable for complex issues
2. **GPT-3.5 Turbo** - Fast and efficient for simple bugs
3. **Claude 3 Opus** - Excellent for code analysis
4. **Claude 3 Sonnet** - Balanced performance

Each model analyzes:
- Issue description and context
- Repository structure
- Key files (README, package.json, etc.)
- Similar code patterns

## 🛡️ Security

- OAuth tokens are encrypted and stored securely
- Session-based authentication
- CORS protection
- Helmet.js for security headers
- Environment variables for secrets

## 🚧 Limitations

- This is a prototype, not production-ready
- AI solutions may not always be perfect (hence the validation layer)
- Limited to public repositories or repos you have access to
- API rate limits apply (GitHub, OpenAI, Anthropic)
- Large files may not be fully analyzed

## 🔮 Future Enhancements

- [ ] Support for more AI models (Gemini, etc.)
- [ ] Better diff visualization
- [ ] Code review integration
- [ ] Testing automation
- [ ] CI/CD integration
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Webhook support for auto-solving
- [ ] Multi-language support
- [ ] Mobile app

## 🤝 Contributing

This is a prototype project. Feel free to fork and enhance!

## 📝 License

ISC

## 🙏 Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- GitHub for excellent API
- All open-source libraries used

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Made with ❤️ for developers who want to solve issues faster**

**Note**: This is a working prototype demonstrating AI-powered issue resolution with human validation. It's designed to showcase the concept of 70% AI + 30% human intervention for optimal code quality.
