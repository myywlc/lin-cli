"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.join");

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

var _downloadGitRepo = _interopRequireDefault(require("download-git-repo"));

var _child_process = _interopRequireDefault(require("child_process"));

var _commander = _interopRequireDefault(require("commander"));

var _utils_deploy = require("../utils/utils_deploy");

var deployPath = _path.default.join(process.cwd(), './deploy');

var deployConfigPath = "".concat(deployPath, "/deploy.config.js");
var projectDir = process.cwd();
var deployGit = 'dadaiwei/fe-deploy-cli-template';
var tmp = 'deploy';
var ssh = new _nodeSsh.default(); // 生成ssh实例

var name = 'deploy';
exports.name = name;
var cmd = {
  description: 'deploy package',
  usages: ['lin deploy init', 'lin deploy this']
};
exports.cmd = cmd;

var handle = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(key, value) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = key;
            _context.next = _context.t0 === 'init' ? 3 : _context.t0 === 'this' ? 5 : 7;
            break;

          case 3:
            checkDeployExists();
            return _context.abrupt("break", 8);

          case 5:
            handleDeploy();
            return _context.abrupt("break", 8);

          case 7:
            return _context.abrupt("break", 8);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handle(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // ===================== init =========================
// 检查部署目录及部署配置文件是否存在


exports.handle = handle;

var checkDeployExists = function checkDeployExists() {
  if (_fs.default.existsSync(deployPath) && _fs.default.existsSync(deployConfigPath)) {
    (0, _utils_deploy.infoLog)('deploy目录下的deploy.config.js配置文件已经存在，请勿重新下载');
    process.exit(1);
    return;
  }

  downloadAndGenerate(deployGit);
}; // 下载部署脚本配置


var downloadAndGenerate = function downloadAndGenerate(templateUrl) {
  var spinner = (0, _ora.default)('开始生成部署模板');
  spinner.start();
  (0, _downloadGitRepo.default)(templateUrl, tmp, {
    clone: false
  }, function (err) {
    if (err) {
      console.log();
      (0, _utils_deploy.errorLog)(err);
      process.exit(1);
    }

    spinner.stop();
    (0, _utils_deploy.successLog)('模板下载成功，模板位置：deploy/deploy.config.js');
    (0, _utils_deploy.infoLog)('请配置deploy目录下的deploy.config.js配置文件');
    console.log('注意：请删除不必要的环境配置（如只需线上环境，请删除dev测试环境配置）');
    process.exit(0);
  });
}; // ===================== deploy =========================
// 部署流程入口


function runDeploy(_x3) {
  return _runDeploy.apply(this, arguments);
} // 第一步，执行打包脚本


function _runDeploy() {
  _runDeploy = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(config) {
    var script, webDir, distPath, projectName, name;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            script = config.script, webDir = config.webDir, distPath = config.distPath, projectName = config.projectName, name = config.name;
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
            return unzipFile(webDir);

          case 11:
            _context2.next = 13;
            return deleteLocalZip();

          case 13:
            (0, _utils_deploy.successLog)("\n \u606D\u559C\u60A8\uFF0C".concat((0, _utils_deploy.underlineLog)(projectName), "\u9879\u76EE").concat((0, _utils_deploy.underlineLog)(name), "\u90E8\u7F72\u6210\u529F\u4E86^_^\n"));
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
    console.log();

    _child_process.default.execSync(script, {
      cwd: projectDir
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
    distPath = _path.default.resolve(projectDir, distPath);
    console.log('（2）打包成zip');
    var archive = (0, _archiver.default)('zip', {
      zlib: {
        level: 9
      }
    }).on('error', function (err) {
      throw err;
    });

    var output = _fs.default.createWriteStream("".concat(projectDir, "/dist.zip"));

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
    archive.directory(distPath, '/');
    archive.finalize();
  });
} // 第三步，连接SSH


function connectSSH(_x4) {
  return _connectSSH.apply(this, arguments);
} // 第四部，上传zip包


function _connectSSH() {
  _connectSSH = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(config) {
    var host, port, username, password, privateKey, passphrase, distPath, sshConfig;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            host = config.host, port = config.port, username = config.username, password = config.password, privateKey = config.privateKey, passphrase = config.passphrase, distPath = config.distPath;
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

function uploadFile(_x5) {
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
            return ssh.putFile("".concat(projectDir, "/dist.zip"), "".concat(webDir, "/dist.zip"));

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

function runCommand(_x6, _x7) {
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

function unzipFile(_x8) {
  return _unzipFile.apply(this, arguments);
} // 第六步，删除本地dist.zip包


function _unzipFile() {
  _unzipFile = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(webDir) {
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
            _context6.next = 13;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](0);
            (0, _utils_deploy.errorLog)("  zip\u5305\u89E3\u538B\u5931\u8D25 ".concat(_context6.t0));
            process.exit(1);

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 9]]);
  }));
  return _unzipFile.apply(this, arguments);
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

              _fs.default.unlink("".concat(projectDir, "/dist.zip"), function (err) {
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
  // 检测部署配置是否合理
  var deployConfigs = (0, _utils_deploy.checkDeployConfig)(deployConfigPath);

  if (!deployConfigs) {
    process.exit(1);
  } // 注册部署命令


  deployConfigs.forEach(function (config) {
    var command = config.command,
        projectName = config.projectName,
        name = config.name;

    _commander.default.command("".concat(command)).description("".concat((0, _utils_deploy.underlineLog)(projectName), "\u9879\u76EE").concat((0, _utils_deploy.underlineLog)(name), "\u90E8\u7F72")).action(function () {
      _inquirer.default.prompt([{
        type: 'confirm',
        message: "".concat((0, _utils_deploy.underlineLog)(projectName), "\u9879\u76EE\u662F\u5426\u90E8\u7F72\u5230").concat((0, _utils_deploy.underlineLog)(name), "\uFF1F"),
        name: 'sure'
      }]).then(function (answers) {
        var sure = answers.sure;

        if (!sure) {
          process.exit(1);
        }

        if (sure) {
          runDeploy(config);
        }
      });
    });
  });
}