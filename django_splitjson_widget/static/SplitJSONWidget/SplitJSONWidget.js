var SplitJSON = false;
var SplitJSONHelper = {
  'addEventHandler': function(elem, eventType, handler) {
        if (elem.addEventListener)
            elem.addEventListener (eventType, handler, false);
        else if (elem.attachEvent)
            elem.attachEvent ('on' + eventType, handler); 
    },  
};
function SplitJSONWidget(){
    this.version = '1.0';
    this.new_entries = 0;    
}
SplitJSONWidget.prototype.syncHiddenInput = function(){
    var data = {};
    var keys = document.querySelectorAll(".SplitJSONWidget-key"); 
    for (var i = 0, len_i = keys.length; i < len_i; i++) {
        var valueID = String(keys[i].id).replace('-key','-value');
        
        if(keys[i].value)
            data[ keys[i].value ] = document.getElementById(valueID).value;
    }
    document.getElementById('id_data').value = JSON.stringify(data);  
};
SplitJSONWidget.prototype.DOMLoaded = function(){
    if(!SplitJSON){
        return false;//app is not ready
    }
    var SplitJSONWidget = SplitJSON;
    var keys = document.querySelectorAll(".SplitJSONWidget-key"); 
    var values = document.querySelectorAll(".SplitJSONWidget-value");
    
    SplitJSONWidget.syncHiddenInput();
    
    //wire up the delete button
    Array.prototype.forEach.call (keys, function (node) {
        var children = node.parentNode.children; //gets all elements within the <li>
        var elemID = String(node.id).replace('-key','');
        var dataRow = node.parentNode;
        
        Array.prototype.forEach.call (children, function (tmpElement) {
            if(tmpElement.nodeName == "BUTTON"){
                //currently only ONE button - 
                //TODO: add extra checks to make sure its the delete button
                SplitJSONHelper.addEventHandler(tmpElement, 'click', function(e) {
                    dataRow.parentNode.removeChild(dataRow);
                    SplitJSONWidget.syncHiddenInput();
                });
            }         
        });            
    });
    
    SplitJSONHelper.addEventHandler(document.getElementById('SplitJSONWidget-add-button'), 'click', function(e) {
        e.preventDefault();
        SplitJSONWidget.new_entries = SplitJSONWidget.new_entries + 1;
            var tmpLI = document.createElement('li');
            tmpLI.classList.add('SplitJSON-new');
            if(SplitJSONWidget.new_entries == 1){
                tmpLI.classList.add('first');
            }
            
            var tmpInput = document.createElement('input');
            
            tmpInput.classList.add('SplitJSONWidget-key');
            tmpInput.setAttribute('id','SplitJSON-new-key-'+String(SplitJSONWidget.new_entries));
            tmpInput.onchange = SplitJSONWidget.syncHiddenInput;
            tmpInput.setAttribute('value','');
            tmpInput.setAttribute('placeholder','Enter label for attribute');
            
            var separator = document.createElement('span');
            separator.innerHTML = ' : ';
            
            var tmpValInput = document.createElement('input');
            tmpValInput.classList.add('SplitJSONWidget-value');
            tmpValInput.setAttribute('id','SplitJSON-new-value-'+String(SplitJSONWidget.new_entries));
            tmpValInput.setAttribute('value','');
            tmpValInput.setAttribute('placeholder','Enter new value');
            tmpValInput.onchange = SplitJSONWidget.syncHiddenInput;
            
            
            //tmpLI appendChild
            tmpLI.appendChild(tmpInput);
            tmpLI.appendChild(separator);
            tmpLI.appendChild(tmpValInput);
            
            //separator for delete
            var del_separator = document.createElement('span');
            del_separator.innerHTML = ' ';
            tmpLI.appendChild(del_separator);
            
            //delete btn
            var del_btn = document.createElement('button');
            del_btn.innerHTML = 'delete';
            del_btn.setAttribute('type','button');
            del_btn.classList.add('SplitJSON-delete-btn');
            
            SplitJSONHelper.addEventHandler(del_btn, 'click', function(e) {
                tmpLI.parentNode.removeChild(tmpLI);
                SplitJSONWidget.syncHiddenInput();
            });
            tmpLI.appendChild(del_btn);
            
            var c=document.getElementsByClassName("SplitJSONWidget-X-list");
            var last_element = c[c.length - 1];
            
            last_element.insertBefore(tmpLI,null);
            
        
        
        
    });
    
    for (var i = 0, len_i = keys.length; i < len_i; i++) {
        SplitJSONHelper.addEventHandler(keys[i], 'change', SplitJSONWidget.syncHiddenInput);
    }
    for (var j = 0, len_j = values.length; j < len_j; j++) {
        SplitJSONHelper.addEventHandler(values[j], 'change', SplitJSONWidget.syncHiddenInput);
    }
        
};

SplitJSONHelper.addEventHandler(document, 'DOMContentLoaded', function() {
    SplitJSON = new SplitJSONWidget();
    SplitJSON.DOMLoaded();
});
