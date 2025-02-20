```sh
  git remote set-url origin [git/ssh url]       Setting your remote original target
  git config --get remote.origin.url            Getting remote url
  git push --delete origin                      Delete a remote branch
  git checkout —.                               Discarding changes
  git checkout otherbranch myfile.txt           Pulling file from another branch
  git stash --include-untracked                 Stash all including untracked, new files
  git rev-list --count HEAD                     See number of commits
  git commit --amend --no-edit                  Amend the existing commit
  git restore -s db47d3f7 -- package.json       Pulling file from another commit
  git branch --merged                           See all branches that have been merged into main
  git branch -m <oldname> <newname>             Renaming local branch
  git log -n 1 --date-order --all               See latest commits irrespective of branch
  git merge --ff-only [your-branch]             Will abort if it cannot fast-forward
  git cherry-pick <commit hash>                 Merge commit from another branch
  git cherry-pick --no-commit <commit hash>     Merge commit from another branch without committing
  git cherry -v main [your-branch]              See only commits made in a specific branch
  git reset HEAD~                               Remove the most recent commit, keep your working tree unchanged (best for accidental, unpushed commits)
  git reset 'HEAD@{1}'                          Undo git reset
  git reset --hard HEAD~                        Resetting one commmit in the past
  git reset --hard e0b5aa9d                     Resetting to previous hash commit
  git reset --soft HEAD~                        Reset 3 commits backwards keeping changes
  git reset --soft 357bd91                      Reset backwards to commit keeping changes
  git rebase -i HEAD~10                         Rebase interactive x commits
  git rebase -i --root                          Rebase interactive entire history
  git symbolic-ref HEAD refs/heads/mybranch     Change default branch on remote bare repo
```
