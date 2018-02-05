.pragma library

function getCalendar() {
    return {
        "id": "debug",
        "backgroundColor": "#9a9cff",
        "accessRole": "owner",
    }
}

function getEventData() {
    var debugEventData = {
        "items": []
    };
    function addEvent(summary, start, end) {
        debugEventData.items.push({
            "kind": "calendar#event",
            "etag": "\"2561779720126000\"",
            "id": "debug_" + start.dateTime.getTime() + "_" + end.dateTime.getTime(),
            "status": "confirmed",
            "htmlLink": "https://www.google.com/calendar/event?eid=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&ctz=Etc/UTC",
            "created": "2008-03-24T22:34:26.000Z",
            "updated": "2010-08-04T02:44:20.063Z",
            "summary": summary,
            "start": start,
            "end": end,
            // "recurringEventId": "a1a1a1a1a1a1a1a1a1a1a1a1a1",
            "originalStartTime": {
                "date": "2016-03-25"
            },
            "transparency": "transparent",
            "iCalUID": "a1a1a1a1a1a1a1a1a1a1a1a1a1@google.com",
            "sequence": 0,
            "reminders": {
                "useDefault": false
            },
        });
    }

    function dateString(d) {
        return d.toISOString().substr(0, 10)
    }
    function nowPlus(n) {
        var now = new Date()
        var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + n, 0, 0, 0)
        return d
    }

    function addAllDayTestEvent(summary, startDaysFromNow, endDaysFromNow) {
        var start = nowPlus(startDaysFromNow)
        var end = nowPlus(endDaysFromNow)
        addEvent(summary, {
            date: dateString(start),
            dateTime: start,
        }, {
            date: dateString(end),
            dateTime: end,
        })
    }
    function addMinuteTestEvent(summary, startMinutesFromNow) {
        var start = new Date()
        start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), 0);
        start.setMinutes(start.getMinutes() + startMinutesFromNow)
        var end = new Date(start)
        end.setMinutes(end.getMinutes() + 1)
        addEvent(summary, {dateTime: start }, {dateTime: end });
    }

    addAllDayTestEvent("Dude's Birthday", 0, 1);
    addAllDayTestEvent("Dudette's Birthday", 1, 2);
    addAllDayTestEvent("Multiday Event", 3, 7);
    for (var i = 0; i < 5; i++) {
        addMinuteTestEvent("Minute Event " + i, i);
    }

    // This test is known to crash plasmashell.
    // See https://github.com/Zren/plasma-applets/issues/60
    // Note: Emoji's do not show up in plasmoidviewer.
    addAllDayTestEvent("Emoji Test 1: '🤑'", 0, 1); // Pasted
    addAllDayTestEvent("Emoji Test 2: '\uD83E\uDD11'", 0, 1); // UTF-16 (hex)

    // Unicode / Foreign Characters
    addAllDayTestEvent("Unicode Test 1: 'ひらがな'", 0, 1); // Japenese (Hiragana)

    // Long summary
    addAllDayTestEvent("One Two Three Four Five Six Seven Eight Nine Ten One Two Three Four Five Six Seven Eight Nine Ten One Two Three Four Five Six Seven Eight Nine Ten", 1, 2);
    addAllDayTestEvent("OneTwoThreeFourFiveSixSevenEightNineTenOneTwoThreeFourFiveSixSevenEightNineTen", -2, -1);
    addAllDayTestEvent("OneTwoThreeFourFiveSixSevenEightNineTenOneTwoThreeFourFiveSixSevenEightNineTen", -1, 0);

    for (var i = -30; i <= 30; i++) {
        addAllDayTestEvent("Day " + i, i, i+1);
    }
    
    return debugEventData;
}

function getDailyWeatherData() {
    var debugWeatherData = {
        "city": {
            "id": 1,
            "name": "Area 51",
            "coord": {
                "lon": 0.249672,
                "lat": 0.550098
            },
            "country": "CA",
            "population": 0
        },
        "cod": "200",
        "message": 0.0275,
        "cnt": 7,
        "list": [
            {
                "dt": Date.now()/1000,
                "temp": {
                    "day": 5.3,
                    "min": -6.14,
                    "max": 5.43,
                    "night": -6.14,
                    "eve": 1.01,
                    "morn": 5.3
                },
                "pressure": 1006.93,
                "humidity": 49,
                "weather": [
                    {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                    }
                ],
                "speed": 6.82,
                "deg": 327,
                "clouds": 0
            },
        ],
    };
    return debugWeatherData;
}
