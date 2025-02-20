```sh
# Rsync for large files over remote connections
rsync -avxP --progress --inplace --partial --whole-file --timeout=0 src: dest:
```
