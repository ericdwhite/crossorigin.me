crossorigin.me
==============

A CORS proxy replacement. Based partly on https://github.com/technoboy10/crossorigin.me 

## What?
crossorigin.me is a CORS proxy. It lets developers (like you!) access resources from other sites that don't have CORS enabled on their server.

Installation
------------
To run this proxy you will need node js.

    $ git clone https://github.com/ericdwhite/crossorigin.me
    $ cd crossorigin.me
    $ npm install

Running
-------
In the default case you can just run with npm.

    $ npm start

There are additional parameters that can be set via the environment.

    # PORT - (default 8080)
    # AC_ALLOW_HEADERS - a comma deliminted list of 'Access-Control-Allow-Headers' (default Content-Type)

The AC_ALLOW_HEADERS allows the CORS proxy to pass through additional headers.  For example to support JSON with basic auth
you can use:

    $ AC_ALLOW_HEADERS="Authorization, Content-Type" npm start

