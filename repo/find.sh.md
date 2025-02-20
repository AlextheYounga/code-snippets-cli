```sh
  find . -type f -print0 | xargs -0 grep -l "some string"     Find a file using string
  find ./ -maxdepth 1 -type f -name "*.sqlite"                Find file recursively
  grep -Rl “some string” ./                                   Recursive search files
  find . -type d | grep DIRNAME                               Find folder
  find ./ -type f -not -path '*.git/**'                       Find all files except folder
  find . -not -path '*.git/**' -delete                        Delete all files except one
  find ./ -type d -empty -not -path '*.git/**'                The above command may leave behind some straggling folders if delete is passed
  find . -type f -size +1G                                    Find files larger than 1 gig
```
