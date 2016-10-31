# Virtuelt Laboratorium

## Development

Use node v 4.0.0. 
You need to have npm, bower, typings and grunt installed globally.
Restart terminal after npm install if you get can't find module q error (maybe also npm install bower -g).

```
npm install
bower install
typings install
grunt test
grunt
```

##### Start at certain step
* Open `app/js/controller/App.ts`
  * Remove comment from `something`
* Open `app/js/utils/ExperimentStarter.ts`
  * Se the outcommented code at the bottom for inspiration

##### Dev tips

* In Atom add `customFileTypes:"text.html.basic": ["ko"]` to core in config.cson
* Language files are in: [...tree/master/app/data](https://github.com/Socialsquare/Virtual-Laboratory/tree/master/app/data) and can be edited directly in on github.com (remember to "preview changes" prior to commit)

## Test

[vlab.demo.socialsquare.dk](http://vlab.demo.socialsquare.dk/)

Jenkins CI auto deploys current master from github to vlab.demo.socialsquare.dk
and on vlab.demo.socialsquare.dk there is a repository with post-received hook
which installs npm, bower and runs `grunt production` task.

```
demo          ssh://vlab@vlab.demo.socialsquare.dk:vlab.git
(git push --force demo origin/master)
```

## Production

Production, hosted by biotechacademy: [biotechacademy.dk/Virtuelt-Laboratorium/velkommen](http://www.biotechacademy.dk/Virtuelt-Laboratorium/velkommen)

```
production    ssh://vlab.biotechacademy.dk/home/vlab/vlab.git
```
