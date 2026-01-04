# Brainiac AI

> "Knowledge is power, and I am its master."

**Inspired by the superintelligent AI from Superman's home planet Krypton**

---

## Overview

Brainiac AI is a powerful CLI-based coding agent that brings the intelligence of advanced AI directly to your terminal. Just like its namesake from Krypton, Brainiac AI possesses vast knowledge and capabilities to assist developers in their coding journey.

Powered by a locally hosted Ollama model (llama3.1 by default), Brainiac AI acts as your personal coding companion, understanding your needs and delivering production-ready solutions with the expertise of a senior developer—without sending source code outside your device.

---

## Core Capabilities

### Project Creation & Management
- Create complete project structures from scratch
- Set up organized folder hierarchies with best practices
- Generate boilerplate code for various frameworks and languages
- Initialize projects with proper configuration files (package.json, .gitignore, README.md)

### Code Generation & Modification
- Write production-ready code with error handling
- Read, write, and modify existing files intelligently
- Show diffs before making changes to your code
- Format code automatically using industry standards

### Development Assistance
- Execute shell commands safely within your project
- Explain complex programming concepts clearly
- Provide best practices and architectural guidance
- Debug issues and suggest optimizations

### Intelligent Features
- Context-aware responses using conversation memory
- Multi-step reasoning with function calling
- Automatic rate limit handling and retries
- Live code streaming in the terminal while files are written
- Interactive follow-up questions to guide your workflow

---

## Tech Stack

### Core Technologies

```
Runtime Environment:    Node.js (Latest LTS)
AI/ML Framework:        Ollama JavaScript client
Language Model:         Configurable (default llama3.1 via Ollama)
```

### Key Dependencies

- **ollama** - Local LLM client communication
- **readline** - Interactive CLI input/output
- **ora** - Terminal spinners and loading indicators
- **chalk** - Terminal text styling and colors
- **zod** - JSON schema generation for tool validation
- **execa** - Shell command execution helper

---

## Architecture

### Modular Tool System
Extensible architecture with dedicated tools for:
- File operations (read, write, create, delete, diff)
- Code formatting and linting
- Shell command execution
- Project scaffolding and generation

### Conversation History
- Maintains in-memory transcripts for the current session
- Keeps tool inputs and outputs aligned with model reasoning
- Provides relevant historical information automatically during the run

### CLI Interface
- Color-coded output for enhanced readability
- Loading indicators for asynchronous operations
- Structured separation between user input and AI responses
- Detailed logging for tool execution

### Safety Mechanisms
- Rate limit handling with exponential backoff
- Graceful error recovery
- Input validation and sanitization
- Safe file operations with user confirmations

---

## Use Cases

### For Beginners
- Learn programming concepts with clear explanations
- Quick-start new frameworks and projects
- Understand industry best practices
- Get code examples and walkthroughs

### For Experienced Developers
- Rapid prototyping and experimentation
- Automate repetitive coding tasks
- Receive architectural guidance for complex systems
- Refactor legacy code with confidence

### For Development Teams
- Maintain consistent code style across projects
- Generate boilerplate for microservices
- Automate API and function documentation
- Set up CI/CD configurations

---

## Example Workflows

```bash
# Create a new REST API
❯ Create a REST API for a todo application

# Add authentication
❯ Add authentication with JWT tokens

# Implement security
❯ Add rate limiting and security headers

# Prepare for deployment
❯ Create a Dockerfile for this project

# Add testing
❯ Generate unit tests for the API endpoints
```

---

## Development Roadmap

### Planned Features
- Multi-language support (Python, Go, Rust agents)
- Automatic test generation and execution
- Code analysis with complexity metrics
- Git integration (commit, branch, PR automation)
- Collaborative coding sessions
- Interactive learning mode with tutorials

### Performance Improvements
- Optimized context window management
- Parallel tool execution
- Enhanced caching mechanisms
- Reduced API latency

---

## Why "Brainiac"?

In the Superman universe, Brainiac is a Kryptonian AI characterized by:

**12th-Level Intellect** - Superhuman intelligence and reasoning
**Vast Knowledge** - Collector and curator of information across worlds
**Adaptability** - Continuous evolution and improvement
**Problem-Solving** - Calculates and executes optimal solutions

Our Brainiac AI embodies these qualities to help developers build, learn, and innovate faster than ever before.

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Bishwash-007/gemin-coding-agent-js.git

# Navigate to project directory
cd gemin-coding-agent-js

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Ensure Ollama is running locally and adjust host/model in .env if needed
```

### Usage

```bash
# Verify Ollama server is running in another terminal
# ollama serve

# Start Brainiac AI
npm run cli

# Begin your coding session
❯ Hello Brainiac, let's build something amazing!
```

### Configuration

Edit the `.env` file to point at your local Ollama server:

```env
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1
```

---

## Technical Specifications

### System Requirements
- Node.js version 18.x or higher
- Minimum 4GB RAM
- Ollama installed with the desired model pulled (default llama3.1)
- Active internet connection for model downloads and git operations
- Terminal with UTF-8 support

### API Integration
- Communicates with a locally hosted Ollama server over HTTP
- Implements retry logic with exponential backoff when the model is busy
- Handles rate limiting automatically for concurrent requests
- Streams tool output back to the CLI for real-time feedback

### Memory Management
- Session-scoped history buffer shared with the model
- Tool responses recorded alongside assistant messages
- Lightweight context trimming to avoid oversized payloads
- Reset automatically when you exit the CLI

---

## Project Structure

```
brainiac-ai/
├── index.js                # CLI entry point
├── package.json
├── brainiac_presentation.md
├── config/
│   ├── env.js              # Environment loader (OLLAMA_HOST, OLLAMA_MODEL)
│   ├── gemini.js           # Ollama client bootstrap
│   └── prompt.js           # System prompt
├── functions/
│   ├── create.js
│   ├── delete.js
│   ├── diff.js
│   ├── format.js
│   ├── index.js            # Tool registry
│   ├── read.js
│   ├── shell.js
│   └── write.js
├── projects/               # Generated user projects
├── utils/
│   └── ui.js               # CLI formatting helpers
└── .env.example            # Environment template
```

---

## Contributing

We welcome contributions from the community. Please read our contributing guidelines before submitting pull requests.

### Development Setup

```bash
# Fork and clone the repository
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Run tests
npm test

# Submit a pull request
```

---

## Acknowledgments

**Ollama Community** - For delivering accessible local model tooling
**Open Source Community** - For the excellent tools and libraries
**DC Comics** - For the inspiration behind the project name

---

## License

MIT License - Build freely, build responsibly

---

**Brainiac AI** - Your Kryptonian-Level Coding Companion

Star the project | Report bugs | Suggest features

Made with intelligence and care