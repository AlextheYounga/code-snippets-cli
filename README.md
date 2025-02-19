# Code Snippets CLI
## A simple Node.js CLI that allows you to create, tag, and search for code snippets, all from the command line.

I like simple and I have not bothered to set this up as an NPM package. I like this sitting in a git repo, with the database included in the tracking, so that I can easily pull this repo across machines and have everything I need. 

Clone this repo to wherever you would like and then just add an alias. 

Simple implementation:
```sh
alias codesnippets="node /path/to/repo/code-snippets/index.js"
```

Example:
```sh
alexyounger$ codesnippets
? What do you want to do? (Use arrow keys)
❯ Search Files By Tags
  Create File
  Add Tags
  Remove Tags
  Exit
```


All files are saved in Markdown format to avoid any weirdness of accidentally running the files, or to avoid debuggers picking up errors in these files unnecessarily. 

Once you search by tags, it will compile all files that match those tags into a single stream using less:

=== repo/read_zip_file.py.md ===

```py
def read_zip_file(zip_path):
        # Loads zip file into memory and reads the first file in the archive
        with open(zip_path, "rb") as f:
                zip_bytes = f.read()
                zip_buffer = io.BytesIO(zip_bytes)
                with zipfile.ZipFile(zip_buffer, "r") as zip_file:
                        files = zip_file.namelist()
                        with zip_file.open(files[0]) as file:
                                file_contents = file.read().decode("utf-8")
                                return file_contents
```

(END)
