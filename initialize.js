const fs = require('fs');

const dd = {

    page : '',
    all_ui : {},
    all_headers: {},
    all_footers: {},
    all_css: {},
    full_html: '',

    readFile : function(filePath) {
        try {

            return fs.readFileSync(filePath).toString();
            console.log('File was found');

        } catch(err) {
           console.log('File not found');
           return false;
        }
    },

    ui: function(file) {
        var filePath = './ui/'+this.page+'/'+file+'.html';
        this.all_ui[file] = this.readFile(filePath);
    },

    header: function(file) {
        var filePath = './ui/headers/'+file+'.html';
        this.all_headers[file] = this.readFile(filePath);
    },

    footer: function(file) {
        var filePath = './ui/footers/'+file+'.html';
        this.all_footers[file] = this.readFile(filePath);
    },

    css: function(file) {
        var filePath = './ui/'+this.page+'/'+file+'.css';
        this.all_css[file] = "<link rel='stylesheet' href='../"+filePath+"'>";
    },

    writeHTML: function(target) {
        for (const data in target) {
            if (target.hasOwnProperty(data)) {
                this.full_html += target[data];
            }
        }
    },

    compile : function() {

        this.writeHTML(this.all_headers);
        this.writeHTML(this.all_css);
        this.writeHTML(this.all_ui);
        this.writeHTML(this.all_footers);

        console.log('The file has ended - initialize.js');
        return this.full_html;
    }
}

module.exports = dd;