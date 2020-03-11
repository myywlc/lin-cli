"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = exports.cmd = exports.name = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _ora = _interopRequireDefault(require("ora"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _archiver = _interopRequireDefault(require("archiver"));

var _nodeSsh = _interopRequireDefault(require("node-ssh"));

var _child_process = _interopRequireDefault(require("child_process"));

var _utils_deploy = require("../utils/utils_deploy");

var deployConfigPath = "".concat(process.cwd(), "/deploy.config.js");
var ssh = new _nodeSsh.default(); // 生成ssh实例

var name = 'deploy';
exports.name = name;
var cmd = {
  description: 'deploy package',
  usages: ['lin deploy init', 'lin deploy']
};
exports.cmd = cmd;

var handle = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(key) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = key;
            _context.next = _context.t0 === 'init' ? 3 : 5;
            break;

          case 3:
            checkDeployExists();
            return _context.abrupt("break", 7);

          case 5:
            handleDeploy();
            return _context.abrupt("break", 7);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handle(_x) {
    return _ref.apply(this, arguments);
  };
}(); // ===================== init =========================
// 检查部署目录及部署配置文件是否存在


exports.handle = handle;

var checkDeployExists = function checkDeployExists() {
  if (_fs.default.existsSync(deployConfigPath)) {
    (0, _utils_deploy.infoLog)('根目录下的deploy.config.js配置文件已经存在!');
    process.exit(1);
    return;
  }

  writeConfigFile();
};

var configTemplate = "const config = {\n  privateKey: '', // \u672C\u5730\u79C1\u94A5\u5730\u5740\uFF0C\u4F4D\u7F6E\u4E00\u822C\u5728C:/Users/xxx/.ssh/id_rsa\uFF0C\u975E\u5FC5\u586B\uFF0C\u6709\u79C1\u94A5\u5219\u914D\u7F6E\n  passphrase: '', // \u672C\u5730\u79C1\u94A5\u5BC6\u7801\uFF0C\u975E\u5FC5\u586B\uFF0C\u6709\u79C1\u94A5\u5219\u914D\u7F6E\n  projectName: '', // \u9879\u76EE\u540D\u79F0\n  // \u6839\u636E\u9700\u8981\u8FDB\u884C\u914D\u7F6E\uFF0C\u5982\u53EA\u9700\u90E8\u7F72prod\u7EBF\u4E0A\u73AF\u5883\uFF0C\u8BF7\u5220\u9664dev\u6D4B\u8BD5\u73AF\u5883\u914D\u7F6E\uFF0C\u53CD\u4E4B\u4EA6\u7136\uFF0C\u652F\u6301\u591A\u73AF\u5883\u90E8\u7F72\n  dev: {\n    // \u6D4B\u8BD5\u73AF\u5883\n    name: '\u6D4B\u8BD5\u73AF\u5883',\n    script: 'npm run build', // \u6D4B\u8BD5\u73AF\u5883\u6253\u5305\u811A\u672C\n    host: '', // \u6D4B\u8BD5\u670D\u52A1\u5668\u5730\u5740\n    port: 22, // ssh port\uFF0C\u4E00\u822C\u9ED8\u8BA422\n    username: '', // \u767B\u5F55\u670D\u52A1\u5668\u7528\u6237\u540D\n    password: '', // \u767B\u5F55\u670D\u52A1\u5668\u5BC6\u7801\n    distPath: 'dist', // \u672C\u5730\u6253\u5305dist\u76EE\u5F55\n    // distPath: {\n    //   files: ['package.json', 'yarn.lock', '.gitignore', '.prettierrc.js', 'babel.config.js', 'README.md'],\n    //   directory: ['dist', 'static']\n    // },\n    webDir: '', // \u6D4B\u8BD5\u73AF\u5883\u670D\u52A1\u5668\u5730\u5740\n  },\n  prod: {\n    // \u7EBF\u4E0A\u73AF\u5883\n    name: '\u7EBF\u4E0A\u73AF\u5883',\n    script: 'npm run build', // \u7EBF\u4E0A\u73AF\u5883\u6253\u5305\u811A\u672C\n    host: '', // \u7EBF\u4E0A\u670D\u52A1\u5668\u5730\u5740\n    port: 22, // ssh port\uFF0C\u4E00\u822C\u9ED8\u8BA422\n    username: '', // \u767B\u5F55\u670D\u52A1\u5668\u7528\u6237\u540D\n    password: '', // \u767B\u5F55\u670D\u52A1\u5668\u5BC6\u7801\n    distPath: 'dist', // \u672C\u5730\u6253\u5305dist\u76EE\u5F55\n    // distPath: {\n    //   files: ['package.json', 'yarn.lock', '.gitignore', '.prettierrc.js', 'babel.config.js', 'README.md'],\n    //   directory: ['dist', 'static']\n    // },\n    webDir: '', // \u7EBF\u4E0A\u73AF\u5883web\u76EE\u5F55\n  },\n};\n\nmodule.exports = { config };\n";

