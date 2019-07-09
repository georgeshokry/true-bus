/**
 * Created by lenovo on 02-Oct-17.
 */
//#06

//#06f01
//calculate revenue, costs, and interest //
function calAccData(idOfTrip, driver, reservation, gas, bus, objectOfData, assignCalData) {
    var logMsg;
    if(typeof driver !== 'number' || typeof reservation !== 'number' || typeof gas !== 'number' || typeof bus !== 'number'){
        logMsg = "خطأ, يجب ان تكون جميع البيانات ارقام فقط";
        assignCalData(logMsg);

    }else {
        var numberOfTickets, priceOfTrip, totalCosts, totalInterest, totalRevenue;

        var database = firebase.database().ref().child('trips/' + idOfTrip);
        database.once("value").then(function (snapshot) {
            priceOfTrip = snapshot.child("price").val();
            var database = firebase.database().ref().child('tickets/').orderByChild('tripId').equalTo(idOfTrip);
            database.once('value').then(function (snapshot) {
                var totalCal = [];
                numberOfTickets = snapshot.numChildren();
                totalRevenue = numberOfTickets * priceOfTrip;
                totalCosts = driver + reservation + gas + bus;
                if (objectOfData !== null) {
                    for (var i in objectOfData) {
                        if(typeof objectOfData[i] !== 'number'){
                            logMsg = "خطأ, يجب ان تكون جميع البيانات ارقام فقط";
                            assignCalData(logMsg);
                        }else {
                            totalCosts = totalCosts + objectOfData[i];

                        }
                    }
                }
                totalInterest = totalRevenue - totalCosts;
                totalCal.push({
                    totalRevenue: totalRevenue,
                    totalCosts: totalCosts,
                    totalInterest: totalInterest
                });
                assignCalData(totalCal);
            });
        });
    }
}

//#06f02
//add the accounting data into database
function addAccData(idOfTrip, objectOfData, assignLogMsg) {
    var logMsg;
    var database = firebase.database().ref().child('accounting/').child(idOfTrip);
    database.set(objectOfData).then(function () {
        objectOfData = {};

    }).catch(function (error) {
        logMsg = "خطأ فى اضافة البيانات, حاول مرة اخرى";
        assignLogMsg(logMsg);
        objectOfData = {};
    });
}

//#06f03
//get all accounting data of trip by ID//
function getAccData(idOfTrip, assignData) {
    var logMsg;
    var database = firebase.database().ref().child('accounting/').child(idOfTrip);
    database.once("value").then(function (snapshot) {
        var arrayOfData = [];
        arrayOfData.push(snapshot.val());
        assignData(arrayOfData);
    }).catch(function (error) {
        if(error) {
            logMsg = "غير مصرح لك بمشاهدة هذة البيانات" ;
            assignData(logMsg);
        }
    });


}

////archiving trip accounting FOR CLOSED trips ONLY
// function archivingAccData(arrOfTrips, assignLogMsg) {
//     var logMsg= "";
//     var openedTrips = '';
//     var checkStat = "";
//     var checkName = "";
//     for (var i in arrOfTrips) {
//         var database = firebase.database().ref().child('trips/').child(arrOfTrips[i]);
//         database.on("value", function (snapshot) {
//              checkStat = snapshot.child("tripStatus").val();
//             checkName = snapshot.child("name").val();
//
//             if(checkStat === true){
//                 openedTrips += checkName + ", ";
//             }
//             if(checkStat === false){
//                     firebase.database().ref().child('accounting/' + arrOfTrips[j] + '/' + 'archived').set(true);
//
//             }else {
//                 logMsg = ("خطأ,هذة الرحلات ليست مغلقة للارشفة:" + openedTrips);
//                 assignLogMsg(logMsg);
//             }
//         });
//     }
// }

//#06f04
////archiving trip accounting FOR CLOSED trips ONLY
function archivingAccData(arrOfTrips) {

    var checkStat = "";
    var checkName = "";
    for (var i in arrOfTrips) {
        var database = firebase.database().ref().child('trips/').child(i);
        database.on("value", function (snapshot) {
            checkStat = snapshot.child("tripStatus").val();
            checkName = snapshot.child("name").val();


                firebase.database().ref().child('trips/' + i + '/' + 'archivedAcc').set(true);

        });
    }
}

