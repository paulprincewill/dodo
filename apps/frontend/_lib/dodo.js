function dd(selector) {
	var self = {};

	self.validQuery = function() {
		try {
			document.querySelector(selector) ;
			return true;
		} catch(e) {}
		return false;
	}
    
    self.validObject = function() {
        if (typeof selector !== 'object' ) {
            console.log("The target is not an object");
            return false;
        } else {
            return true;
        }
    }
    
	self.target = self.validQuery() && document.querySelector(selector) || self.validObject() && selector || false;

     
	self.select = function() {
		return self.target;
	}

	self.selectAll = function(callback) {
		var all = document.querySelectorAll(selector);
		
		if (typeof callback === 'function') {
			for (i=0; i < all.length; i++) {
				callback(all[i]);
			}
		}

		return all;
	}

	self.alert = function() {
		alert(selector);
	}

	self.html = function(value) {
		if (typeof value === 'undefined') {
			return self.target.innerHTML;
		} else {
			self.target.innerHTML = value;
		}
	}

	self.val = function(value) {
		if (typeof value === 'undefined') {
			return self.target.value;
		} else {
			self.target.value= value;
		}
	}

	self.style = function(property, value) {
		self.target.style[property] = value;
	}

	self.fadeIn = function(time, callback) {

        self.hide();
		self.target.style.opacity = 0;
		self.show();

		var opacity = 0;
		var increment = 10/time;
		function changeOpacity() {
			self.target.style.opacity = opacity;
			if (opacity >= 1) {
				clearInterval(timer);
				self.target.style.opacity = 1;
                
                if (typeof callback === 'function') { 
                    callback();
                }
                
			} else {
				opacity = opacity+increment;
			}
		}

		var timer = setInterval(changeOpacity, 10);
	}

	self.fadeOut = function(time, callback) {

		self.target.style.opacity = 1;

		var opacity = 1;
		var increment = 10/time;
		function changeOpacity() {
			self.target.style.opacity = opacity;
			if (opacity <= 0) {
				clearInterval(timer);
				self.target.style.opacity = 0;
				self.hide();
                
                if (typeof callback === 'function') { 
                    callback();
                }
                
			} else {
				opacity = opacity-increment;
			}
		}

		var timer = setInterval(changeOpacity, 10);
	}

	self.show = function() {
		var previousDisplay = self.target.getAttribute('dd_previousDisplay');
		if (previousDisplay ===null || previousDisplay =='') {
            // First, we get the initial value of propery 'display'
	       	previousDisplay = self['target'].style.display !='' && self['target'].style.display !='undefined' && self['target'].style.display !='none' && self['target'].style.display || getComputedStyle(self.target).display !='none' && getComputedStyle(self.target).display || 'block';
            
		}
        
        self.target.style.display = previousDisplay;
	}

	self.hide = function() {
        
		// First, we get the initial value of propery 'display'
		var previousDisplay = self['target'].style.display !='' && self['target'].style.display !='undefined' && self['target'].style.display || getComputedStyle(self.target).display || 'block';

		// Then we save it in an attribute of 'data-dd-previous_display'
		if (previousDisplay !='' && previousDisplay !='none') {
			self.target.setAttribute('dd_previousDisplay',previousDisplay);
		}
        
        self['target'].style.display = 'none';
	}

	self.isEmpty = function() {
		for (var key in selector) {
			if(selector.hasOwnProperty(key)) {
				return false;
			}
		}

		return true;
	}
    
    self.urlEncode = function() {
        
        if (!self.validObject()) {
            return false
        }
        
        var obj = self.target;
        
        // This code is meant to break down multidimentional objects
        for (var x in obj) {
          if (obj.hasOwnProperty(x)) { 
            if (typeof obj[x] === 'object') { 
                var k = obj[x];
                for (var y in k) {
                    if (k.hasOwnProperty(y)) { 
                        obj[x+"["+y+"]"] = k[y];
                    }
                }
                
                delete obj[x];
            }
          }
        }
        
        
        var x  = Object.keys(obj).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
        }).join('&');
        return x;
        
    }
    
    self.clone = function(repeat) {
        
        var target = self.target;
        var current_cycle = target.getAttribute("dd_cloned") !== null && parseInt(target.getAttribute("dd_cloned")) || 0;

        for (var j = 1; j <= repeat; j++) {
            var clone = target.cloneNode(true); // Clone node has to be inside, not outside this loop
            var id = j+current_cycle;
            clone.innerHTML = clone.innerHTML.replace(/\$id/g, id);
            if (target.id !== null && target.id !='') {
                clone.id = target.id.replace(/\$id/g, id);
            }

            dd(clone).show();
            clone.removeAttribute('dd_cloned');

            target.parentNode.insertBefore(clone, target);

        } 


        target.setAttribute("dd_cloned", current_cycle + repeat);
        self.hide();
        
        console.log("clone happend");
    }
    
	return self;
}


