#!/usr/bin/env python3
"""
Script to automatically fix common warning issues in the codebase
"""

import os
import re
import subprocess
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd, 
            capture_output=True, 
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def fix_python_warnings():
    """Fix Python warnings using various tools"""
    print("🔧 Fixing Python warnings...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False
    
    # Install required packages if not present
    packages = ["black", "isort", "flake8", "mypy"]
    for package in packages:
        print(f"📦 Installing {package}...")
        success, _, stderr = run_command(f"pip install {package}", cwd="backend")
        if not success:
            print(f"⚠️  Warning: Could not install {package}: {stderr}")
    
    # Format code with black
    print("🎨 Formatting Python code with Black...")
    success, stdout, stderr = run_command("black .", cwd="backend")
    if success:
        print("✅ Black formatting completed")
    else:
        print(f"⚠️  Black formatting failed: {stderr}")
    
    # Sort imports with isort
    print("📚 Sorting imports with isort...")
    success, stdout, stderr = run_command("isort .", cwd="backend")
    if success:
        print("✅ Import sorting completed")
    else:
        print(f"⚠️  Import sorting failed: {stderr}")
    
    return True

def fix_typescript_warnings():
    """Fix TypeScript warnings using ESLint"""
    print("🔧 Fixing TypeScript warnings...")
    
    # Check if package.json exists
    if not Path("package.json").exists():
        print("❌ package.json not found")
        return False
    
    # Install dependencies if needed
    print("📦 Installing npm dependencies...")
    success, _, stderr = run_command("npm install")
    if not success:
        print(f"⚠️  Warning: Could not install dependencies: {stderr}")
    
    # Run ESLint auto-fix
    print("🔍 Running ESLint auto-fix...")
    success, stdout, stderr = run_command("npx eslint --fix .")
    if success:
        print("✅ ESLint auto-fix completed")
        if stdout:
            print(f"📝 Fixed issues: {stdout}")
    else:
        print(f"⚠️  ESLint auto-fix failed: {stderr}")
    
    return True

def create_git_hooks():
    """Create git hooks to prevent committing code with warnings"""
    print("🔒 Creating git hooks...")
    
    hooks_dir = Path(".git/hooks")
    if not hooks_dir.exists():
        print("❌ .git directory not found")
        return False
    
    # Pre-commit hook
    pre_commit_content = """#!/bin/sh
# Pre-commit hook to check code quality

echo "🔍 Running pre-commit checks..."

# Check Python code
cd backend
if command -v black >/dev/null 2>&1; then
    echo "🎨 Checking Python formatting..."
    black --check . || exit 1
fi

if command -v isort >/dev/null 2>&1; then
    echo "📚 Checking import sorting..."
    isort --check-only . || exit 1
fi

# Check TypeScript code
cd ..
if command -v npx >/dev/null 2>&1; then
    echo "🔍 Checking TypeScript code..."
    npx eslint . || exit 1
fi

echo "✅ All checks passed!"
"""
    
    pre_commit_file = hooks_dir / "pre-commit"
    pre_commit_file.write_text(pre_commit_content)
    pre_commit_file.chmod(0o755)
    
    print("✅ Git hooks created")
    return True

def main():
    """Main function to fix all warnings"""
    print("🚀 Starting automatic warning fix...")
    print("=" * 50)
    
    # Fix Python warnings
    fix_python_warnings()
    print()
    
    # Fix TypeScript warnings
    fix_typescript_warnings()
    print()
    
    # Create git hooks
    create_git_hooks()
    print()
    
    print("🎉 Warning fix completed!")
    print("=" * 50)
    print("💡 Tips to prevent future warnings:")
    print("1. Use VS Code with the provided settings")
    print("2. Run 'npm run lint' before committing")
    print("3. Use Black and isort for Python formatting")
    print("4. Enable ESLint in your editor")
    print("5. Use TypeScript strict mode")

if __name__ == "__main__":
    main()