//#06f05
/// get all archived ACCOUNTING Trips FOR ACCOUNTING ELEMENT
function getArchivedAccTrips(assignTripsData) {
    var idOfTrip, name, date;
    var databaseTrips = firebase.database().ref().child('trips/').orderByChild('archivedAcc').equalTo(true);
    databaseTrips.on('value', function (snapshot) {
        var tripData = [];
        snapshot.forEach(function (sTrip) {
            idOfTrip = sTrip.key;
            name = sTrip.child("name").val();
            date = sTrip.child("date").val();

            tripData.push({
                idOfTrip: idOfTrip,
                name: name,
                date: date
            });
        });
        assignTripsData(tripData);
    });
}

//#06f06
/// get all archived ACCOUNTING Trips FOR ACCOUNTING ELEMENT BY Date
function getArchivedAccByDate(from, to, assignTripsData) {

    var start = new Date(from);
    var end = new Date(to);

    var databaseTrips = firebase.database().ref().child('trips/').orderByChild('archivedAcc').equalTo(true);
    databaseTrips.once('value', function (snapshot) {
        var tripData = {};
        snapshot.forEach(function (sTrip) {


                var idOfTrip = sTrip.key;
                var name = sTrip.child("name").val();
                var date = sTrip.child("date").val();
                tripData[idOfTrip] = {
                    idOfTrip: idOfTrip,
                    name: name,
                    date: date
                };

        });

        var finalTrips = {};
        for(var i in tripData) {

            var dateNowToMili = new Date(tripData[i].date);


                if (dateNowToMili * 60 * 1000 >= start  * 60 * 1000 && dateNowToMili * 60 * 1000 <= end * 60 * 1000){
                    finalTrips[tripData[i].idOfTrip] = {};
                }
        }

        calArchivedAccData(finalTrips, function (assignOut) {
            assignTripsData(assignOut);
        });
    });

}



///view archiving trips in accounting element (FIRST FUN)
// function getArcivedAcc(assignAccData) {
//
//     var idOfTrip;
//
//     var tripData = [];
//     var tripId = [];
//     var fisrtQ = firebase.database().ref().child('trips/').orderByChild('archivedAcc').equalTo(true);
//         fisrtQ.once('value', function (snapshot1) {
//
//             snapshot1.forEach(function (sTrip) {
//                 idOfTrip = sTrip.key;
//                 tripId.push(idOfTrip);
//             });
//             var dataAcc;
//             var name;
//             var date;
//             var id2;
//             for (var j in tripId) {
//
//
//                 var secQ = firebase.database().ref().child('trips/').child(tripId[j]);
//                 secQ.once('value', function (snapshot3) {
//                     name = snapshot3.child("name").val();
//                     date = snapshot3.child("date").val();
//                     id2 = snapshot3.key;
//
//                     tripData[id2] = {
//                         id: id2,
//                         name: name,
//                         date: date,
//                         AccData: ""
//                     };
//                     console.log(tripData);
//                 });
//
//
//             }
//
//
//
//             for (var h in tripData){
//                 console.log(h);
//                 var databaseAcc = firebase.database().ref().child("accounting/" + h);
//                 databaseAcc.once('value', function (snapshot2) {
//                     var keyNow = snapshot2.key;
//                     tripData[keyNow].AccData= snapshot2.val();
//                 });
//
//
//             }
//
//                 assignAccData(tripData);
//
// });
//
//
//
// }


// function getArcivedAcc(arrOfTrips, assignAccData){
// var allAccData = [];
//             for (var h in arrOfTrips){
//                 console.log(arrOfTrips[h]);
//                 var databaseAcc = firebase.database().ref().child("accounting/" + arrOfTrips[h]);
//                 databaseAcc.once('value', function (snapshot2) {
//                     var keyNow = snapshot2.key;
//                     allAccData[keyNow]=snapshot2.val();
//                 });
//
//
//             }
//             assignAccData(allAccData);
// }