var writeConfigFile = function writeConfigFile() {
  var spinner = (0, _ora.default)('开始生成部署模板');
  spinner.start();

  _fs.default.writeFile(deployConfigPath, configTemplate, {
    encoding: 'utf8'
  }, function (err) {
    if (err) {
      (0, _utils_deploy.errorLog)(err);
      process.exit(1);
    }

    spinner.stop();
    (0, _utils_deploy.successLog)('配置模板创建成功');
    (0, _utils_deploy.infoLog)('请配置根目录下的deploy.config.js配置文件');
    (0, _utils_deploy.errorLog)('注意：请在.gitignore配置忽略deploy.config.js文件,避免关键信息泄露');
    process.exit(0);
  });
}; // ===================== deploy =========================
// 部署流程入口


function runDeploy(_x2) {
  return _runDeploy.apply(this, arguments);
} // 第一步，执行打包脚本


function _runDeploy() {
  _runDeploy = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(config) {
    var script, webDir, distPath, projectName, name, _config$onlineScript, onlineScript;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            script = config.script, webDir = config.webDir, distPath = config.distPath, projectName = config.projectName, name = config.name, _config$onlineScript = config.onlineScript, onlineScript = _config$onlineScript === void 0 ? '' : _config$onlineScript;
            _context2.prev = 1;
            execBuild(script);
            _context2.next = 5;
            return startZip(distPath);

          case 5:
            _context2.next = 7;
            return connectSSH(config);

          case 7:
            _context2.next = 9;
            return uploadFile(webDir);

          case 9:
            _context2.next = 11;
            return unzipFileAndReStart(webDir, onlineScript);

          case 11:
            _context2.next = 13;
            return deleteLocalZip();

          case 13:
            (0, _utils_deploy.successLog)(" ".concat((0, _utils_deploy.underlineLog)(projectName), "\u9879\u76EE").concat((0, _utils_deploy.underlineLog)(name), "\u90E8\u7F72\u6210\u529F \n"));
            process.exit(0);
            _context2.next = 21;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](1);
            (0, _utils_deploy.errorLog)("  \u90E8\u7F72\u5931\u8D25 ".concat(_context2.t0));
            process.exit(1);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 17]]);
  }));
  return _runDeploy.apply(this, arguments);
}

function execBuild(script) {
  try {
    console.log("\n\uFF081\uFF09".concat(script));
    var spinner = (0, _ora.default)('正在打包中');
    spinner.start();

    _child_process.default.execSync(script, {
      cwd: process.cwd()
    });

    spinner.stop();
    (0, _utils_deploy.successLog)('  打包成功');
  } catch (err) {
    (0, _utils_deploy.errorLog)(err);
    process.exit(1);
  }
} // 第二部，打包zip


function startZip(distPath) {
  return new Promise(function (resolve, reject) {
    var output = _fs.default.createWriteStream("".concat(process.cwd(), "/dist.zip"));

    console.log('（2）打包成zip');
    var archive = (0, _archiver.default)('zip', {
      zlib: {
        level: 9
      }
    }).on('error', function (err) {
      throw err;
    });
    output.on('close', function (err) {
      if (err) {
        (0, _utils_deploy.errorLog)("  \u5173\u95EDarchiver\u5F02\u5E38 ".concat(err));
        reject(err);
        process.exit(1);
      }

      (0, _utils_deploy.successLog)('  zip打包成功');
      resolve();
    });
    archive.pipe(output);

    if (distPath instanceof Object) {
      var _distPath = distPath,
          files = _distPath.files,
          directory = _distPath.directory;
      files.forEach(function (item) {
        archive.file("".concat(process.cwd(), "/").concat(item), {
          name: item
        });
      });
      directory.forEach(function (item) {
        archive.directory("".concat(process.cwd(), "/").concat(item), "/".concat(item));
      });
    } else {
      distPath = _path.default.resolve(process.cwd(), distPath);
      archive.directory(distPath, '/');
    }

    archive.finalize();
  });
} // 第三步，连接SSH


function connectSSH(_x3) {
  return _connectSSH.apply(this, arguments);
} // 第四部，上传zip包


