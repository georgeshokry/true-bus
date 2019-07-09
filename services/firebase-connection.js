/**
 * Created by mac_pro on 9/26/17.
 */

//#01

//here  will be the intialization code of the connection to firebase
///src="https://www.gstatic.com/firebasejs/4.4.0/firebase.js"; <<put it in html


    //#0101
// Initialize Firebase
var config = {
    apiKey: "AIzaSyC_jfkrI1qGYJe0mcgJB9Uaw0OY0nha2z4",
    authDomain: "truebus-84d41.firebaseapp.com",
    databaseURL: "https://truebus-84d41.firebaseio.com",
    projectId: "truebus-84d41",
    storageBucket: "truebus-84d41.appspot.com",
    messagingSenderId: "211198716262"
};
firebase.initializeApp(config);


////check connection between user and firebase ////
// function checkConn(assignLogMsg) {
//     var connectedRef = firebase.database().ref(".info/connected");
//     connectedRef.on("value", function (snap) {
//         var logMsg;
//         if (snap.val() === false) {
//             logMsg = false;
//             assignLogMsg(logMsg);
//         } else {
//             logMsg = true;
//             assignLogMsg(logMsg);
//         }
//     });
// }



function showToast(msg,toast) {
    toast.text = msg;
    toast.open();
}

//#01f02
function showLoading() {

    var loading = document.getElementById("divLoading");
    loading.style.display = "block";
}
function hideLoading() {

    var loading = document.getElementById("divLoading");
    loading.style.display = "none";
}

// if (navigator.onLine) {
//     alert("فقد الاتصال بالانترنت");
// }else {
//     alert("استرجع الاتصال بالانترنت");
// }