function dd_ajax(get) {

    var self = {};
    self.url = get.url;
    self.loader = '';
    self.ready = get.ready;
    self.after_request = get.after_request;
    self.data = get.data || '';
    self.method = get.method || 'POST';
    self.content_type = get.content_type || '';
    self.request_type = get.request_type || '';
    self.data_type = get.data_type || '';
    self.if_successful = get.if_successful || '';
    self.if_not = get.if_not || '';  
    self.expecting = get.expecting || self.if_successful !='' && 'JSON' || ''; 
    self.interval = get.interval || "";
    self.timeSet = get.timeSet || "";

    self.__construct = function() {
        
        self.start_loader();
        self.prepare_data();
        self.prepare_connection();

        if (self.method == 'GET') {self.request_using_get();} 
        else {self.request_using_post();}
        
        self.send_request();
    }
    
    self.start_loader = function() {
        
        var loader = dd('dd_loader [dd_ajaxload]');
        if (loader.select()) {
            self.loader = loader;
            loader.fadeIn(500);
        }
    }
    
    self.end_loader = function() {
        
        if (self.loader !='') {
            self.loader.fadeOut(500);
        }
    }
    
    self.prepare_data = function() {
        if (self.data_type == 'object' && self.content_type == '') {
            self.data = dd(self.data).urlEncode();
        }
    }
    
    self.prepare_connection = function() {
        self.ajax = window.XMLHttpRequest && new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
    }

    self.request_using_get = function() {
        self.ajax.open("GET",self.url+'?'+self.data,true);
        self.ajax.send();
    }

    self.request_using_post = function() {
        

        self.ajax.open("POST",self.url,true);
        if (self.content_type != 'none' && self.content_type == '') {
            self.ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        } else if (self.content_type != 'none' &&  self.content_type != '' ) {
            self.ajax.setRequestHeader("Content-type", self.content_type);
        }
        
        self.ajax.send(self.data);
    }

    self.send_request = function() {
        
        self.ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                self.ajax_has_worked(this.responseText);
                self.end_loader();
            }
        };
    }
    
    self.ajax_has_worked = function(response) {
        
        if (self.expecting == "JSON") {
            response = JSON.parse(response);
        }

        if (typeof self.if_successful === 'function' && typeof response.dd_success !== 'undefined' && response.dd_success) {
            self.if_successful(response);
        } 
        
        if (typeof self.if_not === 'function' && typeof response.dd_success !== 'undefined' && !response.dd_success) {
            self.if_not(response);
        }
        
        if (typeof self.ready === 'function') {
            self.ready(response);
        }
        
        if (typeof self.after_request === 'function') {
            self.after_request(response);
        }
        
        
        
        console.log(response);
    }


    self.__construct();
    
    if (self.interval !='' && self.timeSet !='yes') {
        if (typeof self.interval === 'number') {
            
            setInterval(function() {
                get.timeSet = 'yes';
                dd_ajax(get);
            }, self.interval)
        } else {
            console.log("DoDo301: interval was not set to a number");
        }
    }
}