//#06f07
//calculate revenue, costs, and interest FOR Archived Trips only
function calArchivedAccData(arrOfTrips, assignOut) {
    var logMsg;
    var totalCal = {};
    var lenghtNow=0;
for(var h in arrOfTrips) {
    lenghtNow++;
    var totalRevenue = 0;
    var numberOfTickets = 0, priceOfTrip = 0;
    var name, date;
    var database = firebase.database().ref().child('trips/' + h);
    database.once('value', function (snapshot1) {
        var keyNow = snapshot1.key;
        priceOfTrip = snapshot1.child("price").val();
        console.log("-------------");
        console.log("price of trip: " + priceOfTrip);
            numberOfTickets = snapshot1.child("numOfTickets").val();
            name = snapshot1.child("name").val();
            date = snapshot1.child("date").val();
            console.log("-------------");
            console.log("number of tickets: " + numberOfTickets);
            totalRevenue = numberOfTickets * priceOfTrip;
            console.log("-------------");
            console.log("total revenue: " + totalRevenue);
            totalCal[keyNow] = {
                name: name,
                date: date,
                totalRevenue: totalRevenue,
                totalCosts: "",
                totalInterest: ""
            };
    });
}
console.log(lenghtNow);
    for(var k in totalCal){

        var database2 = firebase.database().ref().child('accounting/' + k);
        database2.once('value',function(snapshot3){
            var keyNow = snapshot3.key;
            var  totalCosts = 0, totalInterest = 0;
            lenghtNow--;
            snapshot3.forEach(function (sTrip) {
                totalCosts = totalCosts + sTrip.val();
            });
            console.log("total costs: " , totalCosts );
            totalInterest = totalInterest + (totalCal[keyNow].totalRevenue - totalCosts);
            console.log("total interest: " + totalInterest);

            totalCal[keyNow].totalCosts = totalCosts;
            totalCal[keyNow].totalInterest = totalInterest;

            if(lenghtNow === 0){
                getTotalForAll(totalCal, function (assignFinal) {
                    totalCal["final"]= assignFinal;
                    console.log(totalCal);
                    assignOut(totalCal);
                });
            }
        });

    }
}

//#06f08
///cal all total for costs, Interest & revenue
function getTotalForAll(totalForNow, assignFinal) {
    var finalTotalInterest = 0, finalTotalCosts = 0, finalTotalRevenue = 0;
    for(var y in totalForNow){
       finalTotalInterest = finalTotalInterest + totalForNow[y].totalInterest;
        finalTotalCosts = finalTotalCosts + totalForNow[y].totalCosts;
        finalTotalRevenue = finalTotalRevenue + totalForNow[y].totalRevenue;
    }
    var final ={
        finalTotalInterest: finalTotalInterest,
        finalTotalCosts: finalTotalCosts,
        finalTotalRevenue: finalTotalRevenue
    };
    assignFinal(final);
}
//////////////////////////////////////functions for external accounting////////////////////////////////
///add external accounts
function addExternalAcc(name, objectOfData) {
    firebase.database().ref().child('externalAccounting/').push({name: name, data: objectOfData});

}

///get external accounts FOR CARDS VIEW
function getExternalAcc(assignAcc) {
    var database = firebase.database().ref().child('externalAccounting/');
    database.once('value', function (snapshot1) {
        var externalAcc = [];
        snapshot1.forEach(function (sAcc) {
            var idOfAcc = sAcc.key;
            var name = sAcc.child("name").val();
            externalAcc.push({
                idOfAcc: idOfAcc,
                name: name
            });
        });
        assignAcc(externalAcc);
    });
}


///get all data for selected acc by id
function getExternalAccData(idOfAcc, assignAccData) {

    var database = firebase.database().ref().child('externalAccounting/' + idOfAcc);
    database.once('value', function (snapshot1) {

        assignAccData(snapshot1.child("data").val());
    });
}

///edit acc by id of it
function editExternalAcc(idOfAcc, objectOfData) {
    firebase.database().ref().child('externalAccounting/'+idOfAcc).child("data").set(objectOfData);
}