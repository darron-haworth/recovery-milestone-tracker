# Contributing

Thank you for your interest in contributing to this project! This guide will help you set up your development environment and understand our contribution process.

## Code Statistics

This project automatically tracks code statistics using `cloc` and `clocrt`. The results are maintained in the `cloc-results.md` file, which is automatically updated by a pre-commit hook before each commit.

## Prerequisites

Before you can contribute, you'll need to install the following dependencies:

### Required Tools

- **Go**: The `clocrt` tool is written in Go, so you must have Go installed on your system
- **cloc**: Standard lines-of-code counting tool
- **clocrt**: Go-based tool for generating markdown-formatted code statistics
- **Node.js/npm**: Required for `npx` functionality

### Installing Dependencies

1. **Install Go** (if not already installed):
   Follow the official installation guide at [https://golang.org/doc/install](https://golang.org/doc/install)

2. **Install clocrt**:
   ```bash
   go install github.com/michalspano/clocrt/clocrt@latest
   ```

3. **Install cloc** (if not already installed):
   ```bash
   # On Ubuntu/Debian
   sudo apt install cloc
   
   # On macOS
   brew install cloc
   ```

## Development Environment Setup

### 1. Configure Your Go Path

Add your Go binary path to your system's PATH variable by adding this line to your shell configuration file (e.g., `~/.bashrc`, `~/.zshrc`):

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

After adding this line, reload your shell configuration:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### 2. Enable Pre-commit Hook

From your project's root directory, make the pre-commit hook executable:

```bash
chmod +x .git/hooks/pre-commit
```

### 3. Verify Setup

Test that everything is working correctly:

```bash
# Verify Go is installed
go version

# Verify clocrt is available
clocrt --version

# Verify cloc is available
cloc --version
```

## How It Works

Once set up, the pre-commit hook will automatically:

1. Run `cloc` to count lines of code in your project
2. Use `clocrt` to format the results as a Markdown table
3. Update the `cloc-results.md` file with current statistics
4. Stage the updated file as part of your commit

This ensures that code statistics are always up-to-date and accurately reflect the current state of the codebase.

## Troubleshooting

### Common Issues

- **"clocrt command not found"**: Make sure you've added the Go binary path to your PATH and reloaded your shell
- **Permission denied on pre-commit hook**: Run `chmod +x .git/hooks/pre-commit` to make it executable
- **Go not found**: Ensure Go is properly installed and available in your PATH

### Getting Help

If you encounter issues during setup, please:

1. Check that all prerequisites are installed and properly configured
2. Verify your PATH includes the Go binary directory
3. Open an issue with details about your environment and the specific error you're encountering

## Making Contributions

With your environment set up, you're ready to contribute! The pre-commit hook will automatically handle code statistics tracking, so you can focus on writing great code.

Happy coding! ðŸš€