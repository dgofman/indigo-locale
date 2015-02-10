@echo off

SET REPORTER=spec
SET MOCHA_OPTS=--check-leaks
SET BASE=.

SET ISTANBUL=node_modules\.bin\istanbul
SET JSHINT=node_modules\.bin\jshint
SET MOCHA=node_modules\.bin\mocha
SET UMOCHA=node_modules\.bin\_mocha
SET _MOCHA=node_modules\mocha\bin\_mocha

if "%1"=="" goto :main else goto :eof

call:%~1

goto :eof

:main
	call :clean
	call :lint
	call :killnode
	call :test-unit
	call :test-mocha
goto :eof

:cover
	call :clean
	call :killnode
	cmd /c %ISTANBUL% cover "%_MOCHA%" -- test/mocha test/unittest -R spec
goto :eof

:test-unit
	SET NODE_ENV=test & %UMOCHA% test\unittest --reporter %REPORTER% %MOCHA_OPTS%
goto :eof

:test-mocha
	call :killnode
	SET NODE_ENV=test & %MOCHA% test/mocha --reporter %REPORTER% %MOCHA_OPTS%
goto :eof

:start
	call :killnode
	start /WAIT /B node index.js
	start "" "http://localhost:8888/localization/index"
goto :eof

:debug
	cls
	SET DEBUG=indigo:* & nodemon --debug .
goto :eof

:killnode
	taskkill /f /im node.exe
goto :eof

:lint
	cmd /c %JSHINT% . --config %BASE%/.jshintrc
goto :eof

:clean
	rmdir coverage /s /q
goto :eof