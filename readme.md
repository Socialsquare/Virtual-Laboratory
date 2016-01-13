# Virtuelt Laboratorium

Production, hosted by the client: http://www.biotechacademy.dk/Virtuelt-Laboratorium/velkommen

## Demo

Demo is hosted by Socialsquare: http://vlab.demo.socialsquare.dk/
Jenikins CI auto deploy current master from github to vlab.demo.socialsquare.dk
and on vlab.demo.socialsquare.dk there is a repository with post-received hook
which installs npm, bower and runs `grunt production` task.

	demo          ssh://vlab@vlab.demo.socialsquare.dk:vlab.git

## Production
Production is hosted by the client but it used to be here:

	production    ssh://vlab.biotechacademy.dk/home/vlab/vlab.git


## Development

    npm install
    bower install
    tsd reinstall -s
    grunt test
    grunt

