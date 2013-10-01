
var dextend  = require('dextend');
var minimist = require('minimist');

var runningEnvironment = ('' + [process.env.NODE_ENV]) || 'development';

var processEnv = (function() {
	var env = {};
	for (var key in process.env) {
		if (/^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/.test(key)) {
			var normalizedKey = key.toLowerCase();
			env[normalizedKey] = process.env[key];
		}
	}
	return env;
}());

var processArgs = (function() {
	var args = process.argv.slice(2);

	if (process.env.npm_config_argv) {
		try {
			args = JSON.parse(process.env.npm_config_argv).cooked;
			if (args[0] === 'run-script') {
				args.shift();
			}
			args.unshift('--run-script');
		} catch (error) {}
	}

	var parsedArgs = minimist(args);
	args = {};
	for (var key in parsedArgs) {
		if (/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(key)) {
			var normalizedKey = key.replace(/-/g, '_');
			args[normalizedKey] = parsedArgs[key];
		}
	}

	return args;
}());

var combinedArgs = dextend({}, processEnv, processArgs);

function configist(options) {
	var args = (options && options.args) ? options.args : combinedArgs;
	var self = {};
	var configs = {};

	function env(environment) {
		environment = environment || runningEnvironment;

		var defaultConfig = configs[''] || {};
		var envConfig = configs[environment] || {};
		var config = dextend({}, defaultConfig, envConfig);

		for (var key in config) {
			if (key in args) {
				config[key] = args[key];
			}
		}
		config.env = runningEnvironment;

		return dextend(self, config);
	}

	function use(envName, config) {
		if (config === undefined) {
			var pkg = envName;
			for (var key in pkg) {
				var matches = key.match(/^config(?:\:([\w\-]+))?$/);
				if (matches) {
					envName = matches[1] || '';
					configs[envName] = dextend(configs[envName] || {}, pkg[key]);
				}
			}
		} else {
			envName = '' + [envName];
			configs[envName] = dextend(configs[envName] || {}, config);
		}

		return env();
	}

	Object.defineProperty(self, 'use', { value: use });

	return self;
}

module.exports = configist;
