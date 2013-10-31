$(document).ready(function () {
    function upload(filePath) {
        $.ajax({
            type: "GET",
            url: "movies.xml",
            dataType: "xml",
            success: parseXml
        });
    }

    function parseXml(xml) {
        $(xml).find("movie").each(function () {
            var nodeName,
                startTime,
                endTime,
                movieName;

            //$("#output").append($(this).attr("id") + "<br />");
            //$("#output").append($(this).find("start_time").text() + "<br />");
            //$("#output").append($(this).find("end_time").text() + "<br />");

            nodeName = $(this).find("name")[0].parentNode.nodeName;
            movieName = $(this).find("name").text();
            startTime = $(this).find("start_time").text();
            endTime = $(this).find("end_time").text();

            insertMovie(nodeName, movieName, startTime, endTime);           
        });
    }

    function insertMovie(nodeName, movieName, startTime, endTime) {
        var _startTime,
            _endTime,
            duration,
            width,
            positionLeft,
            lastFour = 900,
            id;

        _startTime = parseFloat(startTime) * 100;
        _endTime = parseFloat(endTime) * 100;
        duration = _endTime - _startTime;
        width = duration * 0.98;

        //TO DO: take care of AM-PM
        //Smaller Functions
        //On TD Click
        //Overflow-x

        if ($("#" + nodeName).text() == "No programmes available") {
            $("#" + nodeName).text("");
        }

        $("#" + nodeName).find('td').each(function () {
            id = $(this).attr('id');
            lastFour = id.substr(id.length - 4);
        });

        positionLeft = (_startTime - lastFour) * 0.98;

        $("#" + nodeName).append("<td id='" + nodeName + _endTime + "' class='movie'>"+movieName+'</td>');

        $("#" + nodeName + _endTime).width(width);

        $("#" + nodeName + _endTime).css('left', positionLeft);
        $("#" + nodeName + _endTime).css('border-spacing', positionLeft);

        if (positionLeft < 1) {
            $("#" + nodeName + _endTime).css('border-left', 'none');
        }
    }

    $("#upload").click(function () {
        var filePath = $("#filePath").val();
        //$("#output").append($("#filePath").val());
        upload(filePath);
    });
});

