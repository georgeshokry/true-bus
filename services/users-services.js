/**
 * Created by lenovo on 01-Oct-17.
 */

//#03

///////////////////////////////////
/////manage users section/////
/////////////////////////////////

//#03f01
///sign up function///
function createUser(checkEmail, checkPassword, userEmail, userPassword, userName, adminCheck, assignLogMsg) {
    var logMsg;
    if(adminCheck !== false && adminCheck !== true){
        logMsg = "خطأ فى البيانات";
        assignLogMsg(logMsg);

    } else {
        if(checkEmail === "" || checkPassword === "" || userEmail === "" || userPassword === "" || userName === "") {
            logMsg = "خطأ فى البيانات";
            assignLogMsg(logMsg);
        } else {
            var arrUserData = {};
            firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function (user) {
                var userId = user.uid;
                var userNew = user;
                var hireDate = new Date();
                arrUserData = {
                    name: userName,
                    email: userEmail,
                    status: "hired",
                    hireDate: hireDate.toLocaleDateString(),
                    admin: adminCheck
                };

                ///get sign in user again///

                signOutUser();
                /// get user signed in again///
                firebase.auth().signInWithEmailAndPassword(checkEmail, checkPassword).then(function () {
                    ////add user data in firebase//
                    firebase.database().ref().child('users/').child(userId).set(arrUserData);
                    logMsg = "تم انشاء مستخدم بنجاح";
                    assignLogMsg(logMsg);
                }).catch(function (error) {
                    //// handle errors here//
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        logMsg = "خطأ فى كلمة سر المدير, حاول مرة اخرى ";

                        //delete the user created already in firebase auth when admin password wrong
                        userNew.delete().then(function() {
                            console.log("new user deleted");
                        }).catch(function(error) {
                            console.log("error in deleting new user");
                        });
                        assignLogMsg(logMsg);

                    }else if (errorCode === 'auth/user-not-found') {
                        logMsg = 'خطأ فى ايميل المدير, حاول مرة اخرى';
                        //delete the user created already in firebase auth when admin password wrong
                        userNew.delete().then(function() {
                            console.log("new user deleted");
                        }).catch(function(error) {
                            console.log("error in deleting new user");
                        });
                        assignLogMsg(logMsg);
                    }
                });
            }).catch(function(error){
                if(error){
                    logMsg = "خطأ فى انشاء مستخدم جديد";
                    assignLogMsg(logMsg);
                }
            });
        }
    }
}

//#03f02
//get all users in the system//
function getUsers(assignUsersData) {
    var idOfUser, name, email, hireDate, status, admin;
    var logMsg;
    var database = firebase.database().ref().child('users/');
    database.on('value', function (snapshot) {
        var userData = [];
        snapshot.forEach(function (sUser) {
            idOfUser = sUser.key;
            name = sUser.child("name").val();
            email = sUser.child("email").val();
            hireDate = sUser.child("hireDate").val();
            status = sUser.child("status").val();
            admin = sUser.child("admin").val();

            userData.push({
                idOfUser: idOfUser,
                name: name,
                email: email,
                hireDate: hireDate,
                status: status,
                admin: admin
            });
        });
        assignUsersData(userData);
    }, function (error) {
        logMsg = "غير مسرح لك بمشاهدة هذة البيانات";
        assignUsersData(logMsg);
    });
}

//#03f03
//edit user by id//
function editUser(idOfUser, status, hireDate, email, name, type, assignLogMsg) {
    var logMsg;
    if (typeof type !== 'boolean' || hireDate === '' || name === '' || status === '' || email === '') {
        logMsg = "خطأ, يجب كتابة جميع البيانات";
        assignLogMsg(logMsg);
    } else {
        var database = firebase.database().ref().child('users/' + idOfUser);
        database.set({
            name: name,
            email: email,
            admin: type,
            status: status,
            hireDate: hireDate
        });
        logMsg = "تم التعديل بنجاح";
        assignLogMsg(logMsg);
    }
}

/////////////////////////////////////////////
//////////***the new additions///////// 26/10/2017/////////////////
////////////////////////////////////////////

//#03f04
function getIdOfTickets(idOfUser, assignArrOfIds) {
    var arryOfTickets = [];
    var database = firebase.database().ref().child('tickets/').orderByChild('authorId').equalTo(idOfUser);
    database.on('value', function (snapshot) {
        snapshot.forEach(function (idOfTrip) {
            arryOfTickets.push(idOfTrip.child('tripId').val());
        });
        assignArrOfIds(arryOfTickets);
    });
}


