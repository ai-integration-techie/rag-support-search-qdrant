#!/usr/bin/env python3
"""
Test script for large file uploads
This script helps test the improved file handling for large CSV files
"""

import requests
import pandas as pd
import os
import tempfile

def create_test_csv(size_mb=4, rows=10000):
    """Create a test CSV file of specified size"""
    print(f"Creating test CSV file of ~{size_mb}MB with {rows} rows...")
    
    # Create sample data
    data = {
        'id': range(1, rows + 1),
        'name': [f'User_{i}' for i in range(1, rows + 1)],
        'email': [f'user{i}@example.com' for i in range(1, rows + 1)],
        'description': [f'This is a detailed description for user {i} with additional information to make the file larger and test the chunking functionality.' * 5 for i in range(1, rows + 1)],
        'category': [f'Category_{i % 10}' for i in range(1, rows + 1)],
        'value': [i * 1.5 for i in range(1, rows + 1)]
    }
    
    df = pd.DataFrame(data)
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        df.to_csv(f.name, index=False)
        file_path = f.name
    
    # Check actual file size
    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    print(f"Created file: {file_path}")
    print(f"Actual file size: {file_size_mb:.2f}MB")
    
    return file_path

def test_upload(file_path, backend_url="http://localhost:8001"):
    """Test file upload to the backend"""
    print(f"\nTesting upload of {file_path}...")
    
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f, 'text/csv')}
            response = requests.post(f"{backend_url}/api/upload", files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Upload successful!")
            print(f"   Filename: {result.get('filename')}")
            print(f"   Chunks processed: {result.get('chunks_processed')}")
            print(f"   File type: {result.get('file_type')}")
            print(f"   File size: {result.get('file_size_mb')}MB")
        else:
            print(f"❌ Upload failed with status {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")

def main():
    """Main function to test large file uploads"""
    print("🚀 Testing Large File Upload Improvements")
    print("=" * 50)
    
    # Test with different file sizes
    test_sizes = [1, 2, 4]  # MB
    
    for size in test_sizes:
        print(f"\n📁 Testing {size}MB file...")
        file_path = create_test_csv(size_mb=size, rows=size * 2500)
        
        try:
            test_upload(file_path)
        finally:
            # Clean up test file
            if os.path.exists(file_path):
                os.unlink(file_path)
                print(f"   Cleaned up: {file_path}")
        
        print("-" * 30)

if __name__ == "__main__":
    main() 