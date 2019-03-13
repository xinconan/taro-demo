#!/usr/bin/env sh

set -e
yarn build:h5

cd dist

git init
git add -A
git commit -m 'deploy'
# one commit
git push -f git@github.com:xinconan/taro-demo.git master:gh-pages

cd -