//#03f05
///get the total of trips //egmaly el eradat
function getTotalTrip(idOfUser, assignGetTotal) {
    var getTotal = 0;
    var getarryOfTickets;
    var priceOfTrip;
    getIdOfTickets(idOfUser, function (assignArrOfIds) {
        getarryOfTickets = assignArrOfIds;
        for(var i in getarryOfTickets) {
                var database2 = firebase.database().ref().child('trips/' + getarryOfTickets[i]);
                database2.on("value", function (snapshot2) {
                    priceOfTrip = snapshot2.child("price").val();
                    getTotal += priceOfTrip;

                });
        }
        assignGetTotal(getTotal);
    });
}

//#03f06
///get the paid attribute for the selected user by User id///tam ta7seel
function getPaid(idOfUser, assignPaid){
    var paid;
    var database = firebase.database().ref().child('users/' + idOfUser);
    database.on("value", function (snapshot) {
        paid = snapshot.child("paid").val();
        assignPaid(paid);
    });
}

//#03f07
///get the remaining of paid//egmaly el eradat - tam el ta7seel = elmotabaky (getRemain)
function getRemain(totalTrip, paid) {
    var remaining;
    remaining = totalTrip - paid;
    return remaining;
}

//#03f08
///call the two previous functions to get the remaining to view to user only//
function getRemainTrip(idOfUser, assignAllData) {
    var getFinalTotal;
    getTotalTrip(idOfUser, function (assignGetTotal) {
        getPaid(idOfUser, function (assignPaid) {
            getFinalTotal = getRemain(assignGetTotal, assignPaid);
            assignAllData({total :assignGetTotal, paid: assignPaid, remaining: getFinalTotal});
        });
    });
}

//#03f09
////add the paid attribute for the selected trip by id///
function addPaid(idOfUser, paid, assignLogMsg) {
    var logMsg;
    if(typeof paid !== 'number'){
        logMsg = "خطأ, يجب ان تكون جميع البيانات ارقام فقط";
        assignLogMsg(logMsg);
    } else {
        firebase.database().ref().child('users/' + idOfUser + '/' + 'paid').set(paid)
            .then(function () {
                assignLogMsg("تم التعديل بنجاح");
            }).catch(function (error) {
            if (error) {
                assignLogMsg("خطأ,لم يتم التعديل");
            }
        });
    }
}

//#03f10
////to build the table for the tickets information///
function getUserTickets(idOfUser, assignTableData) {

    var createdTimeStamp, seatNo, idOfTrip, price, name;
            var database = firebase.database().ref().child('tickets/').orderByChild('authorId').equalTo(idOfUser);
            database.on("value", function (snapshotFirst) {
                var ticketData = [];
                snapshotFirst.forEach(function (sTicket) {
                    createdTimeStamp = sTicket.child("createdTimeStamp").val();
                    seatNo = sTicket.child("seatNo").val();
                    idOfTrip = sTicket.child("tripId").val();

                    var databaseTrip = firebase.database().ref().child('trips/' + idOfTrip);
                    databaseTrip.once('value', function (snapshot) {
                        price = snapshot.child("price").val();
                        name = snapshot.child("name").val();
                        ticketData.push({
                            name: name,
                            price: price,
                            seatNo: seatNo,
                            createdTimeStamp: createdTimeStamp
                        });
                    });
                });
                assignTableData(ticketData);
            });
}

///////end///////////

