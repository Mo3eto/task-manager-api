git init 
git add . 
git commit -m "initCommit"
git remote add origin git@github.com:Mo3eto/$yourRepoName$.git
git push -u origin master

heroku create $yourWebsiteName
heroku config:set key=value
git push heroku master
