const dd = {
    echoData: [],
    redirectTo: '',

    echo: function(data) {
        this.echoData.push(data);
    },

    isset: function(data) {
        if (typeof data === "undefined") {
            return false;
        } else {
            return true;
        }
    },

    redirect: function(data) {
        this.redirectTo = data;
    },

    compile: function() {
        
        let response = '';
        if (this.redirectTo !='') {
            response = {redirectTo: this.redirectTo}
        } else {
            response = this.echoData.join("");
        }

        return response;
    }
}

module.exports = dd;