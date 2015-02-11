[![Indigo Logo](http://www.indigojs.com/img/smallogo.png)](http://indigojs.com/)


### Getting started

###### Add or update package.json

```
"devDependencies": {
	"indigo-locale": "git://github.com/dgofman/indigo-locale.git#master"
}

```

###### Run command

```
npm install

```

###### Include and initialize a module

```
require('indigojs').start(__dirname + '/config/app.json', function() {
	require('indigo-locale').init();
});

```

###### Launch and open module

```
npm start

http://localhost:8125/indigo-locale/en/index

```