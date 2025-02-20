```sh
# Zip all folders within a folder
for dir in */; do (cd "$dir" && zip -r "../${dir%/}.zip" .); done

```
