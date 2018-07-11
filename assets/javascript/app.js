//javascript to add bootstrap-date time picker
$(document).ready(function () {


    $('#datetimepicker1').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,

    }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        $('#datetimepicker2').datepicker('setStartDate', minDate);

    });




    //CALENDAR CHECK-OUT DATE

    $('#datetimepicker2').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
    }).on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('#datetimepicker1').datepicker('setEndDate', maxDate);
    });



});