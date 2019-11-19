class CompilePage {

    constructor(page) {
        this.fs = require('fs');
        this.page = page;
        this.all_ui = {};
        this.all_headers = {};
        this.all_footers = {};
        this.all_css = {};
        this.all_js = {};
        this.full_html = '';
    }


    readFile(filePath) {
        try {

            return this.fs.readFileSync(filePath).toString();
            console.log('File was found');

        } catch(err) {
           console.log('File not found');
           return false;
        }
    }

    ui(file) {
        var filePath = './ui/'+this.page+'/'+file+'.html';
        this.all_ui[file] = this.readFile(filePath);
    }

    header(file) {
        var filePath = './ui/headers/'+file+'.html';
        this.all_headers[file] = this.readFile(filePath);
    }

    footer(file) {
        var filePath = './ui/footers/'+file+'.html';
        this.all_footers[file] = this.readFile(filePath);
    }

    css(file) {
        var filePath = './ui/'+this.page+'/'+file+'.css';
        this.all_css[file] = "<link rel='stylesheet' href='../"+filePath+"'>";
    }
    
    js(file, location = 'internal') {

        var filePath = location == 'internal' ? './js/'+this.page+'/'+file+'.js' : location == 'external' ? file : location !='' ? './js/'+location+'/'+file+'.js' : '';

        this.all_js[file] = "<script src='../"+filePath+"'></script>";
    }

    writeHTML(target) {
        for (const data in target) {
            if (target.hasOwnProperty(data)) {
                this.full_html += target[data];
            }
        }
    }

    compile() {

        this.writeHTML(this.all_headers);
        this.writeHTML(this.all_css);
        this.writeHTML(this.all_ui);
        this.writeHTML(this.all_js);
        this.writeHTML(this.all_footers);

        console.log('The file has ended - initialize.js');
        return this.full_html;
    }
}

module.exports = CompilePage;