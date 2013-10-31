$(document).ready(function () {
    $("#upload").click(function () {
        upload();       
        $("#upload").attr('disabled', 'disabled');
    });

    function upload() {
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

            nodeName = $(this).find("name")[0].parentNode.nodeName;
            movieName = $(this).find("name").text();
            startTime = $(this).find("start_time").text();
            endTime = $(this).find("end_time").text();

            insertMovie(nodeName, movieName, startTime, endTime);           
        });
    }

    function configureCSS(newId, positionLeft, width) {
        if (positionLeft < 1) {
            $("#" + newId).css('border-left', 'none');
        }

        $("#" + newId).width(width);
        $("#" + newId).css('left', positionLeft);
    }

    function removeDefaultText(nodeName) {
        if ($("#" + nodeName).text() == "No programmes available") {
            $("#" + nodeName).text("");
        }
    }

    function mapTime(time,amPmInclusive) {
        var amPm,
            actualTime;

        if (amPmInclusive) {
            amPm = time.substr(time.length - 2);
            actualTime = parseInt(time.substr(0, time.length - 2) * 100);

            if (amPm == "pm" && actualTime < 1200)
                actualTime += 1200;
        }
        else {
            actualTime = parseInt(time);
        }
        return actualTime;
    }

    function insertMovie(nodeName, movieName, startTime, endTime) {
        var _startTime,
            _endTime,
            duration,
            width,
            positionLeft,
            splitArr,
            preEndTime = 900,
            id,
            newId;

        _startTime = mapTime(startTime,true);
        _endTime = mapTime(endTime,true);
        duration = _endTime - _startTime;
        width = duration * 0.99;

        //remove 'No Programmes Available'
        removeDefaultText(nodeName);

        //Get previous movies end time
        $("#" + nodeName).find('td').each(function () {
            id = $(this).attr('id');
            splitArr = id.split("-");
            preEndTime = mapTime(splitArr[1],false);
        });

        //Calculate new movies starttime position
        positionLeft = (_startTime - preEndTime) * 0.99;

        //Insert the movie
        newId = nodeName + "-" + _endTime;
        $("#" + nodeName).append("<td id='" + newId + "' class='movie'>" + movieName + '</td>');

        //Amend inserted movie's css
        configureCSS(newId, positionLeft, width);

        //Create Remote Records popup
        $('#' + nodeName).on('click', '#'+newId, function () {
            $("#dialog-message").dialog({
                width: 450,
                height: 300,
                modal: true,
                buttons: {
                    Close: function () {
                        $("#dialog-message").text("");
                        $(this).dialog("destroy");
                        $("#remoteRecords > tbody:last").append("<tr class='c"+newId+"'><td>" + $("#" + newId).text() + "</td><td><button id='x"+newId+"'>X</button></td></tr>");
                    }
                }
            });
            $(".ui-dialog-titlebar-close").hide();
            $(".ui-dialog-titlebar").append("<img src='image/sky.png' id='skyImg' />");
            $(".ui-dialog-titlebar").append("Remote Record");
            $("#dialog-message").append("The James Bond movie " + $("#" + newId).text() + " is set to be recorded");
            $("#remoteRecords").on('click', '#x' + newId, function () {
                $('.c'+newId).remove();
            });
        });
    }
});

