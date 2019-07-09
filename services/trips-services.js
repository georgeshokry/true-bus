/**
 * Created by lenovo on 28-Sep-17.
 */
//#04

//include auth service to get userID logged at this time//
// include('auth.js');

//#04f01
////add new trip with given data ///
function addNewTrip(name, from, to, duration, date, time, seatsNo, price, driverName, driverPhone, assignLogMsg){
    var logMsg;
    if(name==="" || from === "" || to === "" || duration === "" || date === "" || time === "" || seatsNo === "" || price === "" || driverName ==="" || driverPhone === "") {
        logMsg = '"يجب ملأ جميع البيانات"';
        assignLogMsg(logMsg);

    }else {
        var loggedUser;
        //get logged userID//
        getSignedUser(function (user) {
            loggedUser = user.uid;
            var parsedSeatsNo = parseInt(seatsNo);
            // var date = new Date();
            // var dateNow = date.toLocaleDateString();
            // var time = new Date();
            // var timeNow = time.toLocaleTimeString();
            var dateTime = new Date();
            var timeStamp = dateTime.toUTCString();
            var database = firebase.database().ref().child('/trips');
            database.push({
                name: name,
                date: date,
                time: time,
                from: from,
                to: to,
                duration: duration,
                seatsNo: parsedSeatsNo,
                lastUpdateTimeStamp: timeStamp,
                authorId: loggedUser,
                price: parseInt(price),
                driverName: driverName,
                driverPhone: driverPhone,
                tripStatus: true,
                archived: false,
                numOfTickets: 0,
                archivedAcc: false
            });
            logMsg = "تم انشاء رحلة جديدة بنجاح";
            assignLogMsg(logMsg);
        });
    }
}

//#04f02
///get trips ///
function getTrips(assignAllTrips) {
    var idOfTrip, name, date, time, from, to, duration, seatsNo, lastUpdateTimeStamp, authorId, price, driverName, driverPhone, tripStatus, archived;
    var database = firebase.database().ref().child('trips/').orderByChild('archivedAcc').equalTo(false);
    database.on('value', function (snapshot) {
        var tripData = [];
        snapshot.forEach(function (sTrip) {
            idOfTrip = sTrip.key;
            name = sTrip.child("name").val();
            date = sTrip.child("date").val();
            time = sTrip.child("time").val();
            from = sTrip.child("from").val();
            to = sTrip.child("to").val();
            duration = sTrip.child("duration").val();
            seatsNo = sTrip.child("seatsNo").val();
            lastUpdateTimeStamp = sTrip.child("lastUpdateTimeStamp").val();
            authorId = sTrip.child("authorId").val();
            price = sTrip.child("price").val();
            driverName = sTrip.child("driverName").val();
            driverPhone = sTrip.child("driverPhone").val();
            tripStatus = sTrip.child("tripStatus").val();
            archived = sTrip.child("archived").val();
            tripData.push({
                idOfTrip: idOfTrip,
                name: name,
                date: date,
                time: time,
                from: from,
                to: to,
                duration: duration,
                seatsNo: seatsNo,
                lastUpdateTimeStamp: lastUpdateTimeStamp,
                authorId: authorId,
                price: price,
                driverName: driverName,
                driverPhone: driverPhone,
                tripStatus: tripStatus,
                archived: archived
            });
        });

        assignAllTrips(tripData);
    });
}

//#04f03
// get one trip data with given id//
function getTripData(idOfTrip, assignTripData) {
    var name, date, time, from, to, duration, seatsNo, lastUpdateTimeStamp, authorId, price, driverName, driverPhone, tripStatus, archived;
    var database = firebase.database().ref().child('trips/' + idOfTrip);
    database.once('value', function (snapshot) {
        var tripData = [];

        name = snapshot.child("name").val();
        date = snapshot.child("date").val();
        time = snapshot.child("time").val();
        from = snapshot.child("from").val();
        to = snapshot.child("to").val();
        duration = snapshot.child("duration").val();
        seatsNo = snapshot.child("seatsNo").val();
        lastUpdateTimeStamp = snapshot.child("lastUpdateTimeStamp").val();
        authorId = snapshot.child("authorId").val();
        price = snapshot.child("price").val();
        driverName = snapshot.child("driverName").val();
        driverPhone = snapshot.child("driverPhone").val();
        tripStatus = snapshot.child("tripStatus").val();
        archived = snapshot.child("archived").val();
        tripData.push({
            idOfTrip: idOfTrip,
            name: name,
            date: date,
            time: time,
            from: from,
            to: to,
            duration: duration,
            seatsNo: seatsNo,
            lastUpdateTimeStamp: lastUpdateTimeStamp,
            authorId: authorId,
            price: price,
            driverName: driverName,
            driverPhone: driverPhone,
            tripStatus: tripStatus,
            archived: archived
        });

        assignTripData(tripData);
    });
}

