__author__ = 'OBLIVIO LLC'

from distutils.core import setup
from setuptools import setup, find_packages

setup(name = "django_splitjson_widget",
    version = "1.0.0",
    description = "Simple and clean widget for JSONField or TextField(JSON-encoded)",
    long_description=open('README.rst').read(),
    author = "OBLIVIO LLC",
    author_email = "oblivio.company@gmail.com",
    url = "https://github.com/oblivio/django-splitJSON-widget",
    license = "GPL V3",
    packages = find_packages(),
    include_package_data=True,
    install_requires = ['django'],
    classifiers = [
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        "License :: OSI Approved :: GPL V3",
        'Topic :: Software Development :: Libraries :: Python Modules ',
        ],
    zip_safe=False,
)