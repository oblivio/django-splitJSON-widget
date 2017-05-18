django_splitjson_widget
======================

``django_splitjson_widget``  is a simple and clean widget for JSONField or TextField (JSON-encoded).


Installation
------------

#. Install django_splitjson_widget using pip. For example::

    pip install django_splitjson_widget

#. Add  ``django_splitjson_widget`` to your INSTALLED_APPS.

Basic Configuration
-------------------
#. Create your model-form and set  DateTimeWidget widget to your DateTimeField  ::

    from django_splitjson_widget.widgets import SplitJSONWidget

    class ExampleForm(forms.ModelForm):
	    def __init__(self, *args, **kwargs):
		super(ExampleForm, self).__init__(*args, **kwargs)
	    def save(self, commit=True):
		if 'data' in self.cleaned_data:
		    self.instance.data = self.cleaned_data.get('data')
		m = super(ProductDataForm, self).save(commit=commit)
		return m
	    class Meta:
		fields = "__all__"
		widgets = {'data':SplitJSONWidget}
		model = ExampleModel