//#04f04
//edit a trip with given trip id//
function editTrip(idOfTrip, name, from, to, duration, date, time, seatsNo, price, driverName, driverPhone, tripStatus, archived, assignLogMsg) {
    var logMsg;
    if(name==="" || from === "" || to === "" || duration === "" || date === "" || time === "" || seatsNo === "" || price === "" || driverName ==="" || driverPhone === "" || typeof tripStatus !== 'boolean') {
        logMsg = "يجب ملأ جميع البيانات";
        assignLogMsg(logMsg);

    }else {
        //get logged userID//
        getSignedUser(function (user) {
            var loggedUser;
            loggedUser = user.uid;
            var dateTime = new Date();
            var timeStamp = dateTime.toUTCString();
            var database = firebase.database().ref().child('trips/' + idOfTrip);
            database.set({
                name: name,
                date: date,
                time: time,
                from: from,
                to: to,
                duration: duration,
                seatsNo: parseInt(seatsNo),
                lastUpdateTimeStamp: timeStamp,
                authorId: loggedUser,
                price: parseInt(price),
                driverName: driverName,
                driverPhone: driverPhone,
                tripStatus: tripStatus,
                archived: archived
            });
            logMsg = "تم تعديل الرحلة بنجاح";
            assignLogMsg(logMsg);
        });
    }
}

//#04f05
///get trips IN ARABIC///
function getTripsInArabic(assignArabicData) {
    var idOfTrip, name, date, time, from, to, duration, seatsNo, lastUpdateTimeStamp, authorId, price, driverName, driverPhone, tripStatus, archived;
    var database = firebase.database().ref().child('/trips').orderByChild('archived').equalTo(false);
    database.on('value', function (snapshot) {
        var tripData = [];
        snapshot.forEach(function (sTrip) {
            idOfTrip = sTrip.key;
            name = sTrip.child("name").val();
            date = sTrip.child("date").val();
            time = sTrip.child("time").val();
            from = sTrip.child("from").val();
            to = sTrip.child("to").val();
            duration = sTrip.child("duration").val();
            seatsNo = sTrip.child("seatsNo").val();
            lastUpdateTimeStamp = sTrip.child("lastUpdateTimeStamp").val();
            authorId = sTrip.child("authorId").val();
            price = sTrip.child("price").val();
            driverName = sTrip.child("driverName").val();
            driverPhone = sTrip.child("driverPhone").val();
            tripStatus = sTrip.child("tripStatus").val();
            archived = sTrip.child("archived").val();
            var timePM, timeAM, finalArabicTime;
            //change time PM & AM into arabic//

            var getTime = time.split(" ", 4);
            if(getTime[1] === "AM"){
                timePM = time.slice(0,4);
                var almostPM = " صباحا ";
                finalArabicTime = timePM + " " + almostPM;
            }else if(getTime[1] === "PM"){
                timeAM = time.slice(0,4);
                var almostAM = "مساءا ";
                finalArabicTime = timeAM + " " + almostAM;
            }
            tripData.push({
                idOfTrip: idOfTrip,
                name: name,
                date: date,
                time: finalArabicTime,
                from: from,
                to: to,
                duration: duration,
                seatsNo: seatsNo,
                lastUpdateTimeStamp: lastUpdateTimeStamp,
                authorId: authorId,
                price: price,
                driverName: driverName,
                driverPhone: driverPhone,
                tripStatus: tripStatus,
                archived: archived
            });
        });
        assignArabicData(tripData);
    });
}

//#04f06
///edit trip status///
function editTripStatus(idOfTrip, userTripStatus) {
    // var user = firebase.auth().currentUser;
    // var checkUser = firebase.database().ref().child('users/' + user.uid);
    // checkUser.once('value', function (snapshot) {
    //     var admin = snapshot.child("admin").val();
    //     if (admin !== true) {
    //     }else {
    var updateDate = new Date();
    firebase.database().ref().child('trips/' + idOfTrip + '/' + 'lastUpdateTimeStamp').set(updateDate.toUTCString());
    firebase.database().ref().child('trips/' + idOfTrip + '/' + 'tripStatus').set(userTripStatus);
    // }
    // });
}

