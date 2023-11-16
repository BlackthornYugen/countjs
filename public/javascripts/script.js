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
        navigator.vibrate([20,10,10]);
    });

    minusOneBtn.addEventListener('click', () => {
        if (socket) {
            socket.send('-1 ' + room);
        }
        handleMessage('-1');
        navigator.vibrate([90,20,200]);
    });

    function handleMessage(message) {
        console.log(message);
        const value = parseInt(message);
        if (isFinite(value)) {
            let localCount = parseInt(count.innerText);
            count.innerText = isFinite(localCount) ? (localCount + value).toString() : (value).toString();
        }
    }
});

function getRandomHexDigit() {
    return (crypto.getRandomValues(new Uint8Array(1))[0] % 16).toString(16);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char =>
        (char === 'x' ? getRandomHexDigit() : (getRandomHexDigit() & 0x3 | 0x8).toString(16))
    );
}
