// Applying the event listener on window in your code ensures that the listener will capture keyboard events from anywhere in the browser window

const insert = document.getElementById('insert')

window.addEventListener('keydown', (e) =>{
    insert.innerHTML = `
    <div class='color'>  
        <table>
            <tr>
                <th>Key</th>
                <th>Keycode</th>
                <th>Code</th>
            </tr>
            <tr>
                <td>${e.key === ' ' ? 'Space' : e.key}</td>
                <td>${e.keyCode}</td>
                <td>${e.code}</td>
            </tr>
        </table>
    </div>
    `;
});