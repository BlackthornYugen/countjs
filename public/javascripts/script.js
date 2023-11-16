document.addEventListener('DOMContentLoaded', () => {
    const plusOneBtn = document.getElementById('plusOneBtn');
    const minusOneBtn = document.getElementById('minusOneBtn');
    const count = document.getElementById('count');
    let socket;
    let room = window.location.hash.substring(1) || generateUUID();
    let shouldReconnect = true;

    function connectWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        socket = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);

        socket.onopen = function() {
            plusOneBtn.disabled = false;
            minusOneBtn.disabled = false;
            console.log('Connected');
            socket.send("Subscribe: " + room);
            count.innerText = "???"
            window.location.hash = room;
        };

        socket.onmessage = function(event) {
            handleMessage(`${event.data}`);
        };

        socket.onclose = function() {
            plusOneBtn.disabled = true;
            minusOneBtn.disabled = true;
            console.log('Disconnected');
            if (shouldReconnect) {
                setTimeout(connectWebSocket, 2000); // Try to reconnect every 2 seconds
            }
        };

        socket.onerror = function(err) {
            console.log('Error occurred', err);
        };
    }

    // Initial connection
    connectWebSocket();

    plusOneBtn.addEventListener('click', () => {
        if (socket) {
            socket.send('+1 ' + room);
        }
        handleMessage('+1');
    });

    minusOneBtn.addEventListener('click', () => {
        if (socket) {
            socket.send('-1 ' + room);
        }
        handleMessage('-1');
    });

    function handleMessage(message) {
        console.log(message);
        const value = parseInt(message);
        if (isFinite(value)) {
            let localCount = parseInt(count.innerText);
            count.innerText = isFinite(localCount) ? (localCount + value).toString() : (value).toString();

            if ('vibrate' in navigator) { // Handle safari or other browsers where vibrate is not a func
                navigator.vibrate(createVibrationPattern(value));
            }
        }
    }
});

function createVibrationPattern(value) {
    const shortVibration = 100;
    const longVibration = 150;
    const pause = 50;
    let pattern = [];

    // Truncate the value to a maximum of 10
    value = Math.min(Math.abs(value), 10) * (value >= 0 ? 1 : -1);

    if (value > 0) {
        for (let i = 0; i < value; i++) {
            pattern.push(shortVibration);
            if (i < value - 1) {
                pattern.push(pause);
            }
        }
    } else if (value < 0) {
        for (let i = 0; i < Math.abs(value); i++) {
            pattern.push(longVibration);
            if (i < Math.abs(value) - 1) {
                pattern.push(pause);
            }
        }
    }
    return pattern;
}

function getRandomHexDigit() {
    return (crypto.getRandomValues(new Uint8Array(1))[0] % 16).toString(16);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char =>
        (char === 'x' ? getRandomHexDigit() : (getRandomHexDigit() & 0x3 | 0x8).toString(16))
    );
}
