/**
 * Created by lenovo on 30-Sep-17.
 */
//#05

//include auth service to get userID logged at this time//
//include('auth.js');

//#05f01
///creating trip ticket BY given id of trip///
function createTicket(idOfTrip, desiredSeat, ownerName, ownerPhone, assignLogMsg) {
    var logMsg;
    if(typeof desiredSeat !== 'number' || ownerName === '' || ownerPhone === ''){
        logMsg = 'خطأ فى البيانات';
        assignLogMsg(logMsg);
    } else {
        var tripStatus = firebase.database().ref().child('trips/' + idOfTrip);
        tripStatus.once('value', function (sTripStatus) {
            var numOfTickets = sTripStatus.child("numOfTickets").val();

            var status = sTripStatus.child('tripStatus').val();
            if(status === true){
                logMsg = '';
                var getCheckedSeat;
                var checkSeat = firebase.database().ref().child('tickets/').orderByChild('tripId').equalTo(idOfTrip);
                checkSeat.once('value', function (sSeat) {
                    var newTick = numOfTickets + 1;
                    firebase.database().ref().child('trips').child(idOfTrip).child("numOfTickets").set(newTick);
                    sSeat.forEach(function (check) {
                        var boolenSeat = check.val();
                        if (boolenSeat.seatNo === desiredSeat) {

                            getCheckedSeat = true;

                        } else {
                            getCheckedSeat = false;

                        }
                    });
                    if (getCheckedSeat === true) {
                        logMsg =  "تم حجز" + desiredSeat +" من قبل";
                        assignLogMsg(logMsg);
                    } else {

                        logMsg = "";
                        //get logged userID//
                        getSignedUser(function (user) {
                            var loggedUser = user.uid;

                            //start to create ticket//
                            var dateTime = new Date();
                            var timeStamp = dateTime.toUTCString();
                            var database = firebase.database().ref().child('tickets/');
                            database.once("value").then(function (snapshot) {
                                var ticketData = {
                                    seatNo: parseInt(desiredSeat),
                                    authorId: loggedUser,
                                    ownerName: ownerName,
                                    ownerPhone: ownerPhone,
                                    createdTimeStamp: timeStamp,
                                    tripId: idOfTrip
                                };
                                var idOfTicketNow = firebase.database().ref().child('tickets/').push(ticketData).key;



                                logMsg = "تم انشاء تذكرة بنجاح";
                                assignLogMsg(idOfTicketNow, logMsg);
                            });
                        });
                    }
                });
            }else {
                logMsg = '';
                logMsg = 'هذه الرحلة ليست متاحة للحجز, راجع المدير';
                assignLogMsg(logMsg);
            }
        });

    }
}

//#05f02
//get the data of ticket by the given id //
function getTicket(idOfTicket, assignTicketData) {
    var seatNo, ownerName, ownerPhone, createdTimeStamp, from, to, time, date, price, idOfTrip, duration, tripName;
    var ticketData;
    var databaseTicket = firebase.database().ref().child('tickets/' + idOfTicket);
    databaseTicket.once('value').then(function (snapshotFirst) {
        idOfTrip = snapshotFirst.child("tripId").val();
        ownerName = snapshotFirst.child("ownerName").val();
        ownerPhone = snapshotFirst.child("ownerPhone").val();
        createdTimeStamp = snapshotFirst.child("createdTimeStamp").val();
        seatNo = snapshotFirst.child("seatNo").val();

        var databaseTrip = firebase.database().ref().child('trips/' + idOfTrip);
        databaseTrip.once('value').then(function (snapshot) {
            from = snapshot.child("from").val();
            to = snapshot.child("to").val();
            time = snapshot.child("time").val();
            date = snapshot.child("date").val();
            price = snapshot.child("price").val();
            duration = snapshot.child("duration").val();
            tripName = snapshot.child("name").val();

            var timePM, timeAM, finalArabicTime;
            //change time PM & AM into arabic//

            var getTime = time.split(" ", 4);
            if(getTime[1] === "AM"){
                timePM = time.slice(0,4);
                var almostPM = "صباحا ";
                finalArabicTime = timePM + " " + almostPM;
            }else if(getTime[1] === "PM"){
                timeAM = time.slice(0,4);
                var almostAM = "مساءا ";
                finalArabicTime = timeAM + " " + almostAM;
            }

            ticketData = {
                idOfTrip: idOfTrip,
                seatNo: seatNo,
                ownerName: ownerName,
                ownerPhone: ownerPhone,
                createdTimeStamp: createdTimeStamp,
                duration: duration,
                from: from,
                to: to,
                time: finalArabicTime,
                date: date,
                price: price,
                tripName: tripName
            };
            assignTicketData(ticketData);
        });

    });
}

