#!/bin/bash
# NyayaSahayak - Pre-Push Verification Script
# Run this BEFORE pushing to GitHub to ensure everything works

echo "🔍 NyayaSahayak Pre-Push Verification"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0
PASSED=0

# Function to check command
 check_command() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAILED++))
    fi
}

# 1. Check if we're in the right directory
echo "📁 Checking project structure..."
if [ -f "package.json" ] && [ -d "src" ]; then
    check_command 0 "Project structure looks correct"
else
    check_command 1 "Missing package.json or src directory"
    echo -e "${RED}ERROR: Please run this script from the project root${NC}"
    exit 1
fi

# 2. Check Git installation
echo ""
echo "🔧 Checking Git installation..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    check_command 0 "Git installed: $GIT_VERSION"
else
    check_command 1 "Git not installed"
    echo -e "${RED}Please install Git first: https://git-scm.com/downloads${NC}"
    exit 1
fi

# 3. Check if git is initialized
echo ""
echo "📦 Checking Git repository..."
if [ -d ".git" ]; then
    check_command 0 "Git repository already initialized"
else
    echo -e "${YELLOW}⚠ Git not initialized. Initializing now...${NC}"
    git init
    check_command $? "Git repository initialized"
fi

# 4. Check Node.js
echo ""
echo "🟢 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_command 0 "Node.js installed: $NODE_VERSION"
else
    check_command 1 "Node.js not installed"
fi

# 5. Check dependencies
echo ""
echo "📥 Checking dependencies..."
if [ -d "node_modules" ]; then
    check_command 0 "Dependencies already installed"
else
    echo -e "${YELLOW}⚠ Installing dependencies...${NC}"
    npm install
    check_command $? "Dependencies installed"
fi

# 6. Check for critical files
echo ""
echo "📄 Checking critical files..."
CRITICAL_FILES=(
    "src/personas/citizen/pages/AboutPage.tsx"
    "src/shared/layout/CitizenLayout.tsx"
    "src/shared/styles/designTokens.ts"
    "package.json"
    "tsconfig.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_command 0 "Found: $file"
    else
        check_command 1 "Missing: $file"
    fi
done

# 7. Check for .gitignore
echo ""
echo "🚫 Checking .gitignore..."
if [ -f ".gitignore" ]; then
    check_command 0 ".gitignore exists"
else
    echo -e "${YELLOW}⚠ Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Testing
coverage/
.nyc_output/

# Cache
.cache/
.parcel-cache/
.eslintcache
.stylelintcache

# Misc
*.pem
*.cert
*.key
EOF
    check_command $? ".gitignore created"
fi

# 8. Check TypeScript compilation (if tsc exists)
echo ""
echo "🔷 Checking TypeScript..."
if command -v npx &> /dev/null; then
    echo "Running TypeScript check (this may take a moment)..."
    npx tsc --noEmit 2>&1 | head -20
    if [ $? -eq 0 ]; then
        check_command 0 "TypeScript compilation successful"
    else
        check_command 1 "TypeScript errors found (see above)"
        echo -e "${YELLOW}⚠ Fix TypeScript errors before pushing${NC}"
    fi
else
    check_command 1 "npx not available"
fi

# 9. Check for uncommitted changes
echo ""
echo "💾 Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠ Uncommitted changes found${NC}"
    git status --short
    echo ""
    read -p "Do you want to commit all changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "${commit_msg:-Production ready release}"
        check_command $? "Changes committed"
    else
        check_command 1 "Uncommitted changes remain"
    fi
else
    check_command 0 "No uncommitted changes"
fi

# 10. Check remote repository
echo ""
echo "🌐 Checking remote repository..."
REMOTE=$(git remote get-url origin 2>&1)
if [ $? -eq 0 ]; then
    check_command 0 "Remote configured: $REMOTE"
else
    check_command 1 "No remote repository configured"
    echo -e "${YELLOW}⚠ You'll need to add a remote after creating the GitHub repo${NC}"
fi

# Summary
echo ""
echo "======================================"
echo "📊 VERIFICATION SUMMARY"
echo "======================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo "Your project is ready to push to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/nyayasahayak.git"
    echo "3. Run: git push -u origin main"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo "Please fix the issues above before pushing to GitHub."
    exit 1
fi