//#04f07
/// select many trips by ids to make them closed
function closeTrips(arrOfTrips) {
    for (var i in arrOfTrips){
        var updateDate = new Date();
        firebase.database().ref().child('trips/' + arrOfTrips[i] + '/' + 'lastUpdateTimeStamp').set(updateDate.toUTCString());
        firebase.database().ref().child('trips/' + arrOfTrips[i] + '/' + 'tripStatus').set(false);
    }
}

//#04f08
/// select many trips by ids to make them opened
function openTrips(arrOfTrips) {
    for (var i in arrOfTrips){
        var updateDate = new Date();
        firebase.database().ref().child('trips/' + arrOfTrips[i] + '/' + 'lastUpdateTimeStamp').set(updateDate.toUTCString());
        firebase.database().ref().child('trips/' + arrOfTrips[i] + '/' + 'tripStatus').set(true);
    }
}

//#04f09
/// select many trips by ids to make them archived
function archiveTrips(arrOfTrips) {
    for (var i in arrOfTrips){
        var updateDate = new Date();
        firebase.database().ref().child('trips/' + arrOfTrips[i] + '/' + 'lastUpdateTimeStamp').set(updateDate.toUTCString());
        firebase.database().ref().child('trips/' + arrOfTrips[i] + '/' + 'archived').set(true);
    }
}

//#04f10
/// get all archived Trips
function getArchivedTrips(assignTripsData) {
    var idOfTrip, name, date, time, from, to, duration, seatsNo, lastUpdateTimeStamp, authorId, price, driverName, driverPhone, tripStatus, archivedType;
    var databaseTrips = firebase.database().ref().child('trips/').orderByChild('archived').equalTo(true);
    databaseTrips.on('value', function (snapshot) {
        var tripData = [];
        snapshot.forEach(function (sTrip) {
            idOfTrip = sTrip.key;
            name = sTrip.child("name").val();
            date = sTrip.child("date").val();
            time = sTrip.child("time").val();
            from = sTrip.child("from").val();
            to = sTrip.child("to").val();
            duration = sTrip.child("duration").val();
            seatsNo = sTrip.child("seatsNo").val();
            lastUpdateTimeStamp = sTrip.child("lastUpdateTimeStamp").val();
            authorId = sTrip.child("authorId").val();
            price = sTrip.child("price").val();
            driverName = sTrip.child("driverName").val();
            driverPhone = sTrip.child("driverPhone").val();
            tripStatus = sTrip.child("tripStatus").val();
            archivedType = sTrip.child("archived").val();
            var timePM, timeAM, finalArabicTime;
            //change time PM & AM into arabic//

            var getTime = time.split(" ", 4);
            if(getTime[1] === "AM"){
                timePM = time.slice(0,4);
                var almostPM = " صباحا ";
                finalArabicTime = timePM + " " + almostPM;
            }else if(getTime[1] === "PM"){
                timeAM = time.slice(0,4);
                var almostAM = "مساءا ";
                finalArabicTime = timeAM + " " + almostAM;
            }
            tripData.push({
                idOfTrip: idOfTrip,
                name: name,
                date: date,
                time: finalArabicTime,
                from: from,
                to: to,
                duration: duration,
                seatsNo: seatsNo,
                lastUpdateTimeStamp: lastUpdateTimeStamp,
                authorId: authorId,
                price: price,
                driverName: driverName,
                driverPhone: driverPhone,
                tripStatus: tripStatus,
                archived: archivedType
            });
        });
        ///for sorting by lastUpdateTimeStamp (from new to old)
        tripData.sort(function(a,b){
            var c = new Date(a.lastUpdateTimeStamp);
            var d = new Date(b.lastUpdateTimeStamp);
            return d-c;
        });
        assignTripsData(tripData);
    });
}

function deleteTrip(idOfTrip, assignLogMsg){
    var accCheck;
    var ticketCheck = 0;
    var name;
    var databaseTrips = firebase.database().ref().child('trips/').child(idOfTrip);
            databaseTrips.once("value").then(function(snapshot1) {
                ticketCheck = snapshot1.child('numOfTickets').val();

                 console.log(accCheck);
                var acc = firebase.database().ref().child('accounting/').child(idOfTrip);
                acc.once("value").then(function(snapshot2) {
                    accCheck = snapshot2.hasChildren();
                     name = snapshot2.child('name').val();
                    if (accCheck === false && ticketCheck === 0) {
                        firebase.database().ref().child('trips/' + idOfTrip).remove().then(function () {
                        assignLogMsg("تم مسح الرحلة بنجاح");
                        });
                    } else {
                        assignLogMsg("هذة الرحلة بها حسابات او تذاكر, لن يتم الحذف");

                    }
                });
            });

}