function _connectSSH() {
  _connectSSH = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(config) {
    var host, port, username, password, privateKey, passphrase, sshConfig;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            host = config.host, port = config.port, username = config.username, password = config.password, privateKey = config.privateKey, passphrase = config.passphrase;
            sshConfig = {
              host: host,
              port: port,
              username: username,
              password: password,
              privateKey: privateKey,
              passphrase: passphrase
            };
            _context3.prev = 2;
            console.log("\uFF083\uFF09\u8FDE\u63A5".concat((0, _utils_deploy.underlineLog)(host)));
            _context3.next = 6;
            return ssh.connect(sshConfig);

          case 6:
            (0, _utils_deploy.successLog)('  SSH连接成功');
            _context3.next = 13;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            (0, _utils_deploy.errorLog)("  \u8FDE\u63A5\u5931\u8D25 ".concat(_context3.t0));
            process.exit(1);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));
  return _connectSSH.apply(this, arguments);
}

function uploadFile(_x4) {
  return _uploadFile.apply(this, arguments);
} // 运行命令


function _uploadFile() {
  _uploadFile = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(webDir) {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            console.log("\uFF084\uFF09\u4E0A\u4F20zip\u81F3\u76EE\u5F55".concat((0, _utils_deploy.underlineLog)(webDir)));
            _context4.next = 4;
            return ssh.putFile("".concat(process.cwd(), "/dist.zip"), "".concat(webDir, "/dist.zip"));

          case 4:
            (0, _utils_deploy.successLog)('  zip包上传成功');
            _context4.next = 11;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            (0, _utils_deploy.errorLog)("  zip\u5305\u4E0A\u4F20\u5931\u8D25 ".concat(_context4.t0));
            process.exit(1);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return _uploadFile.apply(this, arguments);
}

function runCommand(_x5, _x6) {
  return _runCommand.apply(this, arguments);
} // 第五步，解压zip包


function _runCommand() {
  _runCommand = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(command, webDir) {
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return ssh.execCommand(command, {
              cwd: webDir
            });

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _runCommand.apply(this, arguments);
}

function unzipFileAndReStart(_x7, _x8) {
  return _unzipFileAndReStart.apply(this, arguments);
} // 第六步，删除本地dist.zip包


function _unzipFileAndReStart() {
  _unzipFileAndReStart = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(webDir, onlineScript) {
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            console.log('（5）开始解压zip包');
            _context6.next = 4;
            return runCommand("cd ".concat(webDir), webDir);

          case 4:
            _context6.next = 6;
            return runCommand('unzip -o dist.zip && rm -f dist.zip', webDir);

          case 6:
            (0, _utils_deploy.successLog)('  zip包解压成功');

            if (!onlineScript) {
              _context6.next = 11;
              break;
            }

            _context6.next = 10;
            return runCommand(onlineScript, webDir);

          case 10:
            (0, _utils_deploy.successLog)('  重启服务成功');

          case 11:
            _context6.next = 17;
            break;

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](0);
            (0, _utils_deploy.errorLog)("  zip\u5305\u89E3\u538B\u5931\u8D25 ".concat(_context6.t0));
            process.exit(1);

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 13]]);
  }));
  return _unzipFileAndReStart.apply(this, arguments);
}

function deleteLocalZip() {
  return _deleteLocalZip.apply(this, arguments);
}

function _deleteLocalZip() {
  _deleteLocalZip = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", new Promise(function (resolve, reject) {
              console.log('（6）开始删除本地zip包');

              _fs.default.unlink("".concat(process.cwd(), "/dist.zip"), function (err) {
                if (err) {
                  (0, _utils_deploy.errorLog)("  \u672C\u5730zip\u5305\u5220\u9664\u5931\u8D25 ".concat(err), err);
                  reject(err);
                  process.exit(1);
                }

                (0, _utils_deploy.successLog)('  本地zip包删除成功\n');
                resolve();
              });
            }));

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _deleteLocalZip.apply(this, arguments);
}

function handleDeploy() {
  return _handleDeploy.apply(this, arguments);
}

function _handleDeploy() {
  _handleDeploy = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
    var deployConfigs, choices;
    return _regenerator.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _utils_deploy.checkDeployConfig)(deployConfigPath);

          case 2:
            deployConfigs = _context8.sent;

            if (!deployConfigs) {
              process.exit(1);
            }

            choices = deployConfigs.map(function (config) {
              var name = config.name;
              return name;
            });

            _inquirer.default.prompt([{
              type: 'list',
              message: "\u5C06".concat((0, _utils_deploy.underlineLog)(deployConfigs[0].projectName), "\u9879\u76EE\u662F\u5426\u90E8\u7F72\u5230\u4EC0\u4E48\u73AF\u5883 \uFF1F"),
              name: 'env',
              choices: choices,
              filter: function filter(val) {
                // 使用filter将回答变为小写
                return val.toLowerCase();
              }
            }]).then(function (answers) {
              var env = answers.env;

              if (!env) {
                process.exit(1);
              }

              var targetObj = deployConfigs.find(function (item) {
                return item.name === env;
              });

              if (targetObj) {
                runDeploy(targetObj);
              }
            });

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _handleDeploy.apply(this, arguments);
}