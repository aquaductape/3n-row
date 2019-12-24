#!/bin/bash

echo "building dist...\n" &&
npm run build &&
echo "\nallow dist in gitingore\n"
sed -i -- 's/dist//g' ./.gitignore &&
git add . &&
echo "\ncreating commit to push dist subtree for gh-pages...\n"
git commit -m "update dist subtree for gh-pages" &&
git push origin `git subtree split --prefix dist master`:gh-pages --force &&
echo -e "\n removing dist commit, reseting to previous commit\n"
git reset --hard HEAD~1
echo -e "\nComplete!"