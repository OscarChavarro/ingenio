export HOSTNAME=`hostname`

if [ $HOSTNAME == "ingenio.cubestudio.co" ]; then
    echo RUNNING APPLICATION IN PRODUCTION MODE
    export ROOT_URL=http://ingenio.cubestudio.co
    export MONGO_URL=mongodb://ingenio.cubestudio.co:27017/ingenio
    meteor --production --port 80 run
else
    echo RUNNING APPLICATION IN DEVELOPMENT MODE
    export ROOT_URL=http://localhost:3000
    export MONGO_URL=mongodb://ingenio.cubestudio.co:27017/ingenio
    meteor --port 3000 run
fi