//#05f03
////get seats number of trip by id and get the registered seats////
function getSeats(idOfTrip, assignDoneSeats){
    var numberOfSeats;
    var database2 = firebase.database().ref().child('tickets/').orderByChild('tripId').equalTo(idOfTrip);
    database2.on('value', function (snapshot2) {
        var arrOfSeats = [];
        snapshot2.forEach(function (seatTrip) {
            numberOfSeats = seatTrip.child("seatNo").val();
            arrOfSeats.push(numberOfSeats);
        });
        assignDoneSeats(arrOfSeats);
    });
}

//#05f04
///get ticket by id of trip///
function getTickets(idOfTrip, assignAllTickets) {
    var seatNo, ownerName, idOfTicket, ownerPhone, createdTimeStamp, from, to, time, date, price, duration, authorId, authorName, tripName;

    var databaseTicket = firebase.database().ref().child('tickets/').orderByChild('tripId').equalTo(idOfTrip);
    databaseTicket.on('value', function (snapshotFirst) {
        var ticketData = [];
        snapshotFirst.forEach(function (sTicket) {
            idOfTicket = sTicket.key;
            ownerName = sTicket.child("ownerName").val();
            ownerPhone = sTicket.child("ownerPhone").val();
            createdTimeStamp = sTicket.child("createdTimeStamp").val();
            seatNo = sTicket.child("seatNo").val();
            authorId = sTicket.child("authorId").val();

        var databaseTrip = firebase.database().ref().child('trips/' + idOfTrip);
        databaseTrip.once('value', function (snapshot) {
            from = snapshot.child("from").val();
            to = snapshot.child("to").val();
            time = snapshot.child("time").val();
            date = snapshot.child("date").val();
            price = snapshot.child("price").val();
            duration = snapshot.child("duration").val();
            tripName = snapshot.child("name").val();

            var timePM, timeAM, finalArabicTime;
            //change time PM & AM into arabic//

                var getTime = time.split(" ", 4);
                if (getTime[1] === "AM") {
                    timePM = time.slice(0, 4);
                    var almostPM = "صباحا ";
                    finalArabicTime = timePM + " " + almostPM;
                } else if (getTime[1] === "PM") {
                    timeAM = time.slice(0, 4);
                    var almostAM = "مساءا ";
                    finalArabicTime = timeAM + " " + almostAM;
                }

            var databaseTrip = firebase.database().ref().child('users/' + authorId);
            databaseTrip.once('value', function (sUser) {
                authorName = sUser.child("name").val();

                ticketData.push({
                    authorName : authorName,
                    idOfTicket: idOfTicket,
                    seatNo: seatNo,
                    ownerName: ownerName,
                    ownerPhone: ownerPhone,
                    createdTimeStamp: createdTimeStamp,
                    duration: duration,
                    from: from,
                    to: to,
                    time: finalArabicTime,
                    date: date,
                    price: price,
                    tripName: tripName
                });
            });
        });

        });
        assignAllTickets(ticketData);
    });
}

