from django import forms
from django import utils

try:
    import simplejson as json
except ImportError:
    import json


class SplitJSONWidget(forms.Widget):
    class Media:
        css = {
            'all': ('SplitJSONWidget/SplitJSONWidget.css',)
        }
        js = ('SplitJSONWidget/SplitJSONWidget.js',)
        
    def __init__(self, attrs=None, newline='<br/>\n', sep='__', debug=True):
        self.newline = newline
        self.separator = sep
        self.debug = debug
        self._id = 'SplitJSONWidget-X'
        forms.Widget.__init__(self, attrs)

    def _as_text_field(self, name, key, value, is_sub=False):
        attrs = self.build_attrs(self.attrs, type='text',
                                 name="%s%s%s" % (name, self.separator, key))
        attrs['value'] = str(value)
        attrs['id'] = attrs.get('name', None)
        
        what2return = u""" <input readonly="readonly" class="SplitJSONWidget-key" id="%s-key" value="%s" />  :  
            <input id="%s-value" class="SplitJSONWidget-value" value="%s" /> <button class="SplitJSON-delete-btn" type="button">delete</button>""" % (key, key, key, attrs['value'])
            
        return what2return

    def _to_build(self, name, json_obj):
        inputs = []
        if isinstance(json_obj, list):
            title = name.rpartition(self.separator)[2]
            _l = ['%s:%s' % (title, self.newline)]
            for key, value in enumerate(json_obj):
                _l.append(self._to_build("%s%s%s" % (name,
                                         self.separator, key), value))
            inputs.extend([_l])
        elif isinstance(json_obj, dict):
            title = name.rpartition(self.separator)[2]
            _l = ['%s:%s' % (title, self.newline)]
            for key, value in json_obj.items():
                _l.append(self._to_build("%s%s%s" % (name,
                                                     self.separator, key),
                                         value))
            inputs.extend([_l])
        elif isinstance(json_obj, (str, int)):
            
            name, _, key = name.rpartition(self.separator)
            
            if str(key) != "data":
                inputs.append(self._as_text_field(name, key, json_obj))
        elif json_obj is None:
            name, _, key = name.rpartition(self.separator)
            inputs.append(self._as_text_field(name, key, ''))
            
        return inputs

    def _prepare_as_ul(self, l):
        if l:
            result = ''
            for el in l:
                print(str(el))
                if isinstance(el, list) and len(l) is 1:
                    result += '%s' % self._prepare_as_ul(el)
                elif isinstance(el, list):
                    result += '<ul class="%s-list">' % (self._id)
                    result += '%s' % self._prepare_as_ul(el)
                    result += '</ul>'
                else:
                    if el != 'data:<br/>\n':
                        result += '<li>%s</li>' % el
                    else:
                        result = '<ul class="%s-list"></ul>' % (self._id)
            
            return result
        else:
            result = '<ul class="%s-list"></ul>' % (self._id)
            return result
        

    def value_from_datadict(self, data, files, name):
        """
        Given a dictionary of data and this widget's name, returns the value
        of this widget. Returns None if it's not provided.
        """
        
        result = data.get('id_'+name)
        return result
    
    
    def render(self, name, value, attrs=None):
        try:
            value = json.loads(value)
        except TypeError:
            pass
        
        inputs = self._to_build(name, value or {})
        
        result = self._prepare_as_ul(inputs)
        if self.debug:
            # render json as well
            source_data = u'<input id="id_data" name="id_data" data-id="%s" type="hidden" value=\'{\"YYY\":\"XXX\"}\' /><hr/>Source data: <br/><span id="%s">%s</span><hr/><button id="SplitJSONWidget-add-button" type="button" >Add</button>' % (self._id,str(self._id+'-RAW'),json.dumps(value))
            result = '%s%s' % (result, source_data)
        return utils.safestring.mark_safe(result)
