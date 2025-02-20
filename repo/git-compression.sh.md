```sh
# Push with compression to remote
git -c core.compression=9 push pi --all

# Prune all unused objects in git history
git -c gc.reflogExpire=0 -c gc.reflogExpireUnreachable=0 -c gc.rerereresolved=0 -c gc.rerereunresolved=0 -c gc.pruneExpire=now gc
```