/////////////////////////////////////////////
//////////***the new additions***XXXXXXXXXXX******CANCELED******XXXXXXXXXXXX/////////////////
////////////////////////////////////////////
//
//
// ///get the total of trip by trip id//egmaly el re7la
// function getTotalTrip(idOfTrip, assignTotalTrip) {
//     var priceOfTrip, numberOfTickets, totalTrip;
//     var database = firebase.database().ref().child('trips/' + idOfTrip);
//     database.once("value").then(function (snapshot) {
//         priceOfTrip = snapshot.child("price").val();
//         var database = firebase.database().ref().child('tickets/').orderByChild('tripId').equalTo(idOfTrip);
//         database.once('value').then(function (snapshot) {
//             numberOfTickets = snapshot.numChildren();
//             totalTrip = numberOfTickets * priceOfTrip;
//             assignTotalTrip(totalTrip);
//         });
//     });
// }
//
// ///get the paid attribute for the selected trip by id///tam ta7seel
// function getPaid(idOfTrip, assignTripPaid){
//     var paid;
//     var database = firebase.database().ref().child('accounting/' + idOfTrip);
//     database.once("value").then(function (snapshot) {
//         paid = snapshot.child("paid").val();
//         assignTripPaid(paid);
//     });
// }
//
//
// ///get the remaining of paid//egmaly el re7la - tam el ta7seel = elmotabaky (getRemain)
// function getRemain(totalTrip, paid) {
//     var remaining;
//     remaining = totalTrip - paid;
//     return remaining;
// }
//
// ///call the two previous functions to get the remaining to view to user only//
// function getRemainTrip(idOfTrip, assignAllData) {
//     var getFinalTotal;
//     getTotalTrip(idOfTrip, function (assignTotalTrip) {
//         getPaid(idOfTrip, function (assignTripPaid) {
//             getFinalTotal = getRemain(assignTotalTrip, assignTripPaid);
//             assignAllData({total :assignTotalTrip, paid: assignTripPaid, remaining: getFinalTotal});
//         });
//     });
// }
//
//
//
// ////add the paid attribute for the selected trip by id///
// function addPaid(idOfTrip, paid, assignLogMsg) {
//     var logMsg;
//     if(typeof paid !== 'number'){
//         logMsg = "خطأ, يجب ان تكون جميع البيانات ارقام فقط";
//         assignLogMsg(logMsg);
//     } else {
//         firebase.database().ref().child('accounting/' + idOfTrip + '/' + 'paid').set(paid)
//             .then(function () {
//                 assignLogMsg("");
//             }).catch(function (error) {
//             if (error) {
//                 assignLogMsg("");
//             }
//         });
//     }
// }
//
//
// //////////////////////////////////////////////
// ///THIS ONLY FOR MAIN ELEMENT OF ACCOUNTING///
// /////////////////////////////////////////////
//
// ///get the total of trips in whole database//egamaly el re7alat
// function getAllTotalTrips() {
//     var getTotal = 0;
//     var priceOfTrip, numberOfTickets, totalTrip, idOfTrip;
//     var database = firebase.database().ref().child('trips/');
//     database.on("value", function (snapshot) {
//         snapshot.forEach(function (sThisTrip) {
//             idOfTrip = sThisTrip.key;
//             priceOfTrip = sThisTrip.child("price").val();
//             var database2 = firebase.database().ref().child('tickets/').orderByChild('tripId').equalTo(idOfTrip);
//             database2.once('value', function (snapshot2) {
//                 numberOfTickets = snapshot2.numChildren();
//                 console.log(numberOfTickets);
//                 console.log(idOfTrip);
//                 totalTrip = numberOfTickets * priceOfTrip;
//                 getTotal += totalTrip;
//                 console.log(getTotal);
//             });
//         });
//     });
// }
//
// ///get the paid attribute for the selected trip by id///tam ta7seel
// function getAllPaid(assignTripPaid){
//     var paid;
//     var database = firebase.database().ref().child('accounting/' + idOfTrip);
//     database.once("value").then(function (snapshot) {
//         paid = snapshot.child("paid").val();
//         assignTripPaid(paid);
//     });
// }
//
// ///get the remaining of paid////el motabaky
// function getRemainTripMain(idOfTrip, assignAllData) {
//     var getFinalTotal;
//     getTotalTrip(idOfTrip, function (assignTotalTrip) {
//         getPaid(idOfTrip, function (assignTripPaid) {
//             getFinalTotal = getRemain(assignTotalTrip, assignTripPaid);
//             assignAllData({totalMain :assignTotalTrip, paidMain: assignTripPaid, remainingMain: getFinalTotal});
//         });
//     });
// }

// ///THIS ONLY FOR MAIN ELEMENT OF ACCOUNTING///
// ///call the two previous functions to get the remaining to view to user only//
// function getRemainTripForMain() {
//     getAllTotalTrips(function (assignAllTotalTrips) {
//
//     });
//     getFinalTotal = getRemain(paid, assignTotalTrip);
//     console.log(getFinalTotal);
// }
//////////////////////////////////////////////
////////////////////END//////////////////////
/////////////////////////////////////////////
