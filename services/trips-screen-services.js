/**
 * Created by lenovo on 10-Oct-17.
 */
//#07

//////////////////////////////////////////////////////////////////
///////THIS service is ONLY for display trips in main page///////
////////////////////////////////////////////////////////////////

//#07f01
////get trips for REAL TIME SCREEN////
function getTripsScreen(assignScreenData) {
    var name, date, time, from, to, duration, price, tripStatus;

    var database = firebase.database().ref().child('/trips').orderByChild('archived').equalTo(false);
    database.on('value', function (snapshot) {
        var tripData = [];
        snapshot.forEach(function (sTrip) {
            name = sTrip.child("name").val();
            date = sTrip.child("date").val();
            time = sTrip.child("time").val();
            from = sTrip.child("from").val();
            to = sTrip.child("to").val();
            duration = sTrip.child("duration").val();
            price = sTrip.child("price").val();
            tripStatus = sTrip.child("tripStatus").val();

            var timePM, timeAM, finalArabicTime;
            //change time PM & AM into arabic//

            var getTime = time.split(" ", 4);
            if(getTime[1] === "AM"){
                timePM = time.slice(0,4);
                var almostPM = "صباحا ";
                finalArabicTime =timePM + almostPM;
            }else if(getTime[1] === "PM"){
                timeAM = time.slice(0,4);
                var almostAM = "مساءا ";
                finalArabicTime =timeAM + almostAM;
            }
            var statArabic;
            if(tripStatus === true){
                statArabic = "متاح للحجز";
            }else if(tripStatus === false){
                statArabic = "مغلق";
            }


            tripData.push({
                name: name,
                date: date,
                time: finalArabicTime,
                from: from,
                to: to,
                duration: duration,
                price: price,
                tripStatus: statArabic
            });
        });

        assignScreenData(tripData);
    });
}

