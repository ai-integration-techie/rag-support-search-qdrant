#!/bin/bash

# RAG Support Search Project Setup Script
# This script sets up the complete project environment

set -e  # Exit on any error

echo "🚀 Setting up RAG Support Search Project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is installed
check_python() {
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION found"
    else
        print_error "Python 3 is not installed. Please install Python 3.8+ first."
        exit 1
    fi
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION found"
    else
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm $NPM_VERSION found"
    else
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    print_status "Upgrading pip..."
    pip install --upgrade pip
    
    # Install requirements
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Create data directories
    print_status "Creating data directories..."
    mkdir -p data/uploads
    mkdir -p data/chroma_db
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
CHROMA_DB_PATH=./data/chroma_db
UPLOAD_DIR=./data/uploads
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
EOF
        print_warning "Please update the .env file with your actual API keys"
    fi
    
    cd ..
    print_success "Backend setup completed!"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Start frontend
    print_status "Starting frontend..."
    npm start
    
    cd ..
    print_success "Frontend setup completed!"
}

# Create sample data
create_sample_data() {
    print_status "Creating sample data..."
    
    mkdir -p backend/data/sample
    
    # Create sample CSV file
    cat > backend/data/sample/sample_kb.csv << EOF
id,title,content,category,created_date
1,How to reset password,To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email.,Authentication,2024-01-15
2,Installation guide,Download the installer from our website. Run the setup.exe file and follow the installation wizard.,Installation,2024-01-16
3,Troubleshooting connection issues,If you're experiencing connection issues, check your internet connection and firewall settings. Try restarting the application.,Troubleshooting,2024-01-17
4,User account management,To manage user accounts, go to Settings > Users. You can add, edit, or remove users from here.,Administration,2024-01-18
5,Backup and restore,To backup your data, go to Settings > Backup. Select the data you want to backup and choose a location.,Data Management,2024-01-19
EOF

    # Create sample TXT file
    cat > backend/data/sample/sample_support.txt << EOF
Support Case #001
Customer: John Doe
Issue: Unable to login to the application
Description: Customer reports getting "Invalid credentials" error when trying to login with correct username and password.
Resolution: Cleared browser cache and cookies. Issue resolved.
Status: Closed
Date: 2024-01-20

Support Case #002
Customer: Jane Smith
Issue: Application crashes on startup
Description: Application crashes immediately after launching on Windows 10.
Resolution: Updated graphics drivers and reinstalled the application.
Status: Closed
Date: 2024-01-21

Support Case #003
Customer: Bob Johnson
Issue: Slow performance
Description: Application is running very slowly, taking 30+ seconds to load pages.
Resolution: Optimized database queries and added indexing.
Status: In Progress
Date: 2024-01-22
EOF

    print_success "Sample data created!"
}

# Main setup function
main() {
    print_status "Starting RAG Support Search Project setup..."
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_python
    check_node
    check_npm
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Create sample data
    create_sample_data
    
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update the .env file in backend/ with your API keys"
    echo "2. Start the backend: docker-compose up --build"
    echo "3. Start the frontend: cd frontend && npm start"
    echo "4. Access the application at http://localhost:3000"
    echo ""
    echo "For more information, see the README.md file."
}

# Run main function
main 