//#05f05
///delete ticket by id///
function delTicket(idOfTicket, assignLogMsg) {
    var logMsg;
    var seatNo, ownerName, ownerPhone, deletedTimeStamp, idOfTrip, authorId, deleteAuthorId, dataToDelete;
    var databaseTicket = firebase.database().ref().child('tickets/' + idOfTicket);
    databaseTicket.once('value', function (snapshotFirst) {
        idOfTrip = snapshotFirst.child("tripId").val();
        ownerName = snapshotFirst.child("ownerName").val();
        ownerPhone = snapshotFirst.child("ownerPhone").val();
        seatNo = snapshotFirst.child("seatNo").val();
        authorId = snapshotFirst.child("authorId").val();


    getSignedUser(function (user) {
        if (user !== null) {
            deleteAuthorId = user.uid;
            deletedTimeStamp = new Date();
            dataToDelete = {
                deleteAuthorId: deleteAuthorId,
                deleteTimeStamp: deletedTimeStamp.toUTCString(),
                authorId: authorId,
                ownerName: ownerName,
                ownerPhone: ownerPhone,
                seatNo: seatNo,
                tripId: idOfTrip
            };
            firebase.database().ref().child('delTickets/').child(idOfTicket).set(dataToDelete);
            firebase.database().ref().child('tickets/' + idOfTicket).remove();
            var databaseTrip = firebase.database().ref().child('trips/' + idOfTrip);
            databaseTrip.once('value', function (snapshotTrip) {
                var numOfTickets = snapshotTrip.child("numOfTickets").val();
                var tickNow = numOfTickets - 1;
                firebase.database().ref().child('trips').child(idOfTrip).child("numOfTickets").set(tickNow);
            });
            logMsg = "تم حذف التذكرة بنجاح";
            assignLogMsg(logMsg);
        }
    });
    }).catch(function (error){
        if(error) {
            logMsg = "خطأ فى حذف التذكرة, حاول مرة اخرى";
            assignLogMsg(logMsg);
        }
    });
}

//#05f06
///get all deleted tickets///
function getDelTickets(assignDelTickets) {
    var seatNo, ownerName, idOfTicket, ownerPhone, createdTimeStamp, from, to, time, date, price, idOfTrip, duration, authorId, authorDelName, authorName, deleteAuthorId;
    var databaseTicket = firebase.database().ref().child('delTickets');
    databaseTicket.on('value', function (snapshotFirst) {
        var deletedTicketData = [];
        snapshotFirst.forEach(function (sDelTicket) {
            idOfTrip = sDelTicket.child("tripId").val();
            ownerName = sDelTicket.child("ownerName").val();
            ownerPhone = sDelTicket.child("ownerPhone").val();
            createdTimeStamp = sDelTicket.child("deleteTimeStamp").val();
            seatNo = sDelTicket.child("seatNo").val();
            authorId = sDelTicket.child("authorId").val();
            deleteAuthorId = sDelTicket.child("deleteAuthorId").val();

            var databaseTrip = firebase.database().ref().child('trips/' + idOfTrip);
            databaseTrip.on('value', function (snapshot) {
                from = snapshot.child("from").val();
                to = snapshot.child("to").val();
                time = snapshot.child("time").val();
                date = snapshot.child("date").val();
                price = snapshot.child("price").val();
                duration = snapshot.child("duration").val();


                var timePM, timeAM, finalArabicTime;
                //change time PM & AM into arabic//

                    var getTime = time.split(" ", 4);
                    if (getTime[1] === "AM") {
                        timePM = time.slice(0, 4);
                        var almostPM = "صباحا ";
                        finalArabicTime = timePM + " " + almostPM;
                    } else if (getTime[1] === "PM") {
                        timeAM = time.slice(0, 4);
                        var almostAM = "مساءا ";
                        finalArabicTime = timeAM + " " + almostAM;
                    }


                var databaseTicketAuthor = firebase.database().ref().child('users/' + authorId);
                databaseTicketAuthor.once('value', function (sUserAuthor) {
                    authorName = sUserAuthor.child("name").val();
                    var databaseDelAuthor = firebase.database().ref().child('users/' + deleteAuthorId);
                    databaseDelAuthor.once('value', function (sUserDelAuthor) {
                        authorDelName = sUserDelAuthor.child("name").val();
                        deletedTicketData.push({
                            deleteAuthorId: authorDelName,
                            authorName: authorName,
                            idOfTrip: idOfTrip,
                            seatNo: seatNo,
                            ownerName: ownerName,
                            ownerPhone: ownerPhone,
                            createdTimeStamp: createdTimeStamp,
                            duration: duration,
                            from: from,
                            to: to,
                            time: finalArabicTime,
                            date: date,
                            price: price
                        });
                    });
                });
            });

        });
        assignDelTickets(deletedTicketData);
    });
}
//
// function testing(idOfTrip) {
//     var tripStatus = firebase.database().ref().child('trips/' + idOfTrip);
//     tripStatus.once('value', function (sTripStatus) {
//         var numOfTickets = sTripStatus.child("numOfTickets").val();
//         var newTick = numOfTickets++;
//         firebase.database().ref().child('trips').child(idOfTrip).child("numOfTickets").set(numOfTickets++);
//     });
// }