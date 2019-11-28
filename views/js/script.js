var socket = io.connect(window.location.href)

function submitDoc(){
    console.log($("#paras").val())
    $.ajax({
        url: "/submit",
        type: "POST",
        data: {
            paras:$("#paras").val()
        },
        success: function (response) {
            $("#stats").html(response);
            $("#paras").val("");
            

        }
    });
}
socket.on("stats", (data) => {
    console.log(data);
    $("#stats").html(data.data);



})