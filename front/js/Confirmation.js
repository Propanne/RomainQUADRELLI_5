// Get URL and parse parameter to get command_id field
let urlParams = new URLSearchParams(document.location.search);
let commandID = urlParams.get("command_id");

// Remove old cart
localStorage.setItem('cartList', JSON.stringify({}));

// Add commandID to command validation
document.getElementById('orderId').innerHTML = commandID;
