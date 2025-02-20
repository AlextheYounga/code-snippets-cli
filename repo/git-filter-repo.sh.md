```sh
# Trivially make git history linear
git filter-branch --parent-filter 'cut -f 2,3 -d " "'

# Filter repo using git-filter-repo
git filter-repo --path <path> --invert-paths
```
