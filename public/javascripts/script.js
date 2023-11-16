document.addEventListener('DOMContentLoaded', () => {
    const plusOneBtn = document.getElementById('plusOneBtn');
    const minusOneBtn = document.getElementById('minusOneBtn');
    const count = document.getElementById('count');
    let socket  = new WebSocket('ws://localhost:3000/ws');
    let room = window.location.hash.substring(1) || generateUUID();

    socket.onopen = function() {
        plusOneBtn.disabled = false;
        minusOneBtn.disabled = false;
        console.log('Connected');
        socket.send("Subscribe: " + room)
        window.location.hash = room;
    };

    socket.onmessage = function(event) {
        handleMessage(`${event.data}`);
    };

    socket.onclose = function() {
        plusOneBtn.disabled = true;
        minusOneBtn.disabled = true;
        console.log('Disconnected');
    };

    socket.onerror = function(err) {
        console.log('Error occurred', err);
    };

    plusOneBtn.addEventListener('click', () => {
        if (socket) {
            socket.send('+1 ' + room);
        }
        handleMessage('+1')
    });

    minusOneBtn.addEventListener('click', () => {
        if (socket) {
            socket.send('-1 ' + room);
        }
        handleMessage('-1')
    });

    function handleMessage(message) {
        console.log(message);
        const value = parseInt(message);
        if (isFinite(value)) {
            count.innerText = (parseInt(count.innerText) + value).toString()
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
