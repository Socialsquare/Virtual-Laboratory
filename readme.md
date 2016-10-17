# Virtuelt Laboratorium

## Development

You need to have npm, bower, typings and grunt installed globally.  
Restart terminal after npm install if you get can't find module q error (maybe also npm install bower -g).

```
cd app
npm install
bower install
typings install
grunt test
grunt
```

##### Dev tips

* In Atom add `customFileTypes:"text.html.basic": ["ko"]` to core in config.cson
* Sprogfiler ligger i: https://github.com/Socialsquare/Virtual-Laboratory/tree/master/app/data og kan redigeres direkte i interface på github.com (husk at "preview changes" inden commit)

## Demo

Demo is hosted by Socialsquare: http://vlab.demo.socialsquare.dk/
Jenikins CI auto deploy current master from github to vlab.demo.socialsquare.dk
and on vlab.demo.socialsquare.dk there is a repository with post-received hook
which installs npm, bower and runs `grunt production` task.

	demo          ssh://vlab@vlab.demo.socialsquare.dk:vlab.git

	(git push --force demo origin/master)

## Production

Production, hosted by the client: http://www.biotechacademy.dk/Virtuelt-Laboratorium/velkommen

	production    ssh://vlab.biotechacademy.dk/home/vlab/vlab.git
