// Generated by CoffeeScript 1.4.0
(function() {
  var HandBrake;

  HandBrake = (function() {
    var command, handbrake, hb_options, log_locate, x264_options;

    function HandBrake() {
      require('consolable');
    }

    command = [];

    handbrake = 'HandBrakeCLI';

    hb_options = {};

    x264_options = {};

    log_locate = './log.txt';

    HandBrake.prototype.setLogs = function(log_path) {
      if (!log_path || (string(log_path)).length < 1) {
        log_path = '/dev/null';
      }
      return log_locate = log_path;
    };

    HandBrake.prototype.setPath = function(handbrake_path) {
      return handbrake = handbrake_path;
    };

    HandBrake.prototype.setOpts = function(options) {
      var key, val, _results;
      if (typeof options !== 'object') {
        console.error('argument type must be object.');
        process.exit(1);
      }
      _results = [];
      for (key in options) {
        val = options[key];
        if ((String(key)).length > 1) {
          _results.push(this.setLong(key, val));
        } else if ((String(val)).length < 1) {
          _results.push(this.setFlag(key));
        } else {
          _results.push(hb_options[key] = val);
        }
      }
      return _results;
    };

    HandBrake.prototype.setFlag = function(key) {
      return hb_options[key] = null;
    };

    HandBrake.prototype.setLong = function(key, val) {
      var option;
      key = key.replace('_', '-');
      if ((String(val)).length > 0) {
        option = "-" + key + "='" + val + "'";
      } else {
        option = "-" + key;
      }
      return hb_options[option] = null;
    };

    HandBrake.prototype.setX264 = function(options) {
      var key, val, _results;
      _results = [];
      for (key in options) {
        val = options[key];
        key = key.replace('_', '-');
        _results.push(x264_options[key] = val);
      }
      return _results;
    };

    HandBrake.prototype.execute = function() {
      var key, spawn, val, x264_command;
      x264_command = [];
      if (x264_options) {
        if (hb_options.e !== 'x264') {
          console.error('x264 options ignored, your video codec is NOT x264');
        } else {
          for (key in x264_options) {
            val = x264_options[key];
            x264_command.push("" + key + "=" + val);
          }
          hb_options['x'] = x264_command.join(':');
        }
      } else {
        console.info('no x264 option');
      }
      for (key in hb_options) {
        val = hb_options[key];
        command.push("-" + key);
        if (val !== null) {
          command.push(val);
        }
      }
      command.push("2> " + log_locate);
      console.info('[loglocate]', log_locate);
      console.info('[execute]', handbrake, command.join(' '));
      spawn = (require('child_process')).spawn(handbrake, command);
      spawn.stdout.on('data', function(data) {
        return console.log(data.toString());
      });
      spawn.stderr.on('data', function(data) {
        var a;
        a = data.toString();
        return console.error('A: ', a);
      });
      return spawn.on('exit', function(code) {
        return console.info(code);
      });
    };

    return HandBrake;

  })();

  exports.HandBrake = HandBrake;

}).call(this);
