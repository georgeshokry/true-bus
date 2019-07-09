/**
 * Created by lenovo on 28-Sep-17.
 */
//#02
/////auth services goes here/////

//#02f01
///check user if admin or not///
function checkUserType(assignUserType) {
    getSignedUser(function (user) {
        var loggedUser = user.uid;
        var database1 = firebase.database().ref().child('users/' + loggedUser);
        database1.on('value', function (snapshot) {
            var userType = snapshot.child("admin").val();
                assignUserType(userType);
        });
    });
}

//#02f02
///get the signed in user now///
function getSignedUser(assign) {
  
    firebase.auth().onAuthStateChanged(function (user) {
        var cok = document.cookie;
        if (user) {
            assign(user);
            if(cok === user.uid) {
                var database1 = firebase.database().ref().child('users/' + user.uid);
                database1.on('value', function (snapshot) {
                    var work = snapshot.child("status").val();
                    if (work !== 'hired') {
                        var logMsg = "";
                        signOutUser();
                        location.reload();
                    }
                });
            }

        } else {
            assign(user);
        }
    });
}

//#02f03
/// sign in function///
function signInUser(email, password, assignUserStat) {
    var logMsg;
if(email !== "" && password !== "") {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        // var checked;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                document.cookie = user.uid;
                getSignedUser();
            }
        });


    }).catch(function (error) {
        // Handle Errors here.

        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
            logMsg = 'خطأ فى كلمة السر, حاول مرة اخرى';
            assignUserStat(errorCode);
        } else if (errorCode === 'auth/user-not-found') {
            logMsg = 'خطأ فى الايميل, حاول مرة اخرى';
            assignUserStat(errorCode);
        }

    });
}

}

//#02f04
///sign out function///
function signOutUser() {
    var logMsg;
    firebase.auth().signOut().then(function () {
        logMsg = 'تم الخروج بنجاح';
        document.cookie = "";
    }).catch( function (error) {
        logMsg = 'خطأ فى الخروج';
    });
}
