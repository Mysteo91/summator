#!/bin/sh

function printlog {

    logger -t WATCHDOG $1

}

function checkConnection {

    ping -c 3 -I $1 8.8.8.8 > /dev/null

}


function restartNetworkInterface {


    ubus call network.interface.$1 down
    sleep 10
    ubus call network.interface.$1 up
    printlog "$1 interface is restarted"

}

function restartQmiInterface {

killall uqmi

}

function checkwwan {
    
    res=$(ifconfig | grep $1)
    if [ "$res" == "" ]
    then
	printlog "$1 interface is down"
	return 0
    else
	printlog "$1 interface is up"
	return 1
    fi

}

function watchdog {

	sleep 40	
	while true
	do
		for var in $1
		    do
			wwan=$(echo "$var" | awk -F ":" '{print $3}')
			interface=$(echo "$var" | awk -F ":" '{print $1}')
			checkwwan $wwan
			res=$?
			if [ $res -eq "1" ]
			    then
				checkConnection $wwan && printlog "$wwan ping is OK" || restartNetworkInterface $interface			
			    else
				restartQmiInterface
				restartNetworkInterface $interface
			    fi
			 
		done
	sleep 30
	done

}
	/etc/init.d/modemmanager restart
	sleep 15

	#detecting qmi interfaces and wwan
	WWAN_LIST=''
	COUNT=$(uci show network | grep cdc-wdm| wc -l) 
	if [ "$COUNT" -ne "0" ]
	then
		printlog "$COUNT  wdm interfaces founded"
		QMI_INTERFACE_LIST=$(uci show network | grep cdc-wdm | awk -F "." '{print $2}')
		for var in $QMI_INTERFACE_LIST
		    do
			printlog  "$var"
			CDC_INTERFACE=$(uci show network | grep $var.device | awk -F "'" ' {print substr($2,6,length($2))}')
			WWAN_INTERFACE=$(logread | grep name=$CDC_INTERFACE | awk -F "/net/" '{print $2}')
			WWAN_LIST="$WWAN_LIST$var:$CDC_INTERFACE:$WWAN_INTERFACE"$'\n'
		    done 
	        printlog "$WWAN_LIST"
	        watchdog "$WWAN_LIST"
	else
	    printlog "wdm interface is not detected"
	fi
	#end detecting
	
	







