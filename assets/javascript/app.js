$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyA6IGjaw3eohoWxjoLOzJqJuOyS_xMjDnQ",
        authDomain: "train-scheduler-a5f17.firebaseapp.com",
        databaseURL: "https://train-scheduler-a5f17.firebaseio.com",
        projectId: "train-scheduler-a5f17",
        storageBucket: "train-scheduler-a5f17.appspot.com",
        messagingSenderId: "674944382995",
        appId: "1:674944382995:web:7a6457275871c198f0e7e6"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);



    var database = firebase.database();


    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function () {
        event.preventDefault();

        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();


        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function (childSnapshot) {
        var nextArr;
        var minAway;

        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;

        var minAway = childSnapshot.val().frequency - remainder;

        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});