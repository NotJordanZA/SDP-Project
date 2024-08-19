# SDP-Project
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/NotJordanZA/SDP-Project/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/NotJordanZA/SDP-Project/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/NotJordanZA/SDP-Project/badge.svg?branch=coverallsSetup)](https://coveralls.io/github/NotJordanZA/SDP-Project?branch=coverallsSetup)

https://wits-infrastructure-management.web.app/

## Branch Management
### Main branch
This is the production branch of the project; whatever is merged into this branch will be automatically deployed. Thus, it is important that this branch be protected by the following rules:
* This branch cannot be directly edited in any way ,i.e, you cannot push directly to this branch.
* In order to merge another branch into this branch, it must meet the following three criteria:
  1. It must pass all CircleCI checks.
  2. The pull request must be approved by two members of the team.
  3. It must be the development branch.

### Development branch
This is the developmental branch of the project; members will merge their own working branches into this branch. This is also the branch that should be branched off from for any development.

### General Guidelines
* Merge back into the development branch as often as possible to prevent merge conflicts.
* Create meaningful and concise commit messages.
