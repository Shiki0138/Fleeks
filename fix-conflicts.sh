#!/bin/bash

# Backup original files
cp index.html index.html.backup
cp styles.css styles.css.backup

# Remove merge conflict markers and keep the content between HEAD and =======
# This keeps your local changes

# For index.html
sed -i '' '/^<<<<<<< HEAD$/d' index.html
sed -i '' '/^=======$/,/^>>>>>>> [0-9a-f]\+$/d' index.html

# For styles.css
sed -i '' '/^<<<<<<< HEAD$/d' styles.css
sed -i '' '/^=======$/,/^>>>>>>> [0-9a-f]\+$/d' styles.css

echo "Merge conflicts removed. Backups created as .backup files"