var data = {
    name: "Paul"
}

dd_ajax({
    url: 'app/dd_ajax/main',
    data: data,
    data_type: 'object',
    ready: function(response) {
        console.log("response");
    }
})