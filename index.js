#!/usr/bin/env node

const inquirer = require('@inquirer/prompts');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Open or create the database
const db = new Database('db.sqlite');

// Run schema creation if needed
initDB();

/**
 * Initialize the DB schema if it doesn't already exist.
 */
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id   INTEGER PRIMARY KEY,
      path TEXT NOT NULL UNIQUE
    );
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id   INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS file_tags (
      file_id INTEGER NOT NULL,
      tag_id  INTEGER NOT NULL,
      UNIQUE(file_id, tag_id),
      FOREIGN KEY(file_id) REFERENCES files(id),
      FOREIGN KEY(tag_id)  REFERENCES tags(id)
    );
  `);
}

/**
 * Main interactive menu loop with inquirer.
 */
async function mainMenu() {
  while (true) {
    const choice = await inquirer.select({
      message: 'What do you want to do?',
      choices: [
        {
          name: 'Create File',
          value: 'create_file',
          description: 'Create new file with nano',
        },
        {
          name: 'Add Tags',
          value: 'add_tags',
          description: 'Add tags to a file',
        },
        {
          name: 'Remove Tags',
          value: 'remove_tags',
          description: 'Remove tags from a file',
        },
        {
          name: 'Exit',
          value: 'exit',
          description: 'End program',
        },
      ],
    });

    switch (choice) {
      case 'create_file':
        await handleCreateNewFile();
        break;
      case 'add_tags':
        await handleAddTags();
        break;
      case 'remove_tags':
        await handleRemoveTags();
        break;
      case 'exit':
        console.log('Goodbye!');
        process.exit(0);
    }
  }
}

/**
 * Create a new file and open it with nano. Then optionally add tags.
 */
async function handleCreateNewFile() {
  const filename = await inquirer.input({ message: 'Enter file name with extension type' });

  // Ensure the repo directory exists
  fs.mkdirSync('repo', { recursive: true });

  // Create the new .md file in repo if it doesn't exist
  const extension = filename.split('.').pop();
  const fullPath = path.join('repo', `${filename}.md`);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, '# New Document\n\n```' + extension + '\n\n```');
  }

  // Open nano editor, wait until user is done
  spawnSync('nano', [fullPath], { stdio: 'inherit' });

  // Check if the file was saved
  if (fs.existsSync(fullPath)) {
    // Insert file info into DB
    insertFile(fullPath);

    // Prompt for tags
    const tags = await inquirer.input({ message: 'Enter comma-separated tags (or leave empty):' });
    console.log(tags)
    if (tags && tags.trim().length > 0) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      tagArray.forEach(tag => {
        insertTagIfMissing(tag);
        linkFileTag(fullPath, tag);
      });
      console.log(`File "${filename}.md" tagged with: ${tagArray.join(', ')}`);
    } else {
      console.log('No tags added.');
    }
  } else {
    console.log('File not saved.');
  }
}

/**
 * Add one or more tags to an existing file.
 */
async function handleAddTags() {
  // First, we might want the user to choose from existing files
  // or we can just ask them to type a filename. 
  // For simplicity, let's just ask them for the exact filename.
  const filename = await inquirer.input({ message: 'Enter file name without extension:' });
  // Then get tags
  const tags = await inquirer.input({ message: 'Enter comma-separated tags to add:' });

  const fullPath = path.join('repo', `${filename}.md`);
  if (!fs.existsSync(fullPath)) {
    console.log('Error: That file does not exist in ./repo!');
    return;
  }

  const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
  tagArray.forEach(tag => {
    insertTagIfMissing(tag);
    linkFileTag(fullPath, tag);
  });
  console.log(`Added tags [${tagArray.join(', ')}] to ${filename}.md`);
}

/**
 * Remove one or more tags from an existing file.
 */
async function handleRemoveTags() {
  const filename = await inquirer.input({ message: 'Enter file name without extension:' });
  const tags = await inquirer.input({ message: 'Enter comma-separated tags to add:' });

  const fullPath = path.join('repo', `${filename}.md`);
  if (!fs.existsSync(fullPath)) {
    console.log('Error: That file does not exist in ./repo!');
    return;
  }

  const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
  tagArray.forEach(tag => {
    removeFileTag(fullPath, tag);
  });
  console.log(`Removed tags [${tagArray.join(', ')}] from ${filename}.md`);
}

/**
 * Insert a file record if not already present.
 */
function insertFile(filePath) {
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO files (path) VALUES (?)
  `);
  insertStmt.run(filePath);
}

/**
 * Insert a tag if it doesn't exist already.
 */
function insertTagIfMissing(tagName) {
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO tags (name) VALUES (?)
  `);
  insertStmt.run(tagName);
}

/**
 * Link a file to a tag in the join table.
 */
function linkFileTag(filePath, tagName) {
  const fileIdStmt = db.prepare(`SELECT id FROM files WHERE path = ?`);
  const file = fileIdStmt.get(filePath);
  if (!file) {
    console.log(`File not found in DB: ${filePath}`);
    return;
  }

  const tagIdStmt = db.prepare(`SELECT id FROM tags WHERE name = ?`);
  const tag = tagIdStmt.get(tagName);
  if (!tag) {
    console.log(`Tag not found in DB (should never happen if we inserted): ${tagName}`);
    return;
  }

  const linkStmt = db.prepare(`
    INSERT OR IGNORE INTO file_tags (file_id, tag_id) VALUES (?, ?)
  `);
  linkStmt.run(file.id, tag.id);
}

/**
 * Remove a tag from a file in the join table.
 */
function removeFileTag(filePath, tagName) {
  const fileIdStmt = db.prepare(`SELECT id FROM files WHERE path = ?`);
  const file = fileIdStmt.get(filePath);
  if (!file) {
    console.log(`File not found in DB: ${filePath}`);
    return;
  }

  const tagIdStmt = db.prepare(`SELECT id FROM tags WHERE name = ?`);
  const tag = tagIdStmt.get(tagName);
  if (!tag) {
    console.log(`Tag not found in DB: ${tagName}`);
    return;
  }

  const delStmt = db.prepare(`
    DELETE FROM file_tags WHERE file_id = ? AND tag_id = ?
  `);
  delStmt.run(file.id, tag.id);
}

// Start the main menu
mainMenu();