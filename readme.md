# Virtuelt Laboratorium

## Development

    npm install
    bower install
    tsd reinstall -s
    grunt test
    grunt

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

