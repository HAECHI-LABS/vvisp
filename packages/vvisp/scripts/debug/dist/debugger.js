(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define('Debugger', [], factory);
  else if (typeof exports === 'object') exports['Debugger'] = factory();
  else root['Debugger'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {}
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          /******/ configurable: false,
          /******/ enumerable: true,
          /******/ get: getter
          /******/
        });
        /******/
      }
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default'];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, 'a', getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 37));
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
      /***/ function(module, exports) {
        module.exports = require('debug');

        /***/
      },
      /* 1 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        exports.isDeliberatelySkippedNodeType = isDeliberatelySkippedNodeType;
        exports.isSkippedNodeType = isSkippedNodeType;
        exports.prefixName = prefixName;
        exports.extractPrimarySource = extractPrimarySource;
        exports.keccak256 = keccak256;
        exports.stableKeccak256 = stableKeccak256;
        exports.makeAssignment = makeAssignment;
        exports.isCallMnemonic = isCallMnemonic;
        exports.isShortCallMnemonic = isShortCallMnemonic;
        exports.isDelegateCallMnemonicBroad = isDelegateCallMnemonicBroad;
        exports.isDelegateCallMnemonicStrict = isDelegateCallMnemonicStrict;
        exports.isStaticCallMnemonic = isStaticCallMnemonic;
        exports.isCreateMnemonic = isCreateMnemonic;
        exports.isNormalHaltingMnemonic = isNormalHaltingMnemonic;

        var _truffleDecodeUtils = __webpack_require__(4);

        var utils = _interopRequireWildcard(_truffleDecodeUtils);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const stringify = __webpack_require__(47);

        /** AST node types that are skipped by stepNext() to filter out some noise */
        function isDeliberatelySkippedNodeType(node) {
          const skippedTypes = ['ContractDefinition', 'VariableDeclaration'];
          return skippedTypes.includes(node.nodeType);
        }

        //HACK
        //these aren't the only types of skipped nodes, but determining all skipped
        //nodes would be too difficult
        function isSkippedNodeType(node) {
          const otherSkippedTypes = ['VariableDeclarationStatement', 'Mapping'];
          return (
            isDeliberatelySkippedNodeType(node) ||
            otherSkippedTypes.includes(node.nodeType) ||
            node.nodeType.includes('TypeName') || //HACK
            //skip string literals too -- we'll handle that manually
            (node.typeDescriptions !== undefined && //seems this sometimes happens?
              utils.Definition.typeClass(node) === 'stringliteral')
          );
        }

        function prefixName(prefix, fn) {
          Object.defineProperty(fn, 'name', {
            value: `${prefix}.${fn.name}`,
            configurable: true
          });

          return fn;
        }

        /*
         * extract the primary source from a source map
         * (i.e., the source for the first instruction, found
         * between the second and third colons)
         * (this is something of a HACK)
         */
        function extractPrimarySource(sourceMap) {
          return parseInt(sourceMap.match(/^[^:]+:[^:]+:([^:]+):/)[1]);
        }

        /**
         * @return 0x-prefix string of keccak256 hash
         */
        function keccak256(...args) {
          return utils.Conversion.toHexString(utils.EVM.keccak256(...args));
        }

        /**
         * Given an object, return a stable hash by first running it through a stable
         * stringify operation before hashing
         */
        function stableKeccak256(obj) {
          return keccak256({ type: 'string', value: stringify(obj) });
        }

        /*
         * used by data; takes an id object and a ref (pointer) and returns a full
         * corresponding assignment object
         */
        function makeAssignment(idObj, ref) {
          let id = stableKeccak256(idObj);
          return (0, _extends3.default)({}, idObj, { id, ref });
        }

        /*
         * Given a mmemonic, determine whether it's the mnemonic of a calling
         * instruction (does NOT include creation instructions)
         */
        function isCallMnemonic(op) {
          const calls = ['CALL', 'DELEGATECALL', 'STATICCALL', 'CALLCODE'];
          return calls.includes(op);
        }

        /*
         * returns true for mnemonics for calls that take only 6 args instead of 7
         */
        function isShortCallMnemonic(op) {
          const shortCalls = ['DELEGATECALL', 'STATICCALL'];
          return shortCalls.includes(op);
        }

        /*
         * returns true for mnemonics for calls that delegate storage
         */
        function isDelegateCallMnemonicBroad(op) {
          const delegateCalls = ['DELEGATECALL', 'CALLCODE'];
          return delegateCalls.includes(op);
        }

        /*
         * returns true for mnemonics for calls that delegate everything
         */
        function isDelegateCallMnemonicStrict(op) {
          const delegateCalls = ['DELEGATECALL'];
          return delegateCalls.includes(op);
        }

        /*
         * returns true for mnemonics for static calls
         */
        function isStaticCallMnemonic(op) {
          const delegateCalls = ['STATICCALL'];
          return delegateCalls.includes(op);
        }

        /*
         * Given a mmemonic, determine whether it's the mnemonic of a creation
         * instruction
         */
        function isCreateMnemonic(op) {
          const creates = ['CREATE', 'CREATE2'];
          return creates.includes(op);
        }

        /*
         * Given a mmemonic, determine whether it's the mnemonic of a normal
         * halting instruction
         */
        function isNormalHaltingMnemonic(op) {
          const halts = ['STOP', 'RETURN', 'SELFDESTRUCT', 'SUICIDE'];
          //the mnemonic SUICIDE is no longer used, but just in case, I'm including it
          return halts.includes(op);
        }

        /***/
      },
      /* 2 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/helpers/extends');

        /***/
      },
      /* 3 */
      /***/ function(module, exports) {
        module.exports = require('reselect-tree');

        /***/
      },
      /* 4 */
      /***/ function(module, exports) {
        module.exports = require('truffle-decode-utils');

        /***/
      },
      /* 5 */
      /***/ function(module, exports) {
        module.exports = require('redux-saga/effects');

        /***/
      },
      /* 6 */
      /***/ function(module, exports) {
        module.exports = require('redux');

        /***/
      },
      /* 7 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/core-js/object/entries');

        /***/
      },
      /* 8 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/core-js/object/assign');

        /***/
      },
      /* 9 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        var _assign = __webpack_require__(8);

        var _assign2 = _interopRequireDefault(_assign);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _reselectTree = __webpack_require__(3);

        var _bn = __webpack_require__(15);

        var _bn2 = _interopRequireDefault(_bn);

        var _selectors = __webpack_require__(10);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _truffleDecodeUtils = __webpack_require__(4);

        var DecodeUtils = _interopRequireWildcard(_truffleDecodeUtils);

        var _helpers = __webpack_require__(1);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:evm:selectors'); // eslint-disable-line no-unused-vars

        /**
         * create EVM-level selectors for a given trace step selector
         * may specify additional selectors to include
         */
        function createStepSelectors(step, state = null) {
          let base = {
            /**
             * .trace
             *
             * trace step info related to operation
             */
            trace: (0, _reselectTree.createLeaf)([step], step => {
              if (!step) {
                return null;
              }
              let { gasCost, op, pc } = step;
              return { gasCost, op, pc };
            }),

            /**
             * .programCounter
             */
            programCounter: (0, _reselectTree.createLeaf)(['./trace'], step =>
              step ? step.pc : null
            ),

            /**
             * .isJump
             */
            isJump: (0, _reselectTree.createLeaf)(
              ['./trace'],
              step => step.op != 'JUMPDEST' && step.op.indexOf('JUMP') == 0
            ),

            /**
             * .isCall
             *
             * whether the opcode will switch to another calling context
             */
            isCall: (0, _reselectTree.createLeaf)(['./trace'], step =>
              (0, _helpers.isCallMnemonic)(step.op)
            ),

            /**
             * .isShortCall
             *
             * for calls that only take 6 arguments instead of 7
             */
            isShortCall: (0, _reselectTree.createLeaf)(['./trace'], step =>
              (0, _helpers.isShortCallMnemonic)(step.op)
            ),

            /**
             * .isDelegateCallBroad
             *
             * for calls that delegate storage
             */
            isDelegateCallBroad: (0, _reselectTree.createLeaf)(
              ['./trace'],
              step => (0, _helpers.isDelegateCallMnemonicBroad)(step.op)
            ),

            /**
             * .isDelegateCallStrict
             *
             * for calls that additionally delegate sender and value
             */
            isDelegateCallStrict: (0, _reselectTree.createLeaf)(
              ['./trace'],
              step => (0, _helpers.isDelegateCallMnemonicStrict)(step.op)
            ),

            /**
             * .isStaticCall
             */
            isStaticCall: (0, _reselectTree.createLeaf)(['./trace'], step =>
              (0, _helpers.isStaticCallMnemonic)(step.op)
            ),

            /**
             * .isCreate
             */
            isCreate: (0, _reselectTree.createLeaf)(['./trace'], step =>
              (0, _helpers.isCreateMnemonic)(step.op)
            ),

            /**
             * .isHalting
             *
             * whether the instruction halts or returns from a calling context
             * (covers only ordinary halds, not exceptional halts)
             */
            isHalting: (0, _reselectTree.createLeaf)(['./trace'], step =>
              (0, _helpers.isNormalHaltingMnemonic)(step.op)
            ),

            /*
             * .isStore
             */
            isStore: (0, _reselectTree.createLeaf)(
              ['./trace'],
              step => step.op == 'SSTORE'
            ),

            /*
             * .isLoad
             */
            isLoad: (0, _reselectTree.createLeaf)(
              ['./trace'],
              step => step.op == 'SLOAD'
            ),

            /*
             * .touchesStorage
             *
             * whether the instruction involves storage
             */
            touchesStorage: (0, _reselectTree.createLeaf)(
              ['./isStore', 'isLoad'],
              (stores, loads) => stores || loads
            )
          };

          if (state) {
            const isRelative = path =>
              typeof path == 'string' &&
              (path.startsWith('./') || path.startsWith('../'));

            if (isRelative(state)) {
              state = `../${state}`;
            }

            (0, _assign2.default)(base, {
              /**
               * .callAddress
               *
               * address transferred to by call operation
               */
              callAddress: (0, _reselectTree.createLeaf)(
                ['./isCall', state],
                (matches, { stack }) => {
                  if (!matches) {
                    return null;
                  }

                  let address = stack[stack.length - 2];
                  return DecodeUtils.Conversion.toAddress(address);
                }
              ),

              /**
               * .createBinary
               *
               * binary code to execute via create operation
               */
              createBinary: (0, _reselectTree.createLeaf)(
                ['./isCreate', state],
                (matches, { stack, memory }) => {
                  if (!matches) {
                    return null;
                  }

                  // Get the code that's going to be created from memory.
                  // Note we multiply by 2 because these offsets are in bytes.
                  const offset = parseInt(stack[stack.length - 2], 16) * 2;
                  const length = parseInt(stack[stack.length - 3], 16) * 2;

                  return (
                    '0x' + memory.join('').substring(offset, offset + length)
                  );
                }
              ),

              /**
               * .callData
               *
               * data passed to EVM call
               */
              callData: (0, _reselectTree.createLeaf)(
                ['./isCall', './isShortCall', state],
                (matches, short, { stack, memory }) => {
                  if (!matches) {
                    return null;
                  }

                  //if it's 6-argument call, the data start and offset will be one spot
                  //higher in the stack than they would be for a 7-argument call, so
                  //let's introduce an offset to handle this
                  let argOffset = short ? 1 : 0;

                  // Get the data from memory.
                  // Note we multiply by 2 because these offsets are in bytes.
                  const offset =
                    parseInt(stack[stack.length - 4 + argOffset], 16) * 2;
                  const length =
                    parseInt(stack[stack.length - 5 + argOffset], 16) * 2;

                  return (
                    '0x' + memory.join('').substring(offset, offset + length)
                  );
                }
              ),

              /**
               * .callValue
               *
               * value for the call (not create); returns null for DELEGATECALL
               */
              callValue: (0, _reselectTree.createLeaf)(
                ['./isCall', './isDelegateCallStrict', './isStaticCall', state],
                (calls, delegates, isStatic, { stack }) => {
                  if (!calls || delegates) {
                    return null;
                  }

                  if (isStatic) {
                    return new _bn2.default(0);
                  }

                  //otherwise, for CALL and CALLCODE, it's the 3rd argument
                  let value = stack[stack.length - 3];
                  return DecodeUtils.Conversion.toBN(value);
                }
              ),

              /**
               * .createValue
               *
               * value for the create
               */
              createValue: (0, _reselectTree.createLeaf)(
                ['./isCreate', state],
                (matches, { stack }) => {
                  if (!matches) {
                    return null;
                  }

                  //creates have the value as the first argument
                  let value = stack[stack.length - 1];
                  return DecodeUtils.Conversion.toBN(value);
                }
              ),

              /**
               * .storageAffected
               *
               * storage slot being stored to or loaded from
               * we do NOT prepend "0x"
               */
              storageAffected: (0, _reselectTree.createLeaf)(
                ['./touchesStorage', state],
                (matches, { stack }) => {
                  if (!matches) {
                    return null;
                  }

                  return stack[stack.length - 1];
                }
              )
            });
          }

          return base;
        }

        const evm = (0, _reselectTree.createSelectorTree)({
          /**
           * evm.state
           */
          state: state => state.evm,

          /**
           * evm.info
           */
          info: {
            /**
             * evm.info.contexts
             */
            contexts: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.info.contexts.byContext
            ),

            /**
             * evm.info.binaries
             */
            binaries: {
              /**
               * evm.info.binaries.search
               *
               * returns function (binary) => context (returns the *ID* of the context)
               * (returns null on no match)
               */
              search: (0, _reselectTree.createLeaf)(
                ['/info/contexts'],
                contexts => binary =>
                  DecodeUtils.Contexts.findDebuggerContext(contexts, binary)
              )
            }
          },

          /**
           * evm.transaction
           */
          transaction: {
            /**
             * evm.transaction.instances
             */
            instances: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.transaction.instances.byAddress
            ),

            /*
             * evm.transaction.globals
             */
            globals: {
              /*
               * evm.transaction.globals.tx
               */
              tx: (0, _reselectTree.createLeaf)(
                ['/state'],
                state => state.transaction.globals.tx
              ),
              /*
               * evm.transaction.globals.block
               */
              block: (0, _reselectTree.createLeaf)(
                ['/state'],
                state => state.transaction.globals.block
              )
            }
          },

          /**
           * evm.current
           */
          current: {
            /**
             * evm.current.callstack
             */
            callstack: state => state.evm.proc.callstack,

            /**
             * evm.current.call
             */
            call: (0, _reselectTree.createLeaf)(['./callstack'], stack =>
              stack.length ? stack[stack.length - 1] : {}
            ),

            /**
             * evm.current.context
             */
            context: (0, _reselectTree.createLeaf)(
              [
                './call',
                '/transaction/instances',
                '/info/binaries/search',
                '/info/contexts'
              ],
              ({ address, binary }, instances, search, contexts) => {
                let contextId;
                if (address) {
                  //if we're in a call to a deployed contract, we *must* have recorded
                  //it in the instance table, so we just need to look up the context ID
                  //from there; we don't need to do any further searching
                  contextId = instances[address].context;
                  binary = instances[address].binary;
                } else if (binary) {
                  //otherwise, if we're in a constructor, we'll need to actually do a
                  //search
                  contextId = search(binary);
                } else {
                  //exceptional case: no transaction is loaded
                  return null;
                }

                let context = contexts[contextId];

                return (0, _extends3.default)({}, context, {
                  binary
                });
              }
            ),

            /**
             * evm.current.state
             *
             * evm state info: as of last operation, before op defined in step
             */
            state: (0, _assign2.default)(
              {},
              ...['depth', 'error', 'gas', 'memory', 'stack', 'storage'].map(
                param => ({
                  [param]: (0, _reselectTree.createLeaf)(
                    [_selectors2.default.step],
                    step => step[param]
                  )
                })
              )
            ),

            /**
             * evm.current.step
             */
            step: (0, _extends3.default)(
              {},
              createStepSelectors(_selectors2.default.step, './state'),
              {
                //the following step selectors only exist for current, not next or any
                //other step

                /*
                 * evm.current.step.createdAddress
                 *
                 * address created by the current create step
                 */
                createdAddress: (0, _reselectTree.createLeaf)(
                  ['./isCreate', '/nextOfSameDepth/state/stack'],
                  (matches, stack) => {
                    if (!matches) {
                      return null;
                    }
                    let address = stack[stack.length - 1];
                    return DecodeUtils.Conversion.toAddress(address);
                  }
                ),

                /**
                 * evm.current.step.callsPrecompileOrExternal
                 *
                 * are we calling a precompiled contract or an externally-owned account,
                 * rather than a contract account that isn't precompiled?
                 */
                callsPrecompileOrExternal: (0, _reselectTree.createLeaf)(
                  ['./isCall', '/current/state/depth', '/next/state/depth'],
                  (calls, currentDepth, nextDepth) =>
                    calls && currentDepth === nextDepth
                ),

                /**
                 * evm.current.step.isContextChange
                 * groups together calls, creates, halts, and exceptional halts
                 */
                isContextChange: (0, _reselectTree.createLeaf)(
                  ['/current/state/depth', '/next/state/depth'],
                  (currentDepth, nextDepth) => currentDepth !== nextDepth
                ),

                /**
                 * evm.current.step.isExceptionalHalting
                 *
                 */
                isExceptionalHalting: (0, _reselectTree.createLeaf)(
                  ['./isHalting', '/current/state/depth', '/next/state/depth'],
                  (halting, currentDepth, nextDepth) =>
                    nextDepth < currentDepth && !halting
                )
              }
            ),

            /**
             * evm.current.codex (namespace)
             */
            codex: {
              /**
               * evm.current.codex (selector)
               * the whole codex! not that that's very much at the moment
               */
              _: (0, _reselectTree.createLeaf)(
                ['/state'],
                state => state.proc.codex
              ),

              /**
               * evm.current.codex.storage
               * the current storage, as fetched from the codex... unless we're in a
               * failed creation call, then we just fall back on the state (which will
               * work, since nothing else can interfere with the storage of a failed
               * creation call!)
               */
              storage: (0, _reselectTree.createLeaf)(
                ['./_', '../state/storage', '../call'],
                (codex, rawStorage, { storageAddress }) =>
                  storageAddress === DecodeUtils.EVM.ZERO_ADDRESS
                    ? rawStorage //HACK -- if zero address ignore the codex
                    : codex[codex.length - 1].accounts[storageAddress].storage
              )
            }
          },

          /**
           * evm.next
           */
          next: {
            /**
             * evm.next.state
             *
             * evm state as a result of next step operation
             */
            state: (0, _assign2.default)(
              {},
              ...['depth', 'error', 'gas', 'memory', 'stack', 'storage'].map(
                param => ({
                  [param]: (0, _reselectTree.createLeaf)(
                    [_selectors2.default.next],
                    step => step[param]
                  )
                })
              )
            ),

            /*
             * evm.next.step
             */
            step: createStepSelectors(_selectors2.default.next, './state')
          },

          /**
           * evm.nextOfSameDepth
           */
          nextOfSameDepth: {
            /**
             * evm.nextOfSameDepth.state
             *
             * evm state at the next step of same depth
             */
            state: (0, _assign2.default)(
              {},
              ...['depth', 'error', 'gas', 'memory', 'stack', 'storage'].map(
                param => ({
                  [param]: (0, _reselectTree.createLeaf)(
                    [_selectors2.default.nextOfSameDepth],
                    step => step[param]
                  )
                })
              )
            )
          }
        });

        exports.default = evm;

        /***/
      },
      /* 10 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _reselectTree = __webpack_require__(3);

        const PAST_END_OF_TRACE = {
          depth: -1, //this is the part that matters!
          //the rest of this is just to look like a trace step
          error: '',
          gas: 0,
          memory: [],
          stack: [],
          storage: {},
          gasCost: 0,
          op: 'STOP',
          pc: -1 //this is not at all valid but that's fine
        };

        let trace = (0, _reselectTree.createSelectorTree)({
          /**
           * trace.index
           *
           * current step index
           */
          index: state => state.trace.proc.index,

          /*
           * trace.loaded
           * is a trace loaded?
           */
          loaded: (0, _reselectTree.createLeaf)(
            ['/steps'],
            steps => steps !== null
          ),

          /**
           * trace.finished
           * is the trace finished?
           */
          finished: state => state.trace.proc.finished,

          /**
           * trace.finishedOrUnloaded
           *
           * is the trace finished, including if it's unloaded?
           */
          finishedOrUnloaded: (0, _reselectTree.createLeaf)(
            ['/finished', '/loaded'],
            (finished, loaded) => finished || !loaded
          ),

          /**
           * trace.steps
           *
           * all trace steps
           */
          steps: state => state.trace.transaction.steps,

          /**
           * trace.stepsRemaining
           *
           * number of steps remaining in trace
           */
          stepsRemaining: (0, _reselectTree.createLeaf)(
            ['./steps', './index'],
            (steps, index) => steps.length - index
          ),

          /**
           * trace.step
           *
           * current trace step
           */
          step: (0, _reselectTree.createLeaf)(
            ['./steps', './index'],
            (steps, index) => (steps ? steps[index] : null) //null if no tx loaded
          ),

          /**
           * trace.next
           *
           * next trace step
           * HACK: if at the end,
           * we will return a spoofed "past end" step
           */
          next: (0, _reselectTree.createLeaf)(
            ['./steps', './index'],
            (steps, index) =>
              index < steps.length - 1 ? steps[index + 1] : PAST_END_OF_TRACE
          ),

          /*
           * trace.nextOfSameDepth
           * next trace step that's at the same depth as this one
           * NOTE: if there is none, will return undefined
           * (should not be used in such cases)
           */
          nextOfSameDepth: (0, _reselectTree.createLeaf)(
            ['./steps', './index'],
            (steps, index) => {
              let depth = steps[index].depth;
              return steps.slice(index + 1).find(step => step.depth === depth);
            }
          )
        });

        exports.default = trace;

        /***/
      },
      /* 11 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _entries = __webpack_require__(7);

        var _entries2 = _interopRequireDefault(_entries);

        var _assign = __webpack_require__(8);

        var _assign2 = _interopRequireDefault(_assign);

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _reselectTree = __webpack_require__(3);

        var _truffleSolidityUtils = __webpack_require__(51);

        var _truffleSolidityUtils2 = _interopRequireDefault(
          _truffleSolidityUtils
        );

        var _truffleCodeUtils = __webpack_require__(52);

        var _truffleCodeUtils2 = _interopRequireDefault(_truffleCodeUtils);

        var _map = __webpack_require__(26);

        var _jsonPointer = __webpack_require__(22);

        var _jsonPointer2 = _interopRequireDefault(_jsonPointer);

        var _selectors = __webpack_require__(9);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _selectors3 = __webpack_require__(10);

        var _selectors4 = _interopRequireDefault(_selectors3);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:solidity:selectors');

        function getSourceRange(instruction = {}) {
          return {
            start: instruction.start || 0,
            length: instruction.length || 0,
            lines: instruction.range || {
              start: {
                line: 0,
                column: 0
              },
              end: {
                line: 0,
                column: 0
              }
            }
          };
        }

        //function to create selectors that need both a current and next version
        function createMultistepSelectors(stepSelector) {
          return {
            /**
             * .instruction
             */
            instruction: (0, _reselectTree.createLeaf)(
              [
                '/current/instructionAtProgramCounter',
                stepSelector.programCounter
              ],
              //HACK: we use solidity.current.instructionAtProgramCounter
              //even if we're looking at solidity.next.
              //This is harmless... so long as the current instruction isn't a context
              //change.  So, don't use solidity.next when it is.

              (map, pc) => map[pc] || {}
            ),

            /**
             * .source
             */
            source: (0, _reselectTree.createLeaf)(
              ['/info/sources', './instruction'],
              (sources, { file: id }) => sources[id] || {}
            ),

            /**
             * .sourceRange
             */
            sourceRange: (0, _reselectTree.createLeaf)(
              ['./instruction'],
              getSourceRange
            ),

            /**
             * .pointer
             */
            pointer: (0, _reselectTree.createLeaf)(
              ['./source', './sourceRange'],
              ({ ast }, range) =>
                (0, _map.findRange)(ast, range.start, range.length)
            ),

            /**
             * .node
             */
            node: (0, _reselectTree.createLeaf)(
              ['./source', './pointer'],
              ({ ast }, pointer) =>
                pointer
                  ? _jsonPointer2.default.get(ast, pointer)
                  : _jsonPointer2.default.get(ast, '')
            )
          };
        }

        let solidity = (0, _reselectTree.createSelectorTree)({
          /**
           * solidity.state
           */
          state: state => state.solidity,

          /**
           * solidity.info
           */
          info: {
            /**
             * solidity.info.sources
             */
            sources: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.info.sources.byId
            )
          },

          /**
           * solidity.current
           */
          current: (0, _extends3.default)(
            {
              /**
               * solidity.current.sourceMap
               */
              sourceMap: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.context],
                context => (context ? context.sourceMap : null) //null when no tx loaded
              ),

              /**
               * solidity.current.functionDepthStack
               */
              functionDepthStack: state =>
                state.solidity.proc.functionDepthStack,

              /**
               * solidity.current.functionDepth
               */
              functionDepth: (0, _reselectTree.createLeaf)(
                ['./functionDepthStack'],
                stack => stack[stack.length - 1]
              ),

              /**
               * solidity.current.instructions
               */
              instructions: (0, _reselectTree.createLeaf)(
                [
                  '/info/sources',
                  _selectors2.default.current.context,
                  './sourceMap'
                ],
                (sources, context, sourceMap) => {
                  if (!context) {
                    return [];
                  }
                  let binary = context.binary;
                  if (!binary) {
                    return [];
                  }

                  let numInstructions;
                  if (sourceMap) {
                    numInstructions = sourceMap.split(';').length;
                  } else {
                    //HACK
                    numInstructions = (binary.length - 2) / 2;
                    //this is actually an overestimate, but that's OK
                  }

                  //because we might be dealing with a constructor with arguments, we do
                  //*not* remove metadata manually
                  let instructions = _truffleCodeUtils2.default.parseCode(
                    binary,
                    numInstructions
                  );

                  if (!sourceMap) {
                    // HACK
                    // Let's create a source map to use since none exists. This source
                    // map maps just as many ranges as there are instructions (or
                    // possibly more), and marks them all as being Solidity-internal and
                    // not jumps.
                    sourceMap =
                      binary !== '0x'
                        ? '0:0:-1:-'.concat(';'.repeat(instructions.length - 1))
                        : '';
                  }

                  var lineAndColumnMappings = (0, _assign2.default)(
                    {},
                    ...(0, _entries2.default)(sources).map(
                      ([id, { source }]) => ({
                        [id]: _truffleSolidityUtils2.default.getCharacterOffsetToLineAndColumnMapping(
                          source || ''
                        )
                      })
                    )
                  );
                  var humanReadableSourceMap = _truffleSolidityUtils2.default.getHumanReadableSourceMap(
                    sourceMap
                  );

                  let primaryFile = humanReadableSourceMap[0].file;
                  debug('primaryFile %o', primaryFile);

                  return instructions
                    .map((instruction, index) => {
                      // lookup source map by index and add `index` property to
                      // instruction
                      //

                      const sourceMap = humanReadableSourceMap[index] || {};

                      return {
                        instruction: (0, _extends3.default)({}, instruction, {
                          index
                        }),
                        sourceMap
                      };
                    })
                    .map(({ instruction, sourceMap }) => {
                      // add source map information to instruction, or defaults
                      //

                      const {
                        jump,
                        start = 0,
                        length = 0,
                        file = primaryFile
                      } = sourceMap;
                      const lineAndColumnMapping =
                        lineAndColumnMappings[file] || {};
                      const range = {
                        start: lineAndColumnMapping[start] || {
                          line: null,
                          column: null
                        },
                        end: lineAndColumnMapping[start + length] || {
                          line: null,
                          column: null
                        }
                      };

                      if (range.start.line === null) {
                        debug('sourceMap %o', sourceMap);
                      }

                      return (0, _extends3.default)({}, instruction, {
                        jump,
                        start,
                        length,
                        file,
                        range
                      });
                    });
                }
              ),

              /**
               * solidity.current.instructionAtProgramCounter
               */
              instructionAtProgramCounter: (0, _reselectTree.createLeaf)(
                ['./instructions'],
                instructions =>
                  (0, _assign2.default)(
                    {},
                    ...instructions.map(instruction => ({
                      [instruction.pc]: instruction
                    }))
                  )
              )
            },
            createMultistepSelectors(_selectors2.default.current.step),
            {
              /**
               * solidity.current.isSourceRangeFinal
               */
              isSourceRangeFinal: (0, _reselectTree.createLeaf)(
                [
                  './instructionAtProgramCounter',
                  _selectors2.default.current.step.programCounter,
                  _selectors2.default.next.step.programCounter
                ],
                (map, current, next) => {
                  if (!map[next]) {
                    return true;
                  }

                  current = map[current];
                  next = map[next];

                  return (
                    current.start != next.start ||
                    current.length != next.length ||
                    current.file != next.file
                  );
                }
              ),

              /*
               * solidity.current.functionsByProgramCounter
               */
              functionsByProgramCounter: (0, _reselectTree.createLeaf)(
                ['./instructions', '/info/sources'],
                (instructions, sources) =>
                  (0, _assign2.default)(
                    {},
                    ...instructions
                      .filter(instruction => instruction.name === 'JUMPDEST')
                      .filter(instruction => instruction.file !== -1)
                      //note that the designated invalid function *does* have an associated
                      //file, so it *is* safe to just filter out the ones that don't
                      .map(instruction => {
                        debug('instruction %O', instruction);
                        let source = instruction.file;
                        debug('source %O', sources[source]);
                        let ast = sources[source].ast;
                        let range = getSourceRange(instruction);
                        let pointer = (0, _map.findRange)(
                          ast,
                          range.start,
                          range.length
                        );
                        let node = pointer
                          ? _jsonPointer2.default.get(ast, pointer)
                          : _jsonPointer2.default.get(ast, '');
                        if (!node || node.nodeType !== 'FunctionDefinition') {
                          //filter out JUMPDESTs that aren't function definitions...
                          //except for the designated invalid function
                          let nextInstruction =
                            instructions[instruction.index + 1] || {};
                          if (nextInstruction.name === 'INVALID') {
                            //designated invalid, include it
                            return {
                              [instruction.pc]: {
                                isDesignatedInvalid: true
                              }
                            };
                          } else {
                            //not designated invalid, filter it out
                            return {};
                          }
                        }
                        //otherwise, we're good to go, so let's find the contract node and
                        //put it all together
                        //to get the contract node, we go up twice from the function node;
                        //the path from one to the other should have a very specific form,
                        //so this is easy
                        let contractPointer = pointer.replace(
                          /\/nodes\/\d+$/,
                          ''
                        );
                        let contractNode = _jsonPointer2.default.get(
                          ast,
                          contractPointer
                        );
                        return {
                          [instruction.pc]: {
                            source,
                            pointer,
                            node,
                            name: node.name,
                            id: node.id,
                            contractPointer,
                            contractNode,
                            contractName: contractNode.name,
                            contractId: contractNode.id,
                            contractKind: contractNode.contractKind,
                            isDesignatedInvalid: false
                          }
                        };
                      })
                  )
              ),

              /**
               * solidity.current.isMultiline
               */
              isMultiline: (0, _reselectTree.createLeaf)(
                ['./sourceRange'],
                ({ lines }) => lines.start.line != lines.end.line
              ),

              /**
               * solidity.current.willJump
               */
              willJump: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.step.isJump],
                isJump => isJump
              ),

              /**
               * solidity.current.jumpDirection
               */
              jumpDirection: (0, _reselectTree.createLeaf)(
                ['./instruction'],
                (i = {}) => i.jump || '-'
              ),

              /**
               * solidity.current.willCall
               */
              willCall: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.step.isCall],
                x => x
              ),

              /**
               * solidity.current.willCreate
               */
              willCreate: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.step.isCreate],
                x => x
              ),

              /**
               * solidity.current.callsPrecompileOrExternal
               */
              callsPrecompileOrExternal: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.step.callsPrecompileOrExternal],
                x => x
              ),

              /**
               * solidity.current.willReturn
               */
              willReturn: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.step.isHalting],
                isHalting => isHalting
              ),

              /**
               * solidity.current.willFail
               */
              willFail: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.step.isExceptionalHalting],
                x => x
              ),

              /*
               * solidity.current.nextMapped
               * returns the next trace step after this one which is sourcemapped
               * HACK: this assumes we're not about to change context! don't use this if
               * we are!
               * ALSO, this may return undefined, so be prepared for that
               */
              nextMapped: (0, _reselectTree.createLeaf)(
                [
                  './instructionAtProgramCounter',
                  _selectors4.default.steps,
                  _selectors4.default.index
                ],
                (map, steps, index) =>
                  steps
                    .slice(index + 1)
                    .find(({ pc }) => map[pc] && map[pc].file !== -1)
              )
            }
          ),

          /**
           * solidity.next
           * HACK WARNING: do not use these selectors when the current instruction is a
           * context change! (evm call or evm return)
           */
          next: createMultistepSelectors(_selectors2.default.next.step)
        });

        exports.default = solidity;

        /***/
      },
      /* 12 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.saveSteps = saveSteps;
        exports.next = next;
        exports.tick = tick;
        exports.tock = tock;
        exports.endTrace = endTrace;
        exports.reset = reset;
        exports.unloadTransaction = unloadTransaction;
        exports.backtick = backtick;
        const SAVE_STEPS = (exports.SAVE_STEPS = 'SAVE_STEPS');
        function saveSteps(steps) {
          return {
            type: SAVE_STEPS,
            steps
          };
        }

        const NEXT = (exports.NEXT = 'NEXT');
        function next() {
          return { type: NEXT };
        }

        const TICK = (exports.TICK = 'TICK');
        function tick() {
          return { type: TICK };
        }

        const TOCK = (exports.TOCK = 'TOCK');
        function tock() {
          return { type: TOCK };
        }

        const END_OF_TRACE = (exports.END_OF_TRACE = 'EOT');
        function endTrace() {
          return { type: END_OF_TRACE };
        }

        const RESET = (exports.RESET = 'TRACE_RESET');
        function reset() {
          return { type: RESET };
        }

        const UNLOAD_TRANSACTION = (exports.UNLOAD_TRANSACTION =
          'TRACE_UNLOAD_TRANSACTION');
        function unloadTransaction() {
          return { type: UNLOAD_TRANSACTION };
        }

        const BACKTICK = (exports.BACKTICK = 'BACKTICK');
        function backtick() {
          return { type: BACKTICK };
        }

        /***/
      },
      /* 13 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _set = __webpack_require__(23);

        var _set2 = _interopRequireDefault(_set);

        exports.advance = advance;
        exports.signalTickSagaCompletion = signalTickSagaCompletion;
        exports.processTrace = processTrace;
        exports.reset = reset;
        exports.unload = unload;
        exports.saga = saga;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _helpers = __webpack_require__(1);

        var _truffleDecodeUtils = __webpack_require__(4);

        var DecodeUtils = _interopRequireWildcard(_truffleDecodeUtils);

        var _actions = __webpack_require__(12);

        var actions = _interopRequireWildcard(_actions);

        var _selectors = __webpack_require__(10);

        var _selectors2 = _interopRequireDefault(_selectors);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:trace:sagas');

        function* advance() {
          yield (0, _effects.put)(actions.next());

          debug('TOCK to take');
          yield (0, _effects.take)([actions.TOCK, actions.END_OF_TRACE]);
          debug('TOCK taken');
        }

        const SUBMODULE_COUNT = 3; //data, evm, solidity

        function* next() {
          let remaining = yield (0, _effects.select)(
            _selectors2.default.stepsRemaining
          );
          debug('remaining: %o', remaining);
          let steps = yield (0, _effects.select)(_selectors2.default.steps);
          debug('total steps: %o', steps.length);
          let waitingForSubmodules = 0;

          if (remaining > 0) {
            debug('putting TICK');
            // updates state for current step
            waitingForSubmodules = SUBMODULE_COUNT;
            yield (0, _effects.put)(actions.tick());
            debug('put TICK');

            //wait for all backticks before continuing
            while (waitingForSubmodules > 0) {
              yield (0, _effects.take)(actions.BACKTICK);
              debug('got BACKTICK');
              waitingForSubmodules--;
            }

            remaining--; // local update, just for convenience
          }

          if (remaining) {
            debug('putting TOCK');
            // updates step to next step in trace
            yield (0, _effects.put)(actions.tock());
            debug('put TOCK');
          } else {
            debug('putting END_OF_TRACE');
            yield (0, _effects.put)(actions.endTrace());
            debug('put END_OF_TRACE');
          }
        }

        function* signalTickSagaCompletion() {
          yield (0, _effects.put)(actions.backtick());
        }

        function* processTrace(steps) {
          yield (0, _effects.put)(actions.saveSteps(steps));

          let addresses = [
            ...new _set2.default(
              steps
                .map(({ op, stack, depth }, index) => {
                  if ((0, _helpers.isCallMnemonic)(op)) {
                    //if it's a call, just fetch the address off the stack
                    return DecodeUtils.Conversion.toAddress(
                      stack[stack.length - 2]
                    );
                  } else if ((0, _helpers.isCreateMnemonic)(op)) {
                    //if it's a create, look ahead to when it returns and get the
                    //address off the stack
                    let returnStack = steps
                      .slice(index + 1)
                      .find(step => step.depth === depth).stack;
                    return DecodeUtils.Conversion.toAddress(
                      returnStack[returnStack.length - 1]
                    );
                  } else {
                    //if it's not a call or create, there's no address to get
                    return undefined;
                  }
                })
                //filter out zero addresses from failed creates (as well as undefineds)
                .filter(
                  address =>
                    address !== undefined &&
                    address !== DecodeUtils.EVM.ZERO_ADDRESS
                )
            )
          ];

          return addresses;
        }

        function* reset() {
          yield (0, _effects.put)(actions.reset());
        }

        function* unload() {
          yield (0, _effects.put)(actions.unloadTransaction());
        }

        function* saga() {
          yield (0, _effects.takeEvery)(actions.NEXT, next);
        }

        exports.default = (0, _helpers.prefixName)('trace', saga);

        /***/
      },
      /* 14 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.start = start;
        exports.loadTransaction = loadTransaction;
        exports.interrupt = interrupt;
        exports.unloadTransaction = unloadTransaction;
        exports.ready = ready;
        exports.wait = wait;
        exports.error = error;
        exports.clearError = clearError;
        exports.recordContracts = recordContracts;
        exports.saveTransaction = saveTransaction;
        exports.saveReceipt = saveReceipt;
        exports.saveBlock = saveBlock;
        const START = (exports.START = 'SESSION_START');
        function start(provider, txHash) {
          return {
            type: START,
            provider,
            txHash //OPTIONAL
          };
        }

        const LOAD_TRANSACTION = (exports.LOAD_TRANSACTION =
          'LOAD_TRANSACTION');
        function loadTransaction(txHash) {
          return {
            type: LOAD_TRANSACTION,
            txHash
          };
        }

        const INTERRUPT = (exports.INTERRUPT = 'SESSION_INTERRUPT');
        function interrupt() {
          return { type: INTERRUPT };
        }

        const UNLOAD_TRANSACTION = (exports.UNLOAD_TRANSACTION =
          'UNLOAD_TRANSACTION');
        function unloadTransaction() {
          return {
            type: UNLOAD_TRANSACTION
          };
        }

        const READY = (exports.READY = 'SESSION_READY');
        function ready() {
          return {
            type: READY
          };
        }

        const WAIT = (exports.WAIT = 'SESSION_WAIT');
        function wait() {
          return {
            type: WAIT
          };
        }

        const ERROR = (exports.ERROR = 'SESSION_ERROR');
        function error(error) {
          return {
            type: ERROR,
            error
          };
        }

        const CLEAR_ERROR = (exports.CLEAR_ERROR = 'CLEAR_ERROR');
        function clearError() {
          return {
            type: CLEAR_ERROR
          };
        }

        const RECORD_CONTRACTS = (exports.RECORD_CONTRACTS =
          'RECORD_CONTRACTS');
        function recordContracts(contexts, sources) {
          return {
            type: RECORD_CONTRACTS,
            contexts,
            sources
          };
        }

        const SAVE_TRANSACTION = (exports.SAVE_TRANSACTION =
          'SAVE_TRANSACTION');
        function saveTransaction(transaction) {
          return {
            type: SAVE_TRANSACTION,
            transaction
          };
        }

        const SAVE_RECEIPT = (exports.SAVE_RECEIPT = 'SAVE_RECEIPT');
        function saveReceipt(receipt) {
          return {
            type: SAVE_RECEIPT,
            receipt
          };
        }

        const SAVE_BLOCK = (exports.SAVE_BLOCK = 'SAVE_BLOCK');
        function saveBlock(block) {
          return {
            type: SAVE_BLOCK,
            block
          };
        }

        /***/
      },
      /* 15 */
      /***/ function(module, exports) {
        module.exports = require('bn.js');

        /***/
      },
      /* 16 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/core-js/object/keys');

        /***/
      },
      /* 17 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        exports.scope = scope;
        exports.declare = declare;
        exports.defineType = defineType;
        exports.decode = decode;
        exports.reset = reset;
        exports.recordAllocations = recordAllocations;
        exports.saga = saga;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _helpers = __webpack_require__(1);

        var _actions = __webpack_require__(12);

        var _actions2 = __webpack_require__(28);

        var actions = _interopRequireWildcard(_actions2);

        var _sagas = __webpack_require__(13);

        var trace = _interopRequireWildcard(_sagas);

        var _sagas2 = __webpack_require__(24);

        var evm = _interopRequireWildcard(_sagas2);

        var _sagas3 = __webpack_require__(30);

        var web3 = _interopRequireWildcard(_sagas3);

        var _selectors = __webpack_require__(21);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _lodash = __webpack_require__(58);

        var _lodash2 = _interopRequireDefault(_lodash);

        var _truffleDecodeUtils = __webpack_require__(4);

        var DecodeUtils = _interopRequireWildcard(_truffleDecodeUtils);

        var _truffleDecoder = __webpack_require__(32);

        var _bn = __webpack_require__(15);

        var _bn2 = _interopRequireDefault(_bn);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:data:sagas');

        function* scope(nodeId, pointer, parentId, sourceId) {
          yield (0, _effects.put)(
            actions.scope(nodeId, pointer, parentId, sourceId)
          );
        }

        function* declare(node) {
          yield (0, _effects.put)(actions.declare(node));
        }

        function* defineType(node) {
          yield (0, _effects.put)(actions.defineType(node));
        }

        function* tickSaga() {
          debug('got TICK');

          yield* variablesAndMappingsSaga();
          debug('about to SUBTOCK');
          yield* trace.signalTickSagaCompletion();
        }

        function* decode(definition, ref) {
          let referenceDeclarations = yield (0, _effects.select)(
            _selectors2.default.views.referenceDeclarations
          );
          let state = yield (0, _effects.select)(
            _selectors2.default.current.state
          );
          let mappingKeys = yield (0, _effects.select)(
            _selectors2.default.views.mappingKeys
          );
          let allocations = yield (0, _effects.select)(
            _selectors2.default.info.allocations
          );
          let instances = yield (0, _effects.select)(
            _selectors2.default.views.instances
          );
          let contexts = yield (0, _effects.select)(
            _selectors2.default.views.contexts
          );
          let currentContext = yield (0, _effects.select)(
            _selectors2.default.current.context
          );
          let internalFunctionsTable = yield (0, _effects.select)(
            _selectors2.default.current.functionsByProgramCounter
          );
          let blockNumber = yield (0, _effects.select)(
            _selectors2.default.views.blockNumber
          );

          let ZERO_WORD = new Uint8Array(DecodeUtils.EVM.WORD_SIZE);
          ZERO_WORD.fill(0);
          let NO_CODE = new Uint8Array(); //empty array

          let decoder = (0, _truffleDecoder.forEvmState)(definition, ref, {
            referenceDeclarations,
            state,
            mappingKeys,
            storageAllocations: allocations.storage,
            memoryAllocations: allocations.memory,
            calldataAllocations: allocations.calldata,
            contexts,
            currentContext,
            internalFunctionsTable
          });

          let result = decoder.next();
          while (!result.done) {
            let request = result.value;
            let response;
            switch (request.type) {
              case 'storage':
                //the debugger supplies all storage it knows at the beginning.
                //any storage it does not know is presumed to be zero.
                response = ZERO_WORD;
                break;
              case 'code':
                let address = request.address;
                if (address in instances) {
                  response = instances[address];
                } else if (address === DecodeUtils.EVM.ZERO_ADDRESS) {
                  //HACK: to avoid displaying the zero address to the user as an
                  //affected address just because they decoded a contract or external
                  //function variable that hadn't been initialized yet, we give the
                  //zero address's codelessness its own private cache :P
                  response = NO_CODE;
                } else {
                  //I don't want to write a new web3 saga, so let's just use
                  //obtainBinaries with a one-element array
                  debug('fetching binary');
                  let binary = (yield* web3.obtainBinaries(
                    [address],
                    blockNumber
                  ))[0];
                  debug('adding instance');
                  yield* evm.addInstance(address, binary);
                  response = DecodeUtils.Conversion.toBytes(binary);
                }
                break;
              default:
                debug('unrecognized request type!');
            }
            result = decoder.next(response);
          }
          //at this point, result.value holds the final value
          //note: we're still using the old decoder output format, so we need to clean
          //containers before returning something the debugger can use
          return DecodeUtils.Conversion.cleanContainers(result.value);
        }

        function* variablesAndMappingsSaga() {
          let node = yield (0, _effects.select)(
            _selectors2.default.current.node
          );
          let scopes = yield (0, _effects.select)(
            _selectors2.default.views.scopes.inlined
          );
          let referenceDeclarations = yield (0, _effects.select)(
            _selectors2.default.views.referenceDeclarations
          );
          let allocations = yield (0, _effects.select)(
            _selectors2.default.info.allocations.storage
          );
          let currentAssignments = yield (0, _effects.select)(
            _selectors2.default.proc.assignments
          );
          let mappedPaths = yield (0, _effects.select)(
            _selectors2.default.proc.mappedPaths
          );
          let currentDepth = yield (0, _effects.select)(
            _selectors2.default.current.functionDepth
          );
          let address = yield (0, _effects.select)(
            _selectors2.default.current.address
          );
          //storage address, not code address

          let stack = yield (0, _effects.select)(
            _selectors2.default.next.state.stack
          ); //note the use of next!
          //in this saga we are interested in the *results* of the current instruction
          //note that the decoder is still based on data.current.state; that's fine
          //though.  There's already a delay between when we record things off the
          //stack and when we decode them, after all.  Basically, nothing serious
          //should happen after an index node but before the index access node that
          //would cause storage, memory, or calldata to change, meaning that even if
          //the literal we recorded was a pointer, it will still be valid at the time
          //we use it.  (The other literals we make use of, for the base expressions,
          //are not decoded, so no potential mismatch there would be relevant anyway.)

          let alternateStack = yield (0, _effects.select)(
            _selectors2.default.nextMapped.state.stack
          );
          //HACK: unfortunately, in some cases, data.next.state.stack gets the wrong
          //results due to unmapped instructions intervening.  So, we get the stack at
          //the next *mapped* stack instead.  This is something of a hack and won't
          //work if we're about to change context, but it should work in the cases that
          //need it.

          if (!stack) {
            return;
          }

          let top = stack.length - 1;
          var assignment,
            assignments,
            preambleAssignments,
            baseExpression,
            slot,
            path;

          if (!node) {
            return;
          }

          // stack is only ready for interpretation after the last step of each
          // source range
          //
          // the data module always looks at the result of a particular opcode
          // (i.e., the following trace step's stack/memory/storage), so this
          // asserts that the _current_ operation is the final one before
          // proceeding
          if (
            !(yield (0, _effects.select)(
              _selectors2.default.views.atLastInstructionForSourceRange
            ))
          ) {
            return;
          }

          //HACK: modifier preamble
          //modifier definitions are typically skipped (this includes constructor
          //definitions when called as a base constructor); as such I've added this
          //"modifier preamble" to catch them
          if (
            yield (0, _effects.select)(
              _selectors2.default.current.aboutToModify
            )
          ) {
            let modifier = yield (0, _effects.select)(
              _selectors2.default.current.modifierBeingInvoked
            );
            //may be either a modifier or base constructor
            let currentIndex = yield (0, _effects.select)(
              _selectors2.default.current.modifierArgumentIndex
            );
            debug('currentIndex %d', currentIndex);
            let parameters = modifier.parameters.parameters;
            //now: look at the parameters *after* the current index.  we'll need to
            //adjust for those.
            let parametersLeft = parameters.slice(currentIndex + 1);
            let adjustment = (0, _lodash2.default)(
              parametersLeft.map(DecodeUtils.Definition.stackSize)
            );
            debug('adjustment %d', adjustment);
            preambleAssignments = assignParameters(
              parameters,
              top + adjustment,
              currentDepth
            );
          } else {
            preambleAssignments = {};
          }

          switch (node.nodeType) {
            case 'FunctionDefinition':
            case 'ModifierDefinition':
              //NOTE: this will *not* catch most modifier definitions!
              //the rest hopefully will be caught by the modifier preamble
              //(in fact they won't all be, but...)

              //HACK: filter out some garbage
              //this filters out the case where we're really in an invocation of a
              //modifier or base constructor, but have temporarily hit the definition
              //node for some reason.  However this obviously can have a false positive
              //in the case where a function has the same modifier twice.
              let nextModifier = yield (0, _effects.select)(
                _selectors2.default.next.modifierBeingInvoked
              );
              if (nextModifier && nextModifier.id === node.id) {
                break;
              }

              let parameters = node.parameters.parameters;
              //note that we do *not* include return parameters, since those are
              //handled by the VariableDeclaration case (no, I don't know why it
              //works out that way)

              //we can skip preambleAssignments here, that isn't used in this case
              assignments = assignParameters(parameters, top, currentDepth);

              debug('Function definition case');
              debug('assignments %O', assignments);

              yield (0, _effects.put)(actions.assign(assignments));
              break;

            case 'ContractDefinition':
              let allocation = allocations[node.id];

              debug('Contract definition case');
              debug('allocations %O', allocations);
              debug('allocation %O', allocation);
              assignments = {};
              for (let id in allocation.members) {
                id = Number(id); //not sure why we're getting them as strings, but...
                let idObj = { astId: id, address };
                let fullId = (0, _helpers.stableKeccak256)(idObj);
                //we don't use makeAssignment here as we had to compute the ID anyway
                assignment = (0, _extends3.default)({}, idObj, {
                  id: fullId,
                  ref: (0, _extends3.default)(
                    {},
                    (currentAssignments.byId[fullId] || {}).ref || {},
                    allocation.members[id].pointer
                  )
                });
                assignments[fullId] = assignment;
              }
              debug('assignments %O', assignments);

              //this case doesn't need preambleAssignments either
              yield (0, _effects.put)(actions.assign(assignments));
              break;

            case 'FunctionTypeName':
              //HACK
              //for some reasons, for declarations of local variables of function type,
              //we land on the FunctionTypeName instead of the VariableDeclaration,
              //so we replace the node with its parent (the VariableDeclaration)
              node = scopes[scopes[node.id].parentId].definition;
              //let's do a quick check that it *is* a VariableDeclaration before
              //continuing
              if (node.nodeType !== 'VariableDeclaration') {
                break;
              }
            //otherwise, deliberately fall through to the VariableDeclaration case
            //NOTE: DELIBERATE FALL-THROUGH
            case 'VariableDeclaration':
              let varId = node.id;
              debug('Variable declaration case');
              debug('currentDepth %d varId %d', currentDepth, varId);

              //NOTE: We're going to make the assignment conditional here; here's why.
              //There's a bug where calling the autogenerated accessor for a public
              //contract variable causes the debugger to see two additional
              //declarations for that variable... which this code reads as local
              //variable declarations.  Rather than prevent this at the source, we're
              //just going to check for it here, by not adding a local variable if said
              //variable is already a contract variable.

              if (
                currentAssignments.byAstId[varId] !== undefined &&
                currentAssignments.byAstId[varId].some(
                  id => currentAssignments.byId[id].address !== undefined
                )
              ) {
                debug('already a contract variable!');
                break;
              }

              //otherwise, go ahead and make the assignment
              assignment = (0, _helpers.makeAssignment)(
                { astId: varId, stackframe: currentDepth },
                {
                  stack: {
                    from: top - DecodeUtils.Definition.stackSize(node) + 1,
                    to: top
                  }
                }
              );
              assignments = { [assignment.id]: assignment };
              //this case doesn't need preambleAssignments either
              debug('assignments: %O', assignments);
              yield (0, _effects.put)(actions.assign(assignments));
              break;

            case 'IndexAccess':
              // to track `mapping` types known indices
              // (and also *some* known indices for arrays)

              //HACK: we use the alternate stack in this case

              debug('Index access case');

              //we're going to start by doing the same thing as in the default case
              //(see below) -- getting things ready for an assignment.  Then we're
              //going to forget this for a bit while we handle the rest...
              assignments = (0, _extends3.default)(
                {},
                preambleAssignments,
                literalAssignments(node, alternateStack, currentDepth)
              );

              //we'll need this
              baseExpression = node.baseExpression;

              //but first, a diversion -- is this something that could not *possibly*
              //lead to a mapping?  i.e., either a bytes, or an array of non-reference
              //types, or a non-storage array?
              //if so, we'll just do the assign and quit out early
              //(note: we write it this way because mappings aren't caught by
              //isReference)
              if (
                DecodeUtils.Definition.typeClass(baseExpression) === 'bytes' ||
                (DecodeUtils.Definition.typeClass(baseExpression) === 'array' &&
                  (DecodeUtils.Definition.isReference(node)
                    ? DecodeUtils.Definition.referenceType(baseExpression) !==
                      'storage'
                    : !DecodeUtils.Definition.isMapping(node)))
              ) {
                debug('Index case bailed out early');
                debug(
                  'typeClass %s',
                  DecodeUtils.Definition.typeClass(baseExpression)
                );
                debug(
                  'referenceType %s',
                  DecodeUtils.Definition.referenceType(baseExpression)
                );
                debug(
                  'isReference(node) %o',
                  DecodeUtils.Definition.isReference(node)
                );
                yield (0, _effects.put)(actions.assign(assignments));
                break;
              }

              let keyDefinition = DecodeUtils.Definition.keyDefinition(
                baseExpression,
                scopes
              );
              //if we're dealing with an array, this will just hack up a uint definition
              //:)

              //begin subsection: key decoding
              //(I tried factoring this out into its own saga but it didn't work when I
              //did :P )

              let indexValue;
              let indexDefinition = node.indexExpression;

              //why the loop? see the end of the block it heads for an explanatory
              //comment
              while (indexValue === undefined) {
                let indexId = indexDefinition.id;
                //indices need to be identified by stackframe
                let indexIdObj = { astId: indexId, stackframe: currentDepth };
                let fullIndexId = (0, _helpers.stableKeccak256)(indexIdObj);

                const indexReference = (
                  currentAssignments.byId[fullIndexId] || {}
                ).ref;

                if (DecodeUtils.Definition.isSimpleConstant(indexDefinition)) {
                  //while the main case is the next one, where we look for a prior
                  //assignment, we need this case (and need it first) for two reasons:
                  //1. some constant expressions (specifically, string and hex literals)
                  //aren't sourcemapped to and so won't have a prior assignment
                  //2. if the key type is bytesN but the expression is constant, the
                  //value will go on the stack *left*-padded instead of right-padded,
                  //so looking for a prior assignment will read the wrong value.
                  //so instead it's preferable to use the constant directly.
                  debug('about to decode simple literal');
                  indexValue = yield* decode(keyDefinition, {
                    definition: indexDefinition
                  });
                } else if (indexReference) {
                  //if a prior assignment is found
                  let splicedDefinition;
                  //in general, we want to decode using the key definition, not the index
                  //definition. however, the key definition may have the wrong location
                  //on it.  so, when applicable, we splice the index definition location
                  //onto the key definition location.
                  if (DecodeUtils.Definition.isReference(indexDefinition)) {
                    splicedDefinition = DecodeUtils.Definition.spliceLocation(
                      keyDefinition,
                      DecodeUtils.Definition.referenceType(indexDefinition)
                    );
                    //we could put code here to add on the "_ptr" ending when absent,
                    //but we presently ignore that ending, so we'll skip that
                  } else {
                    splicedDefinition = keyDefinition;
                  }
                  debug('about to decode');
                  indexValue = yield* decode(splicedDefinition, indexReference);
                } else if (
                  indexDefinition.referencedDeclaration &&
                  scopes[indexDefinition.referenceDeclaration]
                ) {
                  //there's one more reason we might have failed to decode it: it might be a
                  //constant state variable.  Unfortunately, we don't know how to decode all
                  //those at the moment, but we can handle the ones we do know how to decode.
                  //In the future hopefully we will decode all of them
                  debug(
                    'referencedDeclaration %d',
                    indexDefinition.referencedDeclaration
                  );
                  let indexConstantDeclaration =
                    scopes[indexDefinition.referencedDeclaration].definition;
                  debug(
                    'indexConstantDeclaration %O',
                    indexConstantDeclaration
                  );
                  if (indexConstantDeclaration.constant) {
                    let indexConstantDefinition =
                      indexConstantDeclaration.value;
                    //next line filters out constants we don't know how to handle
                    if (
                      DecodeUtils.Definition.isSimpleConstant(
                        indexConstantDefinition
                      )
                    ) {
                      debug('about to decode simple constant');
                      indexValue = yield* decode(keyDefinition, {
                        definition: indexConstantDeclaration.value
                      });
                    }
                  }
                }
                //there's still one more reason we might have failed to decode it:
                //certain (silent) type conversions aren't sourcemapped either.
                //(thankfully, any type conversion that actually *does* something seems
                //to be sourcemapped.)  So if we've failed to decode it, we try again
                //with the argument of the type conversion, if it is one; we leave
                //indexValue undefined so the loop will continue
                //(note that this case is last for a reason; if this were earlier, it
                //would catch *non*-silent type conversions, which we want to just read
                //off the stack)
                else if (indexDefinition.kind === 'typeConversion') {
                  indexDefinition = indexDefinition.arguments[0];
                }
                //otherwise, we've just totally failed to decode it, so we mark
                //indexValue as null (as distinct from undefined) to indicate this.  In
                //the future, we should be able to decode all mapping keys, but we're
                //not quite there yet, sorry (because we can't yet handle all constant
                //state variables)
                else {
                  indexValue = null;
                }
                //now, as mentioned, retry in the typeConversion case
              }

              //end subsection: key decoding

              debug('index value %O', indexValue);
              debug('keyDefinition %o', keyDefinition);

              //whew! But we're not done yet -- we need to turn this decoded key into
              //an actual path (assuming we *did* decode it)
              //OK, not an actual path -- we're just going to use a simple offset for
              //the path.  But that's OK, because the mappedPaths reducer will turn
              //it into an actual path.
              if (indexValue !== null) {
                path = fetchBasePath(
                  baseExpression,
                  mappedPaths,
                  currentAssignments,
                  currentDepth
                );

                let slot = { path };

                //we need to do things differently depending on whether we're dealing
                //with an array or mapping
                switch (DecodeUtils.Definition.typeClass(baseExpression)) {
                  case 'array':
                    slot.hashPath = DecodeUtils.Definition.isDynamicArray(
                      baseExpression
                    );
                    slot.offset = indexValue.muln(
                      (0, _truffleDecoder.storageSize)(
                        node,
                        referenceDeclarations,
                        allocations
                      ).words
                    );
                    break;
                  case 'mapping':
                    slot.key = indexValue;
                    slot.keyEncoding = DecodeUtils.Definition.keyEncoding(
                      keyDefinition
                    );
                    slot.offset = new _bn2.default(0);
                    break;
                  default:
                    debug('unrecognized index access!');
                }
                debug('slot %O', slot);

                //now, map it! (and do the assign as well)
                yield (0, _effects.put)(
                  actions.mapPathAndAssign(
                    address,
                    slot,
                    assignments,
                    DecodeUtils.Definition.typeIdentifier(node),
                    DecodeUtils.Definition.typeIdentifier(baseExpression)
                  )
                );
              } else {
                //if we failed to decode, just do the assign from above
                debug('failed to decode, just assigning');
                yield (0, _effects.put)(actions.assign(assignments));
              }

              break;

            case 'MemberAccess':
              //HACK: we use the alternate stack in this case

              //we're going to start by doing the same thing as in the default case
              //(see below) -- getting things ready for an assignment.  Then we're
              //going to forget this for a bit while we handle the rest...
              assignments = (0, _extends3.default)(
                {},
                preambleAssignments,
                literalAssignments(node, alternateStack, currentDepth)
              );

              debug('Member access case');

              //MemberAccess uses expression, not baseExpression
              baseExpression = node.expression;

              //if this isn't a storage struct, or the element isn't of reference type,
              //we'll just do the assignment and quit out (again, note that mappings
              //aren't caught by isReference)
              if (
                DecodeUtils.Definition.typeClass(baseExpression) !== 'struct' ||
                (DecodeUtils.Definition.isReference(node)
                  ? DecodeUtils.Definition.referenceType(baseExpression) !==
                    'storage'
                  : !DecodeUtils.Definition.isMapping(node))
              ) {
                debug('Member case bailed out early');
                yield (0, _effects.put)(actions.assign(assignments));
                break;
              }

              //but if it is a storage struct, we have to map the path as well
              path = fetchBasePath(
                baseExpression,
                mappedPaths,
                currentAssignments,
                currentDepth
              );

              slot = { path };

              let structId = DecodeUtils.Definition.typeId(baseExpression);
              let memberAllocation =
                allocations[structId].members[node.referencedDeclaration];

              slot.offset = memberAllocation.pointer.storage.from.slot.offset.clone();

              debug('slot %o', slot);
              yield (0, _effects.put)(
                actions.mapPathAndAssign(
                  address,
                  slot,
                  assignments,
                  DecodeUtils.Definition.typeIdentifier(node),
                  DecodeUtils.Definition.typeIdentifier(baseExpression)
                )
              );

            default:
              if (node.typeDescriptions == undefined) {
                break;
              }

              debug('decoding expression value %O', node.typeDescriptions);
              debug('default case');
              debug('currentDepth %d node.id %d', currentDepth, node.id);

              assignments = (0, _extends3.default)(
                {},
                preambleAssignments,
                literalAssignments(node, stack, currentDepth)
              );
              yield (0, _effects.put)(actions.assign(assignments));
              break;
          }
        }

        function* reset() {
          yield (0, _effects.put)(actions.reset());
        }

        function* recordAllocations() {
          const contracts = yield (0, _effects.select)(
            _selectors2.default.views.userDefinedTypes.contractDefinitions
          );
          debug('contracts %O', contracts);
          const referenceDeclarations = yield (0, _effects.select)(
            _selectors2.default.views.referenceDeclarations
          );
          debug('referenceDeclarations %O', referenceDeclarations);
          const storageAllocations = (0, _truffleDecoder.getStorageAllocations)(
            referenceDeclarations,
            contracts
          );
          debug('storageAllocations %O', storageAllocations);
          const memoryAllocations = (0, _truffleDecoder.getMemoryAllocations)(
            referenceDeclarations
          );
          const calldataAllocations = (0,
          _truffleDecoder.getCalldataAllocations)(referenceDeclarations);
          yield (0, _effects.put)(
            actions.allocate(
              storageAllocations,
              memoryAllocations,
              calldataAllocations
            )
          );
        }

        function literalAssignments(node, stack, currentDepth) {
          let top = stack.length - 1;

          let literal = (0, _truffleDecoder.readStack)(
            stack,
            top - DecodeUtils.Definition.stackSize(node) + 1,
            top
          );

          let assignment = (0, _helpers.makeAssignment)(
            { astId: node.id, stackframe: currentDepth },
            { literal }
          );

          return { [assignment.id]: assignment };
        }

        //takes a parameter list as given in the AST
        function assignParameters(parameters, top, functionDepth) {
          let reverseParameters = parameters.slice().reverse();
          //reverse is in-place, so we use slice() to clone first
          debug('reverseParameters %o', parameters);

          let currentPosition = top;
          let assignments = {};

          for (let parameter of reverseParameters) {
            let words = DecodeUtils.Definition.stackSize(parameter);
            let pointer = {
              stack: {
                from: currentPosition - words + 1,
                to: currentPosition
              }
            };
            let assignment = (0, _helpers.makeAssignment)(
              { astId: parameter.id, stackframe: functionDepth },
              pointer
            );
            assignments[assignment.id] = assignment;
            currentPosition -= words;
          }
          return assignments;
        }

        function fetchBasePath(
          baseNode,
          mappedPaths,
          currentAssignments,
          currentDepth
        ) {
          let fullId = (0, _helpers.stableKeccak256)({
            astId: baseNode.id,
            stackframe: currentDepth
          });
          //base expression is an expression, and so has a literal assigned to
          //it
          let offset = DecodeUtils.Conversion.toBN(
            currentAssignments.byId[fullId].ref.literal
          );
          return { offset };
        }

        function* saga() {
          yield (0, _effects.takeEvery)(_actions.TICK, tickSaga);
        }

        exports.default = (0, _helpers.prefixName)('data', saga);

        /***/
      },
      /* 18 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/helpers/asyncToGenerator');

        /***/
      },
      /* 19 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/core-js/object/values');

        /***/
      },
      /* 20 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.advance = advance;
        exports.stepNext = stepNext;
        exports.stepOver = stepOver;
        exports.stepInto = stepInto;
        exports.stepOut = stepOut;
        exports.reset = reset;
        exports.interrupt = interrupt;
        exports.continueUntilBreakpoint = continueUntilBreakpoint;
        exports.addBreakpoint = addBreakpoint;
        exports.removeBreakpoint = removeBreakpoint;
        exports.removeAllBreakpoints = removeAllBreakpoints;
        exports.startStepping = startStepping;
        exports.doneStepping = doneStepping;
        const ADVANCE = (exports.ADVANCE = 'ADVANCE');
        function advance(count) {
          return { type: ADVANCE, count };
        }

        const STEP_NEXT = (exports.STEP_NEXT = 'STEP_NEXT');
        function stepNext() {
          return { type: STEP_NEXT };
        }

        const STEP_OVER = (exports.STEP_OVER = 'STEP_OVER');
        function stepOver() {
          return { type: STEP_OVER };
        }

        const STEP_INTO = (exports.STEP_INTO = 'STEP_INTO');
        function stepInto() {
          return { type: STEP_INTO };
        }

        const STEP_OUT = (exports.STEP_OUT = 'STEP_OUT');
        function stepOut() {
          return { type: STEP_OUT };
        }

        const RESET = (exports.RESET = 'RESET');
        function reset() {
          return { type: RESET };
        }

        const INTERRUPT = (exports.INTERRUPT = 'CONTROLLER_INTERRUPT');
        function interrupt() {
          return { type: INTERRUPT };
        }

        const CONTINUE = (exports.CONTINUE = 'CONTINUE');
        function continueUntilBreakpoint(breakpoints) {
          //"continue" is not a legal name
          return {
            type: CONTINUE,
            breakpoints
          };
        }

        const ADD_BREAKPOINT = (exports.ADD_BREAKPOINT = 'ADD_BREAKPOINT');
        function addBreakpoint(breakpoint) {
          return {
            type: ADD_BREAKPOINT,
            breakpoint
          };
        }

        const REMOVE_BREAKPOINT = (exports.REMOVE_BREAKPOINT =
          'REMOVE_BREAKPOINT');
        function removeBreakpoint(breakpoint) {
          return {
            type: REMOVE_BREAKPOINT,
            breakpoint
          };
        }

        const REMOVE_ALL_BREAKPOINTS = (exports.REMOVE_ALL_BREAKPOINTS =
          'REMOVE_ALL_BREAKPOINTS');
        function removeAllBreakpoints() {
          return {
            type: REMOVE_ALL_BREAKPOINTS
          };
        }

        const START_STEPPING = (exports.START_STEPPING = 'START_STEPPING');
        function startStepping() {
          return {
            type: START_STEPPING
          };
        }

        const DONE_STEPPING = (exports.DONE_STEPPING = 'DONE_STEPPING');
        function doneStepping() {
          return {
            type: DONE_STEPPING
          };
        }

        /***/
      },
      /* 21 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _values = __webpack_require__(19);

        var _values2 = _interopRequireDefault(_values);

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        var _entries = __webpack_require__(7);

        var _entries2 = _interopRequireDefault(_entries);

        var _assign = __webpack_require__(8);

        var _assign2 = _interopRequireDefault(_assign);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _reselectTree = __webpack_require__(3);

        var _jsonPointer = __webpack_require__(22);

        var _jsonPointer2 = _interopRequireDefault(_jsonPointer);

        var _helpers = __webpack_require__(1);

        var _selectors = __webpack_require__(9);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _selectors3 = __webpack_require__(11);

        var _selectors4 = _interopRequireDefault(_selectors3);

        var _truffleDecodeUtils = __webpack_require__(4);

        var DecodeUtils = _interopRequireWildcard(_truffleDecodeUtils);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:data:selectors');

        /**
         * @private
         */
        const identity = x => x;

        function findAncestorOfType(node, types, scopes) {
          //note: I'm not including any protection against null in this function.
          //You are advised to include "SourceUnit" as a fallback type.
          while (node && !types.includes(node.nodeType)) {
            node = scopes[scopes[node.id].parentId].definition;
          }
          return node;
        }

        //given a modifier invocation (or inheritance specifier) node,
        //get the node for the actual modifier (or constructor)
        function modifierForInvocation(invocation, scopes) {
          let rawId; //raw referencedDeclaration ID extracted from the AST.
          //if it's a modifier this is what we want, but if it's base
          //constructor, we'll get the contract instead, and need to find its
          //constructor.
          switch (invocation.nodeType) {
            case 'ModifierInvocation':
              rawId = invocation.modifierName.referencedDeclaration;
              break;
            case 'InheritanceSpecifier':
              rawId = invocation.baseName.referencedDeclaration;
              break;
            default:
              debug('bad invocation node');
          }
          let rawNode = scopes[rawId].definition;
          switch (rawNode.nodeType) {
            case 'ModifierDefinition':
              return rawNode;
            case 'ContractDefinition':
              return rawNode.nodes.find(
                node =>
                  node.nodeType === 'FunctionDefinition' &&
                  node.kind === 'constructor'
              );
            default:
              //we should never hit this case
              return undefined;
          }
        }

        //see data.views.contexts for an explanation
        function debuggerContextToDecoderContext(context) {
          let {
            contractName,
            binary,
            contractId,
            contractKind,
            isConstructor,
            abi
          } = context;
          return {
            contractName,
            binary,
            contractId,
            contractKind,
            isConstructor,
            abi: DecodeUtils.Contexts.abiToFunctionAbiWithSignatures(abi)
          };
        }

        const data = (0, _reselectTree.createSelectorTree)({
          state: state => state.data,

          /**
           * data.views
           */
          views: {
            /*
             * data.views.atLastInstructionForSourceRange
             */
            atLastInstructionForSourceRange: (0, _reselectTree.createLeaf)(
              [_selectors4.default.current.isSourceRangeFinal],
              final => final
            ),

            /**
             * data.views.scopes (namespace)
             */
            scopes: {
              /**
               * data.views.scopes.inlined (namespace)
               */
              inlined: {
                /**
                 * data.views.scopes.inlined (selector)
                 * see data.info.scopes for how this differs from the raw version
                 */
                _: (0, _reselectTree.createLeaf)(
                  ['/info/scopes', './raw'],
                  (scopes, inlined) =>
                    (0, _assign2.default)(
                      {},
                      ...(0, _entries2.default)(inlined).map(([id, info]) => {
                        let newInfo = (0, _extends3.default)({}, info);
                        newInfo.variables = scopes[id].variables;
                        return { [id]: newInfo };
                      })
                    )
                ),

                /**
                 * data.views.scopes.inlined.raw
                 */
                raw: (0, _reselectTree.createLeaf)(
                  ['/info/scopes/raw', _selectors4.default.info.sources],
                  (scopes, sources) =>
                    (0, _assign2.default)(
                      {},
                      ...(0, _entries2.default)(scopes).map(([id, entry]) => ({
                        [id]: (0, _extends3.default)({}, entry, {
                          definition: _jsonPointer2.default.get(
                            sources[entry.sourceId].ast,
                            entry.pointer
                          )
                        })
                      }))
                    )
                )
              }
            },

            /*
             * data.views.userDefinedTypes
             */
            userDefinedTypes: {
              /*
               * data.views.userDefinedTypes.contractDefinitions
               * restrict to contracts only, and get their definitions
               */
              contractDefinitions: (0, _reselectTree.createLeaf)(
                ['/info/userDefinedTypes', '/views/scopes/inlined'],
                (typeIds, scopes) =>
                  typeIds
                    .map(id => scopes[id].definition)
                    .filter(node => node.nodeType === 'ContractDefinition')
              )
            },

            /*
             * data.views.referenceDeclarations
             */
            referenceDeclarations: (0, _reselectTree.createLeaf)(
              ['./scopes/inlined', '/info/userDefinedTypes'],
              (scopes, userDefinedTypes) =>
                (0, _assign2.default)(
                  {},
                  ...userDefinedTypes.map(id => ({
                    [id]: scopes[id].definition
                  }))
                )
            ),

            /**
             * data.views.mappingKeys
             */
            mappingKeys: (0, _reselectTree.createLeaf)(
              ['/proc/mappedPaths', '/current/address'],
              (mappedPaths, address) =>
                []
                  .concat(
                    ...(0, _values2.default)(
                      (mappedPaths.byAddress[address] || { byType: {} }).byType
                    ).map(({ bySlotAddress }) =>
                      (0, _values2.default)(bySlotAddress)
                    )
                  )
                  .filter(slot => slot.key !== undefined)
            ),

            /*
             * data.views.blockNumber
             * returns block number as string
             */
            blockNumber: (0, _reselectTree.createLeaf)(
              [_selectors2.default.transaction.globals.block],
              block => block.number.toString()
            ),

            /*
             * data.views.instances
             * same as evm.info.instances, but we just map address => binary,
             * we don't bother with context
             */
            instances: (0, _reselectTree.createLeaf)(
              [_selectors2.default.transaction.instances],
              instances =>
                (0, _assign2.default)(
                  {},
                  ...(0, _entries2.default)(instances).map(
                    ([address, { binary }]) => ({
                      [address]: DecodeUtils.Conversion.toBytes(binary)
                    })
                  )
                )
            ),

            /*
             * data.views.contexts
             * same as evm.info.contexts, but:
             * 0. we only include non-constructor contexts
             * 1. we now index by contract ID rather than hash
             * 2. we strip out context, sourceMap, primarySource, and compiler
             * 3. we alter abi in several ways:
             * 3a. we strip abi down to just (ordinary) functions
             * 3b. we augment these functions with signatures (here meaning selectors)
             * 3c. abi is now an object, not an array, and indexed by these signatures
             */
            contexts: (0, _reselectTree.createLeaf)(
              [_selectors2.default.info.contexts],
              contexts =>
                (0, _assign2.default)(
                  {},
                  ...(0, _values2.default)(contexts)
                    .filter(context => !context.isConstructor)
                    .map(context => ({
                      [context.context]: debuggerContextToDecoderContext(
                        context
                      )
                    }))
                )
            )
          },

          /**
           * data.info
           */
          info: {
            /**
             * data.info.scopes (namespace)
             */
            scopes: {
              /**
               * data.info.scopes (selector)
               * the raw version is below; this version accounts for inheritance
               * NOTE: doesn't this selector really belong in data.views?  Yes.
               * But, since it's replacing the old data.info.scopes (which is now
               * data.info.scopes.raw), I didn't want to move it.
               */
              _: (0, _reselectTree.createLeaf)(
                ['./raw', '/views/scopes/inlined/raw'],
                (scopes, inlined) =>
                  (0, _assign2.default)(
                    {},
                    ...(0, _entries2.default)(scopes).map(([id, scope]) => {
                      let definition = inlined[id].definition;
                      if (definition.nodeType !== 'ContractDefinition') {
                        return { [id]: scope };
                      }
                      //if we've reached this point, we should be dealing with a
                      //contract, and specifically a contract -- not an interface or
                      //library (those don't get "variables" entries in their scopes)
                      debug('contract id %d', id);
                      let newScope = (0, _extends3.default)({}, scope);
                      //note that Solidity gives us the linearization in order from most
                      //derived to most base, but we want most base to most derived;
                      //annoyingly, reverse() is in-place, so we clone with slice() first
                      let linearizedBaseContractsFromBase = definition.linearizedBaseContracts
                        .slice()
                        .reverse();
                      //now, we put it all together
                      newScope.variables = []
                        .concat(
                          ...linearizedBaseContractsFromBase.map(
                            contractId => scopes[contractId].variables || []
                            //we need the || [] because contracts with no state variables
                            //have variables undefined rather than empty like you'd expect
                          )
                        )
                        .filter(variable => {
                          //...except, HACK, let's filter out those constants we don't know
                          //how to read.  they'll just clutter things up.
                          debug('variable %O', variable);
                          let definition = inlined[variable.id].definition;
                          return (
                            !definition.constant ||
                            DecodeUtils.Definition.isSimpleConstant(
                              definition.value
                            )
                          );
                        });

                      return { [id]: newScope };
                    })
                  )
              ),

              /*
               * data.info.scopes.raw
               */
              raw: (0, _reselectTree.createLeaf)(
                ['/state'],
                state => state.info.scopes.byId
              )
            },

            /*
             * data.info.allocations
             */
            allocations: {
              /*
               * data.info.allocations.storage
               */
              storage: (0, _reselectTree.createLeaf)(
                ['/state'],
                state => state.info.allocations.storage
              ),

              /*
               * data.info.allocations.memory
               */
              memory: (0, _reselectTree.createLeaf)(
                ['/state'],
                state => state.info.allocations.memory
              ),

              /*
               * data.info.allocations.calldata
               */
              calldata: (0, _reselectTree.createLeaf)(
                ['/state'],
                state => state.info.allocations.calldata
              )
            },

            /**
             * data.info.userDefinedTypes
             */
            userDefinedTypes: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.info.userDefinedTypes
            )
          },

          /**
           * data.proc
           */
          proc: {
            /**
             * data.proc.assignments
             */
            assignments: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.proc.assignments
              //note: this no longer fetches just the byId, but rather the whole
              //assignments object
            ),

            /*
             * data.proc.mappedPaths
             */
            mappedPaths: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.proc.mappedPaths
            ),

            /**
             * data.proc.decodingKeys
             *
             * number of keys that are still decoding
             */
            decodingKeys: (0, _reselectTree.createLeaf)(
              ['./mappedPaths'],
              mappedPaths => mappedPaths.decodingStarted
            )
          },

          /**
           * data.current
           */
          current: {
            /**
             * data.current.state
             */
            state: {
              /**
               * data.current.state.stack
               */
              stack: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.state.stack],
                words =>
                  (words || []).map(word =>
                    DecodeUtils.Conversion.toBytes(word)
                  )
              ),

              /**
               * data.current.state.memory
               */
              memory: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.state.memory],
                words => DecodeUtils.Conversion.toBytes(words.join(''))
              ),

              /**
               * data.current.state.calldata
               */
              calldata: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.call],
                ({ data }) => DecodeUtils.Conversion.toBytes(data)
              ),

              /**
               * data.current.state.storage
               */
              storage: (0, _reselectTree.createLeaf)(
                [_selectors2.default.current.codex.storage],
                mapping =>
                  (0, _assign2.default)(
                    {},
                    ...(0, _entries2.default)(mapping).map(
                      ([address, word]) => ({
                        [`0x${address}`]: DecodeUtils.Conversion.toBytes(word)
                      })
                    )
                  )
              ),

              /*
               * data.current.state.specials
               * I've named these after the solidity variables they correspond to,
               * which are *mostly* the same as the corresponding EVM opcodes
               * (FWIW: this = ADDRESS, sender = CALLER, value = CALLVALUE)
               */
              specials: (0, _reselectTree.createLeaf)(
                [
                  '/current/address',
                  _selectors2.default.current.call,
                  _selectors2.default.transaction.globals
                ],
                (address, { sender, value }, { tx, block }) =>
                  (0, _extends3.default)(
                    {
                      this: DecodeUtils.Conversion.toBytes(address),

                      sender: DecodeUtils.Conversion.toBytes(sender),

                      value: DecodeUtils.Conversion.toBytes(value)
                    },
                    (0, _assign2.default)(
                      {},
                      ...(0, _entries2.default)(tx).map(
                        ([variable, value]) => ({
                          [variable]: DecodeUtils.Conversion.toBytes(value)
                        })
                      )
                    ),
                    (0, _assign2.default)(
                      {},
                      ...(0, _entries2.default)(block).map(
                        ([variable, value]) => ({
                          [variable]: DecodeUtils.Conversion.toBytes(value)
                        })
                      )
                    )
                  )
              )
            },

            /**
             * data.current.node
             */
            node: (0, _reselectTree.createLeaf)(
              [_selectors4.default.current.node],
              identity
            ),

            /**
             * data.current.scope
             * old alias for data.current.node (deprecated)
             */
            scope: (0, _reselectTree.createLeaf)(['./node'], identity),

            /*
             * data.current.contract
             * warning: may return null or similar, even though SourceUnit is included
             * as fallback
             */
            contract: (0, _reselectTree.createLeaf)(
              ['./node', '/views/scopes/inlined'],
              (node, scopes) => {
                const types = ['ContractDefinition', 'SourceUnit'];
                //SourceUnit included as fallback
                return findAncestorOfType(node, types, scopes);
              }
            ),

            /**
             * data.current.functionDepth
             */

            functionDepth: (0, _reselectTree.createLeaf)(
              [_selectors4.default.current.functionDepth],
              identity
            ),

            /**
             * data.current.address
             * NOTE: this is the STORAGE address for the current call, not the CODE
             * address
             */

            address: (0, _reselectTree.createLeaf)(
              [_selectors2.default.current.call],
              call => call.storageAddress
            ),

            /*
             * data.current.functionsByProgramCounter
             */
            functionsByProgramCounter: (0, _reselectTree.createLeaf)(
              [_selectors4.default.current.functionsByProgramCounter],
              functions => functions
            ),

            /*
             * data.current.context
             */
            context: (0, _reselectTree.createLeaf)(
              [_selectors2.default.current.context],
              debuggerContextToDecoderContext
            ),

            /*
             * data.current.aboutToModify
             * HACK
             * This selector is used to catch those times when we go straight from a
             * modifier invocation into the modifier itself, skipping over the
             * definition node (this includes base constructor calls).  So it should
             * return true when:
             * 1. we're on the node corresponding to an argument to a modifier
             * invocation or base constructor call, or, if said argument is a type
             * conversion, its argument (or nested argument)
             * 2. the next node is not a FunctionDefinition, ModifierDefinition, or
             * in the same modifier / base constructor invocation
             */
            aboutToModify: (0, _reselectTree.createLeaf)(
              [
                './node',
                './modifierInvocation',
                './modifierArgumentIndex',
                '/next/node',
                '/next/modifierInvocation',
                _selectors2.default.current.step.isContextChange
              ],
              (
                node,
                invocation,
                index,
                next,
                nextInvocation,
                isContextChange
              ) => {
                //ensure: current instruction is not a context change (because if it is
                //we cannot rely on the data.next selectors, but also if it is we know
                //we're not about to call a modifier or base constructor!)
                //we also want to return false if we can't find things for whatever
                //reason
                if (
                  isContextChange ||
                  !node ||
                  !next ||
                  !invocation ||
                  !nextInvocation
                ) {
                  return false;
                }

                //ensure: current position is in a ModifierInvocation or
                //InheritanceSpecifier (recall that SourceUnit was included as
                //fallback)
                if (invocation.nodeType === 'SourceUnit') {
                  return false;
                }

                //ensure: next node is not a function definition or modifier definition
                if (
                  next.nodeType === 'FunctionDefinition' ||
                  next.nodeType === 'ModifierDefinition'
                ) {
                  return false;
                }

                //ensure: next node is not in the same invocation
                if (
                  nextInvocation.nodeType !== 'SourceUnit' &&
                  nextInvocation.id === invocation.id
                ) {
                  return false;
                }

                //now: are we on the node corresponding to an argument, or, if
                //it's a type conversion, its nested argument?
                if (index === undefined) {
                  return false;
                }
                let argument = invocation.arguments[index];
                while (argument.kind === 'typeConversion') {
                  if (node.id === argument.id) {
                    return true;
                  }
                  argument = argument.arguments[0];
                }
                return node.id === argument.id;
              }
            ),

            /*
             * data.current.modifierInvocation
             */
            modifierInvocation: (0, _reselectTree.createLeaf)(
              ['./node', '/views/scopes/inlined'],
              (node, scopes) => {
                const types = [
                  'ModifierInvocation',
                  'InheritanceSpecifier',
                  'SourceUnit'
                ];
                //again, SourceUnit included as fallback
                return findAncestorOfType(node, types, scopes);
              }
            ),

            /**
             * data.current.modifierArgumentIndex
             * gets the index of the current modifier argument that you're in
             * (undefined when not in a modifier argument)
             */
            modifierArgumentIndex: (0, _reselectTree.createLeaf)(
              ['/info/scopes', './node', './modifierInvocation'],
              (scopes, node, invocation) => {
                if (invocation.nodeType === 'SourceUnit') {
                  return undefined;
                }

                let pointer = scopes[node.id].pointer;
                let invocationPointer = scopes[invocation.id].pointer;

                //slice the invocation pointer off the beginning
                let difference = pointer.replace(invocationPointer, '');
                debug('difference %s', difference);
                let rawIndex = difference.match(/^\/arguments\/(\d+)/);
                //note that that \d+ is greedy
                debug('rawIndex %o', rawIndex);
                if (rawIndex === null) {
                  return undefined;
                }
                return parseInt(rawIndex[1]);
              }
            ),

            /*
             * data.current.modifierBeingInvoked
             * gets the node corresponding to the modifier or base constructor
             * being invoked
             */
            modifierBeingInvoked: (0, _reselectTree.createLeaf)(
              ['./modifierInvocation', '/views/scopes/inlined'],
              (invocation, scopes) => {
                if (!invocation || invocation.nodeType === 'SourceUnit') {
                  return undefined;
                }

                return modifierForInvocation(invocation, scopes);
              }
            ),

            /**
             * data.current.identifiers (namespace)
             */
            identifiers: {
              /**
               * data.current.identifiers (selector)
               *
               * returns identifers and corresponding definition node ID or builtin name
               * (object entries look like [name]: {astId: id} or like [name]: {builtin: name}
               */
              _: (0, _reselectTree.createLeaf)(
                ['/views/scopes/inlined', '/current/node'],
                (scopes, scope) => {
                  let variables = {};
                  if (scope !== undefined) {
                    let cur = scope.id;

                    do {
                      variables = (0, _assign2.default)(
                        variables,
                        ...(scopes[cur].variables || [])
                          .filter(v => v.name !== '') //exclude anonymous output params
                          .filter(v => variables[v.name] == undefined)
                          .map(v => ({ [v.name]: { astId: v.id } }))
                      );

                      cur = scopes[cur].parentId;
                    } while (cur != null);
                  }

                  let builtins = {
                    msg: { builtin: 'msg' },
                    tx: { builtin: 'tx' },
                    block: { builtin: 'block' },
                    this: { builtin: 'this' },
                    now: { builtin: 'now' }
                  };

                  return (0, _extends3.default)({}, variables, builtins);
                }
              ),

              /**
               * data.current.identifiers.definitions (namespace)
               */
              definitions: {
                /* data.current.identifiers.definitions (selector)
                 * definitions for current variables, by identifier
                 */
                _: (0, _reselectTree.createLeaf)(
                  ['/views/scopes/inlined', '../_', './this'],
                  (scopes, identifiers, thisDefinition) => {
                    let variables = (0, _assign2.default)(
                      {},
                      ...(0, _entries2.default)(identifiers).map(
                        ([identifier, { astId }]) => {
                          if (astId !== undefined) {
                            //will be undefined for builtins
                            let { definition } = scopes[astId];
                            return { [identifier]: definition };
                          } else {
                            return {}; //skip over builtins; we'll handle those separately
                          }
                        }
                      )
                    );
                    let builtins = {
                      msg: DecodeUtils.Definition.MSG_DEFINITION,
                      tx: DecodeUtils.Definition.TX_DEFINITION,
                      block: DecodeUtils.Definition.BLOCK_DEFINITION,
                      now: DecodeUtils.Definition.spoofUintDefinition('now')
                    };
                    //only include this when it has a proper definition
                    if (thisDefinition) {
                      builtins.this = thisDefinition;
                    }
                    return (0, _extends3.default)({}, variables, builtins);
                  }
                ),

                /*
                 * data.current.identifiers.definitions.this
                 *
                 * returns a spoofed definition for the this variable
                 */
                this: (0, _reselectTree.createLeaf)(
                  ['/current/contract'],
                  contractNode =>
                    contractNode &&
                    contractNode.nodeType === 'ContractDefinition'
                      ? DecodeUtils.Definition.spoofThisDefinition(
                          contractNode.name,
                          contractNode.id
                        )
                      : null
                )
              },

              /**
               * data.current.identifiers.refs
               *
               * current variables' value refs
               */
              refs: (0, _reselectTree.createLeaf)(
                [
                  '/proc/assignments',
                  './_',
                  '/current/functionDepth', //for pruning things too deep on stack
                  '/current/address' //for contract variables
                ],
                (assignments, identifiers, currentDepth, address) =>
                  (0, _assign2.default)(
                    {},
                    ...(0, _entries2.default)(identifiers).map(
                      ([identifier, { astId, builtin }]) => {
                        let id;

                        //is this an ordinary variable or a builtin?
                        if (astId !== undefined) {
                          //if not a builtin, first check if it's a contract var
                          let matchIds = (
                            assignments.byAstId[astId] || []
                          ).filter(
                            idHash =>
                              assignments.byId[idHash].address === address
                          );
                          if (matchIds.length > 0) {
                            id = matchIds[0]; //there should only be one!
                          }

                          //if not contract, it's local, so find the innermost
                          //(but not beyond current depth)
                          if (id === undefined) {
                            let matchFrames = (assignments.byAstId[astId] || [])
                              .map(id => assignments.byId[id].stackframe)
                              .filter(stackframe => stackframe !== undefined);

                            if (matchFrames.length > 0) {
                              //this check isn't *really*
                              //necessary, but may as well prevent stupid stuff
                              let maxMatch = Math.min(
                                currentDepth,
                                Math.max(...matchFrames)
                              );
                              id = (0, _helpers.stableKeccak256)({
                                astId,
                                stackframe: maxMatch
                              });
                            }
                          }
                        } else {
                          //otherwise, it's a builtin
                          //NOTE: for now we assume there is only one assignment per
                          //builtin, but this will change in the future
                          id = assignments.byBuiltin[builtin][0];
                        }

                        //if we still didn't find it, oh well

                        let { ref } = assignments.byId[id] || {};
                        if (!ref) {
                          return undefined;
                        }

                        return {
                          [identifier]: ref
                        };
                      }
                    )
                  )
              )
            }
          },

          /**
           * data.next
           */
          next: {
            /**
             * data.next.state
             * Yes, I'm just repeating the code for data.current.state.stack here;
             * not worth the trouble to factor out
             */
            state: {
              /**
               * data.next.state.stack
               */
              stack: (0, _reselectTree.createLeaf)(
                [_selectors2.default.next.state.stack],
                words =>
                  (words || []).map(word =>
                    DecodeUtils.Conversion.toBytes(word)
                  )
              )
            },

            //HACK WARNING
            //the following selectors depend on solidity.next
            //do not use them when the current instruction is a context change!

            /**
             * data.next.node
             */
            node: (0, _reselectTree.createLeaf)(
              [_selectors4.default.next.node],
              identity
            ),

            /**
             * data.next.modifierInvocation
             * Note: yes, I'm just repeating the code from data.current here but with
             * invalid added
             */
            modifierInvocation: (0, _reselectTree.createLeaf)(
              [
                './node',
                '/views/scopes/inlined',
                _selectors2.default.current.step.isContextChange
              ],
              (node, scopes, invalid) => {
                //don't attempt this at a context change!
                //(also don't attempt this if we can't find the node for whatever
                //reason)
                if (invalid || !node) {
                  return undefined;
                }
                const types = [
                  'ModifierInvocation',
                  'InheritanceSpecifier',
                  'SourceUnit'
                ];
                //again, SourceUnit included as fallback
                return findAncestorOfType(node, types, scopes);
              }
            ),

            /*
             * data.next.modifierBeingInvoked
             */
            modifierBeingInvoked: (0, _reselectTree.createLeaf)(
              [
                './modifierInvocation',
                '/views/scopes/inlined',
                _selectors2.default.current.step.isContextChange
              ],
              (invocation, scopes, invalid) => {
                if (
                  invalid ||
                  !invocation ||
                  invocation.nodeType === 'SourceUnit'
                ) {
                  return undefined;
                }

                return modifierForInvocation(invocation, scopes);
              }
            )
            //END HACK WARNING
          },

          /**
           * data.nextMapped
           */
          nextMapped: {
            /**
             * data.nextMapped.state
             * Yes, I'm just repeating the code for data.current.state.stack here;
             * not worth the trouble to factor out
             * HACK: this assumes we're not about to change context! don't use this if we
             * are!
             */
            state: {
              /**
               * data.nextMapped.state.stack
               */
              stack: (0, _reselectTree.createLeaf)(
                [_selectors4.default.current.nextMapped],
                step =>
                  ((step || {}).stack || []).map(word =>
                    DecodeUtils.Conversion.toBytes(word)
                  )
              )
            }
          }
        });

        exports.default = data;

        /***/
      },
      /* 22 */
      /***/ function(module, exports) {
        module.exports = require('json-pointer');

        /***/
      },
      /* 23 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/core-js/set');

        /***/
      },
      /* 24 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.addContext = addContext;
        exports.normalizeContexts = normalizeContexts;
        exports.addInstance = addInstance;
        exports.begin = begin;
        exports.callstackAndCodexSaga = callstackAndCodexSaga;
        exports.reset = reset;
        exports.unload = unload;
        exports.saga = saga;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _helpers = __webpack_require__(1);

        var _actions = __webpack_require__(12);

        var _actions2 = __webpack_require__(29);

        var actions = _interopRequireWildcard(_actions2);

        var _selectors = __webpack_require__(9);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _sagas = __webpack_require__(13);

        var trace = _interopRequireWildcard(_sagas);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:evm:sagas');

        /**
         * Adds EVM bytecode context
         *
         * @return {string} ID (0x-prefixed keccak of binary)
         */
        function* addContext(context) {
          const contextHash = (0, _helpers.keccak256)({
            type: 'string',
            value: context.binary
          });
          //NOTE: we take hash as *string*, not as bytes, because the binary may
          //contain link references!

          debug('context %O', context);
          yield (0, _effects.put)(actions.addContext(context));

          return contextHash;
        }

        function* normalizeContexts() {
          yield (0, _effects.put)(actions.normalizeContexts());
        }

        /**
         * Adds known deployed instance of binary at address
         *
         * @param {string} binary - may be undefined (e.g. precompiles)
         * @return {string} ID (0x-prefixed keccak of binary)
         */
        function* addInstance(address, binary) {
          let search = yield (0, _effects.select)(
            _selectors2.default.info.binaries.search
          );
          let context = search(binary);

          // in case binary is unknown, add a context for it
          if (context === null) {
            context = yield* addContext({
              binary,
              isConstructor: false
              //addInstance is only used for adding deployed instances, so it will
              //never be a constructor
            });
          }

          //now, whether we needed a new context or not, add the instance
          yield (0, _effects.put)(
            actions.addInstance(address, context, binary)
          );

          return context;
        }

        function* begin({
          address,
          binary,
          data,
          storageAddress,
          sender,
          value,
          gasprice,
          block
        }) {
          yield (0, _effects.put)(actions.saveGlobals(sender, gasprice, block));
          if (address) {
            yield (0, _effects.put)(
              actions.call(address, data, storageAddress, sender, value)
            );
          } else {
            yield (0, _effects.put)(
              actions.create(binary, storageAddress, sender, value)
            );
          }
        }

        function* tickSaga() {
          debug('got TICK');

          yield* callstackAndCodexSaga();
          yield* trace.signalTickSagaCompletion();
        }

        function* callstackAndCodexSaga() {
          if (
            yield (0, _effects.select)(
              _selectors2.default.current.step.isExceptionalHalting
            )
          ) {
            //let's handle this case first so we can be sure everything else is *not*
            //an exceptional halt
            debug('exceptional halt!');

            yield (0, _effects.put)(actions.fail());
          } else if (
            yield (0, _effects.select)(_selectors2.default.current.step.isCall)
          ) {
            debug('got call');
            // if there is no binary (e.g. in the case of precompiled contracts or
            // externally owned accounts), then there will be no trace steps for the
            // called code, and so we shouldn't tell the debugger that we're entering
            // another execution context
            if (
              yield (0, _effects.select)(
                _selectors2.default.current.step.callsPrecompileOrExternal
              )
            ) {
              return;
            }

            let address = yield (0, _effects.select)(
              _selectors2.default.current.step.callAddress
            );
            let data = yield (0, _effects.select)(
              _selectors2.default.current.step.callData
            );

            debug('calling address %s', address);

            if (
              yield (0, _effects.select)(
                _selectors2.default.current.step.isDelegateCallStrict
              )
            ) {
              //if delegating, leave storageAddress, sender, and value the same
              let { storageAddress, sender, value } = yield (0,
              _effects.select)(_selectors2.default.current.call);
              yield (0, _effects.put)(
                actions.call(address, data, storageAddress, sender, value)
              );
            } else {
              //this branch covers CALL, CALLCODE, and STATICCALL
              let currentCall = yield (0, _effects.select)(
                _selectors2.default.current.call
              );
              let storageAddress = (yield (0, _effects.select)(
                _selectors2.default.current.step.isDelegateCallBroad
              ))
                ? currentCall.storageAddress //for CALLCODE
                : address;
              let sender = currentCall.storageAddress; //not the code address!
              let value = yield (0, _effects.select)(
                _selectors2.default.current.step.callValue
              ); //0 if static
              yield (0, _effects.put)(
                actions.call(address, data, storageAddress, sender, value)
              );
            }
          } else if (
            yield (0, _effects.select)(
              _selectors2.default.current.step.isCreate
            )
          ) {
            debug('got create');
            let binary = yield (0, _effects.select)(
              _selectors2.default.current.step.createBinary
            );
            let createdAddress = yield (0, _effects.select)(
              _selectors2.default.current.step.createdAddress
            );
            let value = yield (0, _effects.select)(
              _selectors2.default.current.step.createValue
            );
            let sender = (yield (0, _effects.select)(
              _selectors2.default.current.call
            )).storageAddress;
            //not the code address!

            yield (0, _effects.put)(
              actions.create(binary, createdAddress, sender, value)
            );
            //as above, storageAddress handles when calling from a creation call
          } else if (
            yield (0, _effects.select)(
              _selectors2.default.current.step.isHalting
            )
          ) {
            debug('got return');

            yield (0, _effects.put)(actions.returnCall());
          } else if (
            yield (0, _effects.select)(
              _selectors2.default.current.step.touchesStorage
            )
          ) {
            let storageAddress = (yield (0, _effects.select)(
              _selectors2.default.current.call
            )).storageAddress;
            let slot = yield (0, _effects.select)(
              _selectors2.default.current.step.storageAffected
            );
            //note we get next storage, since we're updating to that
            let storage = yield (0, _effects.select)(
              _selectors2.default.next.state.storage
            );
            //normally we'd need a 0 fallback for this next line, but in this case we
            //can be sure the value will be there, since we're touching that storage
            if (
              yield (0, _effects.select)(
                _selectors2.default.current.step.isStore
              )
            ) {
              yield (0, _effects.put)(
                actions.store(storageAddress, slot, storage[slot])
              );
            } else {
              //otherwise, it's a load
              yield (0, _effects.put)(
                actions.load(storageAddress, slot, storage[slot])
              );
            }
          }
        }

        function* reset() {
          let initialAddress = (yield (0, _effects.select)(
            _selectors2.default.current.callstack
          ))[0].storageAddress;
          yield (0, _effects.put)(actions.reset(initialAddress));
        }

        function* unload() {
          yield (0, _effects.put)(actions.unloadTransaction());
        }

        function* saga() {
          yield (0, _effects.takeEvery)(_actions.TICK, tickSaga);
        }

        exports.default = (0, _helpers.prefixName)('evm', saga);

        /***/
      },
      /* 25 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _reselectTree = __webpack_require__(3);

        var _selectors = __webpack_require__(9);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _selectors3 = __webpack_require__(11);

        var _selectors4 = _interopRequireDefault(_selectors3);

        var _selectors5 = __webpack_require__(10);

        var _selectors6 = _interopRequireDefault(_selectors5);

        var _map = __webpack_require__(26);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:controller:selectors'); //eslint-disable-line no-unused-vars

        /**
         * @private
         */
        const identity = x => x;

        /**
         * controller
         */
        const controller = (0, _reselectTree.createSelectorTree)({
          /**
           * controller.state
           */
          state: state => state.controller,
          /**
           * controller.current
           */
          current: {
            /**
             * controller.current.functionDepth
             */
            functionDepth: (0, _reselectTree.createLeaf)(
              [_selectors4.default.current.functionDepth],
              identity
            ),

            /**
             * controller.current.executionContext
             */
            executionContext: (0, _reselectTree.createLeaf)(
              [_selectors2.default.current.call],
              identity
            ),

            /**
             * controller.current.willJump
             */
            willJump: (0, _reselectTree.createLeaf)(
              [_selectors2.default.current.step.isJump],
              identity
            ),

            /**
             * controller.current.location
             */
            location: {
              /**
               * controller.current.location.sourceRange
               */
              sourceRange: (0, _reselectTree.createLeaf)(
                [
                  _selectors4.default.current.sourceRange,
                  '/current/trace/loaded'
                ],
                (range, loaded) => (loaded ? range : null)
              ),

              /**
               * controller.current.location.source
               */
              source: (0, _reselectTree.createLeaf)(
                [_selectors4.default.current.source, '/current/trace/loaded'],
                (source, loaded) => (loaded ? source : null)
              ),

              /**
               * controller.current.location.node
               */
              node: (0, _reselectTree.createLeaf)(
                [_selectors4.default.current.node, '/current/trace/loaded'],
                (node, loaded) => (loaded ? node : null)
              ),

              /**
               * controller.current.location.isMultiline
               */
              isMultiline: (0, _reselectTree.createLeaf)(
                [
                  _selectors4.default.current.isMultiline,
                  '/current/trace/loaded'
                ],
                (raw, loaded) => (loaded ? raw : false)
              )
            },

            /*
             * controller.current.trace
             */
            trace: {
              /**
               * controller.current.trace.finished
               */
              finished: (0, _reselectTree.createLeaf)(
                [_selectors6.default.finished],
                identity
              ),

              /**
               * controller.current.trace.loaded
               */
              loaded: (0, _reselectTree.createLeaf)(
                [_selectors6.default.loaded],
                identity
              )
            }
          },

          /**
           * controller.breakpoints (namespace)
           */
          breakpoints: {
            /**
             * controller.breakpoints (selector)
             */
            _: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.breakpoints
            ),

            /**
             * controller.breakpoints.resolver (selector)
             * this selector returns a function that adjusts a given line-based
             * breakpoint (on node-based breakpoints it simply returns the input) by
             * repeatedly moving it down a line until it lands on a line where there's
             * actually somewhere to break.  if no such line exists beyond that point, it
             * returns null instead.
             */
            resolver: (0, _reselectTree.createLeaf)(
              [_selectors4.default.info.sources],
              sources => breakpoint => {
                let adjustedBreakpoint;
                if (breakpoint.node === undefined) {
                  let line = breakpoint.line;
                  let { source, ast } = sources[breakpoint.sourceId];
                  let lineLengths = source.split('\n').map(line => line.length);
                  //why does neither JS nor lodash have a scan function like Haskell??
                  //guess we'll have to do our scan manually
                  let lineStarts = [0];
                  for (let length of lineLengths) {
                    lineStarts.push(
                      lineStarts[lineStarts.length - 1] + length + 1
                    );
                    //+1 for the /n itself
                  }
                  debug(
                    'line: %s',
                    source.slice(
                      lineStarts[line],
                      lineStarts[line] + lineLengths[line]
                    )
                  );
                  while (
                    line < lineLengths.length &&
                    !(0, _map.anyNonSkippedInRange)(
                      ast,
                      lineStarts[line],
                      lineLengths[line]
                    )
                  ) {
                    debug('incrementing');
                    line++;
                  }
                  if (line >= lineLengths.length) {
                    adjustedBreakpoint = null;
                  } else {
                    adjustedBreakpoint = (0, _extends3.default)(
                      {},
                      breakpoint,
                      { line }
                    );
                  }
                } else {
                  debug('node-based breakpoint');
                  adjustedBreakpoint = breakpoint;
                }
                return adjustedBreakpoint;
              }
            )
          },

          /**
           * controller.finished
           * deprecated alias for controller.current.trace.finished
           */
          finished: (0, _reselectTree.createLeaf)(
            ['/current/finished'],
            finished => finished
          ),

          /**
           * controller.isStepping
           */
          isStepping: (0, _reselectTree.createLeaf)(
            ['./state'],
            state => state.isStepping
          )
        });

        exports.default = controller;

        /***/
      },
      /* 26 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _keys = __webpack_require__(16);

        var _keys2 = _interopRequireDefault(_keys);

        exports.getRange = getRange;
        exports.rangeNodes = rangeNodes;
        exports.findOverlappingRange = findOverlappingRange;
        exports.findRange = findRange;
        exports.anyNonSkippedInRange = anyNonSkippedInRange;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _nodeIntervalTree = __webpack_require__(53);

        var _nodeIntervalTree2 = _interopRequireDefault(_nodeIntervalTree);

        var _jsonPointer = __webpack_require__(22);

        var _jsonPointer2 = _interopRequireDefault(_jsonPointer);

        var _helpers = __webpack_require__(1);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:ast:map');

        /**
         * @private
         */
        function getRange(node) {
          // src: "<start>:<length>:<_>"
          // returns [start, end]
          let [start, length] = node.src
            .split(':')
            .slice(0, 2)
            .map(i => parseInt(i));

          return [start, start + length];
        }

        /**
         * @private
         */
        function rangeNodes(node, pointer = '') {
          if (node instanceof Array) {
            return [].concat(
              ...node.map((sub, i) => rangeNodes(sub, `${pointer}/${i}`))
            );
          } else if (node instanceof Object) {
            let results = [];

            if (node.src !== undefined && node.id !== undefined) {
              //there are some "pseudo-nodes" with a src but no id.
              //these will cause problems, so we want to exclude them.
              //(to my knowledge this only happens with the externalReferences
              //to an InlineAssembly node, so excluding them just means we find
              //the InlineAssembly node instead, which is fine)
              results.push({ pointer, range: getRange(node) });
            }

            return results.concat(
              ...(0, _keys2.default)(node).map(key =>
                rangeNodes(node[key], `${pointer}/${key}`)
              )
            );
          } else {
            return [];
          }
        }

        /**
         * @private
         */
        function findOverlappingRange(node, sourceStart, sourceLength) {
          let ranges = rangeNodes(node);
          let tree = new _nodeIntervalTree2.default();

          for (let _ref of ranges) {
            let { range, pointer } = _ref;

            let [start, end] = range;
            tree.insert(start, end, { range, pointer });
          }

          let sourceEnd = sourceStart + sourceLength;

          return tree.search(sourceStart, sourceEnd);
          //returns everything overlapping the given range
        }

        /**
         * @private
         */
        function findRange(node, sourceStart, sourceLength) {
          // find nodes that fully contain requested range,
          // return longest pointer
          let sourceEnd = sourceStart + sourceLength;
          return findOverlappingRange(node, sourceStart, sourceLength)
            .filter(
              ({ range }) => sourceStart >= range[0] && sourceEnd <= range[1]
            )
            .map(({ pointer }) => pointer)
            .reduce((a, b) => (a.length > b.length ? a : b), '');
        }

        /**
         * @private
         */
        function anyNonSkippedInRange(node, sourceStart, sourceLength) {
          let sourceEnd = sourceStart + sourceLength;
          return findOverlappingRange(node, sourceStart, sourceLength).some(
            ({ range, pointer }) =>
              sourceStart <= range[0] && //we want to go by starting line
              range[0] < sourceEnd &&
              !(0, _helpers.isSkippedNodeType)(
                _jsonPointer2.default.get(node, pointer)
              )
            //NOTE: this doesn't actually catch everything skipped!  But doing better
            //is hard
          );
        }

        /***/
      },
      /* 27 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _entries = __webpack_require__(7);

        var _entries2 = _interopRequireDefault(_entries);

        var _assign = __webpack_require__(8);

        var _assign2 = _interopRequireDefault(_assign);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _reselectTree = __webpack_require__(3);

        var _selectors = __webpack_require__(9);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _selectors3 = __webpack_require__(10);

        var _selectors4 = _interopRequireDefault(_selectors3);

        var _selectors5 = __webpack_require__(11);

        var _selectors6 = _interopRequireDefault(_selectors5);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:session:selectors');

        const session = (0, _reselectTree.createSelectorTree)({
          /*
           * session.state
           */
          state: state => state.session,

          /**
           * session.info
           */
          info: {
            /**
             * session.info.affectedInstances
             */
            affectedInstances: (0, _reselectTree.createLeaf)(
              [
                _selectors2.default.transaction.instances,
                _selectors2.default.info.contexts,
                _selectors6.default.info.sources
              ],
              (instances, contexts, sources) =>
                (0, _assign2.default)(
                  {},
                  ...(0, _entries2.default)(instances).map(
                    ([address, { context, binary }]) => {
                      debug('instances %O', instances);
                      debug('contexts %O', contexts);
                      let { contractName, primarySource } = contexts[context];

                      let source =
                        primarySource !== undefined
                          ? sources[primarySource]
                          : undefined;

                      return {
                        [address]: {
                          contractName,
                          source,
                          binary
                        }
                      };
                    }
                  )
                )
            )
          },

          /**
           * session.transaction (namespace)
           */
          transaction: {
            /**
             * session.transaction (selector)
             * contains the web3 transaction object
             */
            _: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.transaction
            ),

            /**
             * session.transaction.receipt
             * contains the web3 receipt object
             */
            receipt: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.receipt
            ),

            /**
             * session.transaction.block
             * contains the web3 block object
             */
            block: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.block
            )
          },

          /*
           * session.status (namespace)
           */
          status: {
            /*
             * session.status.readyOrError
             */
            readyOrError: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.ready
            ),

            /*
             * session.status.ready
             */
            ready: (0, _reselectTree.createLeaf)(
              ['./readyOrError', './isError'],
              (readyOrError, error) => readyOrError && !error
            ),

            /*
             * session.status.waiting
             */
            waiting: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => !state.ready
            ),

            /*
             * session.status.error
             */
            error: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.lastLoadingError
            ),

            /*
             * session.status.isError
             */
            isError: (0, _reselectTree.createLeaf)(
              ['./error'],
              error => error !== null
            ),

            /*
             * session.status.success
             */
            success: (0, _reselectTree.createLeaf)(
              ['./error'],
              error => error === null
            ),

            /*
             * session.status.errored
             */
            errored: (0, _reselectTree.createLeaf)(
              ['./readyOrError', './isError'],
              (readyOrError, error) => readyOrError && error
            ),

            /*
             * session.status.loaded
             */
            loaded: (0, _reselectTree.createLeaf)(
              [_selectors4.default.loaded],
              loaded => loaded
            ),

            /*
             * session.status.projectInfoComputed
             */
            projectInfoComputed: (0, _reselectTree.createLeaf)(
              ['/state'],
              state => state.projectInfoComputed
            )
          }
        });

        exports.default = session;

        /***/
      },
      /* 28 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.scope = scope;
        exports.declare = declare;
        exports.assign = assign;
        exports.mapPathAndAssign = mapPathAndAssign;
        exports.reset = reset;
        exports.defineType = defineType;
        exports.allocate = allocate;
        const SCOPE = (exports.SCOPE = 'SCOPE');
        function scope(id, pointer, parentId, sourceId) {
          return {
            type: SCOPE,
            id,
            pointer,
            parentId,
            sourceId
          };
        }

        const DECLARE = (exports.DECLARE = 'DECLARE_VARIABLE');
        function declare(node) {
          return {
            type: DECLARE,
            node
          };
        }

        const ASSIGN = (exports.ASSIGN = 'ASSIGN');
        function assign(assignments) {
          return {
            type: ASSIGN,
            assignments
          };
        }

        const MAP_PATH_AND_ASSIGN = (exports.MAP_PATH_AND_ASSIGN =
          'MAP_PATH_AND_ASSIGN');
        function mapPathAndAssign(
          address,
          slot,
          assignments,
          typeIdentifier,
          parentType
        ) {
          return {
            type: MAP_PATH_AND_ASSIGN,
            address,
            slot,
            assignments,
            typeIdentifier,
            parentType
          };
        }

        const RESET = (exports.RESET = 'DATA_RESET');
        function reset() {
          return { type: RESET };
        }

        const DEFINE_TYPE = (exports.DEFINE_TYPE = 'DEFINE_TYPE');
        function defineType(node) {
          return {
            type: DEFINE_TYPE,
            node
          };
        }

        const ALLOCATE = (exports.ALLOCATE = 'ALLOCATE');
        function allocate(storage, memory, calldata) {
          return {
            type: ALLOCATE,
            storage,
            memory,
            calldata
          };
        }

        /***/
      },
      /* 29 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.addContext = addContext;
        exports.normalizeContexts = normalizeContexts;
        exports.addInstance = addInstance;
        exports.saveGlobals = saveGlobals;
        exports.call = call;
        exports.create = create;
        exports.returnCall = returnCall;
        exports.fail = fail;
        exports.store = store;
        exports.load = load;
        exports.reset = reset;
        exports.unloadTransaction = unloadTransaction;
        const ADD_CONTEXT = (exports.ADD_CONTEXT = 'EVM_ADD_CONTEXT');
        function addContext({
          contractName,
          binary,
          sourceMap,
          compiler,
          abi,
          contractId,
          contractKind,
          isConstructor
        }) {
          return {
            type: ADD_CONTEXT,
            contractName,
            binary,
            sourceMap,
            compiler,
            abi,
            contractId,
            contractKind,
            isConstructor
          };
        }

        const NORMALIZE_CONTEXTS = (exports.NORMALIZE_CONTEXTS =
          'EVM_NORMALIZE_CONTEXTS');
        function normalizeContexts() {
          return { type: NORMALIZE_CONTEXTS };
        }

        const ADD_INSTANCE = (exports.ADD_INSTANCE = 'EVM_ADD_INSTANCE');
        function addInstance(address, context, binary) {
          return {
            type: ADD_INSTANCE,
            address,
            context,
            binary
          };
        }

        const SAVE_GLOBALS = (exports.SAVE_GLOBALS = 'SAVE_GLOBALS');
        function saveGlobals(origin, gasprice, block) {
          return {
            type: SAVE_GLOBALS,
            origin,
            gasprice,
            block
          };
        }

        const CALL = (exports.CALL = 'CALL');
        function call(address, data, storageAddress, sender, value) {
          return {
            type: CALL,
            address,
            data,
            storageAddress,
            sender,
            value
          };
        }

        const CREATE = (exports.CREATE = 'CREATE');
        function create(binary, storageAddress, sender, value) {
          return {
            type: CREATE,
            binary,
            storageAddress,
            sender,
            value
          };
        }

        const RETURN = (exports.RETURN = 'RETURN');
        function returnCall() {
          return {
            type: RETURN
          };
        }

        const FAIL = (exports.FAIL = 'FAIL');
        function fail() {
          return {
            type: FAIL
          };
        }

        const STORE = (exports.STORE = 'STORE');
        function store(address, slot, value) {
          return {
            type: STORE,
            address,
            slot,
            value
          };
        }

        const LOAD = (exports.LOAD = 'LOAD');
        function load(address, slot, value) {
          return {
            type: LOAD,
            address,
            slot,
            value
          };
        }

        const RESET = (exports.RESET = 'EVM_RESET');
        function reset(storageAddress) {
          return {
            type: RESET,
            storageAddress
          };
        }

        const UNLOAD_TRANSACTION = (exports.UNLOAD_TRANSACTION =
          'EVM_UNLOAD_TRANSACTION');
        function unloadTransaction() {
          return {
            type: UNLOAD_TRANSACTION
          };
        }

        /***/
      },
      /* 30 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.inspectTransaction = inspectTransaction;
        exports.obtainBinaries = obtainBinaries;
        exports.init = init;
        exports.saga = saga;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _helpers = __webpack_require__(1);

        var _actions = __webpack_require__(55);

        var actions = _interopRequireWildcard(_actions);

        var _actions2 = __webpack_require__(14);

        var session = _interopRequireWildcard(_actions2);

        var _bn = __webpack_require__(15);

        var _bn2 = _interopRequireDefault(_bn);

        var _web = __webpack_require__(31);

        var _web2 = _interopRequireDefault(_web);

        var _truffleDecodeUtils = __webpack_require__(4);

        var DecodeUtils = _interopRequireWildcard(_truffleDecodeUtils);

        var _adapter = __webpack_require__(56);

        var _adapter2 = _interopRequireDefault(_adapter);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:web3:sagas'); //just for utils!

        function* fetchTransactionInfo(adapter, { txHash }) {
          debug('inspecting transaction');
          var trace;
          try {
            trace = yield (0, _effects.apply)(adapter, adapter.getTrace, [
              txHash
            ]);
          } catch (e) {
            debug('putting error');
            yield (0, _effects.put)(actions.error(e));
            return;
          }

          debug('got trace');
          yield (0, _effects.put)(actions.receiveTrace(trace));

          let tx = yield (0, _effects.apply)(adapter, adapter.getTransaction, [
            txHash
          ]);
          debug('tx %O', tx);
          let receipt = yield (0, _effects.apply)(adapter, adapter.getReceipt, [
            txHash
          ]);
          debug('receipt %O', receipt);
          let block = yield (0, _effects.apply)(adapter, adapter.getBlock, [
            tx.blockNumber
          ]);
          debug('block %O', block);

          yield (0, _effects.put)(session.saveTransaction(tx));
          yield (0, _effects.put)(session.saveReceipt(receipt));
          yield (0, _effects.put)(session.saveBlock(block));

          //these ones get grouped together for convenience
          let solidityBlock = {
            coinbase: block.miner,
            difficulty: new _bn2.default(block.difficulty),
            gaslimit: new _bn2.default(block.gasLimit),
            number: new _bn2.default(block.number),
            timestamp: new _bn2.default(block.timestamp)
          };

          if (tx.to != null) {
            yield (0, _effects.put)(
              actions.receiveCall({
                address: tx.to,
                data: tx.input,
                storageAddress: tx.to,
                sender: tx.from,
                value: new _bn2.default(tx.value),
                gasprice: new _bn2.default(tx.gasPrice),
                block: solidityBlock
              })
            );
          } else {
            let storageAddress = _web2.default.utils.isAddress(
              receipt.contractAddress
            )
              ? receipt.contractAddress
              : DecodeUtils.EVM.ZERO_ADDRESS;
            yield (0, _effects.put)(
              actions.receiveCall({
                binary: tx.input,
                storageAddress,
                status: receipt.status,
                sender: tx.from,
                value: new _bn2.default(tx.value),
                gasprice: new _bn2.default(tx.gasPrice),
                block: solidityBlock
              })
            );
          }
        }

        function* fetchBinary(adapter, { address, block }) {
          debug('fetching binary for %s', address);
          let binary = yield (0, _effects.apply)(
            adapter,
            adapter.getDeployedCode,
            [address, block]
          );

          debug('received binary for %s', address);
          yield (0, _effects.put)(actions.receiveBinary(address, binary));
        }

        function* inspectTransaction(txHash) {
          yield (0, _effects.put)(actions.inspect(txHash));

          let action = yield (0, _effects.take)([
            actions.RECEIVE_TRACE,
            actions.ERROR_WEB3
          ]);
          debug('action %o', action);

          var trace;
          if (action.type == actions.RECEIVE_TRACE) {
            trace = action.trace;
            debug('received trace');
          } else {
            return { error: action.error };
          }

          let {
            address,
            binary,
            data,
            storageAddress,
            status,
            sender,
            value,
            gasprice,
            block
          } = yield (0, _effects.take)(actions.RECEIVE_CALL);
          debug('received call');

          return {
            trace,
            address,
            binary,
            data,
            storageAddress,
            status,
            sender,
            value,
            gasprice,
            block
          };
        }

        //NOTE: the block argument is optional
        function* obtainBinaries(addresses, block) {
          let tasks = yield (0, _effects.all)(
            addresses.map(address => (0, _effects.fork)(receiveBinary, address))
          );

          debug('requesting binaries');
          yield (0, _effects.all)(
            addresses.map(address =>
              (0, _effects.put)(actions.fetchBinary(address, block))
            )
          );

          let binaries = [];
          binaries = yield (0, _effects.join)(tasks);

          debug('binaries %o', binaries);

          return binaries;
        }

        function* receiveBinary(address) {
          let { binary } = yield (0, _effects.take)(
            action =>
              action.type == actions.RECEIVE_BINARY && action.address == address
          );
          debug('got binary for %s', address);

          return binary;
        }

        function* init(provider) {
          yield (0, _effects.put)(actions.init(provider));
        }

        function* saga() {
          // wait for web3 init signal
          let { provider } = yield (0, _effects.take)(actions.INIT_WEB3);
          let adapter = new _adapter2.default(provider);

          yield (0, _effects.takeEvery)(
            actions.INSPECT,
            fetchTransactionInfo,
            adapter
          );
          yield (0, _effects.takeEvery)(
            actions.FETCH_BINARY,
            fetchBinary,
            adapter
          );
        }

        exports.default = (0, _helpers.prefixName)('web3', saga);

        /***/
      },
      /* 31 */
      /***/ function(module, exports) {
        module.exports = require('web3');

        /***/
      },
      /* 32 */
      /***/ function(module, exports) {
        module.exports = require('truffle-decoder');

        /***/
      },
      /* 33 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _keys = __webpack_require__(16);

        var _keys2 = _interopRequireDefault(_keys);

        exports.saga = saga;
        exports.reset = reset;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _helpers = __webpack_require__(1);

        var _sagas = __webpack_require__(13);

        var trace = _interopRequireWildcard(_sagas);

        var _sagas2 = __webpack_require__(17);

        var data = _interopRequireWildcard(_sagas2);

        var _sagas3 = __webpack_require__(24);

        var evm = _interopRequireWildcard(_sagas3);

        var _sagas4 = __webpack_require__(34);

        var solidity = _interopRequireWildcard(_sagas4);

        var _actions = __webpack_require__(20);

        var actions = _interopRequireWildcard(_actions);

        var _selectors = __webpack_require__(25);

        var _selectors2 = _interopRequireDefault(_selectors);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:controller:sagas');

        const STEP_SAGAS = {
          [actions.ADVANCE]: advance,
          [actions.STEP_NEXT]: stepNext,
          [actions.STEP_OVER]: stepOver,
          [actions.STEP_INTO]: stepInto,
          [actions.STEP_OUT]: stepOut,
          [actions.CONTINUE]: continueUntilBreakpoint
        };

        function* saga() {
          while (true) {
            debug('waiting for control action');
            let action = yield (0, _effects.take)(
              (0, _keys2.default)(STEP_SAGAS)
            );
            if (
              !(yield (0, _effects.select)(
                _selectors2.default.current.trace.loaded
              ))
            ) {
              continue; //while no trace is loaded, step actions are ignored
            }
            debug('got control action');
            let saga = STEP_SAGAS[action.type];

            yield (0, _effects.put)(actions.startStepping());
            yield (0, _effects.race)({
              exec: (0, _effects.call)(saga, action), //not all will use this
              interrupt: (0, _effects.take)(actions.INTERRUPT)
            });
            yield (0, _effects.put)(actions.doneStepping());
          }
        }

        exports.default = (0, _helpers.prefixName)('controller', saga);

        /*
         * Advance the state by the given number of instructions (but not past the end)
         * (if no count given, advance 1)
         */

        function* advance(action) {
          let count =
            action !== undefined && action.count !== undefined
              ? action.count
              : 1;
          //default is, as mentioned, to advance 1
          for (
            let i = 0;
            i < count &&
            !(yield (0, _effects.select)(
              _selectors2.default.current.trace.finished
            ));
            i++
          ) {
            yield* trace.advance();
          }
        }

        /**
         * stepNext - step to the next logical code segment
         *
         * Note: It might take multiple instructions to express the same section of code.
         * "Stepping", then, is stepping to the next logical item, not stepping to the next
         * instruction. See advance() if you'd like to advance by one instruction.
         */
        function* stepNext() {
          const startingRange = yield (0, _effects.select)(
            _selectors2.default.current.location.sourceRange
          );

          var upcoming, finished;

          do {
            // advance at least once step
            yield* advance();

            // and check the next source range
            try {
              upcoming = yield (0, _effects.select)(
                _selectors2.default.current.location
              );
            } catch (e) {
              upcoming = null;
            }

            finished = yield (0, _effects.select)(
              _selectors2.default.current.trace.finished
            );

            // if the next step's source range is still the same, keep going
          } while (
            !finished &&
            (!upcoming ||
              !upcoming.node ||
              (0, _helpers.isDeliberatelySkippedNodeType)(upcoming.node) ||
              (upcoming.sourceRange.start == startingRange.start &&
                upcoming.sourceRange.length == startingRange.length))
          );
        }

        /**
         * stepInto - step into the current function
         *
         * Conceptually this is easy, but from a programming standpoint it's hard.
         * Code like `getBalance(msg.sender)` might be highlighted, but there could
         * be a number of different intermediate steps (like evaluating `msg.sender`)
         * before `getBalance` is stepped into. This function will step into the first
         * function available (where instruction.jump == "i"), ignoring any intermediate
         * steps that fall within the same code range. If there's a step encountered
         * that exists outside of the range, then stepInto will only execute until that
         * step.
         */
        function* stepInto() {
          if (
            yield (0, _effects.select)(_selectors2.default.current.willJump)
          ) {
            yield* stepNext();
            return;
          }

          if (
            yield (0, _effects.select)(
              _selectors2.default.current.location.isMultiline
            )
          ) {
            yield* stepOver();
            return;
          }

          const startingDepth = yield (0, _effects.select)(
            _selectors2.default.current.functionDepth
          );
          const startingRange = yield (0, _effects.select)(
            _selectors2.default.current.location.sourceRange
          );
          var currentDepth;
          var currentRange;

          do {
            yield* stepNext();

            currentDepth = yield (0, _effects.select)(
              _selectors2.default.current.functionDepth
            );
            currentRange = yield (0, _effects.select)(
              _selectors2.default.current.location.sourceRange
            );
          } while (
            // the function stack has not increased,
            currentDepth <= startingDepth &&
            // the current source range begins on or after the starting range
            currentRange.start >= startingRange.start &&
            // and the current range ends on or before the starting range ends
            currentRange.start + currentRange.length <=
              startingRange.start + startingRange.length
          );
        }

        /**
         * Step out of the current function
         *
         * This will run until the debugger encounters a decrease in function depth.
         */
        function* stepOut() {
          if (
            yield (0, _effects.select)(
              _selectors2.default.current.location.isMultiline
            )
          ) {
            yield* stepOver();
            return;
          }

          const startingDepth = yield (0, _effects.select)(
            _selectors2.default.current.functionDepth
          );
          var currentDepth;

          do {
            yield* stepNext();

            currentDepth = yield (0, _effects.select)(
              _selectors2.default.current.functionDepth
            );
          } while (currentDepth >= startingDepth);
        }

        /**
         * stepOver - step over the current line
         *
         * Step over the current line. This will step to the next instruction that
         * exists on a different line of code within the same function depth.
         */
        function* stepOver() {
          const startingDepth = yield (0, _effects.select)(
            _selectors2.default.current.functionDepth
          );
          const startingRange = yield (0, _effects.select)(
            _selectors2.default.current.location.sourceRange
          );
          var currentDepth;
          var currentRange;

          do {
            yield* stepNext();

            currentDepth = yield (0, _effects.select)(
              _selectors2.default.current.functionDepth
            );
            currentRange = yield (0, _effects.select)(
              _selectors2.default.current.location.sourceRange
            );
          } while (
            // keep stepping provided:
            //
            // we haven't jumped out
            !(currentDepth < startingDepth) &&
            // either: function depth is greater than starting (ignore function calls)
            // or, if we're at the same depth, keep stepping until we're on a new
            // line.
            (currentDepth > startingDepth ||
              currentRange.lines.start.line == startingRange.lines.start.line)
          );
        }

        /**
         * continueUntilBreakpoint - step through execution until a breakpoint
         */
        function* continueUntilBreakpoint(action) {
          var currentLocation, currentNode, currentLine, currentSourceId;
          var finished;
          var previousLine, previousSourceId;

          //if breakpoints was not specified, use the stored list from the state.
          //if it was, override that with the specified list.
          //note that explicitly specifying an empty list will advance to the end.
          let breakpoints =
            action !== undefined && action.breakpoints !== undefined
              ? action.breakpoints
              : yield (0, _effects.select)(_selectors2.default.breakpoints);

          let breakpointHit = false;

          currentLocation = yield (0, _effects.select)(
            _selectors2.default.current.location
          );
          currentNode = currentLocation.node.id;
          currentLine = currentLocation.sourceRange.lines.start.line;
          currentSourceId = currentLocation.source.id;

          do {
            yield* stepNext();

            previousLine = currentLine;
            previousSourceId = currentSourceId;

            currentLocation = yield (0, _effects.select)(
              _selectors2.default.current.location
            );
            finished = yield (0, _effects.select)(
              _selectors2.default.current.trace.finished
            );
            debug('finished %o', finished);

            currentNode = currentLocation.node.id;
            currentLine = currentLocation.sourceRange.lines.start.line;
            currentSourceId = currentLocation.source.id;

            breakpointHit =
              breakpoints.filter(({ sourceId, line, node }) => {
                if (node !== undefined) {
                  debug('node %d currentNode %d', node, currentNode);
                  return sourceId === currentSourceId && node === currentNode;
                }
                //otherwise, we have a line-style breakpoint; we want to stop at the
                //*first* point on the line
                return (
                  sourceId === currentSourceId &&
                  line === currentLine &&
                  (currentSourceId !== previousSourceId ||
                    currentLine !== previousLine)
                );
              }).length > 0;
          } while (!breakpointHit && !finished);
        }

        /**
         * reset -- reset the state of the debugger
         */
        function* reset() {
          yield* data.reset();
          yield* evm.reset();
          yield* solidity.reset();
          yield* trace.reset();
        }

        /***/
      },
      /* 34 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.addSource = addSource;
        exports.reset = reset;
        exports.saga = saga;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _helpers = __webpack_require__(1);

        var _actions = __webpack_require__(35);

        var actions = _interopRequireWildcard(_actions);

        var _actions2 = __webpack_require__(12);

        var _sagas = __webpack_require__(13);

        var trace = _interopRequireWildcard(_sagas);

        var _selectors = __webpack_require__(11);

        var _selectors2 = _interopRequireDefault(_selectors);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:solidity:sagas');

        function* addSource(source, sourcePath, ast, compiler) {
          yield (0, _effects.put)(
            actions.addSource(source, sourcePath, ast, compiler)
          );
        }

        function* tickSaga() {
          debug('got TICK');

          yield* functionDepthSaga();
          yield* trace.signalTickSagaCompletion();
        }

        function* functionDepthSaga() {
          if (
            yield (0, _effects.select)(_selectors2.default.current.willFail)
          ) {
            //we do this case first so we can be sure we're not failing in any of the
            //other cases below!
            yield (0, _effects.put)(actions.externalReturn());
          } else if (
            yield (0, _effects.select)(_selectors2.default.current.willJump)
          ) {
            let jumpDirection = yield (0, _effects.select)(
              _selectors2.default.current.jumpDirection
            );
            yield (0, _effects.put)(actions.jump(jumpDirection));
          } else if (
            yield (0, _effects.select)(_selectors2.default.current.willCall)
          ) {
            debug('about to call');
            if (
              yield (0, _effects.select)(
                _selectors2.default.current.callsPrecompileOrExternal
              )
            ) {
              //call to precompile or externally-owned account; do nothing
            } else {
              yield (0, _effects.put)(actions.externalCall());
            }
          } else if (
            yield (0, _effects.select)(_selectors2.default.current.willCreate)
          ) {
            yield (0, _effects.put)(actions.externalCall());
          } else if (
            yield (0, _effects.select)(_selectors2.default.current.willReturn)
          ) {
            yield (0, _effects.put)(actions.externalReturn());
          }
        }

        function* reset() {
          yield (0, _effects.put)(actions.reset());
        }

        function* saga() {
          yield (0, _effects.takeEvery)(_actions2.TICK, tickSaga);
        }

        exports.default = (0, _helpers.prefixName)('solidity', saga);

        /***/
      },
      /* 35 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.addSource = addSource;
        exports.jump = jump;
        exports.externalCall = externalCall;
        exports.externalReturn = externalReturn;
        exports.reset = reset;
        const ADD_SOURCE = (exports.ADD_SOURCE = 'SOLIDITY_ADD_SOURCE');
        function addSource(source, sourcePath, ast, compiler) {
          return {
            type: ADD_SOURCE,
            source,
            sourcePath,
            ast,
            compiler
          };
        }

        const JUMP = (exports.JUMP = 'JUMP');
        function jump(jumpDirection) {
          return {
            type: JUMP,
            jumpDirection
          };
        }

        const EXTERNAL_CALL = (exports.EXTERNAL_CALL = 'EXTERNAL_CALL');
        function externalCall() {
          return { type: EXTERNAL_CALL };
        }

        const EXTERNAL_RETURN = (exports.EXTERNAL_RETURN = 'EXTERNAL_RETURN');
        function externalReturn() {
          return { type: EXTERNAL_RETURN };
        }

        const RESET = (exports.RESET = 'SOLIDITY_RESET');
        function reset() {
          return { type: RESET };
        }

        /***/
      },
      /* 36 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _reselectTree = __webpack_require__(3);

        var _selectors = __webpack_require__(11);

        var _selectors2 = _interopRequireDefault(_selectors);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:ast:selectors');

        /**
         * ast
         */
        const ast = (0, _reselectTree.createSelectorTree)({
          /**
           * ast.views
           */
          views: {
            /**
             * ast.views.sources
             */
            sources: (0, _reselectTree.createLeaf)(
              [_selectors2.default.info.sources],
              sources => sources
            )
          }
        });

        exports.default = ast;

        /***/
      },
      /* 37 */
      /***/ function(module, exports, __webpack_require__) {
        var Debugger = __webpack_require__(38).default;

        module.exports = Debugger;

        /***/
      },
      /* 38 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _asyncToGenerator2 = __webpack_require__(18);

        var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _truffleExpect = __webpack_require__(39);

        var _truffleExpect2 = _interopRequireDefault(_truffleExpect);

        var _session = __webpack_require__(40);

        var _session2 = _interopRequireDefault(_session);

        var _reselectTree = __webpack_require__(3);

        var _selectors = __webpack_require__(21);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _selectors3 = __webpack_require__(36);

        var _selectors4 = _interopRequireDefault(_selectors3);

        var _selectors5 = __webpack_require__(10);

        var _selectors6 = _interopRequireDefault(_selectors5);

        var _selectors7 = __webpack_require__(9);

        var _selectors8 = _interopRequireDefault(_selectors7);

        var _selectors9 = __webpack_require__(11);

        var _selectors10 = _interopRequireDefault(_selectors9);

        var _selectors11 = __webpack_require__(27);

        var _selectors12 = _interopRequireDefault(_selectors11);

        var _selectors13 = __webpack_require__(25);

        var _selectors14 = _interopRequireDefault(_selectors13);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger');

        /**
         * @example
         * let session = Debugger
         *   .forTx(<txHash>, {
         *     contracts: [<contract obj>, ...],
         *     provider: <provider instance>
         *   })
         *   .connect();
         */
        class Debugger {
          /**
           * @param {Session} session - debugger session
           * @private
           */
          constructor(session) {
            /**
             * @private
             */
            this._session = session;
          }

          /**
           * Instantiates a Debugger for a given transaction hash.
           *
           * @param {String} txHash - transaction hash with leading "0x"
           * @param {{contracts: Array<Contract>, files: Array<String>, provider: Web3Provider}} options -
           * @return {Debugger} instance
           */
          static forTx(txHash, options = {}) {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function*() {
              _truffleExpect2.default.options(options, [
                'contracts',
                'provider'
              ]);

              let session = new _session2.default(
                options.contracts,
                options.files,
                options.provider,
                txHash
              );

              try {
                yield session.ready();
                debug('session ready');
              } catch (e) {
                debug('error occurred, unloaded');
                session.unload();
              }

              return new _this(session);
            })();
          }

          /*
           * Instantiates a Debugger for a given project (with no transaction loaded)
           *
           * @param {{contracts: Array<Contract>, files: Array<String>, provider: Web3Provider}} options -
           * @return {Debugger} instance
           */
          static forProject(options = {}) {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              _truffleExpect2.default.options(options, [
                'contracts',
                'provider'
              ]);

              let session = new _session2.default(
                options.contracts,
                options.files,
                options.provider
              );

              yield session.ready();

              return new _this2(session);
            })();
          }

          /**
           * Connects to the instantiated Debugger.
           *
           * @return {Session} session instance
           */
          connect() {
            return this._session;
          }

          /**
           * Exported selectors
           *
           * See individual selector docs for full listing
           *
           * @example
           * Debugger.selectors.ast.current.tree
           *
           * @example
           * Debugger.selectors.solidity.current.instruction
           *
           * @example
           * Debugger.selectors.trace.steps
           */
          static get selectors() {
            return (0, _reselectTree.createNestedSelector)({
              ast: _selectors4.default,
              data: _selectors2.default,
              trace: _selectors6.default,
              evm: _selectors8.default,
              solidity: _selectors10.default,
              session: _selectors12.default,
              controller: _selectors14.default
            });
          }
        }

        exports.default = Debugger;
        /**
         * @typedef {Object} Contract
         * @property {string} contractName contract name
         * @property {string} source solidity source code
         * @property {string} sourcePath path to source file
         * @property {string} binary 0x-prefixed hex string with create bytecode
         * @property {string} sourceMap solidity source map for create bytecode
         * @property {Object} ast Abstract Syntax Tree from Solidity
         * @property {string} deployedBinary 0x-prefixed compiled binary (on chain)
         * @property {string} deployedSourceMap solidity source map for on-chain bytecode
         */

        /***/
      },
      /* 39 */
      /***/ function(module, exports) {
        module.exports = require('truffle-expect');

        /***/
      },
      /* 40 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _entries = __webpack_require__(7);

        var _entries2 = _interopRequireDefault(_entries);

        var _values = __webpack_require__(19);

        var _values2 = _interopRequireDefault(_values);

        var _asyncToGenerator2 = __webpack_require__(18);

        var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

        var _promise = __webpack_require__(41);

        var _promise2 = _interopRequireDefault(_promise);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _store = __webpack_require__(42);

        var _store2 = _interopRequireDefault(_store);

        var _actions = __webpack_require__(20);

        var controller = _interopRequireWildcard(_actions);

        var _actions2 = __webpack_require__(14);

        var actions = _interopRequireWildcard(_actions2);

        var _selectors = __webpack_require__(21);

        var _selectors2 = _interopRequireDefault(_selectors);

        var _selectors3 = __webpack_require__(27);

        var _selectors4 = _interopRequireDefault(_selectors3);

        var _sagas = __webpack_require__(17);

        var dataSagas = _interopRequireWildcard(_sagas);

        var _sagas2 = __webpack_require__(33);

        var controllerSagas = _interopRequireWildcard(_sagas2);

        var _sagas3 = __webpack_require__(59);

        var sagas = _interopRequireWildcard(_sagas3);

        var _selectors5 = __webpack_require__(25);

        var _selectors6 = _interopRequireDefault(_selectors5);

        var _reducers = __webpack_require__(61);

        var _reducers2 = _interopRequireDefault(_reducers);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:session');

        /**
         * Debugger Session
         */
        class Session {
          /**
           * @param {Array<Contract>} contracts - contract definitions
           * @param {Array<String>} files - array of filenames for sourceMap indexes
           * @param {Web3Provider} provider - web3 provider
           * txHash parameter is now optional!
           * @private
           */
          constructor(contracts, files, provider, txHash) {
            /**
             * @private
             */
            let { store, sagaMiddleware } = (0, _store2.default)(
              _reducers2.default,
              sagas.default
            );
            this._store = store;
            this._sagaMiddleware = sagaMiddleware;

            let { contexts, sources } = Session.normalize(contracts, files);

            // record contracts
            this._store.dispatch(actions.recordContracts(contexts, sources));

            //set up the ready listener
            this._ready = new _promise2.default((accept, reject) => {
              const unsubscribe = this._store.subscribe(() => {
                if (this.view(_selectors4.default.status.ready)) {
                  debug('ready!');
                  unsubscribe();
                  accept();
                } else if (this.view(_selectors4.default.status.errored)) {
                  debug('error!');
                  unsubscribe();
                  reject(this.view(_selectors4.default.status.error));
                }
              });
            });

            //note that txHash is now optional
            this._store.dispatch(actions.start(provider, txHash));
          }

          ready() {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function*() {
              yield _this._ready;
            })();
          }

          readyAgainAfterLoading(sessionAction) {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return new _promise2.default(function(accept, reject) {
                let hasStartedWaiting = false;
                debug('reready listener set up');
                const unsubscribe = _this2._store.subscribe(function() {
                  debug('reready?');
                  if (hasStartedWaiting) {
                    if (_this2.view(_selectors4.default.status.ready)) {
                      debug('reready!');
                      unsubscribe();
                      accept(true);
                    } else if (
                      _this2.view(_selectors4.default.status.errored)
                    ) {
                      unsubscribe();
                      debug('error!');
                      reject(_this2.view(_selectors4.default.status.error));
                    }
                  } else {
                    if (_this2.view(_selectors4.default.status.waiting)) {
                      debug('started waiting');
                      hasStartedWaiting = true;
                    }
                    return;
                  }
                });
                _this2.dispatch(sessionAction);
              });
            })();
          }

          /**
           * Split up artifacts into "contexts" and "sources", dividing artifact
           * data into appropriate buckets.
           *
           * Multiple contracts can be defined in the same source file, but have
           * different bytecodes.
           *
           * This iterates over the contracts and collects binaries separately
           * from sources, using the optional `files` argument to force
           * source ordering.
           * @private
           */
          static normalize(contracts, files = null) {
            let sourcesByPath = {};
            let contexts = [];
            let sources;

            for (let contract of contracts) {
              let {
                contractName,
                binary,
                sourceMap,
                deployedBinary,
                deployedSourceMap,
                sourcePath,
                source,
                ast,
                abi,
                compiler
              } = contract;

              let contractNode = ast.nodes.find(
                node =>
                  node.nodeType === 'ContractDefinition' &&
                  node.name === contractName
              ); //ideally we'd hold this off till later, but that would break the
              //direction of the evm/solidity dependence, so we do it now

              let contractId = contractNode.id;
              let contractKind = contractNode.contractKind;

              debug('contractName %s', contractName);
              debug('sourceMap %o', sourceMap);
              debug('compiler %o', compiler);
              debug('abi %O', abi);

              sourcesByPath[sourcePath] = { sourcePath, source, ast, compiler };

              if (binary && binary != '0x') {
                contexts.push({
                  contractName,
                  binary,
                  sourceMap,
                  abi,
                  compiler,
                  contractId,
                  contractKind,
                  isConstructor: true
                });
              }

              if (deployedBinary && deployedBinary != '0x') {
                contexts.push({
                  contractName,
                  binary: deployedBinary,
                  sourceMap: deployedSourceMap,
                  abi,
                  compiler,
                  contractId,
                  contractKind,
                  isConstructor: false
                });
              }
            }

            if (!files) {
              sources = (0, _values2.default)(sourcesByPath);
            } else {
              sources = files.map(file => sourcesByPath[file]);
            }

            return { contexts, sources };
          }

          get state() {
            return this._store.getState();
          }

          view(selector) {
            return selector(this.state);
          }

          dispatch(action) {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              _this3._store.dispatch(action);

              return true;
            })();
          }

          /**
           * @private
           * Allows running any saga -- for internal use only!
           * Using this could seriously screw up the debugger state if you
           * don't know what you're doing!
           */
          _runSaga(saga, ...args) {
            var _this4 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this4._sagaMiddleware
                .run(saga, ...args)
                .toPromise();
            })();
          }

          interrupt() {
            var _this5 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              yield _this5.dispatch(actions.interrupt());
              yield _this5.dispatch(controller.interrupt());
            })();
          }

          doneStepping(stepperAction) {
            var _this6 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return new _promise2.default(function(resolve) {
                let hasStarted = false;
                const unsubscribe = _this6._store.subscribe(function() {
                  const isStepping = _this6.view(
                    _selectors6.default.isStepping
                  );

                  if (isStepping && !hasStarted) {
                    hasStarted = true;
                    debug('heard step start');
                    return;
                  }

                  if (!isStepping && hasStarted) {
                    debug('heard step stop');
                    unsubscribe();
                    resolve(true);
                  }
                });
                _this6.dispatch(stepperAction);
              });
            })();
          }

          //returns true on success, false on already loaded, error object on failure
          load(txHash) {
            var _this7 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              if (_this7.view(_selectors4.default.status.loaded)) {
                return false;
              }
              try {
                return yield _this7.readyAgainAfterLoading(
                  actions.loadTransaction(txHash)
                );
              } catch (e) {
                _this7._runSaga(sagas.unload);
                return e;
              }
            })();
          }

          //returns true on success, false on already unloaded
          unload() {
            var _this8 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              if (!_this8.view(_selectors4.default.status.loaded)) {
                return false;
              }
              debug('unloading');
              yield _this8._runSaga(sagas.unload);
              return true;
            })();
          }

          //Note: count is an optional argument; default behavior is to advance 1
          advance(count) {
            var _this9 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this9.doneStepping(controller.advance(count));
            })();
          }

          stepNext() {
            var _this10 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this10.doneStepping(controller.stepNext());
            })();
          }

          stepOver() {
            var _this11 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this11.doneStepping(controller.stepOver());
            })();
          }

          stepInto() {
            var _this12 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this12.doneStepping(controller.stepInto());
            })();
          }

          stepOut() {
            var _this13 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this13.doneStepping(controller.stepOut());
            })();
          }

          reset() {
            var _this14 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              let loaded = _this14.view(_selectors4.default.status.loaded);
              if (!loaded) {
                return;
              }
              return yield _this14._runSaga(controllerSagas.reset);
            })();
          }

          //NOTE: breakpoints is an OPTIONAL argument for if you want to supply your
          //own list of breakpoints; leave it out to use the internal one (as
          //controlled by the functions below)
          continueUntilBreakpoint(breakpoints) {
            var _this15 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this15.doneStepping(
                controller.continueUntilBreakpoint(breakpoints)
              );
            })();
          }

          addBreakpoint(breakpoint) {
            var _this16 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this16.dispatch(
                controller.addBreakpoint(breakpoint)
              );
            })();
          }

          removeBreakpoint(breakpoint) {
            var _this17 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this17.dispatch(
                controller.removeBreakpoint(breakpoint)
              );
            })();
          }

          removeAllBreakpoints() {
            var _this18 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this18.dispatch(controller.removeAllBreakpoints());
            })();
          }

          //deprecated -- decode is now *always* ready!
          decodeReady() {
            return (0, _asyncToGenerator3.default)(function*() {
              return true;
            })();
          }

          variable(name) {
            var _this19 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              const definitions = _this19.view(
                _selectors2.default.current.identifiers.definitions
              );
              const refs = _this19.view(
                _selectors2.default.current.identifiers.refs
              );

              return yield _this19._runSaga(
                dataSagas.decode,
                definitions[name],
                refs[name]
              );
            })();
          }

          variables() {
            var _this20 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              if (!_this20.view(_selectors4.default.status.loaded)) {
                return {};
              }
              let definitions = _this20.view(
                _selectors2.default.current.identifiers.definitions
              );
              let refs = _this20.view(
                _selectors2.default.current.identifiers.refs
              );
              let decoded = {};
              for (let [identifier, ref] of (0, _entries2.default)(refs)) {
                if (identifier in definitions) {
                  decoded[identifier] = yield _this20._runSaga(
                    dataSagas.decode,
                    definitions[identifier],
                    ref
                  );
                }
              }
              return decoded;
            })();
          }
        }
        exports.default = Session;

        /***/
      },
      /* 41 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/core-js/promise');

        /***/
      },
      /* 42 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        if (true) {
          module.exports = __webpack_require__(43);
        } else if (process.env.NODE_ENV === 'test') {
          module.exports = require('./test');
        } else {
          module.exports = require('./development');
        }

        /***/
      },
      /* 43 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _common = __webpack_require__(44);

        var _common2 = _interopRequireDefault(_common);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        exports.default = _common2.default;

        /***/
      },
      /* 44 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _entries = __webpack_require__(7);

        var _entries2 = _interopRequireDefault(_entries);

        var _assign = __webpack_require__(8);

        var _assign2 = _interopRequireDefault(_assign);

        exports.abbreviateValues = abbreviateValues;
        exports.default = configureStore;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _redux = __webpack_require__(6);

        var _reduxSaga = __webpack_require__(45);

        var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

        var _reduxCliLogger = __webpack_require__(46);

        var _reduxCliLogger2 = _interopRequireDefault(_reduxCliLogger);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:store:common');
        const reduxDebug = (0, _debug2.default)('debugger:redux');

        function abbreviateValues(value, options = {}, depth = 0) {
          options.stringLimit = options.stringLimit || 66;
          options.arrayLimit = options.arrayLimit || 8;
          options.recurseLimit = options.recurseLimit || 4;

          if (depth > options.recurseLimit) {
            return '...';
          }

          const recurse = child => abbreviateValues(child, options, depth + 1);

          if (value instanceof Array) {
            if (value.length > options.arrayLimit) {
              value = [
                ...value.slice(0, options.arrayLimit / 2),
                '...',
                ...value.slice(value.length - options.arrayLimit / 2 + 1)
              ];
            }

            return value.map(recurse);
          } else if (value instanceof Object) {
            return (0, _assign2.default)(
              {},
              ...(0, _entries2.default)(value).map(([k, v]) => ({
                [recurse(k)]: recurse(v)
              }))
            );
          } else if (
            typeof value === 'string' &&
            value.length > options.stringLimit
          ) {
            let inner = '...';
            let extractAmount = (options.stringLimit - inner.length) / 2;
            let leading = value.slice(0, Math.ceil(extractAmount));
            let trailing = value.slice(
              value.length - Math.floor(extractAmount)
            );
            return `${leading}${inner}${trailing}`;
          } else {
            return value;
          }
        }

        function configureStore(reducer, saga, initialState, composeEnhancers) {
          const sagaMiddleware = (0, _reduxSaga2.default)();

          if (!composeEnhancers) {
            composeEnhancers = _redux.compose;
          }

          const loggerMiddleware = (0, _reduxCliLogger2.default)({
            log: reduxDebug,
            stateTransformer: state =>
              abbreviateValues(state, {
                arrayLimit: 4,
                recurseLimit: 3
              }),
            actionTransformer: abbreviateValues
          });

          let store = (0, _redux.createStore)(
            reducer,
            initialState,
            composeEnhancers(
              (0, _redux.applyMiddleware)(sagaMiddleware, loggerMiddleware)
            )
          );

          sagaMiddleware.run(saga);

          return { store, sagaMiddleware };
        }

        /***/
      },
      /* 45 */
      /***/ function(module, exports) {
        module.exports = require('redux-saga');

        /***/
      },
      /* 46 */
      /***/ function(module, exports) {
        module.exports = require('redux-cli-logger');

        /***/
      },
      /* 47 */
      /***/ function(module, exports, __webpack_require__) {
        var json = typeof JSON !== 'undefined' ? JSON : __webpack_require__(48);

        module.exports = function(obj, opts) {
          if (!opts) opts = {};
          if (typeof opts === 'function') opts = { cmp: opts };
          var space = opts.space || '';
          if (typeof space === 'number') space = Array(space + 1).join(' ');
          var cycles = typeof opts.cycles === 'boolean' ? opts.cycles : false;
          var replacer =
            opts.replacer ||
            function(key, value) {
              return value;
            };

          var cmp =
            opts.cmp &&
            (function(f) {
              return function(node) {
                return function(a, b) {
                  var aobj = { key: a, value: node[a] };
                  var bobj = { key: b, value: node[b] };
                  return f(aobj, bobj);
                };
              };
            })(opts.cmp);

          var seen = [];
          return (function stringify(parent, key, node, level) {
            var indent = space ? '\n' + new Array(level + 1).join(space) : '';
            var colonSeparator = space ? ': ' : ':';

            if (node && node.toJSON && typeof node.toJSON === 'function') {
              node = node.toJSON();
            }

            node = replacer.call(parent, key, node);

            if (node === undefined) {
              return;
            }
            if (typeof node !== 'object' || node === null) {
              return json.stringify(node);
            }
            if (isArray(node)) {
              var out = [];
              for (var i = 0; i < node.length; i++) {
                var item =
                  stringify(node, i, node[i], level + 1) ||
                  json.stringify(null);
                out.push(indent + space + item);
              }
              return '[' + out.join(',') + indent + ']';
            } else {
              if (seen.indexOf(node) !== -1) {
                if (cycles) return json.stringify('__cycle__');
                throw new TypeError('Converting circular structure to JSON');
              } else seen.push(node);

              var keys = objectKeys(node).sort(cmp && cmp(node));
              var out = [];
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = stringify(node, key, node[key], level + 1);

                if (!value) continue;

                var keyValue = json.stringify(key) + colonSeparator + value;
                out.push(indent + space + keyValue);
              }
              seen.splice(seen.indexOf(node), 1);
              return '{' + out.join(',') + indent + '}';
            }
          })({ '': obj }, '', obj, 0);
        };

        var isArray =
          Array.isArray ||
          function(x) {
            return {}.toString.call(x) === '[object Array]';
          };

        var objectKeys =
          Object.keys ||
          function(obj) {
            var has =
              Object.prototype.hasOwnProperty ||
              function() {
                return true;
              };
            var keys = [];
            for (var key in obj) {
              if (has.call(obj, key)) keys.push(key);
            }
            return keys;
          };

        /***/
      },
      /* 48 */
      /***/ function(module, exports, __webpack_require__) {
        exports.parse = __webpack_require__(49);
        exports.stringify = __webpack_require__(50);

        /***/
      },
      /* 49 */
      /***/ function(module, exports) {
        var at, // The index of the current character
          ch, // The current character
          escapee = {
            '"': '"',
            '\\': '\\',
            '/': '/',
            b: '\b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t'
          },
          text,
          error = function(m) {
            // Call error when something is wrong.
            throw {
              name: 'SyntaxError',
              message: m,
              at: at,
              text: text
            };
          },
          next = function(c) {
            // If a c parameter is provided, verify that it matches the current character.
            if (c && c !== ch) {
              error("Expected '" + c + "' instead of '" + ch + "'");
            }

            // Get the next character. When there are no more characters,
            // return the empty string.

            ch = text.charAt(at);
            at += 1;
            return ch;
          },
          number = function() {
            // Parse a number value.
            var number,
              string = '';

            if (ch === '-') {
              string = '-';
              next('-');
            }
            while (ch >= '0' && ch <= '9') {
              string += ch;
              next();
            }
            if (ch === '.') {
              string += '.';
              while (next() && ch >= '0' && ch <= '9') {
                string += ch;
              }
            }
            if (ch === 'e' || ch === 'E') {
              string += ch;
              next();
              if (ch === '-' || ch === '+') {
                string += ch;
                next();
              }
              while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
              }
            }
            number = +string;
            if (!isFinite(number)) {
              error('Bad number');
            } else {
              return number;
            }
          },
          string = function() {
            // Parse a string value.
            var hex,
              i,
              string = '',
              uffff;

            // When parsing for string values, we must look for " and \ characters.
            if (ch === '"') {
              while (next()) {
                if (ch === '"') {
                  next();
                  return string;
                } else if (ch === '\\') {
                  next();
                  if (ch === 'u') {
                    uffff = 0;
                    for (i = 0; i < 4; i += 1) {
                      hex = parseInt(next(), 16);
                      if (!isFinite(hex)) {
                        break;
                      }
                      uffff = uffff * 16 + hex;
                    }
                    string += String.fromCharCode(uffff);
                  } else if (typeof escapee[ch] === 'string') {
                    string += escapee[ch];
                  } else {
                    break;
                  }
                } else {
                  string += ch;
                }
              }
            }
            error('Bad string');
          },
          white = function() {
            // Skip whitespace.

            while (ch && ch <= ' ') {
              next();
            }
          },
          word = function() {
            // true, false, or null.

            switch (ch) {
              case 't':
                next('t');
                next('r');
                next('u');
                next('e');
                return true;
              case 'f':
                next('f');
                next('a');
                next('l');
                next('s');
                next('e');
                return false;
              case 'n':
                next('n');
                next('u');
                next('l');
                next('l');
                return null;
            }
            error("Unexpected '" + ch + "'");
          },
          value, // Place holder for the value function.
          array = function() {
            // Parse an array value.

            var array = [];

            if (ch === '[') {
              next('[');
              white();
              if (ch === ']') {
                next(']');
                return array; // empty array
              }
              while (ch) {
                array.push(value());
                white();
                if (ch === ']') {
                  next(']');
                  return array;
                }
                next(',');
                white();
              }
            }
            error('Bad array');
          },
          object = function() {
            // Parse an object value.

            var key,
              object = {};

            if (ch === '{') {
              next('{');
              white();
              if (ch === '}') {
                next('}');
                return object; // empty object
              }
              while (ch) {
                key = string();
                white();
                next(':');
                if (Object.hasOwnProperty.call(object, key)) {
                  error('Duplicate key "' + key + '"');
                }
                object[key] = value();
                white();
                if (ch === '}') {
                  next('}');
                  return object;
                }
                next(',');
                white();
              }
            }
            error('Bad object');
          };

        value = function() {
          // Parse a JSON value. It could be an object, an array, a string, a number,
          // or a word.

          white();
          switch (ch) {
            case '{':
              return object();
            case '[':
              return array();
            case '"':
              return string();
            case '-':
              return number();
            default:
              return ch >= '0' && ch <= '9' ? number() : word();
          }
        };

        // Return the json_parse function. It will have access to all of the above
        // functions and variables.

        module.exports = function(source, reviver) {
          var result;

          text = source;
          at = 0;
          ch = ' ';
          result = value();
          white();
          if (ch) {
            error('Syntax error');
          }

          // If there is a reviver function, we recursively walk the new structure,
          // passing each name/value pair to the reviver function for possible
          // transformation, starting with a temporary root object that holds the result
          // in an empty key. If there is not a reviver function, we simply return the
          // result.

          return typeof reviver === 'function'
            ? (function walk(holder, key) {
                var k,
                  v,
                  value = holder[key];
                if (value && typeof value === 'object') {
                  for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = walk(value, k);
                      if (v !== undefined) {
                        value[k] = v;
                      } else {
                        delete value[k];
                      }
                    }
                  }
                }
                return reviver.call(holder, key, value);
              })({ '': result }, '')
            : result;
        };

        /***/
      },
      /* 50 */
      /***/ function(module, exports) {
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          gap,
          indent,
          meta = {
            // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
          },
          rep;

        function quote(string) {
          // If the string contains no control characters, no quote characters, and no
          // backslash characters, then we can safely slap some quotes around it.
          // Otherwise we must also replace the offending characters with safe escape
          // sequences.

          escapable.lastIndex = 0;
          return escapable.test(string)
            ? '"' +
                string.replace(escapable, function(a) {
                  var c = meta[a];
                  return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) +
                '"'
            : '"' + string + '"';
        }

        function str(key, holder) {
          // Produce a string from holder[key].
          var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

          // If the value has a toJSON method, call it to obtain a replacement value.
          if (
            value &&
            typeof value === 'object' &&
            typeof value.toJSON === 'function'
          ) {
            value = value.toJSON(key);
          }

          // If we were called with a replacer function, then call the replacer to
          // obtain a replacement value.
          if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
          }

          // What happens next depends on the value's type.
          switch (typeof value) {
            case 'string':
              return quote(value);

            case 'number':
              // JSON numbers must be finite. Encode non-finite numbers as null.
              return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
              // If the value is a boolean or null, convert it to a string. Note:
              // typeof null does not produce 'null'. The case is included here in
              // the remote chance that this gets fixed someday.
              return String(value);

            case 'object':
              if (!value) return 'null';
              gap += indent;
              partial = [];

              // Array.isArray
              if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                  partial[i] = str(i, value) || 'null';
                }

                // Join all of the elements together, separated with commas, and
                // wrap them in brackets.
                v =
                  partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' +
                      gap +
                      partial.join(',\n' + gap) +
                      '\n' +
                      mind +
                      ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
              }

              // If the replacer is an array, use it to select the members to be
              // stringified.
              if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                  k = rep[i];
                  if (typeof k === 'string') {
                    v = str(k, value);
                    if (v) {
                      partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                  }
                }
              } else {
                // Otherwise, iterate through all of the keys in the object.
                for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) {
                      partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                  }
                }
              }

              // Join all of the member texts together, separated with commas,
              // and wrap them in braces.

              v =
                partial.length === 0
                  ? '{}'
                  : gap
                  ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                  : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
          }
        }

        module.exports = function(value, replacer, space) {
          var i;
          gap = '';
          indent = '';

          // If the space parameter is a number, make an indent string containing that
          // many spaces.
          if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
              indent += ' ';
            }
          }
          // If the space parameter is a string, it will be used as the indent string.
          else if (typeof space === 'string') {
            indent = space;
          }

          // If there is a replacer, it must be a function or an array.
          // Otherwise, throw an error.
          rep = replacer;
          if (
            replacer &&
            typeof replacer !== 'function' &&
            (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')
          ) {
            throw new Error('JSON.stringify');
          }

          // Make a fake root object containing our value under the key of ''.
          // Return the result of stringifying the value.
          return str('', { '': value });
        };

        /***/
      },
      /* 51 */
      /***/ function(module, exports) {
        module.exports = require('truffle-solidity-utils');

        /***/
      },
      /* 52 */
      /***/ function(module, exports) {
        module.exports = require('truffle-code-utils');

        /***/
      },
      /* 53 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        // An augmented AVL Tree where each node maintains a list of records and their search intervals.
        // Record is composed of an interval and its underlying data, sent by a client. This allows the
        // interval tree to have the same interval inserted multiple times, as long its data is different.
        // Both insertion and deletion require O(log n) time. Searching requires O(k*logn) time, where `k`
        // is the number of intervals in the output list.
        Object.defineProperty(exports, '__esModule', { value: true });
        var isSame = __webpack_require__(54);
        function height(node) {
          if (node === undefined) {
            return -1;
          } else {
            return node.height;
          }
        }
        var Node = /** @class */ (function() {
          function Node(intervalTree, record) {
            this.intervalTree = intervalTree;
            this.records = [];
            this.height = 0;
            this.key = record.low;
            this.max = record.high;
            // Save the array of all records with the same key for this node
            this.records.push(record);
          }
          // Gets the highest record.high value for this node
          Node.prototype.getNodeHigh = function() {
            var high = this.records[0].high;
            for (var i = 1; i < this.records.length; i++) {
              if (this.records[i].high > high) {
                high = this.records[i].high;
              }
            }
            return high;
          };
          // Updates height value of the node. Called during insertion, rebalance, removal
          Node.prototype.updateHeight = function() {
            this.height = Math.max(height(this.left), height(this.right)) + 1;
          };
          // Updates the max value of all the parents after inserting into already existing node, as well as
          // removing the node completely or removing the record of an already existing node. Starts with
          // the parent of an affected node and bubbles up to root
          Node.prototype.updateMaxOfParents = function() {
            if (this === undefined) {
              return;
            }
            var thisHigh = this.getNodeHigh();
            if (this.left !== undefined && this.right !== undefined) {
              this.max = Math.max(
                Math.max(this.left.max, this.right.max),
                thisHigh
              );
            } else if (this.left !== undefined && this.right === undefined) {
              this.max = Math.max(this.left.max, thisHigh);
            } else if (this.left === undefined && this.right !== undefined) {
              this.max = Math.max(this.right.max, thisHigh);
            } else {
              this.max = thisHigh;
            }
            if (this.parent) {
              this.parent.updateMaxOfParents();
            }
          };
          /*
    Left-Left case:
  
           z                                      y
          / \                                   /   \
         y   T4      Right Rotate (z)          x     z
        / \          - - - - - - - - ->       / \   / \
       x   T3                                T1 T2 T3 T4
      / \
    T1   T2
  
    Left-Right case:
  
         z                               z                           x
        / \                             / \                        /   \
       y   T4  Left Rotate (y)         x  T4  Right Rotate(z)     y     z
      / \      - - - - - - - - ->     / \      - - - - - - - ->  / \   / \
    T1   x                           y  T3                      T1 T2 T3 T4
        / \                         / \
      T2   T3                      T1 T2
    */
          // Handles Left-Left case and Left-Right case after rebalancing AVL tree
          Node.prototype._updateMaxAfterRightRotate = function() {
            var parent = this.parent;
            var left = parent.left;
            // Update max of left sibling (x in first case, y in second)
            var thisParentLeftHigh = left.getNodeHigh();
            if (left.left === undefined && left.right !== undefined) {
              left.max = Math.max(thisParentLeftHigh, left.right.max);
            } else if (left.left !== undefined && left.right === undefined) {
              left.max = Math.max(thisParentLeftHigh, left.left.max);
            } else if (left.left === undefined && left.right === undefined) {
              left.max = thisParentLeftHigh;
            } else {
              left.max = Math.max(
                Math.max(left.left.max, left.right.max),
                thisParentLeftHigh
              );
            }
            // Update max of itself (z)
            var thisHigh = this.getNodeHigh();
            if (this.left === undefined && this.right !== undefined) {
              this.max = Math.max(thisHigh, this.right.max);
            } else if (this.left !== undefined && this.right === undefined) {
              this.max = Math.max(thisHigh, this.left.max);
            } else if (this.left === undefined && this.right === undefined) {
              this.max = thisHigh;
            } else {
              this.max = Math.max(
                Math.max(this.left.max, this.right.max),
                thisHigh
              );
            }
            // Update max of parent (y in first case, x in second)
            parent.max = Math.max(
              Math.max(parent.left.max, parent.right.max),
              parent.getNodeHigh()
            );
          };
          /*
    Right-Right case:
  
      z                               y
     / \                            /   \
    T1  y     Left Rotate(z)       z     x
       / \   - - - - - - - ->     / \   / \
      T2  x                      T1 T2 T3 T4
         / \
        T3 T4
  
    Right-Left case:
  
       z                            z                            x
      / \                          / \                         /   \
     T1  y   Right Rotate (y)     T1  x      Left Rotate(z)   z     y
        / \  - - - - - - - - ->      / \   - - - - - - - ->  / \   / \
       x  T4                        T2  y                   T1 T2 T3 T4
      / \                              / \
    T2   T3                           T3 T4
    */
          // Handles Right-Right case and Right-Left case in rebalancing AVL tree
          Node.prototype._updateMaxAfterLeftRotate = function() {
            var parent = this.parent;
            var right = parent.right;
            // Update max of right sibling (x in first case, y in second)
            var thisParentRightHigh = right.getNodeHigh();
            if (right.left === undefined && right.right !== undefined) {
              right.max = Math.max(thisParentRightHigh, right.right.max);
            } else if (right.left !== undefined && right.right === undefined) {
              right.max = Math.max(thisParentRightHigh, right.left.max);
            } else if (right.left === undefined && right.right === undefined) {
              right.max = thisParentRightHigh;
            } else {
              right.max = Math.max(
                Math.max(right.left.max, right.right.max),
                thisParentRightHigh
              );
            }
            // Update max of itself (z)
            var thisHigh = this.getNodeHigh();
            if (this.left === undefined && this.right !== undefined) {
              this.max = Math.max(thisHigh, this.right.max);
            } else if (this.left !== undefined && this.right === undefined) {
              this.max = Math.max(thisHigh, this.left.max);
            } else if (this.left === undefined && this.right === undefined) {
              this.max = thisHigh;
            } else {
              this.max = Math.max(
                Math.max(this.left.max, this.right.max),
                thisHigh
              );
            }
            // Update max of parent (y in first case, x in second)
            parent.max = Math.max(
              Math.max(parent.left.max, right.max),
              parent.getNodeHigh()
            );
          };
          Node.prototype._leftRotate = function() {
            var rightChild = this.right;
            rightChild.parent = this.parent;
            if (rightChild.parent === undefined) {
              this.intervalTree.root = rightChild;
            } else {
              if (rightChild.parent.left === this) {
                rightChild.parent.left = rightChild;
              } else if (rightChild.parent.right === this) {
                rightChild.parent.right = rightChild;
              }
            }
            this.right = rightChild.left;
            if (this.right !== undefined) {
              this.right.parent = this;
            }
            rightChild.left = this;
            this.parent = rightChild;
            this.updateHeight();
            rightChild.updateHeight();
          };
          Node.prototype._rightRotate = function() {
            var leftChild = this.left;
            leftChild.parent = this.parent;
            if (leftChild.parent === undefined) {
              this.intervalTree.root = leftChild;
            } else {
              if (leftChild.parent.left === this) {
                leftChild.parent.left = leftChild;
              } else if (leftChild.parent.right === this) {
                leftChild.parent.right = leftChild;
              }
            }
            this.left = leftChild.right;
            if (this.left !== undefined) {
              this.left.parent = this;
            }
            leftChild.right = this;
            this.parent = leftChild;
            this.updateHeight();
            leftChild.updateHeight();
          };
          // Rebalances the tree if the height value between two nodes of the same parent is greater than
          // two. There are 4 cases that can happen which are outlined in the graphics above
          Node.prototype._rebalance = function() {
            if (height(this.left) >= 2 + height(this.right)) {
              var left = this.left;
              if (height(left.left) >= height(left.right)) {
                // Left-Left case
                this._rightRotate();
                this._updateMaxAfterRightRotate();
              } else {
                // Left-Right case
                left._leftRotate();
                this._rightRotate();
                this._updateMaxAfterRightRotate();
              }
            } else if (height(this.right) >= 2 + height(this.left)) {
              var right = this.right;
              if (height(right.right) >= height(right.left)) {
                // Right-Right case
                this._leftRotate();
                this._updateMaxAfterLeftRotate();
              } else {
                // Right-Left case
                right._rightRotate();
                this._leftRotate();
                this._updateMaxAfterLeftRotate();
              }
            }
          };
          Node.prototype.insert = function(record) {
            if (record.low < this.key) {
              // Insert into left subtree
              if (this.left === undefined) {
                this.left = new Node(this.intervalTree, record);
                this.left.parent = this;
              } else {
                this.left.insert(record);
              }
            } else {
              // Insert into right subtree
              if (this.right === undefined) {
                this.right = new Node(this.intervalTree, record);
                this.right.parent = this;
              } else {
                this.right.insert(record);
              }
            }
            // Update the max value of this ancestor if needed
            if (this.max < record.high) {
              this.max = record.high;
            }
            // Update height of each node
            this.updateHeight();
            // Rebalance the tree to ensure all operations are executed in O(logn) time. This is especially
            // important in searching, as the tree has a high chance of degenerating without the rebalancing
            this._rebalance();
          };
          Node.prototype._getOverlappingRecords = function(
            currentNode,
            low,
            high
          ) {
            if (currentNode.key <= high && low <= currentNode.getNodeHigh()) {
              // Nodes are overlapping, check if individual records in the node are overlapping
              var tempResults = [];
              for (var i = 0; i < currentNode.records.length; i++) {
                if (currentNode.records[i].high >= low) {
                  tempResults.push(currentNode.records[i]);
                }
              }
              return tempResults;
            }
            return [];
          };
          Node.prototype.search = function(low, high) {
            // Don't search nodes that don't exist
            if (this === undefined) {
              return [];
            }
            var leftSearch = [];
            var ownSearch = [];
            var rightSearch = [];
            // If interval is to the right of the rightmost point of any interval in this node and all its
            // children, there won't be any matches
            if (low > this.max) {
              return [];
            }
            // Search left children
            if (this.left !== undefined && this.left.max >= low) {
              leftSearch = this.left.search(low, high);
            }
            // Check this node
            ownSearch = this._getOverlappingRecords(this, low, high);
            // If interval is to the left of the start of this interval, then it can't be in any child to
            // the right
            if (high < this.key) {
              return leftSearch.concat(ownSearch);
            }
            // Otherwise, search right children
            if (this.right !== undefined) {
              rightSearch = this.right.search(low, high);
            }
            // Return accumulated results, if any
            return leftSearch.concat(ownSearch, rightSearch);
          };
          // Searches for a node by a `key` value
          Node.prototype.searchExisting = function(low) {
            if (this === undefined) {
              return undefined;
            }
            if (this.key === low) {
              return this;
            } else if (low < this.key) {
              if (this.left !== undefined) {
                return this.left.searchExisting(low);
              }
            } else {
              if (this.right !== undefined) {
                return this.right.searchExisting(low);
              }
            }
            return undefined;
          };
          // Returns the smallest node of the subtree
          Node.prototype._minValue = function() {
            if (this.left === undefined) {
              return this;
            } else {
              return this.left._minValue();
            }
          };
          Node.prototype.remove = function(node) {
            var parent = this.parent;
            if (node.key < this.key) {
              // Node to be removed is on the left side
              if (this.left !== undefined) {
                return this.left.remove(node);
              } else {
                return undefined;
              }
            } else if (node.key > this.key) {
              // Node to be removed is on the right side
              if (this.right !== undefined) {
                return this.right.remove(node);
              } else {
                return undefined;
              }
            } else {
              if (this.left !== undefined && this.right !== undefined) {
                // Node has two children
                var minValue = this.right._minValue();
                this.key = minValue.key;
                this.records = minValue.records;
                return this.right.remove(this);
              } else if (parent.left === this) {
                // One child or no child case on left side
                if (this.right !== undefined) {
                  parent.left = this.right;
                  this.right.parent = parent;
                } else {
                  parent.left = this.left;
                  if (this.left !== undefined) {
                    this.left.parent = parent;
                  }
                }
                parent.updateMaxOfParents();
                parent.updateHeight();
                parent._rebalance();
                return this;
              } else if (parent.right === this) {
                // One child or no child case on right side
                if (this.right !== undefined) {
                  parent.right = this.right;
                  this.right.parent = parent;
                } else {
                  parent.right = this.left;
                  if (this.left !== undefined) {
                    this.left.parent = parent;
                  }
                }
                parent.updateMaxOfParents();
                parent.updateHeight();
                parent._rebalance();
                return this;
              }
            }
          };
          return Node;
        })();
        exports.Node = Node;
        var IntervalTree = /** @class */ (function() {
          function IntervalTree() {
            this.count = 0;
          }
          IntervalTree.prototype.insert = function(record) {
            if (record.low > record.high) {
              throw new Error(
                '`low` value must be lower or equal to `high` value'
              );
            }
            if (this.root === undefined) {
              // Base case: Tree is empty, new node becomes root
              this.root = new Node(this, record);
              this.count++;
              return true;
            } else {
              // Otherwise, check if node already exists with the same key
              var node = this.root.searchExisting(record.low);
              if (node !== undefined) {
                // Check the records in this node if there already is the one with same low, high, data
                for (var i = 0; i < node.records.length; i++) {
                  if (isSame(node.records[i], record)) {
                    // This record is same as the one we're trying to insert; return false to indicate
                    // nothing has been inserted
                    return false;
                  }
                }
                // Add the record to the node
                node.records.push(record);
                // Update max of the node and its parents if necessary
                if (record.high > node.max) {
                  node.max = record.high;
                  if (node.parent) {
                    node.parent.updateMaxOfParents();
                  }
                }
                this.count++;
                return true;
              } else {
                // Node with this key doesn't already exist. Call insert function on root's node
                this.root.insert(record);
                this.count++;
                return true;
              }
            }
          };
          IntervalTree.prototype.search = function(low, high) {
            if (this.root === undefined) {
              // Tree is empty; return empty array
              return [];
            } else {
              return this.root.search(low, high);
            }
          };
          IntervalTree.prototype.remove = function(record) {
            if (this.root === undefined) {
              // Tree is empty; nothing to remove
              return false;
            } else {
              var node = this.root.searchExisting(record.low);
              if (node === undefined) {
                return false;
              } else if (node.records.length > 1) {
                var removedRecord = void 0;
                // Node with this key has 2 or more records. Find the one we need and remove it
                for (var i = 0; i < node.records.length; i++) {
                  if (isSame(node.records[i], record)) {
                    removedRecord = node.records[i];
                    node.records.splice(i, 1);
                    break;
                  }
                }
                if (removedRecord) {
                  removedRecord = undefined;
                  // Update max of that node and its parents if necessary
                  if (record.high === node.max) {
                    var nodeHigh = node.getNodeHigh();
                    if (node.left !== undefined && node.right !== undefined) {
                      node.max = Math.max(
                        Math.max(node.left.max, node.right.max),
                        nodeHigh
                      );
                    } else if (
                      node.left !== undefined &&
                      node.right === undefined
                    ) {
                      node.max = Math.max(node.left.max, nodeHigh);
                    } else if (
                      node.left === undefined &&
                      node.right !== undefined
                    ) {
                      node.max = Math.max(node.right.max, nodeHigh);
                    } else {
                      node.max = nodeHigh;
                    }
                    if (node.parent) {
                      node.parent.updateMaxOfParents();
                    }
                  }
                  this.count--;
                  return true;
                } else {
                  return false;
                }
              } else if (node.records.length === 1) {
                // Node with this key has only 1 record. Check if the remaining record in this node is
                // actually the one we want to remove
                if (isSame(node.records[0], record)) {
                  // The remaining record is the one we want to remove. Remove the whole node from the tree
                  if (this.root.key === node.key) {
                    // We're removing the root element. Create a dummy node that will temporarily take
                    // root's parent role
                    var rootParent = new Node(this, {
                      low: record.low,
                      high: record.low
                    });
                    rootParent.left = this.root;
                    this.root.parent = rootParent;
                    var removedNode = this.root.remove(node);
                    this.root = rootParent.left;
                    if (this.root !== undefined) {
                      this.root.parent = undefined;
                    }
                    if (removedNode) {
                      removedNode = undefined;
                      this.count--;
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    var removedNode = this.root.remove(node);
                    if (removedNode) {
                      removedNode = undefined;
                      this.count--;
                      return true;
                    } else {
                      return false;
                    }
                  }
                } else {
                  // The remaining record is not the one we want to remove
                  return false;
                }
              } else {
                // No records at all in this node?! Shouldn't happen
                return false;
              }
            }
          };
          IntervalTree.prototype.inOrder = function() {
            return new InOrder(this.root);
          };
          IntervalTree.prototype.preOrder = function() {
            return new PreOrder(this.root);
          };
          return IntervalTree;
        })();
        exports.IntervalTree = IntervalTree;
        var DataIntervalTree = /** @class */ (function() {
          function DataIntervalTree() {
            this.tree = new IntervalTree();
          }
          DataIntervalTree.prototype.insert = function(low, high, data) {
            return this.tree.insert({ low: low, high: high, data: data });
          };
          DataIntervalTree.prototype.remove = function(low, high, data) {
            return this.tree.remove({ low: low, high: high, data: data });
          };
          DataIntervalTree.prototype.search = function(low, high) {
            return this.tree.search(low, high).map(function(v) {
              return v.data;
            });
          };
          DataIntervalTree.prototype.inOrder = function() {
            return this.tree.inOrder();
          };
          DataIntervalTree.prototype.preOrder = function() {
            return this.tree.preOrder();
          };
          Object.defineProperty(DataIntervalTree.prototype, 'count', {
            get: function() {
              return this.tree.count;
            },
            enumerable: true,
            configurable: true
          });
          return DataIntervalTree;
        })();
        exports.default = DataIntervalTree;
        var InOrder = /** @class */ (function() {
          function InOrder(startNode) {
            this.stack = [];
            if (startNode !== undefined) {
              this.push(startNode);
            }
          }
          InOrder.prototype.next = function() {
            // Will only happen if stack is empty and pop is called
            if (this.currentNode === undefined) {
              return {
                done: true,
                value: undefined
              };
            }
            // Process this node
            if (this.i < this.currentNode.records.length) {
              return {
                done: false,
                value: this.currentNode.records[this.i++]
              };
            }
            if (this.currentNode.right !== undefined) {
              this.push(this.currentNode.right);
            } else {
              // Might pop the last and set this.currentNode = undefined
              this.pop();
            }
            return this.next();
          };
          InOrder.prototype.push = function(node) {
            this.currentNode = node;
            this.i = 0;
            while (this.currentNode.left !== undefined) {
              this.stack.push(this.currentNode);
              this.currentNode = this.currentNode.left;
            }
          };
          InOrder.prototype.pop = function() {
            this.currentNode = this.stack.pop();
            this.i = 0;
          };
          return InOrder;
        })();
        exports.InOrder = InOrder;
        if (typeof Symbol === 'function') {
          InOrder.prototype[Symbol.iterator] = function() {
            return this;
          };
        }
        var PreOrder = /** @class */ (function() {
          function PreOrder(startNode) {
            this.stack = [];
            this.i = 0;
            this.currentNode = startNode;
          }
          PreOrder.prototype.next = function() {
            // Will only happen if stack is empty and pop is called,
            // which only happens if there is no right node (i.e we are done)
            if (this.currentNode === undefined) {
              return {
                done: true,
                value: undefined
              };
            }
            // Process this node
            if (this.i < this.currentNode.records.length) {
              return {
                done: false,
                value: this.currentNode.records[this.i++]
              };
            }
            if (this.currentNode.right !== undefined) {
              this.push(this.currentNode.right);
            }
            if (this.currentNode.left !== undefined) {
              this.push(this.currentNode.left);
            }
            this.pop();
            return this.next();
          };
          PreOrder.prototype.push = function(node) {
            this.stack.push(node);
          };
          PreOrder.prototype.pop = function() {
            this.currentNode = this.stack.pop();
            this.i = 0;
          };
          return PreOrder;
        })();
        exports.PreOrder = PreOrder;
        if (typeof Symbol === 'function') {
          PreOrder.prototype[Symbol.iterator] = function() {
            return this;
          };
        }
        //# sourceMappingURL=index.js.map

        /***/
      },
      /* 54 */
      /***/ function(module, exports) {
        //

        module.exports = function shallowEqual(
          objA,
          objB,
          compare,
          compareContext
        ) {
          var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

          if (ret !== void 0) {
            return !!ret;
          }

          if (objA === objB) {
            return true;
          }

          if (
            typeof objA !== 'object' ||
            !objA ||
            typeof objB !== 'object' ||
            !objB
          ) {
            return false;
          }

          var keysA = Object.keys(objA);
          var keysB = Object.keys(objB);

          if (keysA.length !== keysB.length) {
            return false;
          }

          var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

          // Test for A's keys different from B.
          for (var idx = 0; idx < keysA.length; idx++) {
            var key = keysA[idx];

            if (!bHasOwnProperty(key)) {
              return false;
            }

            var valueA = objA[key];
            var valueB = objB[key];

            ret = compare
              ? compare.call(compareContext, valueA, valueB, key)
              : void 0;

            if (ret === false || (ret === void 0 && valueA !== valueB)) {
              return false;
            }
          }

          return true;
        };

        /***/
      },
      /* 55 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports.init = init;
        exports.inspect = inspect;
        exports.fetchBinary = fetchBinary;
        exports.receiveBinary = receiveBinary;
        exports.receiveTrace = receiveTrace;
        exports.receiveCall = receiveCall;
        exports.error = error;
        const INIT_WEB3 = (exports.INIT_WEB3 = 'INIT_WEB3');
        function init(provider) {
          return {
            type: INIT_WEB3,
            provider
          };
        }

        const INSPECT = (exports.INSPECT = 'INSPECT_TRANSACTION');
        function inspect(txHash) {
          return {
            type: INSPECT,
            txHash
          };
        }

        const FETCH_BINARY = (exports.FETCH_BINARY = 'FETCH_BINARY');
        function fetchBinary(address, block) {
          return {
            type: FETCH_BINARY,
            address,
            block //optional
          };
        }

        const RECEIVE_BINARY = (exports.RECEIVE_BINARY = 'RECEIVE_BINARY');
        function receiveBinary(address, binary) {
          return {
            type: RECEIVE_BINARY,
            address,
            binary
          };
        }

        const RECEIVE_TRACE = (exports.RECEIVE_TRACE = 'RECEIVE_TRACE');
        function receiveTrace(trace) {
          return {
            type: RECEIVE_TRACE,
            trace
          };
        }

        const RECEIVE_CALL = (exports.RECEIVE_CALL = 'RECEIVE_CALL');
        function receiveCall({
          address,
          binary,
          data,
          storageAddress,
          status,
          sender,
          value,
          gasprice,
          block
        }) {
          return {
            type: RECEIVE_CALL,
            address,
            binary,
            data,
            storageAddress,
            status, //only used for creation calls at present!
            sender,
            value,
            gasprice,
            block
          };
        }

        const ERROR_WEB3 = (exports.ERROR_WEB3 = 'ERROR_WEB3');
        function error(error) {
          return {
            type: ERROR_WEB3,
            error
          };
        }

        /***/
      },
      /* 56 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _asyncToGenerator2 = __webpack_require__(18);

        var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _web = __webpack_require__(31);

        var _web2 = _interopRequireDefault(_web);

        var _util = __webpack_require__(57);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:web3:adapter');

        class Web3Adapter {
          constructor(provider) {
            this.web3 = new _web2.default(provider);
          }

          getTrace(txHash) {
            var _this = this;

            return (0, _asyncToGenerator3.default)(function*() {
              let result = yield (0, _util.promisify)(
                _this.web3.currentProvider.send
              )(
                //send *only* uses callbacks, so we use promsifiy to make things more
                //readable
                {
                  jsonrpc: '2.0',
                  method: 'debug_traceTransaction',
                  params: [txHash, {}],
                  id: new Date().getTime()
                }
              );
              if (result.error) {
                throw new Error(result.error.message);
              } else {
                return result.result.structLogs;
              }
            })();
          }

          getTransaction(txHash) {
            var _this2 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this2.web3.eth.getTransaction(txHash);
            })();
          }

          getReceipt(txHash) {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this3.web3.eth.getTransactionReceipt(txHash);
            })();
          }

          getBlock(blockNumberOrHash) {
            var _this4 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              return yield _this4.web3.eth.getBlock(blockNumberOrHash);
            })();
          }

          /**
           * getDeployedCode - get the deployed code for an address from the client
           * NOTE: the block argument is optional
           * @param  {String} address
           * @return {String}         deployedBinary
           */
          getDeployedCode(address, block) {
            var _this5 = this;

            return (0, _asyncToGenerator3.default)(function*() {
              debug('getting deployed code for %s', address);
              let code = yield _this5.web3.eth.getCode(address, block);
              return code === '0x0' ? '0x' : code;
            })();
          }
        }
        exports.default = Web3Adapter;

        /***/
      },
      /* 57 */
      /***/ function(module, exports) {
        module.exports = require('util');

        /***/
      },
      /* 58 */
      /***/ function(module, exports) {
        module.exports = require('lodash.sum');

        /***/
      },
      /* 59 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _keys = __webpack_require__(16);

        var _keys2 = _interopRequireDefault(_keys);

        exports.saga = saga;
        exports.processTransaction = processTransaction;
        exports.unload = unload;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _helpers = __webpack_require__(1);

        var _sagas = __webpack_require__(60);

        var ast = _interopRequireWildcard(_sagas);

        var _sagas2 = __webpack_require__(33);

        var controller = _interopRequireWildcard(_sagas2);

        var _sagas3 = __webpack_require__(34);

        var solidity = _interopRequireWildcard(_sagas3);

        var _sagas4 = __webpack_require__(24);

        var evm = _interopRequireWildcard(_sagas4);

        var _sagas5 = __webpack_require__(13);

        var trace = _interopRequireWildcard(_sagas5);

        var _sagas6 = __webpack_require__(17);

        var data = _interopRequireWildcard(_sagas6);

        var _sagas7 = __webpack_require__(30);

        var web3 = _interopRequireWildcard(_sagas7);

        var _actions = __webpack_require__(14);

        var actions = _interopRequireWildcard(_actions);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:session:sagas');

        const LOAD_SAGAS = {
          [actions.LOAD_TRANSACTION]: load
          //will also add reconstruct action/saga once it exists
        };

        function* listenerSaga() {
          while (true) {
            let action = yield (0, _effects.take)(
              (0, _keys2.default)(LOAD_SAGAS)
            );
            let saga = LOAD_SAGAS[action.type];

            yield (0, _effects.put)(actions.wait());
            yield (0, _effects.race)({
              exec: (0, _effects.call)(saga, action), //not all will use this
              interrupt: (0, _effects.take)(actions.INTERRUPT)
            });
            yield (0, _effects.put)(actions.ready());
          }
        }

        function* saga() {
          debug('starting listeners');
          yield* forkListeners();

          // receiving & saving contracts into state
          debug('waiting for contract information');
          let { contexts, sources } = yield (0, _effects.take)(
            actions.RECORD_CONTRACTS
          );

          debug('recording contract binaries');
          yield* recordContexts(...contexts);

          debug('recording contract sources');
          yield* recordSources(...sources);

          debug('normalizing contexts');
          yield* evm.normalizeContexts();

          debug('waiting for start');
          // wait for start signal
          let { txHash, provider } = yield (0, _effects.take)(actions.START);
          debug('starting');

          debug('visiting ASTs');
          // visit asts
          yield* ast.visitAll();

          //save allocation table
          debug('saving allocation table');
          yield* data.recordAllocations();

          //initialize web3 adapter
          yield* web3.init(provider);

          //process transaction (if there is one)
          //(note: this part may also set the error state)
          if (txHash !== undefined) {
            yield* processTransaction(txHash);
          }

          debug('readying');
          // signal that commands can begin
          yield* ready();
        }

        function* processTransaction(txHash) {
          // process transaction
          debug('fetching transaction info');
          let err = yield* fetchTx(txHash);
          if (err) {
            debug('error %o', err);
            yield* error(err);
          }
        }

        exports.default = (0, _helpers.prefixName)('session', saga);

        function* forkListeners() {
          yield (0, _effects.fork)(listenerSaga); //session listener; this one is separate, sorry
          //(I didn't want to mess w/ the existing structure of defaults)
          return yield (0, _effects.all)(
            [controller, data, evm, solidity, trace, web3].map(
              app => (0, _effects.fork)(app.saga)
              //ast no longer has a listener
            )
          );
        }

        function* fetchTx(txHash) {
          let result = yield* web3.inspectTransaction(txHash);
          debug('result %o', result);

          if (result.error) {
            return result.error;
          }

          debug('sending initial call');
          yield* evm.begin(result);

          //get addresses created/called during transaction
          debug('processing trace for addresses');
          let addresses = yield* trace.processTrace(result.trace);
          //add in the address of the call itself (if a call)
          if (result.address && !addresses.includes(result.address)) {
            addresses.push(result.address);
          }
          //if a create, only add in address if it was successful
          if (
            result.binary &&
            result.status &&
            !addresses.includes(result.storageAddress)
          ) {
            addresses.push(result.storageAddress);
          }

          let blockNumber = result.block.number.toString(); //a BN is not accepted
          debug('obtaining binaries');
          let binaries = yield* web3.obtainBinaries(addresses, blockNumber);

          debug('recording instances');
          yield (0, _effects.all)(
            addresses.map((address, i) =>
              (0, _effects.call)(recordInstance, address, binaries[i])
            )
          );
        }

        function* recordContexts(...contexts) {
          for (let context of contexts) {
            yield* evm.addContext(context);
          }
        }

        function* recordSources(...sources) {
          for (let sourceData of sources) {
            if (sourceData !== undefined && sourceData !== null) {
              yield* solidity.addSource(
                sourceData.source,
                sourceData.sourcePath,
                sourceData.ast,
                sourceData.compiler
              );
            }
          }
        }

        function* recordInstance(address, binary) {
          yield* evm.addInstance(address, binary);
        }

        function* ready() {
          yield (0, _effects.put)(actions.ready());
        }

        function* error(err) {
          yield (0, _effects.put)(actions.error(err));
        }

        function* unload() {
          debug('unloading');
          yield* data.reset();
          yield* solidity.reset();
          yield* evm.unload();
          yield* trace.unload();
          yield (0, _effects.put)(actions.unloadTransaction());
        }

        //note that load takes an action as its argument, which is why it's separate
        //from processTransaction
        function* load({ txHash }) {
          yield* processTransaction(txHash);
        }

        /***/
      },
      /* 60 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _entries = __webpack_require__(7);

        var _entries2 = _interopRequireDefault(_entries);

        exports.visitAll = visitAll;

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _effects = __webpack_require__(5);

        var _sagas = __webpack_require__(17);

        var data = _interopRequireWildcard(_sagas);

        var _selectors = __webpack_require__(36);

        var _selectors2 = _interopRequireDefault(_selectors);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:ast:sagas');

        function* walk(sourceId, node, pointer = '', parentId = null) {
          debug('walking %o %o', pointer, node);

          yield* handleEnter(sourceId, node, pointer, parentId);

          if (node instanceof Array) {
            for (let [i, child] of node.entries()) {
              yield (0, _effects.call)(
                walk,
                sourceId,
                child,
                `${pointer}/${i}`,
                parentId
              );
            }
          } else if (node instanceof Object) {
            for (let [key, child] of (0, _entries2.default)(node)) {
              yield (0, _effects.call)(
                walk,
                sourceId,
                child,
                `${pointer}/${key}`,
                node.id
              );
            }
          }

          yield* handleExit(sourceId, node, pointer);
        }

        function* handleEnter(sourceId, node, pointer, parentId) {
          if (!(node instanceof Object)) {
            return;
          }

          debug('entering %s', pointer);

          if (node.id !== undefined) {
            debug('%s recording scope %s', pointer, node.id);
            yield* data.scope(node.id, pointer, parentId, sourceId);
          }

          switch (node.nodeType) {
            case 'VariableDeclaration':
              debug('%s recording variable %o', pointer, node);
              yield* data.declare(node);
              break;
            case 'ContractDefinition':
            case 'StructDefinition':
            case 'EnumDefinition':
              yield* data.defineType(node);
              break;
          }
        }

        function* handleExit(sourceId, node, pointer) {
          debug('exiting %s', pointer);

          // no-op right now
        }

        function* visitAll() {
          let sources = yield (0, _effects.select)(
            _selectors2.default.views.sources
          );

          yield (0, _effects.all)(
            (0, _entries2.default)(sources)
              .filter(([_, source]) => source.ast)
              .map(([id, { ast }]) => (0, _effects.call)(walk, id, ast))
          );

          debug('done visiting');
        }

        /***/
      },
      /* 61 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _redux = __webpack_require__(6);

        var _reducers = __webpack_require__(62);

        var _reducers2 = _interopRequireDefault(_reducers);

        var _reducers3 = __webpack_require__(63);

        var _reducers4 = _interopRequireDefault(_reducers3);

        var _reducers5 = __webpack_require__(65);

        var _reducers6 = _interopRequireDefault(_reducers5);

        var _reducers7 = __webpack_require__(66);

        var _reducers8 = _interopRequireDefault(_reducers7);

        var _reducers9 = __webpack_require__(67);

        var _reducers10 = _interopRequireDefault(_reducers9);

        var _actions = __webpack_require__(14);

        var actions = _interopRequireWildcard(_actions);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:session:reducers');

        function ready(state = false, action) {
          switch (action.type) {
            case actions.READY:
              debug('readying');
              return true;

            case actions.WAIT:
              return false;

            default:
              return state;
          }
        }

        function projectInfoComputed(state = false, action) {
          switch (action.type) {
            case actions.PROJECT_INFO_COMPUTED:
              return true;
            default:
              return state;
          }
        }

        function lastLoadingError(state = null, action) {
          switch (action.type) {
            case actions.ERROR:
              debug('error: %o', action.error);
              return action.error;

            case actions.WAIT:
              return null;

            default:
              return state;
          }
        }

        function transaction(state = {}, action) {
          switch (action.type) {
            case actions.SAVE_TRANSACTION:
              return action.transaction;
            case actions.UNLOAD_TRANSACTION:
              return {};
            default:
              return state;
          }
        }

        function receipt(state = {}, action) {
          switch (action.type) {
            case actions.SAVE_RECEIPT:
              return action.receipt;
            case actions.UNLOAD_TRANSACTION:
              return {};
            default:
              return state;
          }
        }

        function block(state = {}, action) {
          switch (action.type) {
            case actions.SAVE_BLOCK:
              return action.block;
            case actions.UNLOAD_TRANSACTION:
              return {};
            default:
              return state;
          }
        }

        const session = (0, _redux.combineReducers)({
          ready,
          lastLoadingError,
          projectInfoComputed,
          transaction,
          receipt,
          block
        });

        const reduceState = (0, _redux.combineReducers)({
          session,
          data: _reducers2.default,
          evm: _reducers4.default,
          solidity: _reducers6.default,
          trace: _reducers8.default,
          controller: _reducers10.default
        });

        exports.default = reduceState;

        /***/
      },
      /* 62 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _set = __webpack_require__(23);

        var _set2 = _interopRequireDefault(_set);

        var _values = __webpack_require__(19);

        var _values2 = _interopRequireDefault(_values);

        var _assign = __webpack_require__(8);

        var _assign2 = _interopRequireDefault(_assign);

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _redux = __webpack_require__(6);

        var _actions = __webpack_require__(28);

        var actions = _interopRequireWildcard(_actions);

        var _truffleDecoder = __webpack_require__(32);

        var _helpers = __webpack_require__(1);

        var _truffleDecodeUtils = __webpack_require__(4);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:data:reducers');

        const DEFAULT_SCOPES = {
          byId: {}
        };

        function scopes(state = DEFAULT_SCOPES, action) {
          var scope;
          var variables;

          switch (action.type) {
            case actions.SCOPE:
              scope = state.byId[action.id] || {};

              return {
                byId: (0, _extends3.default)({}, state.byId, {
                  [action.id]: (0, _extends3.default)({}, scope, {
                    id: action.id,
                    sourceId: action.sourceId,
                    parentId: action.parentId,
                    pointer: action.pointer
                  })
                })
              };

            case actions.DECLARE:
              scope = state.byId[action.node.scope] || {};
              variables = scope.variables || [];

              return {
                byId: (0, _extends3.default)({}, state.byId, {
                  [action.node.scope]: (0, _extends3.default)({}, scope, {
                    variables: [
                      ...variables,
                      { name: action.node.name, id: action.node.id }
                    ]
                  })
                })
              };

            default:
              return state;
          }
        }

        //a note on the following reducer: solidity assigns a unique AST ID to every
        //AST node among all the files being compiled together.  thus, it is, for now,
        //safe to identify user-defined types solely by their AST ID.  In the future,
        //once we eventually support having some files compiled separately from others,
        //this will become a bug you'll have to fix, and you'll have to fix it in the
        //decoder, too.  Sorry, future me! (or whoever's stuck doing this)

        function userDefinedTypes(state = [], action) {
          switch (action.type) {
            case actions.DEFINE_TYPE:
              return [...state, action.node.id];
            default:
              return state;
          }
        }

        const DEFAULT_ALLOCATIONS = {
          storage: {},
          memory: {},
          calldata: {}
        };

        function allocations(state = DEFAULT_ALLOCATIONS, action) {
          if (action.type === actions.ALLOCATE) {
            return {
              storage: action.storage,
              memory: action.memory,
              calldata: action.calldata
            };
          } else {
            return state;
          }
        }

        const info = (0, _redux.combineReducers)({
          scopes,
          userDefinedTypes,
          allocations
        });

        const GLOBAL_ASSIGNMENTS = [
          [{ builtin: 'msg' }, { special: 'msg' }],
          [{ builtin: 'tx' }, { special: 'tx' }],
          [{ builtin: 'block' }, { special: 'block' }],
          [{ builtin: 'this' }, { special: 'this' }],
          [{ builtin: 'now' }, { special: 'timestamp' }] //we don't have an alias "now"
        ].map(([idObj, ref]) => (0, _helpers.makeAssignment)(idObj, ref));

        const DEFAULT_ASSIGNMENTS = {
          byId: (0, _assign2.default)(
            {}, //we start out with all globals assigned
            ...GLOBAL_ASSIGNMENTS.map(assignment => ({
              [assignment.id]: assignment
            }))
          ),
          byAstId: {}, //no regular variables assigned at start
          byBuiltin: (0, _assign2.default)(
            {}, //again, all globals start assigned
            ...GLOBAL_ASSIGNMENTS.map(assignment => ({
              [assignment.builtin]: [assignment.id] //yes, that's a 1-element array
            }))
          )
        };

        function assignments(state = DEFAULT_ASSIGNMENTS, action) {
          switch (action.type) {
            case actions.ASSIGN:
            case actions.MAP_PATH_AND_ASSIGN:
              debug('action.type %O', action.type);
              debug('action.assignments %O', action.assignments);
              return (0, _values2.default)(action.assignments).reduce(
                (acc, assignment) => {
                  let { id, astId } = assignment;
                  //we assume for now that only ordinary variables will be assigned this
                  //way, and not globals; globals are handled in DEFAULT_ASSIGNMENTS
                  return (0, _extends3.default)({}, acc, {
                    byId: (0, _extends3.default)({}, acc.byId, {
                      [id]: assignment
                    }),
                    byAstId: (0, _extends3.default)({}, acc.byAstId, {
                      [astId]: [
                        ...new _set2.default([
                          ...(acc.byAstId[astId] || []),
                          id
                        ])
                      ]
                      //we use a set for uniqueness
                    })
                  });
                },
                state
              );

            case actions.RESET:
              return DEFAULT_ASSIGNMENTS;

            default:
              return state;
          }
        }

        const DEFAULT_PATHS = {
          byAddress: {}
        };

        //WARNING: do *not* rely on mappedPaths to keep track of paths that do not
        //involve mapping keys!  Yes, many will get mapped, but there is no guarantee.
        //Only when mapping keys are involved does it necessarily work reliably --
        //which is fine, as that's all we need it for.
        function mappedPaths(state = DEFAULT_PATHS, action) {
          switch (action.type) {
            case actions.MAP_PATH_AND_ASSIGN:
              let { address, slot, typeIdentifier, parentType } = action;
              //how this case works: first, we find the spot in our table (based on
              //address, type identifier, and slot address) where the new entry should
              //be added; if needed we set up all the objects needed along the way.  If
              //there's already something there, we do nothing.  If there's nothing
              //there, we record our given slot in that spot in that table -- however,
              //we alter it in one key way.  Before entry, we check if the slot's
              //*parent* has a spot in the table, based on address (same for both child
              //and parent), parentType, and the parent's slot address (which can be
              //found as the slotAddress of the slot's path object, if it exists -- if
              //it doesn't then we conclude that no the parent does not have a spot in
              //the table).  If the parent has a slot in the table already, then we
              //alter the child slot by replacing its path with the parent slot.  This
              //will keep the slotAddress the same, but since the versions kept in the
              //table here are supposed to preserve path information, we'll be
              //replacing a fairly bare-bones Slot object with one with a full path.

              //we do NOT want to distinguish between types with and without "_ptr" on
              //the end here!
              debug('typeIdentifier %s', typeIdentifier);
              typeIdentifier = _truffleDecodeUtils.Definition.restorePtr(
                typeIdentifier
              );
              parentType = _truffleDecodeUtils.Definition.restorePtr(
                parentType
              );

              debug('slot %o', slot);
              let hexSlotAddress = _truffleDecodeUtils.Conversion.toHexString(
                (0, _truffleDecoder.slotAddress)(slot),
                _truffleDecodeUtils.EVM.WORD_SIZE
              );
              let parentAddress = slot.path
                ? _truffleDecodeUtils.Conversion.toHexString(
                    (0, _truffleDecoder.slotAddress)(slot.path),
                    _truffleDecodeUtils.EVM.WORD_SIZE
                  )
                : undefined;

              //this is going to be messy and procedural, sorry.  but let's start with
              //the easy stuff: create the new address if needed, clone if not
              let newState = (0, _extends3.default)({}, state, {
                byAddress: (0, _extends3.default)({}, state.byAddress, {
                  [address]: {
                    byType: (0, _extends3.default)(
                      {},
                      (state.byAddress[address] || { byType: {} }).byType
                    )
                  }
                })
              });

              //now, let's add in the new type, if needed
              newState.byAddress[address].byType = (0, _extends3.default)(
                {},
                newState.byAddress[address].byType,
                {
                  [typeIdentifier]: {
                    bySlotAddress: (0, _extends3.default)(
                      {},
                      (
                        newState.byAddress[address].byType[typeIdentifier] || {
                          bySlotAddress: {}
                        }
                      ).bySlotAddress
                    )
                  }
                }
              );

              let oldSlot =
                newState.byAddress[address].byType[typeIdentifier]
                  .bySlotAddress[hexSlotAddress];
              //yes, this looks strange, but we haven't changed it yet except to
              //clone or create empty (and we don't want undefined!)
              //now: is there something already there or no?  if no, we must add
              if (oldSlot === undefined) {
                let newSlot;
                debug('parentAddress %o', parentAddress);
                if (
                  parentAddress !== undefined &&
                  newState.byAddress[address].byType[parentType] &&
                  newState.byAddress[address].byType[parentType].bySlotAddress[
                    parentAddress
                  ]
                ) {
                  //if the parent is already present, use that instead of the given
                  //parent!
                  newSlot = (0, _extends3.default)({}, slot, {
                    path:
                      newState.byAddress[address].byType[parentType]
                        .bySlotAddress[parentAddress]
                  });
                } else {
                  newSlot = slot;
                }
                newState.byAddress[address].byType[
                  typeIdentifier
                ].bySlotAddress[hexSlotAddress] = newSlot;
              }
              //if there's already something there, we don't need to do anything

              return newState;

            case actions.RESET:
              return DEFAULT_PATHS;

            default:
              return state;
          }
        }

        const proc = (0, _redux.combineReducers)({
          assignments,
          mappedPaths
        });

        const reducer = (0, _redux.combineReducers)({
          info,
          proc
        });

        exports.default = reducer;

        /***/
      },
      /* 63 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _set = __webpack_require__(23);

        var _set2 = _interopRequireDefault(_set);

        var _from = __webpack_require__(64);

        var _from2 = _interopRequireDefault(_from);

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _redux = __webpack_require__(6);

        var _actions = __webpack_require__(29);

        var actions = _interopRequireWildcard(_actions);

        var _helpers = __webpack_require__(1);

        var _truffleDecodeUtils = __webpack_require__(4);

        var DecodeUtils = _interopRequireWildcard(_truffleDecodeUtils);

        var _bn = __webpack_require__(15);

        var _bn2 = _interopRequireDefault(_bn);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:evm:reducers');

        const DEFAULT_CONTEXTS = {
          byContext: {}
        };

        function contexts(state = DEFAULT_CONTEXTS, action) {
          switch (action.type) {
            /*
             * Adding a new context
             */
            case actions.ADD_CONTEXT:
              const {
                contractName,
                binary,
                sourceMap,
                compiler,
                abi,
                contractId,
                contractKind,
                isConstructor
              } = action;
              debug('action %O', action);
              //NOTE: we take hash as *string*, not as bytes, because the binary may
              //contain link references!
              const context = (0, _helpers.keccak256)({
                type: 'string',
                value: binary
              });
              let primarySource;
              if (sourceMap !== undefined) {
                primarySource = (0, _helpers.extractPrimarySource)(sourceMap);
              }
              //otherwise leave it undefined

              return (0, _extends3.default)({}, state, {
                byContext: (0, _extends3.default)({}, state.byContext, {
                  [context]: {
                    contractName,
                    context,
                    binary,
                    sourceMap,
                    primarySource,
                    compiler,
                    abi,
                    contractId,
                    contractKind,
                    isConstructor
                  }
                })
              });

            case actions.NORMALIZE_CONTEXTS:
              return {
                byContext: DecodeUtils.Contexts.normalizeContexts(
                  state.byContext
                )
              };

            /*
             * Default case
             */
            default:
              return state;
          }
        }

        const DEFAULT_INSTANCES = {
          byAddress: {},
          byContext: {}
        };

        function instances(state = DEFAULT_INSTANCES, action) {
          switch (action.type) {
            /*
             * Adding a new address for context
             */
            case actions.ADD_INSTANCE:
              let { address, context, binary } = action;

              // get known addresses for this context
              let otherInstances = state.byContext[context] || [];
              let otherAddresses = otherInstances.map(({ address }) => address);

              return {
                byAddress: (0, _extends3.default)({}, state.byAddress, {
                  [address]: { address, context, binary }
                }),

                byContext: (0, _extends3.default)({}, state.byContext, {
                  // reconstruct context instances to include new address
                  [context]: (0, _from2.default)(
                    new _set2.default(otherAddresses).add(address)
                  ).map(address => ({ address }))
                })
              };
            case actions.UNLOAD_TRANSACTION:
              return DEFAULT_INSTANCES;

            /*
             * Default case
             */
            default:
              return state;
          }
        }

        const DEFAULT_TX = {
          gasprice: new _bn2.default(0),
          origin: DecodeUtils.EVM.ZERO_ADDRESS
        };

        function tx(state = DEFAULT_TX, action) {
          switch (action.type) {
            case actions.SAVE_GLOBALS:
              let { gasprice, origin } = action;
              return { gasprice, origin };
            case actions.UNLOAD_TRANSACTION:
              return DEFAULT_TX;
            default:
              return state;
          }
        }

        const DEFAULT_BLOCK = {
          coinbase: DecodeUtils.EVM.ZERO_ADDRESS,
          difficulty: new _bn2.default(0),
          gaslimit: new _bn2.default(0),
          number: new _bn2.default(0),
          timestamp: new _bn2.default(0)
        };

        function block(state = DEFAULT_BLOCK, action) {
          switch (action.type) {
            case actions.SAVE_GLOBALS:
              return action.block;
            case actions.UNLOAD_TRANSACTION:
              return DEFAULT_BLOCK;
            default:
              return state;
          }
        }

        const globals = (0, _redux.combineReducers)({
          tx,
          block
        });

        const info = (0, _redux.combineReducers)({
          contexts
        });

        const transaction = (0, _redux.combineReducers)({
          instances,
          globals
        });

        function callstack(state = [], action) {
          switch (action.type) {
            case actions.CALL: {
              const { address, data, storageAddress, sender, value } = action;
              return state.concat([
                { address, data, storageAddress, sender, value }
              ]);
            }

            case actions.CREATE: {
              const { binary, storageAddress, sender, value } = action;
              return state.concat(
                [{ binary, data: '0x', storageAddress, sender, value }]
                //the empty data field is to make msg.data and msg.sig come out right
              );
            }

            case actions.RETURN:
            case actions.FAIL:
              //pop the stack... unless (HACK) that would leave it empty (this will
              //only happen at the end when we want to keep the last one around)
              return state.length > 1 ? state.slice(0, -1) : state;

            case actions.RESET:
              return [state[0]]; //leave the initial call still on the stack

            case actions.UNLOAD_TRANSACTION:
              return [];

            default:
              return state;
          }
        }

        //default codex stackframe with a single address (or none if address not
        //supplied)
        function defaultCodexFrame(address) {
          if (address !== undefined) {
            return {
              //there will be more here in the future!
              accounts: {
                [address]: {
                  //there will be more here in the future!
                  storage: {}
                }
              }
            };
          } else {
            return {
              //there will be more here in the future!
              accounts: {}
            };
          }
        }

        function codex(state = [], action) {
          let newState, topCodex;

          const updateFrameStorage = (frame, address, slot, value) => {
            let existingPage = frame.accounts[address] || { storage: {} };
            return (0, _extends3.default)({}, frame, {
              accounts: (0, _extends3.default)({}, frame.accounts, {
                [address]: (0, _extends3.default)({}, existingPage, {
                  storage: (0, _extends3.default)({}, existingPage.storage, {
                    [slot]: value
                  })
                })
              })
            });
          };

          switch (action.type) {
            case actions.CALL:
            case actions.CREATE:
              //on a call or create, make a new stackframe, then add a new pages to the
              //codex if necessary; don't add a zero page though (or pages that already
              //exist)

              //first, add a new stackframe; if there's an existing stackframe, clone
              //that, otherwise make one from scratch
              newState =
                state.length > 0
                  ? [...state, state[state.length - 1]]
                  : [defaultCodexFrame()];
              topCodex = newState[newState.length - 1];
              //now, do we need to add a new address to this stackframe?
              if (
                topCodex.accounts[action.storageAddress] !== undefined ||
                action.storageAddress === DecodeUtils.EVM.ZERO_ADDRESS
              ) {
                //if we don't
                return newState;
              }
              //if we do
              newState[newState.length - 1] = (0, _extends3.default)(
                {},
                topCodex,
                {
                  accounts: (0, _extends3.default)({}, topCodex.accounts, {
                    [action.storageAddress]: {
                      storage: {}
                      //there will be more here in the future!
                    }
                  })
                }
              );
              return newState;

            case actions.STORE: {
              //on a store, the relevant page should already exist, so we can just
              //add or update the needed slot
              const { address, slot, value } = action;
              if (address === DecodeUtils.EVM.ZERO_ADDRESS) {
                //as always, we do not maintain a zero page
                return state;
              }
              newState = state.slice(); //clone the state
              topCodex = newState[newState.length - 1];
              newState[newState.length - 1] = updateFrameStorage(
                topCodex,
                address,
                slot,
                value
              );
              return newState;
            }

            case actions.LOAD: {
              //loads are a little more complicated -- usually we do nothing, but if
              //it's an external load (there was nothing already there), then we want
              //to update *every* stackframe
              const { address, slot, value } = action;
              if (address === DecodeUtils.EVM.ZERO_ADDRESS) {
                //as always, we do not maintain a zero page
                return state;
              }
              topCodex = state[state.length - 1];
              if (topCodex.accounts[address].storage[slot] !== undefined) {
                //if we already have a value in the *top* stackframe, update *no*
                //stackframes; don't update the top (no need, it's just a load, not a
                //store), don't update the rest (that would be wrong, you might be
                //loading a value that will get reverted later)
                return state;
              } else {
                //if we *don't* already have a value in the top stackframe, that means
                //we're loading a value from a previous transaction!  That's not a
                //value that will get reverted if this call fails, so update *every*
                //stackframe
                return state.map(frame =>
                  updateFrameStorage(frame, address, slot, value)
                );
              }
            }

            case actions.RETURN:
              //we want to pop the top while making the new top a copy of the old top;
              //that is to say, we want to drop just the element *second* from the top
              //(although, HACK, if the stack only has one element, just leave it alone)
              return state.length > 1
                ? state.slice(0, -2).concat([state[state.length - 1]])
                : state;

            case actions.FAIL:
              //pop the stack... unless (HACK) that would leave it empty (this will
              //only happen at the end when we want to keep the last one around)
              return state.length > 1 ? state.slice(0, -1) : state;

            case actions.RESET:
              return [defaultCodexFrame(action.storageAddress)];

            case actions.UNLOAD_TRANSACTION:
              return [];

            default:
              return state;
          }
        }

        const proc = (0, _redux.combineReducers)({
          callstack,
          codex
        });

        const reducer = (0, _redux.combineReducers)({
          info,
          transaction,
          proc
        });

        exports.default = reducer;

        /***/
      },
      /* 64 */
      /***/ function(module, exports) {
        module.exports = require('babel-runtime/core-js/array/from');

        /***/
      },
      /* 65 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _extends2 = __webpack_require__(2);

        var _extends3 = _interopRequireDefault(_extends2);

        var _keys = __webpack_require__(16);

        var _keys2 = _interopRequireDefault(_keys);

        var _redux = __webpack_require__(6);

        var _actions = __webpack_require__(35);

        var actions = _interopRequireWildcard(_actions);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const DEFAULT_SOURCES = {
          byId: {}
        };

        function sources(state = DEFAULT_SOURCES, action) {
          switch (action.type) {
            /*
             * Adding a new source
             */
            case actions.ADD_SOURCE:
              let { ast, source, sourcePath, compiler } = action;

              let id = (0, _keys2.default)(state.byId).length;

              return {
                byId: (0, _extends3.default)({}, state.byId, {
                  [id]: {
                    id,
                    ast,
                    source,
                    sourcePath,
                    compiler
                  }
                })
              };

            /*
             * Default case
             */
            default:
              return state;
          }
        }

        const info = (0, _redux.combineReducers)({
          sources
        });

        function functionDepthStack(state = [0], action) {
          switch (action.type) {
            case actions.JUMP:
              let newState = state.slice(); //clone the state
              const delta = spelunk(action.jumpDirection);
              let top = newState[newState.length - 1];
              newState[newState.length - 1] = top + delta;
              return newState;

            case actions.RESET:
              return [0];

            case actions.EXTERNAL_CALL:
              return [...state, state[state.length - 1] + 1];

            case actions.EXTERNAL_RETURN:
              //just pop the stack! unless, HACK, that would leave it empty
              return state.length > 1 ? state.slice(0, -1) : state;

            default:
              return state;
          }
        }

        function spelunk(jump) {
          if (jump === 'i') {
            return 1;
          } else if (jump === 'o') {
            return -1;
          } else {
            return 0;
          }
        }

        const proc = (0, _redux.combineReducers)({
          functionDepthStack
        });

        const reducer = (0, _redux.combineReducers)({
          info,
          proc
        });

        exports.default = reducer;

        /***/
      },
      /* 66 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _redux = __webpack_require__(6);

        var _actions = __webpack_require__(12);

        var actions = _interopRequireWildcard(_actions);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:trace:reducers');

        function index(state = 0, action) {
          switch (action.type) {
            case actions.TOCK:
              return state + 1;

            case actions.RESET:
            case actions.UNLOAD_TRANSACTION:
              return 0;

            default:
              return state;
          }
        }

        function finished(state = false, action) {
          switch (action.type) {
            case actions.END_OF_TRACE:
              return true;

            case actions.RESET:
            case actions.UNLOAD_TRANSACTION:
              return false;

            default:
              return state;
          }
        }

        function steps(state = null, action) {
          switch (action.type) {
            case actions.SAVE_STEPS:
              return action.steps;
            case actions.UNLOAD_TRANSACTION:
              debug('unloading');
              return null;
            default:
              return state;
          }
        }

        const transaction = (0, _redux.combineReducers)({
          steps
        });

        const proc = (0, _redux.combineReducers)({
          index,
          finished
        });

        const reducer = (0, _redux.combineReducers)({
          transaction,
          proc
        });

        exports.default = reducer;

        /***/
      },
      /* 67 */
      /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _debug = __webpack_require__(0);

        var _debug2 = _interopRequireDefault(_debug);

        var _redux = __webpack_require__(6);

        var _actions = __webpack_require__(20);

        var actions = _interopRequireWildcard(_actions);

        function _interopRequireWildcard(obj) {
          if (obj && obj.__esModule) {
            return obj;
          } else {
            var newObj = {};
            if (obj != null) {
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  newObj[key] = obj[key];
              }
            }
            newObj.default = obj;
            return newObj;
          }
        }

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        const debug = (0, _debug2.default)('debugger:controller:reducers');

        function breakpoints(state = [], action) {
          switch (action.type) {
            case actions.ADD_BREAKPOINT:
              //check for any existing identical breakpoints to avoid redundancy
              if (
                state.filter(
                  breakpoint =>
                    breakpoint.sourceId === action.breakpoint.sourceId &&
                    breakpoint.line === action.breakpoint.line &&
                    breakpoint.node === action.breakpoint.node //may be undefined
                ).length > 0
              ) {
                //if it's already there, do nothing
                return state;
              } else {
                //otherwise add it
                return state.concat([action.breakpoint]);
              }
              break;

            case actions.REMOVE_BREAKPOINT:
              return state.filter(
                breakpoint =>
                  breakpoint.sourceId !== action.breakpoint.sourceId ||
                  breakpoint.line !== action.breakpoint.line ||
                  breakpoint.node !== action.breakpoint.node //may be undefined
              );
              break;

            case actions.REMOVE_ALL_BREAKPOINTS:
              return [];

            default:
              return state;
          }
        }

        function isStepping(state = false, action) {
          switch (action.type) {
            case actions.START_STEPPING:
              debug('got step start action');
              return true;
            case actions.DONE_STEPPING:
              debug('got step stop action');
              return false;
            default:
              return state;
          }
        }

        const reducer = (0, _redux.combineReducers)({
          breakpoints,
          isStepping
        });

        exports.default = reducer;

        /***/
      }
      /******/
    ]
  );
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdnZXIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2svYm9vdHN0cmFwIGUxZTljM2ZlYWM3MjI4YWUyZjEwIiwiZXh0ZXJuYWwgXCJkZWJ1Z1wiIiwibGliL2hlbHBlcnMvaW5kZXguanMiLCJleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzXCIiLCJleHRlcm5hbCBcInJlc2VsZWN0LXRyZWVcIiIsImV4dGVybmFsIFwidHJ1ZmZsZS1kZWNvZGUtdXRpbHNcIiIsImV4dGVybmFsIFwicmVkdXgtc2FnYS9lZmZlY3RzXCIiLCJleHRlcm5hbCBcInJlZHV4XCIiLCJleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZW50cmllc1wiIiwiZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnblwiIiwibGliL2V2bS9zZWxlY3RvcnMvaW5kZXguanMiLCJsaWIvdHJhY2Uvc2VsZWN0b3JzL2luZGV4LmpzIiwibGliL3NvbGlkaXR5L3NlbGVjdG9ycy9pbmRleC5qcyIsImxpYi90cmFjZS9hY3Rpb25zL2luZGV4LmpzIiwibGliL3RyYWNlL3NhZ2FzL2luZGV4LmpzIiwibGliL3Nlc3Npb24vYWN0aW9ucy9pbmRleC5qcyIsImV4dGVybmFsIFwiYm4uanNcIiIsImV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9rZXlzXCIiLCJsaWIvZGF0YS9zYWdhcy9pbmRleC5qcyIsImV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3JcIiIsImV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC92YWx1ZXNcIiIsImxpYi9jb250cm9sbGVyL2FjdGlvbnMvaW5kZXguanMiLCJsaWIvZGF0YS9zZWxlY3RvcnMvaW5kZXguanMiLCJleHRlcm5hbCBcImpzb24tcG9pbnRlclwiIiwiZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvc2V0XCIiLCJsaWIvZXZtL3NhZ2FzL2luZGV4LmpzIiwibGliL2NvbnRyb2xsZXIvc2VsZWN0b3JzL2luZGV4LmpzIiwibGliL2FzdC9tYXAuanMiLCJsaWIvc2Vzc2lvbi9zZWxlY3RvcnMvaW5kZXguanMiLCJsaWIvZGF0YS9hY3Rpb25zL2luZGV4LmpzIiwibGliL2V2bS9hY3Rpb25zL2luZGV4LmpzIiwibGliL3dlYjMvc2FnYXMvaW5kZXguanMiLCJleHRlcm5hbCBcIndlYjNcIiIsImV4dGVybmFsIFwidHJ1ZmZsZS1kZWNvZGVyXCIiLCJsaWIvY29udHJvbGxlci9zYWdhcy9pbmRleC5qcyIsImxpYi9zb2xpZGl0eS9zYWdhcy9pbmRleC5qcyIsImxpYi9zb2xpZGl0eS9hY3Rpb25zL2luZGV4LmpzIiwibGliL2FzdC9zZWxlY3RvcnMvaW5kZXguanMiLCIvVXNlcnMvdHlsZXIvcHJvamVjdHMvdHJ1ZmZsZS9wYWNrYWdlcy90cnVmZmxlLWRlYnVnZ2VyL2RlYnVnZ2VyLmpzIiwibGliL2RlYnVnZ2VyLmpzIiwiZXh0ZXJuYWwgXCJ0cnVmZmxlLWV4cGVjdFwiIiwibGliL3Nlc3Npb24vaW5kZXguanMiLCJleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlXCIiLCJsaWIvc3RvcmUvaW5kZXguanMiLCJsaWIvc3RvcmUvcHJvZHVjdGlvbi5qcyIsImxpYi9zdG9yZS9jb21tb24uanMiLCJleHRlcm5hbCBcInJlZHV4LXNhZ2FcIiIsImV4dGVybmFsIFwicmVkdXgtY2xpLWxvZ2dlclwiIiwiL1VzZXJzL3R5bGVyL3Byb2plY3RzL3RydWZmbGUvbm9kZV9tb2R1bGVzL2pzb24tc3RhYmxlLXN0cmluZ2lmeS9pbmRleC5qcyIsIi9Vc2Vycy90eWxlci9wcm9qZWN0cy90cnVmZmxlL25vZGVfbW9kdWxlcy9qc29uaWZ5L2luZGV4LmpzIiwiL1VzZXJzL3R5bGVyL3Byb2plY3RzL3RydWZmbGUvbm9kZV9tb2R1bGVzL2pzb25pZnkvbGliL3BhcnNlLmpzIiwiL1VzZXJzL3R5bGVyL3Byb2plY3RzL3RydWZmbGUvbm9kZV9tb2R1bGVzL2pzb25pZnkvbGliL3N0cmluZ2lmeS5qcyIsImV4dGVybmFsIFwidHJ1ZmZsZS1zb2xpZGl0eS11dGlsc1wiIiwiZXh0ZXJuYWwgXCJ0cnVmZmxlLWNvZGUtdXRpbHNcIiIsIi9Vc2Vycy90eWxlci9wcm9qZWN0cy90cnVmZmxlL25vZGVfbW9kdWxlcy9ub2RlLWludGVydmFsLXRyZWUvbGliL2luZGV4LmpzIiwiL1VzZXJzL3R5bGVyL3Byb2plY3RzL3RydWZmbGUvbm9kZV9tb2R1bGVzL3NoYWxsb3dlcXVhbC9pbmRleC5qcyIsImxpYi93ZWIzL2FjdGlvbnMvaW5kZXguanMiLCJsaWIvd2ViMy9hZGFwdGVyLmpzIiwiZXh0ZXJuYWwgXCJ1dGlsXCIiLCJleHRlcm5hbCBcImxvZGFzaC5zdW1cIiIsImxpYi9zZXNzaW9uL3NhZ2FzL2luZGV4LmpzIiwibGliL2FzdC9zYWdhcy9pbmRleC5qcyIsImxpYi9zZXNzaW9uL3JlZHVjZXJzLmpzIiwibGliL2RhdGEvcmVkdWNlcnMuanMiLCJsaWIvZXZtL3JlZHVjZXJzLmpzIiwiZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvYXJyYXkvZnJvbVwiIiwibGliL3NvbGlkaXR5L3JlZHVjZXJzLmpzIiwibGliL3RyYWNlL3JlZHVjZXJzLmpzIiwibGliL2NvbnRyb2xsZXIvcmVkdWNlcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEZWJ1Z2dlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEZWJ1Z2dlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEZWJ1Z2dlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMzcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGUxZTljM2ZlYWM3MjI4YWUyZjEwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGVidWdcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJkZWJ1Z1wiXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gXCJ0cnVmZmxlLWRlY29kZS11dGlsc1wiO1xuXG5jb25zdCBzdHJpbmdpZnkgPSByZXF1aXJlKFwianNvbi1zdGFibGUtc3RyaW5naWZ5XCIpO1xuXG4vKiogQVNUIG5vZGUgdHlwZXMgdGhhdCBhcmUgc2tpcHBlZCBieSBzdGVwTmV4dCgpIHRvIGZpbHRlciBvdXQgc29tZSBub2lzZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGVsaWJlcmF0ZWx5U2tpcHBlZE5vZGVUeXBlKG5vZGUpIHtcbiAgY29uc3Qgc2tpcHBlZFR5cGVzID0gW1wiQ29udHJhY3REZWZpbml0aW9uXCIsIFwiVmFyaWFibGVEZWNsYXJhdGlvblwiXTtcbiAgcmV0dXJuIHNraXBwZWRUeXBlcy5pbmNsdWRlcyhub2RlLm5vZGVUeXBlKTtcbn1cblxuLy9IQUNLXG4vL3RoZXNlIGFyZW4ndCB0aGUgb25seSB0eXBlcyBvZiBza2lwcGVkIG5vZGVzLCBidXQgZGV0ZXJtaW5pbmcgYWxsIHNraXBwZWRcbi8vbm9kZXMgd291bGQgYmUgdG9vIGRpZmZpY3VsdFxuZXhwb3J0IGZ1bmN0aW9uIGlzU2tpcHBlZE5vZGVUeXBlKG5vZGUpIHtcbiAgY29uc3Qgb3RoZXJTa2lwcGVkVHlwZXMgPSBbXCJWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50XCIsIFwiTWFwcGluZ1wiXTtcbiAgcmV0dXJuIChcbiAgICBpc0RlbGliZXJhdGVseVNraXBwZWROb2RlVHlwZShub2RlKSB8fFxuICAgIG90aGVyU2tpcHBlZFR5cGVzLmluY2x1ZGVzKG5vZGUubm9kZVR5cGUpIHx8XG4gICAgbm9kZS5ub2RlVHlwZS5pbmNsdWRlcyhcIlR5cGVOYW1lXCIpIHx8IC8vSEFDS1xuICAgIC8vc2tpcCBzdHJpbmcgbGl0ZXJhbHMgdG9vIC0tIHdlJ2xsIGhhbmRsZSB0aGF0IG1hbnVhbGx5XG4gICAgKG5vZGUudHlwZURlc2NyaXB0aW9ucyAhPT0gdW5kZWZpbmVkICYmIC8vc2VlbXMgdGhpcyBzb21ldGltZXMgaGFwcGVucz9cbiAgICAgIHV0aWxzLkRlZmluaXRpb24udHlwZUNsYXNzKG5vZGUpID09PSBcInN0cmluZ2xpdGVyYWxcIilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZWZpeE5hbWUocHJlZml4LCBmbikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIFwibmFtZVwiLCB7XG4gICAgdmFsdWU6IGAke3ByZWZpeH0uJHtmbi5uYW1lfWAsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIHJldHVybiBmbjtcbn1cblxuLypcbiAqIGV4dHJhY3QgdGhlIHByaW1hcnkgc291cmNlIGZyb20gYSBzb3VyY2UgbWFwXG4gKiAoaS5lLiwgdGhlIHNvdXJjZSBmb3IgdGhlIGZpcnN0IGluc3RydWN0aW9uLCBmb3VuZFxuICogYmV0d2VlbiB0aGUgc2Vjb25kIGFuZCB0aGlyZCBjb2xvbnMpXG4gKiAodGhpcyBpcyBzb21ldGhpbmcgb2YgYSBIQUNLKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFByaW1hcnlTb3VyY2Uoc291cmNlTWFwKSB7XG4gIHJldHVybiBwYXJzZUludChzb3VyY2VNYXAubWF0Y2goL15bXjpdKzpbXjpdKzooW146XSspOi8pWzFdKTtcbn1cblxuLyoqXG4gKiBAcmV0dXJuIDB4LXByZWZpeCBzdHJpbmcgb2Yga2VjY2FrMjU2IGhhc2hcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtlY2NhazI1NiguLi5hcmdzKSB7XG4gIHJldHVybiB1dGlscy5Db252ZXJzaW9uLnRvSGV4U3RyaW5nKHV0aWxzLkVWTS5rZWNjYWsyNTYoLi4uYXJncykpO1xufVxuXG4vKipcbiAqIEdpdmVuIGFuIG9iamVjdCwgcmV0dXJuIGEgc3RhYmxlIGhhc2ggYnkgZmlyc3QgcnVubmluZyBpdCB0aHJvdWdoIGEgc3RhYmxlXG4gKiBzdHJpbmdpZnkgb3BlcmF0aW9uIGJlZm9yZSBoYXNoaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFibGVLZWNjYWsyNTYob2JqKSB7XG4gIHJldHVybiBrZWNjYWsyNTYoeyB0eXBlOiBcInN0cmluZ1wiLCB2YWx1ZTogc3RyaW5naWZ5KG9iaikgfSk7XG59XG5cbi8qXG4gKiB1c2VkIGJ5IGRhdGE7IHRha2VzIGFuIGlkIG9iamVjdCBhbmQgYSByZWYgKHBvaW50ZXIpIGFuZCByZXR1cm5zIGEgZnVsbFxuICogY29ycmVzcG9uZGluZyBhc3NpZ25tZW50IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFzc2lnbm1lbnQoaWRPYmosIHJlZikge1xuICBsZXQgaWQgPSBzdGFibGVLZWNjYWsyNTYoaWRPYmopO1xuICByZXR1cm4geyAuLi5pZE9iaiwgaWQsIHJlZiB9O1xufVxuXG4vKlxuICogR2l2ZW4gYSBtbWVtb25pYywgZGV0ZXJtaW5lIHdoZXRoZXIgaXQncyB0aGUgbW5lbW9uaWMgb2YgYSBjYWxsaW5nXG4gKiBpbnN0cnVjdGlvbiAoZG9lcyBOT1QgaW5jbHVkZSBjcmVhdGlvbiBpbnN0cnVjdGlvbnMpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NhbGxNbmVtb25pYyhvcCkge1xuICBjb25zdCBjYWxscyA9IFtcIkNBTExcIiwgXCJERUxFR0FURUNBTExcIiwgXCJTVEFUSUNDQUxMXCIsIFwiQ0FMTENPREVcIl07XG4gIHJldHVybiBjYWxscy5pbmNsdWRlcyhvcCk7XG59XG5cbi8qXG4gKiByZXR1cm5zIHRydWUgZm9yIG1uZW1vbmljcyBmb3IgY2FsbHMgdGhhdCB0YWtlIG9ubHkgNiBhcmdzIGluc3RlYWQgb2YgN1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaG9ydENhbGxNbmVtb25pYyhvcCkge1xuICBjb25zdCBzaG9ydENhbGxzID0gW1wiREVMRUdBVEVDQUxMXCIsIFwiU1RBVElDQ0FMTFwiXTtcbiAgcmV0dXJuIHNob3J0Q2FsbHMuaW5jbHVkZXMob3ApO1xufVxuXG4vKlxuICogcmV0dXJucyB0cnVlIGZvciBtbmVtb25pY3MgZm9yIGNhbGxzIHRoYXQgZGVsZWdhdGUgc3RvcmFnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEZWxlZ2F0ZUNhbGxNbmVtb25pY0Jyb2FkKG9wKSB7XG4gIGNvbnN0IGRlbGVnYXRlQ2FsbHMgPSBbXCJERUxFR0FURUNBTExcIiwgXCJDQUxMQ09ERVwiXTtcbiAgcmV0dXJuIGRlbGVnYXRlQ2FsbHMuaW5jbHVkZXMob3ApO1xufVxuXG4vKlxuICogcmV0dXJucyB0cnVlIGZvciBtbmVtb25pY3MgZm9yIGNhbGxzIHRoYXQgZGVsZWdhdGUgZXZlcnl0aGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEZWxlZ2F0ZUNhbGxNbmVtb25pY1N0cmljdChvcCkge1xuICBjb25zdCBkZWxlZ2F0ZUNhbGxzID0gW1wiREVMRUdBVEVDQUxMXCJdO1xuICByZXR1cm4gZGVsZWdhdGVDYWxscy5pbmNsdWRlcyhvcCk7XG59XG5cbi8qXG4gKiByZXR1cm5zIHRydWUgZm9yIG1uZW1vbmljcyBmb3Igc3RhdGljIGNhbGxzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRpY0NhbGxNbmVtb25pYyhvcCkge1xuICBjb25zdCBkZWxlZ2F0ZUNhbGxzID0gW1wiU1RBVElDQ0FMTFwiXTtcbiAgcmV0dXJuIGRlbGVnYXRlQ2FsbHMuaW5jbHVkZXMob3ApO1xufVxuXG4vKlxuICogR2l2ZW4gYSBtbWVtb25pYywgZGV0ZXJtaW5lIHdoZXRoZXIgaXQncyB0aGUgbW5lbW9uaWMgb2YgYSBjcmVhdGlvblxuICogaW5zdHJ1Y3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ3JlYXRlTW5lbW9uaWMob3ApIHtcbiAgY29uc3QgY3JlYXRlcyA9IFtcIkNSRUFURVwiLCBcIkNSRUFURTJcIl07XG4gIHJldHVybiBjcmVhdGVzLmluY2x1ZGVzKG9wKTtcbn1cblxuLypcbiAqIEdpdmVuIGEgbW1lbW9uaWMsIGRldGVybWluZSB3aGV0aGVyIGl0J3MgdGhlIG1uZW1vbmljIG9mIGEgbm9ybWFsXG4gKiBoYWx0aW5nIGluc3RydWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05vcm1hbEhhbHRpbmdNbmVtb25pYyhvcCkge1xuICBjb25zdCBoYWx0cyA9IFtcIlNUT1BcIiwgXCJSRVRVUk5cIiwgXCJTRUxGREVTVFJVQ1RcIiwgXCJTVUlDSURFXCJdO1xuICAvL3RoZSBtbmVtb25pYyBTVUlDSURFIGlzIG5vIGxvbmdlciB1c2VkLCBidXQganVzdCBpbiBjYXNlLCBJJ20gaW5jbHVkaW5nIGl0XG4gIHJldHVybiBoYWx0cy5pbmNsdWRlcyhvcCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL2hlbHBlcnMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvZXh0ZW5kc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzXCJcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVzZWxlY3QtdHJlZVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlc2VsZWN0LXRyZWVcIlxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0cnVmZmxlLWRlY29kZS11dGlsc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInRydWZmbGUtZGVjb2RlLXV0aWxzXCJcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVkdXgtc2FnYS9lZmZlY3RzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVkdXgtc2FnYS9lZmZlY3RzXCJcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVkdXhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWR1eFwiXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZW50cmllc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZW50cmllc1wiXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ25cIlxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6ZXZtOnNlbGVjdG9yc1wiKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvclRyZWUsIGNyZWF0ZUxlYWYgfSBmcm9tIFwicmVzZWxlY3QtdHJlZVwiO1xuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiO1xuXG5pbXBvcnQgdHJhY2UgZnJvbSBcImxpYi90cmFjZS9zZWxlY3RvcnNcIjtcblxuaW1wb3J0ICogYXMgRGVjb2RlVXRpbHMgZnJvbSBcInRydWZmbGUtZGVjb2RlLXV0aWxzXCI7XG5pbXBvcnQge1xuICBpc0NhbGxNbmVtb25pYyxcbiAgaXNDcmVhdGVNbmVtb25pYyxcbiAgaXNTaG9ydENhbGxNbmVtb25pYyxcbiAgaXNEZWxlZ2F0ZUNhbGxNbmVtb25pY0Jyb2FkLFxuICBpc0RlbGVnYXRlQ2FsbE1uZW1vbmljU3RyaWN0LFxuICBpc1N0YXRpY0NhbGxNbmVtb25pYyxcbiAgaXNOb3JtYWxIYWx0aW5nTW5lbW9uaWNcbn0gZnJvbSBcImxpYi9oZWxwZXJzXCI7XG5cbi8qKlxuICogY3JlYXRlIEVWTS1sZXZlbCBzZWxlY3RvcnMgZm9yIGEgZ2l2ZW4gdHJhY2Ugc3RlcCBzZWxlY3RvclxuICogbWF5IHNwZWNpZnkgYWRkaXRpb25hbCBzZWxlY3RvcnMgdG8gaW5jbHVkZVxuICovXG5mdW5jdGlvbiBjcmVhdGVTdGVwU2VsZWN0b3JzKHN0ZXAsIHN0YXRlID0gbnVsbCkge1xuICBsZXQgYmFzZSA9IHtcbiAgICAvKipcbiAgICAgKiAudHJhY2VcbiAgICAgKlxuICAgICAqIHRyYWNlIHN0ZXAgaW5mbyByZWxhdGVkIHRvIG9wZXJhdGlvblxuICAgICAqL1xuICAgIHRyYWNlOiBjcmVhdGVMZWFmKFtzdGVwXSwgc3RlcCA9PiB7XG4gICAgICBpZiAoIXN0ZXApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBsZXQgeyBnYXNDb3N0LCBvcCwgcGMgfSA9IHN0ZXA7XG4gICAgICByZXR1cm4geyBnYXNDb3N0LCBvcCwgcGMgfTtcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIC5wcm9ncmFtQ291bnRlclxuICAgICAqL1xuICAgIHByb2dyYW1Db3VudGVyOiBjcmVhdGVMZWFmKFtcIi4vdHJhY2VcIl0sIHN0ZXAgPT4gKHN0ZXAgPyBzdGVwLnBjIDogbnVsbCkpLFxuXG4gICAgLyoqXG4gICAgICogLmlzSnVtcFxuICAgICAqL1xuICAgIGlzSnVtcDogY3JlYXRlTGVhZihcbiAgICAgIFtcIi4vdHJhY2VcIl0sXG4gICAgICBzdGVwID0+IHN0ZXAub3AgIT0gXCJKVU1QREVTVFwiICYmIHN0ZXAub3AuaW5kZXhPZihcIkpVTVBcIikgPT0gMFxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiAuaXNDYWxsXG4gICAgICpcbiAgICAgKiB3aGV0aGVyIHRoZSBvcGNvZGUgd2lsbCBzd2l0Y2ggdG8gYW5vdGhlciBjYWxsaW5nIGNvbnRleHRcbiAgICAgKi9cbiAgICBpc0NhbGw6IGNyZWF0ZUxlYWYoW1wiLi90cmFjZVwiXSwgc3RlcCA9PiBpc0NhbGxNbmVtb25pYyhzdGVwLm9wKSksXG5cbiAgICAvKipcbiAgICAgKiAuaXNTaG9ydENhbGxcbiAgICAgKlxuICAgICAqIGZvciBjYWxscyB0aGF0IG9ubHkgdGFrZSA2IGFyZ3VtZW50cyBpbnN0ZWFkIG9mIDdcbiAgICAgKi9cbiAgICBpc1Nob3J0Q2FsbDogY3JlYXRlTGVhZihbXCIuL3RyYWNlXCJdLCBzdGVwID0+IGlzU2hvcnRDYWxsTW5lbW9uaWMoc3RlcC5vcCkpLFxuXG4gICAgLyoqXG4gICAgICogLmlzRGVsZWdhdGVDYWxsQnJvYWRcbiAgICAgKlxuICAgICAqIGZvciBjYWxscyB0aGF0IGRlbGVnYXRlIHN0b3JhZ2VcbiAgICAgKi9cbiAgICBpc0RlbGVnYXRlQ2FsbEJyb2FkOiBjcmVhdGVMZWFmKFtcIi4vdHJhY2VcIl0sIHN0ZXAgPT5cbiAgICAgIGlzRGVsZWdhdGVDYWxsTW5lbW9uaWNCcm9hZChzdGVwLm9wKVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiAuaXNEZWxlZ2F0ZUNhbGxTdHJpY3RcbiAgICAgKlxuICAgICAqIGZvciBjYWxscyB0aGF0IGFkZGl0aW9uYWxseSBkZWxlZ2F0ZSBzZW5kZXIgYW5kIHZhbHVlXG4gICAgICovXG4gICAgaXNEZWxlZ2F0ZUNhbGxTdHJpY3Q6IGNyZWF0ZUxlYWYoW1wiLi90cmFjZVwiXSwgc3RlcCA9PlxuICAgICAgaXNEZWxlZ2F0ZUNhbGxNbmVtb25pY1N0cmljdChzdGVwLm9wKVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiAuaXNTdGF0aWNDYWxsXG4gICAgICovXG4gICAgaXNTdGF0aWNDYWxsOiBjcmVhdGVMZWFmKFtcIi4vdHJhY2VcIl0sIHN0ZXAgPT5cbiAgICAgIGlzU3RhdGljQ2FsbE1uZW1vbmljKHN0ZXAub3ApXG4gICAgKSxcblxuICAgIC8qKlxuICAgICAqIC5pc0NyZWF0ZVxuICAgICAqL1xuICAgIGlzQ3JlYXRlOiBjcmVhdGVMZWFmKFtcIi4vdHJhY2VcIl0sIHN0ZXAgPT4gaXNDcmVhdGVNbmVtb25pYyhzdGVwLm9wKSksXG5cbiAgICAvKipcbiAgICAgKiAuaXNIYWx0aW5nXG4gICAgICpcbiAgICAgKiB3aGV0aGVyIHRoZSBpbnN0cnVjdGlvbiBoYWx0cyBvciByZXR1cm5zIGZyb20gYSBjYWxsaW5nIGNvbnRleHRcbiAgICAgKiAoY292ZXJzIG9ubHkgb3JkaW5hcnkgaGFsZHMsIG5vdCBleGNlcHRpb25hbCBoYWx0cylcbiAgICAgKi9cbiAgICBpc0hhbHRpbmc6IGNyZWF0ZUxlYWYoW1wiLi90cmFjZVwiXSwgc3RlcCA9PlxuICAgICAgaXNOb3JtYWxIYWx0aW5nTW5lbW9uaWMoc3RlcC5vcClcbiAgICApLFxuXG4gICAgLypcbiAgICAgKiAuaXNTdG9yZVxuICAgICAqL1xuICAgIGlzU3RvcmU6IGNyZWF0ZUxlYWYoW1wiLi90cmFjZVwiXSwgc3RlcCA9PiBzdGVwLm9wID09IFwiU1NUT1JFXCIpLFxuXG4gICAgLypcbiAgICAgKiAuaXNMb2FkXG4gICAgICovXG4gICAgaXNMb2FkOiBjcmVhdGVMZWFmKFtcIi4vdHJhY2VcIl0sIHN0ZXAgPT4gc3RlcC5vcCA9PSBcIlNMT0FEXCIpLFxuXG4gICAgLypcbiAgICAgKiAudG91Y2hlc1N0b3JhZ2VcbiAgICAgKlxuICAgICAqIHdoZXRoZXIgdGhlIGluc3RydWN0aW9uIGludm9sdmVzIHN0b3JhZ2VcbiAgICAgKi9cbiAgICB0b3VjaGVzU3RvcmFnZTogY3JlYXRlTGVhZihcbiAgICAgIFtcIi4vaXNTdG9yZVwiLCBcImlzTG9hZFwiXSxcbiAgICAgIChzdG9yZXMsIGxvYWRzKSA9PiBzdG9yZXMgfHwgbG9hZHNcbiAgICApXG4gIH07XG5cbiAgaWYgKHN0YXRlKSB7XG4gICAgY29uc3QgaXNSZWxhdGl2ZSA9IHBhdGggPT5cbiAgICAgIHR5cGVvZiBwYXRoID09IFwic3RyaW5nXCIgJiZcbiAgICAgIChwYXRoLnN0YXJ0c1dpdGgoXCIuL1wiKSB8fCBwYXRoLnN0YXJ0c1dpdGgoXCIuLi9cIikpO1xuXG4gICAgaWYgKGlzUmVsYXRpdmUoc3RhdGUpKSB7XG4gICAgICBzdGF0ZSA9IGAuLi8ke3N0YXRlfWA7XG4gICAgfVxuXG4gICAgT2JqZWN0LmFzc2lnbihiYXNlLCB7XG4gICAgICAvKipcbiAgICAgICAqIC5jYWxsQWRkcmVzc1xuICAgICAgICpcbiAgICAgICAqIGFkZHJlc3MgdHJhbnNmZXJyZWQgdG8gYnkgY2FsbCBvcGVyYXRpb25cbiAgICAgICAqL1xuICAgICAgY2FsbEFkZHJlc3M6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtcIi4vaXNDYWxsXCIsIHN0YXRlXSxcblxuICAgICAgICAobWF0Y2hlcywgeyBzdGFjayB9KSA9PiB7XG4gICAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgYWRkcmVzcyA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDJdO1xuICAgICAgICAgIHJldHVybiBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQWRkcmVzcyhhZGRyZXNzKTtcbiAgICAgICAgfVxuICAgICAgKSxcblxuICAgICAgLyoqXG4gICAgICAgKiAuY3JlYXRlQmluYXJ5XG4gICAgICAgKlxuICAgICAgICogYmluYXJ5IGNvZGUgdG8gZXhlY3V0ZSB2aWEgY3JlYXRlIG9wZXJhdGlvblxuICAgICAgICovXG4gICAgICBjcmVhdGVCaW5hcnk6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtcIi4vaXNDcmVhdGVcIiwgc3RhdGVdLFxuXG4gICAgICAgIChtYXRjaGVzLCB7IHN0YWNrLCBtZW1vcnkgfSkgPT4ge1xuICAgICAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gR2V0IHRoZSBjb2RlIHRoYXQncyBnb2luZyB0byBiZSBjcmVhdGVkIGZyb20gbWVtb3J5LlxuICAgICAgICAgIC8vIE5vdGUgd2UgbXVsdGlwbHkgYnkgMiBiZWNhdXNlIHRoZXNlIG9mZnNldHMgYXJlIGluIGJ5dGVzLlxuICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlSW50KHN0YWNrW3N0YWNrLmxlbmd0aCAtIDJdLCAxNikgKiAyO1xuICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IHBhcnNlSW50KHN0YWNrW3N0YWNrLmxlbmd0aCAtIDNdLCAxNikgKiAyO1xuXG4gICAgICAgICAgcmV0dXJuIFwiMHhcIiArIG1lbW9yeS5qb2luKFwiXCIpLnN1YnN0cmluZyhvZmZzZXQsIG9mZnNldCArIGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogLmNhbGxEYXRhXG4gICAgICAgKlxuICAgICAgICogZGF0YSBwYXNzZWQgdG8gRVZNIGNhbGxcbiAgICAgICAqL1xuICAgICAgY2FsbERhdGE6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtcIi4vaXNDYWxsXCIsIFwiLi9pc1Nob3J0Q2FsbFwiLCBzdGF0ZV0sXG4gICAgICAgIChtYXRjaGVzLCBzaG9ydCwgeyBzdGFjaywgbWVtb3J5IH0pID0+IHtcbiAgICAgICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vaWYgaXQncyA2LWFyZ3VtZW50IGNhbGwsIHRoZSBkYXRhIHN0YXJ0IGFuZCBvZmZzZXQgd2lsbCBiZSBvbmUgc3BvdFxuICAgICAgICAgIC8vaGlnaGVyIGluIHRoZSBzdGFjayB0aGFuIHRoZXkgd291bGQgYmUgZm9yIGEgNy1hcmd1bWVudCBjYWxsLCBzb1xuICAgICAgICAgIC8vbGV0J3MgaW50cm9kdWNlIGFuIG9mZnNldCB0byBoYW5kbGUgdGhpc1xuICAgICAgICAgIGxldCBhcmdPZmZzZXQgPSBzaG9ydCA/IDEgOiAwO1xuXG4gICAgICAgICAgLy8gR2V0IHRoZSBkYXRhIGZyb20gbWVtb3J5LlxuICAgICAgICAgIC8vIE5vdGUgd2UgbXVsdGlwbHkgYnkgMiBiZWNhdXNlIHRoZXNlIG9mZnNldHMgYXJlIGluIGJ5dGVzLlxuICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlSW50KHN0YWNrW3N0YWNrLmxlbmd0aCAtIDQgKyBhcmdPZmZzZXRdLCAxNikgKiAyO1xuICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IHBhcnNlSW50KHN0YWNrW3N0YWNrLmxlbmd0aCAtIDUgKyBhcmdPZmZzZXRdLCAxNikgKiAyO1xuXG4gICAgICAgICAgcmV0dXJuIFwiMHhcIiArIG1lbW9yeS5qb2luKFwiXCIpLnN1YnN0cmluZyhvZmZzZXQsIG9mZnNldCArIGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogLmNhbGxWYWx1ZVxuICAgICAgICpcbiAgICAgICAqIHZhbHVlIGZvciB0aGUgY2FsbCAobm90IGNyZWF0ZSk7IHJldHVybnMgbnVsbCBmb3IgREVMRUdBVEVDQUxMXG4gICAgICAgKi9cbiAgICAgIGNhbGxWYWx1ZTogY3JlYXRlTGVhZihcbiAgICAgICAgW1wiLi9pc0NhbGxcIiwgXCIuL2lzRGVsZWdhdGVDYWxsU3RyaWN0XCIsIFwiLi9pc1N0YXRpY0NhbGxcIiwgc3RhdGVdLFxuICAgICAgICAoY2FsbHMsIGRlbGVnYXRlcywgaXNTdGF0aWMsIHsgc3RhY2sgfSkgPT4ge1xuICAgICAgICAgIGlmICghY2FsbHMgfHwgZGVsZWdhdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNTdGF0aWMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQk4oMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9vdGhlcndpc2UsIGZvciBDQUxMIGFuZCBDQUxMQ09ERSwgaXQncyB0aGUgM3JkIGFyZ3VtZW50XG4gICAgICAgICAgbGV0IHZhbHVlID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gM107XG4gICAgICAgICAgcmV0dXJuIERlY29kZVV0aWxzLkNvbnZlcnNpb24udG9CTih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogLmNyZWF0ZVZhbHVlXG4gICAgICAgKlxuICAgICAgICogdmFsdWUgZm9yIHRoZSBjcmVhdGVcbiAgICAgICAqL1xuICAgICAgY3JlYXRlVmFsdWU6IGNyZWF0ZUxlYWYoW1wiLi9pc0NyZWF0ZVwiLCBzdGF0ZV0sIChtYXRjaGVzLCB7IHN0YWNrIH0pID0+IHtcbiAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvL2NyZWF0ZXMgaGF2ZSB0aGUgdmFsdWUgYXMgdGhlIGZpcnN0IGFyZ3VtZW50XG4gICAgICAgIGxldCB2YWx1ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4gRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0JOKHZhbHVlKTtcbiAgICAgIH0pLFxuXG4gICAgICAvKipcbiAgICAgICAqIC5zdG9yYWdlQWZmZWN0ZWRcbiAgICAgICAqXG4gICAgICAgKiBzdG9yYWdlIHNsb3QgYmVpbmcgc3RvcmVkIHRvIG9yIGxvYWRlZCBmcm9tXG4gICAgICAgKiB3ZSBkbyBOT1QgcHJlcGVuZCBcIjB4XCJcbiAgICAgICAqL1xuICAgICAgc3RvcmFnZUFmZmVjdGVkOiBjcmVhdGVMZWFmKFxuICAgICAgICBbXCIuL3RvdWNoZXNTdG9yYWdlXCIsIHN0YXRlXSxcblxuICAgICAgICAobWF0Y2hlcywgeyBzdGFjayB9KSA9PiB7XG4gICAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBiYXNlO1xufVxuXG5jb25zdCBldm0gPSBjcmVhdGVTZWxlY3RvclRyZWUoe1xuICAvKipcbiAgICogZXZtLnN0YXRlXG4gICAqL1xuICBzdGF0ZTogc3RhdGUgPT4gc3RhdGUuZXZtLFxuXG4gIC8qKlxuICAgKiBldm0uaW5mb1xuICAgKi9cbiAgaW5mbzoge1xuICAgIC8qKlxuICAgICAqIGV2bS5pbmZvLmNvbnRleHRzXG4gICAgICovXG4gICAgY29udGV4dHM6IGNyZWF0ZUxlYWYoW1wiL3N0YXRlXCJdLCBzdGF0ZSA9PiBzdGF0ZS5pbmZvLmNvbnRleHRzLmJ5Q29udGV4dCksXG5cbiAgICAvKipcbiAgICAgKiBldm0uaW5mby5iaW5hcmllc1xuICAgICAqL1xuICAgIGJpbmFyaWVzOiB7XG4gICAgICAvKipcbiAgICAgICAqIGV2bS5pbmZvLmJpbmFyaWVzLnNlYXJjaFxuICAgICAgICpcbiAgICAgICAqIHJldHVybnMgZnVuY3Rpb24gKGJpbmFyeSkgPT4gY29udGV4dCAocmV0dXJucyB0aGUgKklEKiBvZiB0aGUgY29udGV4dClcbiAgICAgICAqIChyZXR1cm5zIG51bGwgb24gbm8gbWF0Y2gpXG4gICAgICAgKi9cbiAgICAgIHNlYXJjaDogY3JlYXRlTGVhZihbXCIvaW5mby9jb250ZXh0c1wiXSwgY29udGV4dHMgPT4gYmluYXJ5ID0+XG4gICAgICAgIERlY29kZVV0aWxzLkNvbnRleHRzLmZpbmREZWJ1Z2dlckNvbnRleHQoY29udGV4dHMsIGJpbmFyeSlcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIGV2bS50cmFuc2FjdGlvblxuICAgKi9cbiAgdHJhbnNhY3Rpb246IHtcbiAgICAvKipcbiAgICAgKiBldm0udHJhbnNhY3Rpb24uaW5zdGFuY2VzXG4gICAgICovXG4gICAgaW5zdGFuY2VzOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiL3N0YXRlXCJdLFxuICAgICAgc3RhdGUgPT4gc3RhdGUudHJhbnNhY3Rpb24uaW5zdGFuY2VzLmJ5QWRkcmVzc1xuICAgICksXG5cbiAgICAvKlxuICAgICAqIGV2bS50cmFuc2FjdGlvbi5nbG9iYWxzXG4gICAgICovXG4gICAgZ2xvYmFsczoge1xuICAgICAgLypcbiAgICAgICAqIGV2bS50cmFuc2FjdGlvbi5nbG9iYWxzLnR4XG4gICAgICAgKi9cbiAgICAgIHR4OiBjcmVhdGVMZWFmKFtcIi9zdGF0ZVwiXSwgc3RhdGUgPT4gc3RhdGUudHJhbnNhY3Rpb24uZ2xvYmFscy50eCksXG4gICAgICAvKlxuICAgICAgICogZXZtLnRyYW5zYWN0aW9uLmdsb2JhbHMuYmxvY2tcbiAgICAgICAqL1xuICAgICAgYmxvY2s6IGNyZWF0ZUxlYWYoW1wiL3N0YXRlXCJdLCBzdGF0ZSA9PiBzdGF0ZS50cmFuc2FjdGlvbi5nbG9iYWxzLmJsb2NrKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogZXZtLmN1cnJlbnRcbiAgICovXG4gIGN1cnJlbnQ6IHtcbiAgICAvKipcbiAgICAgKiBldm0uY3VycmVudC5jYWxsc3RhY2tcbiAgICAgKi9cbiAgICBjYWxsc3RhY2s6IHN0YXRlID0+IHN0YXRlLmV2bS5wcm9jLmNhbGxzdGFjayxcblxuICAgIC8qKlxuICAgICAqIGV2bS5jdXJyZW50LmNhbGxcbiAgICAgKi9cbiAgICBjYWxsOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9jYWxsc3RhY2tcIl0sXG5cbiAgICAgIHN0YWNrID0+IChzdGFjay5sZW5ndGggPyBzdGFja1tzdGFjay5sZW5ndGggLSAxXSA6IHt9KVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBldm0uY3VycmVudC5jb250ZXh0XG4gICAgICovXG4gICAgY29udGV4dDogY3JlYXRlTGVhZihcbiAgICAgIFtcbiAgICAgICAgXCIuL2NhbGxcIixcbiAgICAgICAgXCIvdHJhbnNhY3Rpb24vaW5zdGFuY2VzXCIsXG4gICAgICAgIFwiL2luZm8vYmluYXJpZXMvc2VhcmNoXCIsXG4gICAgICAgIFwiL2luZm8vY29udGV4dHNcIlxuICAgICAgXSxcbiAgICAgICh7IGFkZHJlc3MsIGJpbmFyeSB9LCBpbnN0YW5jZXMsIHNlYXJjaCwgY29udGV4dHMpID0+IHtcbiAgICAgICAgbGV0IGNvbnRleHRJZDtcbiAgICAgICAgaWYgKGFkZHJlc3MpIHtcbiAgICAgICAgICAvL2lmIHdlJ3JlIGluIGEgY2FsbCB0byBhIGRlcGxveWVkIGNvbnRyYWN0LCB3ZSAqbXVzdCogaGF2ZSByZWNvcmRlZFxuICAgICAgICAgIC8vaXQgaW4gdGhlIGluc3RhbmNlIHRhYmxlLCBzbyB3ZSBqdXN0IG5lZWQgdG8gbG9vayB1cCB0aGUgY29udGV4dCBJRFxuICAgICAgICAgIC8vZnJvbSB0aGVyZTsgd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnkgZnVydGhlciBzZWFyY2hpbmdcbiAgICAgICAgICBjb250ZXh0SWQgPSBpbnN0YW5jZXNbYWRkcmVzc10uY29udGV4dDtcbiAgICAgICAgICBiaW5hcnkgPSBpbnN0YW5jZXNbYWRkcmVzc10uYmluYXJ5O1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmFyeSkge1xuICAgICAgICAgIC8vb3RoZXJ3aXNlLCBpZiB3ZSdyZSBpbiBhIGNvbnN0cnVjdG9yLCB3ZSdsbCBuZWVkIHRvIGFjdHVhbGx5IGRvIGFcbiAgICAgICAgICAvL3NlYXJjaFxuICAgICAgICAgIGNvbnRleHRJZCA9IHNlYXJjaChiaW5hcnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vZXhjZXB0aW9uYWwgY2FzZTogbm8gdHJhbnNhY3Rpb24gaXMgbG9hZGVkXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29udGV4dCA9IGNvbnRleHRzW2NvbnRleHRJZF07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5jb250ZXh0LFxuICAgICAgICAgIGJpbmFyeVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBldm0uY3VycmVudC5zdGF0ZVxuICAgICAqXG4gICAgICogZXZtIHN0YXRlIGluZm86IGFzIG9mIGxhc3Qgb3BlcmF0aW9uLCBiZWZvcmUgb3AgZGVmaW5lZCBpbiBzdGVwXG4gICAgICovXG4gICAgc3RhdGU6IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIC4uLltcImRlcHRoXCIsIFwiZXJyb3JcIiwgXCJnYXNcIiwgXCJtZW1vcnlcIiwgXCJzdGFja1wiLCBcInN0b3JhZ2VcIl0ubWFwKHBhcmFtID0+ICh7XG4gICAgICAgIFtwYXJhbV06IGNyZWF0ZUxlYWYoW3RyYWNlLnN0ZXBdLCBzdGVwID0+IHN0ZXBbcGFyYW1dKVxuICAgICAgfSkpXG4gICAgKSxcblxuICAgIC8qKlxuICAgICAqIGV2bS5jdXJyZW50LnN0ZXBcbiAgICAgKi9cbiAgICBzdGVwOiB7XG4gICAgICAuLi5jcmVhdGVTdGVwU2VsZWN0b3JzKHRyYWNlLnN0ZXAsIFwiLi9zdGF0ZVwiKSxcblxuICAgICAgLy90aGUgZm9sbG93aW5nIHN0ZXAgc2VsZWN0b3JzIG9ubHkgZXhpc3QgZm9yIGN1cnJlbnQsIG5vdCBuZXh0IG9yIGFueVxuICAgICAgLy9vdGhlciBzdGVwXG5cbiAgICAgIC8qXG4gICAgICAgKiBldm0uY3VycmVudC5zdGVwLmNyZWF0ZWRBZGRyZXNzXG4gICAgICAgKlxuICAgICAgICogYWRkcmVzcyBjcmVhdGVkIGJ5IHRoZSBjdXJyZW50IGNyZWF0ZSBzdGVwXG4gICAgICAgKi9cbiAgICAgIGNyZWF0ZWRBZGRyZXNzOiBjcmVhdGVMZWFmKFxuICAgICAgICBbXCIuL2lzQ3JlYXRlXCIsIFwiL25leHRPZlNhbWVEZXB0aC9zdGF0ZS9zdGFja1wiXSxcbiAgICAgICAgKG1hdGNoZXMsIHN0YWNrKSA9PiB7XG4gICAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGFkZHJlc3MgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgICByZXR1cm4gRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0FkZHJlc3MoYWRkcmVzcyk7XG4gICAgICAgIH1cbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogZXZtLmN1cnJlbnQuc3RlcC5jYWxsc1ByZWNvbXBpbGVPckV4dGVybmFsXG4gICAgICAgKlxuICAgICAgICogYXJlIHdlIGNhbGxpbmcgYSBwcmVjb21waWxlZCBjb250cmFjdCBvciBhbiBleHRlcm5hbGx5LW93bmVkIGFjY291bnQsXG4gICAgICAgKiByYXRoZXIgdGhhbiBhIGNvbnRyYWN0IGFjY291bnQgdGhhdCBpc24ndCBwcmVjb21waWxlZD9cbiAgICAgICAqL1xuICAgICAgY2FsbHNQcmVjb21waWxlT3JFeHRlcm5hbDogY3JlYXRlTGVhZihcbiAgICAgICAgW1wiLi9pc0NhbGxcIiwgXCIvY3VycmVudC9zdGF0ZS9kZXB0aFwiLCBcIi9uZXh0L3N0YXRlL2RlcHRoXCJdLFxuICAgICAgICAoY2FsbHMsIGN1cnJlbnREZXB0aCwgbmV4dERlcHRoKSA9PiBjYWxscyAmJiBjdXJyZW50RGVwdGggPT09IG5leHREZXB0aFxuICAgICAgKSxcblxuICAgICAgLyoqXG4gICAgICAgKiBldm0uY3VycmVudC5zdGVwLmlzQ29udGV4dENoYW5nZVxuICAgICAgICogZ3JvdXBzIHRvZ2V0aGVyIGNhbGxzLCBjcmVhdGVzLCBoYWx0cywgYW5kIGV4Y2VwdGlvbmFsIGhhbHRzXG4gICAgICAgKi9cbiAgICAgIGlzQ29udGV4dENoYW5nZTogY3JlYXRlTGVhZihcbiAgICAgICAgW1wiL2N1cnJlbnQvc3RhdGUvZGVwdGhcIiwgXCIvbmV4dC9zdGF0ZS9kZXB0aFwiXSxcbiAgICAgICAgKGN1cnJlbnREZXB0aCwgbmV4dERlcHRoKSA9PiBjdXJyZW50RGVwdGggIT09IG5leHREZXB0aFxuICAgICAgKSxcblxuICAgICAgLyoqXG4gICAgICAgKiBldm0uY3VycmVudC5zdGVwLmlzRXhjZXB0aW9uYWxIYWx0aW5nXG4gICAgICAgKlxuICAgICAgICovXG4gICAgICBpc0V4Y2VwdGlvbmFsSGFsdGluZzogY3JlYXRlTGVhZihcbiAgICAgICAgW1wiLi9pc0hhbHRpbmdcIiwgXCIvY3VycmVudC9zdGF0ZS9kZXB0aFwiLCBcIi9uZXh0L3N0YXRlL2RlcHRoXCJdLFxuICAgICAgICAoaGFsdGluZywgY3VycmVudERlcHRoLCBuZXh0RGVwdGgpID0+XG4gICAgICAgICAgbmV4dERlcHRoIDwgY3VycmVudERlcHRoICYmICFoYWx0aW5nXG4gICAgICApXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGV2bS5jdXJyZW50LmNvZGV4IChuYW1lc3BhY2UpXG4gICAgICovXG4gICAgY29kZXg6IHtcbiAgICAgIC8qKlxuICAgICAgICogZXZtLmN1cnJlbnQuY29kZXggKHNlbGVjdG9yKVxuICAgICAgICogdGhlIHdob2xlIGNvZGV4ISBub3QgdGhhdCB0aGF0J3MgdmVyeSBtdWNoIGF0IHRoZSBtb21lbnRcbiAgICAgICAqL1xuICAgICAgXzogY3JlYXRlTGVhZihbXCIvc3RhdGVcIl0sIHN0YXRlID0+IHN0YXRlLnByb2MuY29kZXgpLFxuXG4gICAgICAvKipcbiAgICAgICAqIGV2bS5jdXJyZW50LmNvZGV4LnN0b3JhZ2VcbiAgICAgICAqIHRoZSBjdXJyZW50IHN0b3JhZ2UsIGFzIGZldGNoZWQgZnJvbSB0aGUgY29kZXguLi4gdW5sZXNzIHdlJ3JlIGluIGFcbiAgICAgICAqIGZhaWxlZCBjcmVhdGlvbiBjYWxsLCB0aGVuIHdlIGp1c3QgZmFsbCBiYWNrIG9uIHRoZSBzdGF0ZSAod2hpY2ggd2lsbFxuICAgICAgICogd29yaywgc2luY2Ugbm90aGluZyBlbHNlIGNhbiBpbnRlcmZlcmUgd2l0aCB0aGUgc3RvcmFnZSBvZiBhIGZhaWxlZFxuICAgICAgICogY3JlYXRpb24gY2FsbCEpXG4gICAgICAgKi9cbiAgICAgIHN0b3JhZ2U6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtcIi4vX1wiLCBcIi4uL3N0YXRlL3N0b3JhZ2VcIiwgXCIuLi9jYWxsXCJdLFxuICAgICAgICAoY29kZXgsIHJhd1N0b3JhZ2UsIHsgc3RvcmFnZUFkZHJlc3MgfSkgPT5cbiAgICAgICAgICBzdG9yYWdlQWRkcmVzcyA9PT0gRGVjb2RlVXRpbHMuRVZNLlpFUk9fQUREUkVTU1xuICAgICAgICAgICAgPyByYXdTdG9yYWdlIC8vSEFDSyAtLSBpZiB6ZXJvIGFkZHJlc3MgaWdub3JlIHRoZSBjb2RleFxuICAgICAgICAgICAgOiBjb2RleFtjb2RleC5sZW5ndGggLSAxXS5hY2NvdW50c1tzdG9yYWdlQWRkcmVzc10uc3RvcmFnZVxuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogZXZtLm5leHRcbiAgICovXG4gIG5leHQ6IHtcbiAgICAvKipcbiAgICAgKiBldm0ubmV4dC5zdGF0ZVxuICAgICAqXG4gICAgICogZXZtIHN0YXRlIGFzIGEgcmVzdWx0IG9mIG5leHQgc3RlcCBvcGVyYXRpb25cbiAgICAgKi9cbiAgICBzdGF0ZTogT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgLi4uW1wiZGVwdGhcIiwgXCJlcnJvclwiLCBcImdhc1wiLCBcIm1lbW9yeVwiLCBcInN0YWNrXCIsIFwic3RvcmFnZVwiXS5tYXAocGFyYW0gPT4gKHtcbiAgICAgICAgW3BhcmFtXTogY3JlYXRlTGVhZihbdHJhY2UubmV4dF0sIHN0ZXAgPT4gc3RlcFtwYXJhbV0pXG4gICAgICB9KSlcbiAgICApLFxuXG4gICAgLypcbiAgICAgKiBldm0ubmV4dC5zdGVwXG4gICAgICovXG4gICAgc3RlcDogY3JlYXRlU3RlcFNlbGVjdG9ycyh0cmFjZS5uZXh0LCBcIi4vc3RhdGVcIilcbiAgfSxcblxuICAvKipcbiAgICogZXZtLm5leHRPZlNhbWVEZXB0aFxuICAgKi9cbiAgbmV4dE9mU2FtZURlcHRoOiB7XG4gICAgLyoqXG4gICAgICogZXZtLm5leHRPZlNhbWVEZXB0aC5zdGF0ZVxuICAgICAqXG4gICAgICogZXZtIHN0YXRlIGF0IHRoZSBuZXh0IHN0ZXAgb2Ygc2FtZSBkZXB0aFxuICAgICAqL1xuICAgIHN0YXRlOiBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICAuLi5bXCJkZXB0aFwiLCBcImVycm9yXCIsIFwiZ2FzXCIsIFwibWVtb3J5XCIsIFwic3RhY2tcIiwgXCJzdG9yYWdlXCJdLm1hcChwYXJhbSA9PiAoe1xuICAgICAgICBbcGFyYW1dOiBjcmVhdGVMZWFmKFt0cmFjZS5uZXh0T2ZTYW1lRGVwdGhdLCBzdGVwID0+IHN0ZXBbcGFyYW1dKVxuICAgICAgfSkpXG4gICAgKVxuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZXZtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9ldm0vc2VsZWN0b3JzL2luZGV4LmpzIiwiaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3JUcmVlLCBjcmVhdGVMZWFmIH0gZnJvbSBcInJlc2VsZWN0LXRyZWVcIjtcblxuY29uc3QgUEFTVF9FTkRfT0ZfVFJBQ0UgPSB7XG4gIGRlcHRoOiAtMSwgLy90aGlzIGlzIHRoZSBwYXJ0IHRoYXQgbWF0dGVycyFcbiAgLy90aGUgcmVzdCBvZiB0aGlzIGlzIGp1c3QgdG8gbG9vayBsaWtlIGEgdHJhY2Ugc3RlcFxuICBlcnJvcjogXCJcIixcbiAgZ2FzOiAwLFxuICBtZW1vcnk6IFtdLFxuICBzdGFjazogW10sXG4gIHN0b3JhZ2U6IHt9LFxuICBnYXNDb3N0OiAwLFxuICBvcDogXCJTVE9QXCIsXG4gIHBjOiAtMSAvL3RoaXMgaXMgbm90IGF0IGFsbCB2YWxpZCBidXQgdGhhdCdzIGZpbmVcbn07XG5cbmxldCB0cmFjZSA9IGNyZWF0ZVNlbGVjdG9yVHJlZSh7XG4gIC8qKlxuICAgKiB0cmFjZS5pbmRleFxuICAgKlxuICAgKiBjdXJyZW50IHN0ZXAgaW5kZXhcbiAgICovXG4gIGluZGV4OiBzdGF0ZSA9PiBzdGF0ZS50cmFjZS5wcm9jLmluZGV4LFxuXG4gIC8qXG4gICAqIHRyYWNlLmxvYWRlZFxuICAgKiBpcyBhIHRyYWNlIGxvYWRlZD9cbiAgICovXG4gIGxvYWRlZDogY3JlYXRlTGVhZihbXCIvc3RlcHNcIl0sIHN0ZXBzID0+IHN0ZXBzICE9PSBudWxsKSxcblxuICAvKipcbiAgICogdHJhY2UuZmluaXNoZWRcbiAgICogaXMgdGhlIHRyYWNlIGZpbmlzaGVkP1xuICAgKi9cbiAgZmluaXNoZWQ6IHN0YXRlID0+IHN0YXRlLnRyYWNlLnByb2MuZmluaXNoZWQsXG5cbiAgLyoqXG4gICAqIHRyYWNlLmZpbmlzaGVkT3JVbmxvYWRlZFxuICAgKlxuICAgKiBpcyB0aGUgdHJhY2UgZmluaXNoZWQsIGluY2x1ZGluZyBpZiBpdCdzIHVubG9hZGVkP1xuICAgKi9cbiAgZmluaXNoZWRPclVubG9hZGVkOiBjcmVhdGVMZWFmKFxuICAgIFtcIi9maW5pc2hlZFwiLCBcIi9sb2FkZWRcIl0sXG4gICAgKGZpbmlzaGVkLCBsb2FkZWQpID0+IGZpbmlzaGVkIHx8ICFsb2FkZWRcbiAgKSxcblxuICAvKipcbiAgICogdHJhY2Uuc3RlcHNcbiAgICpcbiAgICogYWxsIHRyYWNlIHN0ZXBzXG4gICAqL1xuICBzdGVwczogc3RhdGUgPT4gc3RhdGUudHJhY2UudHJhbnNhY3Rpb24uc3RlcHMsXG5cbiAgLyoqXG4gICAqIHRyYWNlLnN0ZXBzUmVtYWluaW5nXG4gICAqXG4gICAqIG51bWJlciBvZiBzdGVwcyByZW1haW5pbmcgaW4gdHJhY2VcbiAgICovXG4gIHN0ZXBzUmVtYWluaW5nOiBjcmVhdGVMZWFmKFxuICAgIFtcIi4vc3RlcHNcIiwgXCIuL2luZGV4XCJdLFxuICAgIChzdGVwcywgaW5kZXgpID0+IHN0ZXBzLmxlbmd0aCAtIGluZGV4XG4gICksXG5cbiAgLyoqXG4gICAqIHRyYWNlLnN0ZXBcbiAgICpcbiAgICogY3VycmVudCB0cmFjZSBzdGVwXG4gICAqL1xuICBzdGVwOiBjcmVhdGVMZWFmKFxuICAgIFtcIi4vc3RlcHNcIiwgXCIuL2luZGV4XCJdLFxuICAgIChzdGVwcywgaW5kZXgpID0+IChzdGVwcyA/IHN0ZXBzW2luZGV4XSA6IG51bGwpIC8vbnVsbCBpZiBubyB0eCBsb2FkZWRcbiAgKSxcblxuICAvKipcbiAgICogdHJhY2UubmV4dFxuICAgKlxuICAgKiBuZXh0IHRyYWNlIHN0ZXBcbiAgICogSEFDSzogaWYgYXQgdGhlIGVuZCxcbiAgICogd2Ugd2lsbCByZXR1cm4gYSBzcG9vZmVkIFwicGFzdCBlbmRcIiBzdGVwXG4gICAqL1xuICBuZXh0OiBjcmVhdGVMZWFmKFxuICAgIFtcIi4vc3RlcHNcIiwgXCIuL2luZGV4XCJdLFxuICAgIChzdGVwcywgaW5kZXgpID0+XG4gICAgICBpbmRleCA8IHN0ZXBzLmxlbmd0aCAtIDEgPyBzdGVwc1tpbmRleCArIDFdIDogUEFTVF9FTkRfT0ZfVFJBQ0VcbiAgKSxcblxuICAvKlxuICAgKiB0cmFjZS5uZXh0T2ZTYW1lRGVwdGhcbiAgICogbmV4dCB0cmFjZSBzdGVwIHRoYXQncyBhdCB0aGUgc2FtZSBkZXB0aCBhcyB0aGlzIG9uZVxuICAgKiBOT1RFOiBpZiB0aGVyZSBpcyBub25lLCB3aWxsIHJldHVybiB1bmRlZmluZWRcbiAgICogKHNob3VsZCBub3QgYmUgdXNlZCBpbiBzdWNoIGNhc2VzKVxuICAgKi9cbiAgbmV4dE9mU2FtZURlcHRoOiBjcmVhdGVMZWFmKFtcIi4vc3RlcHNcIiwgXCIuL2luZGV4XCJdLCAoc3RlcHMsIGluZGV4KSA9PiB7XG4gICAgbGV0IGRlcHRoID0gc3RlcHNbaW5kZXhdLmRlcHRoO1xuICAgIHJldHVybiBzdGVwcy5zbGljZShpbmRleCArIDEpLmZpbmQoc3RlcCA9PiBzdGVwLmRlcHRoID09PSBkZXB0aCk7XG4gIH0pXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgdHJhY2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL3RyYWNlL3NlbGVjdG9ycy9pbmRleC5qcyIsImltcG9ydCBkZWJ1Z01vZHVsZSBmcm9tIFwiZGVidWdcIjtcbmNvbnN0IGRlYnVnID0gZGVidWdNb2R1bGUoXCJkZWJ1Z2dlcjpzb2xpZGl0eTpzZWxlY3RvcnNcIik7XG5cbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yVHJlZSwgY3JlYXRlTGVhZiB9IGZyb20gXCJyZXNlbGVjdC10cmVlXCI7XG5pbXBvcnQgU29saWRpdHlVdGlscyBmcm9tIFwidHJ1ZmZsZS1zb2xpZGl0eS11dGlsc1wiO1xuaW1wb3J0IENvZGVVdGlscyBmcm9tIFwidHJ1ZmZsZS1jb2RlLXV0aWxzXCI7XG5cbmltcG9ydCB7IGZpbmRSYW5nZSB9IGZyb20gXCJsaWIvYXN0L21hcFwiO1xuaW1wb3J0IGpzb25wb2ludGVyIGZyb20gXCJqc29uLXBvaW50ZXJcIjtcblxuaW1wb3J0IGV2bSBmcm9tIFwibGliL2V2bS9zZWxlY3RvcnNcIjtcbmltcG9ydCB0cmFjZSBmcm9tIFwibGliL3RyYWNlL3NlbGVjdG9yc1wiO1xuXG5mdW5jdGlvbiBnZXRTb3VyY2VSYW5nZShpbnN0cnVjdGlvbiA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IGluc3RydWN0aW9uLnN0YXJ0IHx8IDAsXG4gICAgbGVuZ3RoOiBpbnN0cnVjdGlvbi5sZW5ndGggfHwgMCxcbiAgICBsaW5lczogaW5zdHJ1Y3Rpb24ucmFuZ2UgfHwge1xuICAgICAgc3RhcnQ6IHtcbiAgICAgICAgbGluZTogMCxcbiAgICAgICAgY29sdW1uOiAwXG4gICAgICB9LFxuICAgICAgZW5kOiB7XG4gICAgICAgIGxpbmU6IDAsXG4gICAgICAgIGNvbHVtbjogMFxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLy9mdW5jdGlvbiB0byBjcmVhdGUgc2VsZWN0b3JzIHRoYXQgbmVlZCBib3RoIGEgY3VycmVudCBhbmQgbmV4dCB2ZXJzaW9uXG5mdW5jdGlvbiBjcmVhdGVNdWx0aXN0ZXBTZWxlY3RvcnMoc3RlcFNlbGVjdG9yKSB7XG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogLmluc3RydWN0aW9uXG4gICAgICovXG4gICAgaW5zdHJ1Y3Rpb246IGNyZWF0ZUxlYWYoXG4gICAgICBbXCIvY3VycmVudC9pbnN0cnVjdGlvbkF0UHJvZ3JhbUNvdW50ZXJcIiwgc3RlcFNlbGVjdG9yLnByb2dyYW1Db3VudGVyXSxcbiAgICAgIC8vSEFDSzogd2UgdXNlIHNvbGlkaXR5LmN1cnJlbnQuaW5zdHJ1Y3Rpb25BdFByb2dyYW1Db3VudGVyXG4gICAgICAvL2V2ZW4gaWYgd2UncmUgbG9va2luZyBhdCBzb2xpZGl0eS5uZXh0LlxuICAgICAgLy9UaGlzIGlzIGhhcm1sZXNzLi4uIHNvIGxvbmcgYXMgdGhlIGN1cnJlbnQgaW5zdHJ1Y3Rpb24gaXNuJ3QgYSBjb250ZXh0XG4gICAgICAvL2NoYW5nZS4gIFNvLCBkb24ndCB1c2Ugc29saWRpdHkubmV4dCB3aGVuIGl0IGlzLlxuXG4gICAgICAobWFwLCBwYykgPT4gbWFwW3BjXSB8fCB7fVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiAuc291cmNlXG4gICAgICovXG4gICAgc291cmNlOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiL2luZm8vc291cmNlc1wiLCBcIi4vaW5zdHJ1Y3Rpb25cIl0sXG5cbiAgICAgIChzb3VyY2VzLCB7IGZpbGU6IGlkIH0pID0+IHNvdXJjZXNbaWRdIHx8IHt9XG4gICAgKSxcblxuICAgIC8qKlxuICAgICAqIC5zb3VyY2VSYW5nZVxuICAgICAqL1xuICAgIHNvdXJjZVJhbmdlOiBjcmVhdGVMZWFmKFtcIi4vaW5zdHJ1Y3Rpb25cIl0sIGdldFNvdXJjZVJhbmdlKSxcblxuICAgIC8qKlxuICAgICAqIC5wb2ludGVyXG4gICAgICovXG4gICAgcG9pbnRlcjogY3JlYXRlTGVhZihcbiAgICAgIFtcIi4vc291cmNlXCIsIFwiLi9zb3VyY2VSYW5nZVwiXSxcblxuICAgICAgKHsgYXN0IH0sIHJhbmdlKSA9PiBmaW5kUmFuZ2UoYXN0LCByYW5nZS5zdGFydCwgcmFuZ2UubGVuZ3RoKVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiAubm9kZVxuICAgICAqL1xuICAgIG5vZGU6IGNyZWF0ZUxlYWYoXG4gICAgICBbXCIuL3NvdXJjZVwiLCBcIi4vcG9pbnRlclwiXSxcbiAgICAgICh7IGFzdCB9LCBwb2ludGVyKSA9PlxuICAgICAgICBwb2ludGVyID8ganNvbnBvaW50ZXIuZ2V0KGFzdCwgcG9pbnRlcikgOiBqc29ucG9pbnRlci5nZXQoYXN0LCBcIlwiKVxuICAgIClcbiAgfTtcbn1cblxubGV0IHNvbGlkaXR5ID0gY3JlYXRlU2VsZWN0b3JUcmVlKHtcbiAgLyoqXG4gICAqIHNvbGlkaXR5LnN0YXRlXG4gICAqL1xuICBzdGF0ZTogc3RhdGUgPT4gc3RhdGUuc29saWRpdHksXG5cbiAgLyoqXG4gICAqIHNvbGlkaXR5LmluZm9cbiAgICovXG4gIGluZm86IHtcbiAgICAvKipcbiAgICAgKiBzb2xpZGl0eS5pbmZvLnNvdXJjZXNcbiAgICAgKi9cbiAgICBzb3VyY2VzOiBjcmVhdGVMZWFmKFtcIi9zdGF0ZVwiXSwgc3RhdGUgPT4gc3RhdGUuaW5mby5zb3VyY2VzLmJ5SWQpXG4gIH0sXG5cbiAgLyoqXG4gICAqIHNvbGlkaXR5LmN1cnJlbnRcbiAgICovXG4gIGN1cnJlbnQ6IHtcbiAgICAvKipcbiAgICAgKiBzb2xpZGl0eS5jdXJyZW50LnNvdXJjZU1hcFxuICAgICAqL1xuICAgIHNvdXJjZU1hcDogY3JlYXRlTGVhZihcbiAgICAgIFtldm0uY3VycmVudC5jb250ZXh0XSxcblxuICAgICAgY29udGV4dCA9PiAoY29udGV4dCA/IGNvbnRleHQuc291cmNlTWFwIDogbnVsbCkgLy9udWxsIHdoZW4gbm8gdHggbG9hZGVkXG4gICAgKSxcblxuICAgIC8qKlxuICAgICAqIHNvbGlkaXR5LmN1cnJlbnQuZnVuY3Rpb25EZXB0aFN0YWNrXG4gICAgICovXG4gICAgZnVuY3Rpb25EZXB0aFN0YWNrOiBzdGF0ZSA9PiBzdGF0ZS5zb2xpZGl0eS5wcm9jLmZ1bmN0aW9uRGVwdGhTdGFjayxcblxuICAgIC8qKlxuICAgICAqIHNvbGlkaXR5LmN1cnJlbnQuZnVuY3Rpb25EZXB0aFxuICAgICAqL1xuICAgIGZ1bmN0aW9uRGVwdGg6IGNyZWF0ZUxlYWYoXG4gICAgICBbXCIuL2Z1bmN0aW9uRGVwdGhTdGFja1wiXSxcbiAgICAgIHN0YWNrID0+IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdXG4gICAgKSxcblxuICAgIC8qKlxuICAgICAqIHNvbGlkaXR5LmN1cnJlbnQuaW5zdHJ1Y3Rpb25zXG4gICAgICovXG4gICAgaW5zdHJ1Y3Rpb25zOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiL2luZm8vc291cmNlc1wiLCBldm0uY3VycmVudC5jb250ZXh0LCBcIi4vc291cmNlTWFwXCJdLFxuXG4gICAgICAoc291cmNlcywgY29udGV4dCwgc291cmNlTWFwKSA9PiB7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYmluYXJ5ID0gY29udGV4dC5iaW5hcnk7XG4gICAgICAgIGlmICghYmluYXJ5KSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG51bUluc3RydWN0aW9ucztcbiAgICAgICAgaWYgKHNvdXJjZU1hcCkge1xuICAgICAgICAgIG51bUluc3RydWN0aW9ucyA9IHNvdXJjZU1hcC5zcGxpdChcIjtcIikubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vSEFDS1xuICAgICAgICAgIG51bUluc3RydWN0aW9ucyA9IChiaW5hcnkubGVuZ3RoIC0gMikgLyAyO1xuICAgICAgICAgIC8vdGhpcyBpcyBhY3R1YWxseSBhbiBvdmVyZXN0aW1hdGUsIGJ1dCB0aGF0J3MgT0tcbiAgICAgICAgfVxuXG4gICAgICAgIC8vYmVjYXVzZSB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYSBjb25zdHJ1Y3RvciB3aXRoIGFyZ3VtZW50cywgd2UgZG9cbiAgICAgICAgLy8qbm90KiByZW1vdmUgbWV0YWRhdGEgbWFudWFsbHlcbiAgICAgICAgbGV0IGluc3RydWN0aW9ucyA9IENvZGVVdGlscy5wYXJzZUNvZGUoYmluYXJ5LCBudW1JbnN0cnVjdGlvbnMpO1xuXG4gICAgICAgIGlmICghc291cmNlTWFwKSB7XG4gICAgICAgICAgLy8gSEFDS1xuICAgICAgICAgIC8vIExldCdzIGNyZWF0ZSBhIHNvdXJjZSBtYXAgdG8gdXNlIHNpbmNlIG5vbmUgZXhpc3RzLiBUaGlzIHNvdXJjZVxuICAgICAgICAgIC8vIG1hcCBtYXBzIGp1c3QgYXMgbWFueSByYW5nZXMgYXMgdGhlcmUgYXJlIGluc3RydWN0aW9ucyAob3JcbiAgICAgICAgICAvLyBwb3NzaWJseSBtb3JlKSwgYW5kIG1hcmtzIHRoZW0gYWxsIGFzIGJlaW5nIFNvbGlkaXR5LWludGVybmFsIGFuZFxuICAgICAgICAgIC8vIG5vdCBqdW1wcy5cbiAgICAgICAgICBzb3VyY2VNYXAgPVxuICAgICAgICAgICAgYmluYXJ5ICE9PSBcIjB4XCJcbiAgICAgICAgICAgICAgPyBcIjA6MDotMTotXCIuY29uY2F0KFwiO1wiLnJlcGVhdChpbnN0cnVjdGlvbnMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICAgIDogXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsaW5lQW5kQ29sdW1uTWFwcGluZ3MgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIC4uLk9iamVjdC5lbnRyaWVzKHNvdXJjZXMpLm1hcCgoW2lkLCB7IHNvdXJjZSB9XSkgPT4gKHtcbiAgICAgICAgICAgIFtpZF06IFNvbGlkaXR5VXRpbHMuZ2V0Q2hhcmFjdGVyT2Zmc2V0VG9MaW5lQW5kQ29sdW1uTWFwcGluZyhcbiAgICAgICAgICAgICAgc291cmNlIHx8IFwiXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KSlcbiAgICAgICAgKTtcbiAgICAgICAgdmFyIGh1bWFuUmVhZGFibGVTb3VyY2VNYXAgPSBTb2xpZGl0eVV0aWxzLmdldEh1bWFuUmVhZGFibGVTb3VyY2VNYXAoXG4gICAgICAgICAgc291cmNlTWFwXG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IHByaW1hcnlGaWxlID0gaHVtYW5SZWFkYWJsZVNvdXJjZU1hcFswXS5maWxlO1xuICAgICAgICBkZWJ1ZyhcInByaW1hcnlGaWxlICVvXCIsIHByaW1hcnlGaWxlKTtcblxuICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zXG4gICAgICAgICAgLm1hcCgoaW5zdHJ1Y3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAvLyBsb29rdXAgc291cmNlIG1hcCBieSBpbmRleCBhbmQgYWRkIGBpbmRleGAgcHJvcGVydHkgdG9cbiAgICAgICAgICAgIC8vIGluc3RydWN0aW9uXG4gICAgICAgICAgICAvL1xuXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VNYXAgPSBodW1hblJlYWRhYmxlU291cmNlTWFwW2luZGV4XSB8fCB7fTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb246IHsgLi4uaW5zdHJ1Y3Rpb24sIGluZGV4IH0sXG4gICAgICAgICAgICAgIHNvdXJjZU1hcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5tYXAoKHsgaW5zdHJ1Y3Rpb24sIHNvdXJjZU1hcCB9KSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgc291cmNlIG1hcCBpbmZvcm1hdGlvbiB0byBpbnN0cnVjdGlvbiwgb3IgZGVmYXVsdHNcbiAgICAgICAgICAgIC8vXG5cbiAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAganVtcCxcbiAgICAgICAgICAgICAgc3RhcnQgPSAwLFxuICAgICAgICAgICAgICBsZW5ndGggPSAwLFxuICAgICAgICAgICAgICBmaWxlID0gcHJpbWFyeUZpbGVcbiAgICAgICAgICAgIH0gPSBzb3VyY2VNYXA7XG4gICAgICAgICAgICBjb25zdCBsaW5lQW5kQ29sdW1uTWFwcGluZyA9IGxpbmVBbmRDb2x1bW5NYXBwaW5nc1tmaWxlXSB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlID0ge1xuICAgICAgICAgICAgICBzdGFydDogbGluZUFuZENvbHVtbk1hcHBpbmdbc3RhcnRdIHx8IHtcbiAgICAgICAgICAgICAgICBsaW5lOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogbnVsbFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlbmQ6IGxpbmVBbmRDb2x1bW5NYXBwaW5nW3N0YXJ0ICsgbGVuZ3RoXSB8fCB7XG4gICAgICAgICAgICAgICAgbGluZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjb2x1bW46IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHJhbmdlLnN0YXJ0LmxpbmUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgZGVidWcoXCJzb3VyY2VNYXAgJW9cIiwgc291cmNlTWFwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4uaW5zdHJ1Y3Rpb24sXG5cbiAgICAgICAgICAgICAganVtcCxcbiAgICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgcmFuZ2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKSxcblxuICAgIC8qKlxuICAgICAqIHNvbGlkaXR5LmN1cnJlbnQuaW5zdHJ1Y3Rpb25BdFByb2dyYW1Db3VudGVyXG4gICAgICovXG4gICAgaW5zdHJ1Y3Rpb25BdFByb2dyYW1Db3VudGVyOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9pbnN0cnVjdGlvbnNcIl0sXG5cbiAgICAgIGluc3RydWN0aW9ucyA9PlxuICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIC4uLmluc3RydWN0aW9ucy5tYXAoaW5zdHJ1Y3Rpb24gPT4gKHtcbiAgICAgICAgICAgIFtpbnN0cnVjdGlvbi5wY106IGluc3RydWN0aW9uXG4gICAgICAgICAgfSkpXG4gICAgICAgIClcbiAgICApLFxuXG4gICAgLi4uY3JlYXRlTXVsdGlzdGVwU2VsZWN0b3JzKGV2bS5jdXJyZW50LnN0ZXApLFxuXG4gICAgLyoqXG4gICAgICogc29saWRpdHkuY3VycmVudC5pc1NvdXJjZVJhbmdlRmluYWxcbiAgICAgKi9cbiAgICBpc1NvdXJjZVJhbmdlRmluYWw6IGNyZWF0ZUxlYWYoXG4gICAgICBbXG4gICAgICAgIFwiLi9pbnN0cnVjdGlvbkF0UHJvZ3JhbUNvdW50ZXJcIixcbiAgICAgICAgZXZtLmN1cnJlbnQuc3RlcC5wcm9ncmFtQ291bnRlcixcbiAgICAgICAgZXZtLm5leHQuc3RlcC5wcm9ncmFtQ291bnRlclxuICAgICAgXSxcblxuICAgICAgKG1hcCwgY3VycmVudCwgbmV4dCkgPT4ge1xuICAgICAgICBpZiAoIW1hcFtuZXh0XSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudCA9IG1hcFtjdXJyZW50XTtcbiAgICAgICAgbmV4dCA9IG1hcFtuZXh0XTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGN1cnJlbnQuc3RhcnQgIT0gbmV4dC5zdGFydCB8fFxuICAgICAgICAgIGN1cnJlbnQubGVuZ3RoICE9IG5leHQubGVuZ3RoIHx8XG4gICAgICAgICAgY3VycmVudC5maWxlICE9IG5leHQuZmlsZVxuICAgICAgICApO1xuICAgICAgfVxuICAgICksXG5cbiAgICAvKlxuICAgICAqIHNvbGlkaXR5LmN1cnJlbnQuZnVuY3Rpb25zQnlQcm9ncmFtQ291bnRlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uc0J5UHJvZ3JhbUNvdW50ZXI6IGNyZWF0ZUxlYWYoXG4gICAgICBbXCIuL2luc3RydWN0aW9uc1wiLCBcIi9pbmZvL3NvdXJjZXNcIl0sXG4gICAgICAoaW5zdHJ1Y3Rpb25zLCBzb3VyY2VzKSA9PlxuICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIC4uLmluc3RydWN0aW9uc1xuICAgICAgICAgICAgLmZpbHRlcihpbnN0cnVjdGlvbiA9PiBpbnN0cnVjdGlvbi5uYW1lID09PSBcIkpVTVBERVNUXCIpXG4gICAgICAgICAgICAuZmlsdGVyKGluc3RydWN0aW9uID0+IGluc3RydWN0aW9uLmZpbGUgIT09IC0xKVxuICAgICAgICAgICAgLy9ub3RlIHRoYXQgdGhlIGRlc2lnbmF0ZWQgaW52YWxpZCBmdW5jdGlvbiAqZG9lcyogaGF2ZSBhbiBhc3NvY2lhdGVkXG4gICAgICAgICAgICAvL2ZpbGUsIHNvIGl0ICppcyogc2FmZSB0byBqdXN0IGZpbHRlciBvdXQgdGhlIG9uZXMgdGhhdCBkb24ndFxuICAgICAgICAgICAgLm1hcChpbnN0cnVjdGlvbiA9PiB7XG4gICAgICAgICAgICAgIGRlYnVnKFwiaW5zdHJ1Y3Rpb24gJU9cIiwgaW5zdHJ1Y3Rpb24pO1xuICAgICAgICAgICAgICBsZXQgc291cmNlID0gaW5zdHJ1Y3Rpb24uZmlsZTtcbiAgICAgICAgICAgICAgZGVidWcoXCJzb3VyY2UgJU9cIiwgc291cmNlc1tzb3VyY2VdKTtcbiAgICAgICAgICAgICAgbGV0IGFzdCA9IHNvdXJjZXNbc291cmNlXS5hc3Q7XG4gICAgICAgICAgICAgIGxldCByYW5nZSA9IGdldFNvdXJjZVJhbmdlKGluc3RydWN0aW9uKTtcbiAgICAgICAgICAgICAgbGV0IHBvaW50ZXIgPSBmaW5kUmFuZ2UoYXN0LCByYW5nZS5zdGFydCwgcmFuZ2UubGVuZ3RoKTtcbiAgICAgICAgICAgICAgbGV0IG5vZGUgPSBwb2ludGVyXG4gICAgICAgICAgICAgICAgPyBqc29ucG9pbnRlci5nZXQoYXN0LCBwb2ludGVyKVxuICAgICAgICAgICAgICAgIDoganNvbnBvaW50ZXIuZ2V0KGFzdCwgXCJcIik7XG4gICAgICAgICAgICAgIGlmICghbm9kZSB8fCBub2RlLm5vZGVUeXBlICE9PSBcIkZ1bmN0aW9uRGVmaW5pdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy9maWx0ZXIgb3V0IEpVTVBERVNUcyB0aGF0IGFyZW4ndCBmdW5jdGlvbiBkZWZpbml0aW9ucy4uLlxuICAgICAgICAgICAgICAgIC8vZXhjZXB0IGZvciB0aGUgZGVzaWduYXRlZCBpbnZhbGlkIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgbGV0IG5leHRJbnN0cnVjdGlvbiA9IGluc3RydWN0aW9uc1tpbnN0cnVjdGlvbi5pbmRleCArIDFdIHx8IHt9O1xuICAgICAgICAgICAgICAgIGlmIChuZXh0SW5zdHJ1Y3Rpb24ubmFtZSA9PT0gXCJJTlZBTElEXCIpIHtcbiAgICAgICAgICAgICAgICAgIC8vZGVzaWduYXRlZCBpbnZhbGlkLCBpbmNsdWRlIGl0XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBbaW5zdHJ1Y3Rpb24ucGNdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgaXNEZXNpZ25hdGVkSW52YWxpZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvL25vdCBkZXNpZ25hdGVkIGludmFsaWQsIGZpbHRlciBpdCBvdXRcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy9vdGhlcndpc2UsIHdlJ3JlIGdvb2QgdG8gZ28sIHNvIGxldCdzIGZpbmQgdGhlIGNvbnRyYWN0IG5vZGUgYW5kXG4gICAgICAgICAgICAgIC8vcHV0IGl0IGFsbCB0b2dldGhlclxuICAgICAgICAgICAgICAvL3RvIGdldCB0aGUgY29udHJhY3Qgbm9kZSwgd2UgZ28gdXAgdHdpY2UgZnJvbSB0aGUgZnVuY3Rpb24gbm9kZTtcbiAgICAgICAgICAgICAgLy90aGUgcGF0aCBmcm9tIG9uZSB0byB0aGUgb3RoZXIgc2hvdWxkIGhhdmUgYSB2ZXJ5IHNwZWNpZmljIGZvcm0sXG4gICAgICAgICAgICAgIC8vc28gdGhpcyBpcyBlYXN5XG4gICAgICAgICAgICAgIGxldCBjb250cmFjdFBvaW50ZXIgPSBwb2ludGVyLnJlcGxhY2UoL1xcL25vZGVzXFwvXFxkKyQvLCBcIlwiKTtcbiAgICAgICAgICAgICAgbGV0IGNvbnRyYWN0Tm9kZSA9IGpzb25wb2ludGVyLmdldChhc3QsIGNvbnRyYWN0UG9pbnRlcik7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgW2luc3RydWN0aW9uLnBjXToge1xuICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgcG9pbnRlcixcbiAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgIGNvbnRyYWN0UG9pbnRlcixcbiAgICAgICAgICAgICAgICAgIGNvbnRyYWN0Tm9kZSxcbiAgICAgICAgICAgICAgICAgIGNvbnRyYWN0TmFtZTogY29udHJhY3ROb2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgICBjb250cmFjdElkOiBjb250cmFjdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICBjb250cmFjdEtpbmQ6IGNvbnRyYWN0Tm9kZS5jb250cmFjdEtpbmQsXG4gICAgICAgICAgICAgICAgICBpc0Rlc2lnbmF0ZWRJbnZhbGlkOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICApLFxuXG4gICAgLyoqXG4gICAgICogc29saWRpdHkuY3VycmVudC5pc011bHRpbGluZVxuICAgICAqL1xuICAgIGlzTXVsdGlsaW5lOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9zb3VyY2VSYW5nZVwiXSxcblxuICAgICAgKHsgbGluZXMgfSkgPT4gbGluZXMuc3RhcnQubGluZSAhPSBsaW5lcy5lbmQubGluZVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBzb2xpZGl0eS5jdXJyZW50LndpbGxKdW1wXG4gICAgICovXG4gICAgd2lsbEp1bXA6IGNyZWF0ZUxlYWYoW2V2bS5jdXJyZW50LnN0ZXAuaXNKdW1wXSwgaXNKdW1wID0+IGlzSnVtcCksXG5cbiAgICAvKipcbiAgICAgKiBzb2xpZGl0eS5jdXJyZW50Lmp1bXBEaXJlY3Rpb25cbiAgICAgKi9cbiAgICBqdW1wRGlyZWN0aW9uOiBjcmVhdGVMZWFmKFtcIi4vaW5zdHJ1Y3Rpb25cIl0sIChpID0ge30pID0+IGkuanVtcCB8fCBcIi1cIiksXG5cbiAgICAvKipcbiAgICAgKiBzb2xpZGl0eS5jdXJyZW50LndpbGxDYWxsXG4gICAgICovXG4gICAgd2lsbENhbGw6IGNyZWF0ZUxlYWYoW2V2bS5jdXJyZW50LnN0ZXAuaXNDYWxsXSwgeCA9PiB4KSxcblxuICAgIC8qKlxuICAgICAqIHNvbGlkaXR5LmN1cnJlbnQud2lsbENyZWF0ZVxuICAgICAqL1xuICAgIHdpbGxDcmVhdGU6IGNyZWF0ZUxlYWYoW2V2bS5jdXJyZW50LnN0ZXAuaXNDcmVhdGVdLCB4ID0+IHgpLFxuXG4gICAgLyoqXG4gICAgICogc29saWRpdHkuY3VycmVudC5jYWxsc1ByZWNvbXBpbGVPckV4dGVybmFsXG4gICAgICovXG4gICAgY2FsbHNQcmVjb21waWxlT3JFeHRlcm5hbDogY3JlYXRlTGVhZihcbiAgICAgIFtldm0uY3VycmVudC5zdGVwLmNhbGxzUHJlY29tcGlsZU9yRXh0ZXJuYWxdLFxuICAgICAgeCA9PiB4XG4gICAgKSxcblxuICAgIC8qKlxuICAgICAqIHNvbGlkaXR5LmN1cnJlbnQud2lsbFJldHVyblxuICAgICAqL1xuICAgIHdpbGxSZXR1cm46IGNyZWF0ZUxlYWYoXG4gICAgICBbZXZtLmN1cnJlbnQuc3RlcC5pc0hhbHRpbmddLFxuICAgICAgaXNIYWx0aW5nID0+IGlzSGFsdGluZ1xuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBzb2xpZGl0eS5jdXJyZW50LndpbGxGYWlsXG4gICAgICovXG4gICAgd2lsbEZhaWw6IGNyZWF0ZUxlYWYoW2V2bS5jdXJyZW50LnN0ZXAuaXNFeGNlcHRpb25hbEhhbHRpbmddLCB4ID0+IHgpLFxuXG4gICAgLypcbiAgICAgKiBzb2xpZGl0eS5jdXJyZW50Lm5leHRNYXBwZWRcbiAgICAgKiByZXR1cm5zIHRoZSBuZXh0IHRyYWNlIHN0ZXAgYWZ0ZXIgdGhpcyBvbmUgd2hpY2ggaXMgc291cmNlbWFwcGVkXG4gICAgICogSEFDSzogdGhpcyBhc3N1bWVzIHdlJ3JlIG5vdCBhYm91dCB0byBjaGFuZ2UgY29udGV4dCEgZG9uJ3QgdXNlIHRoaXMgaWZcbiAgICAgKiB3ZSBhcmUhXG4gICAgICogQUxTTywgdGhpcyBtYXkgcmV0dXJuIHVuZGVmaW5lZCwgc28gYmUgcHJlcGFyZWQgZm9yIHRoYXRcbiAgICAgKi9cbiAgICBuZXh0TWFwcGVkOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9pbnN0cnVjdGlvbkF0UHJvZ3JhbUNvdW50ZXJcIiwgdHJhY2Uuc3RlcHMsIHRyYWNlLmluZGV4XSxcbiAgICAgIChtYXAsIHN0ZXBzLCBpbmRleCkgPT5cbiAgICAgICAgc3RlcHMuc2xpY2UoaW5kZXggKyAxKS5maW5kKCh7IHBjIH0pID0+IG1hcFtwY10gJiYgbWFwW3BjXS5maWxlICE9PSAtMSlcbiAgICApXG4gIH0sXG5cbiAgLyoqXG4gICAqIHNvbGlkaXR5Lm5leHRcbiAgICogSEFDSyBXQVJOSU5HOiBkbyBub3QgdXNlIHRoZXNlIHNlbGVjdG9ycyB3aGVuIHRoZSBjdXJyZW50IGluc3RydWN0aW9uIGlzIGFcbiAgICogY29udGV4dCBjaGFuZ2UhIChldm0gY2FsbCBvciBldm0gcmV0dXJuKVxuICAgKi9cbiAgbmV4dDogY3JlYXRlTXVsdGlzdGVwU2VsZWN0b3JzKGV2bS5uZXh0LnN0ZXApXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgc29saWRpdHk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL3NvbGlkaXR5L3NlbGVjdG9ycy9pbmRleC5qcyIsImV4cG9ydCBjb25zdCBTQVZFX1NURVBTID0gXCJTQVZFX1NURVBTXCI7XG5leHBvcnQgZnVuY3Rpb24gc2F2ZVN0ZXBzKHN0ZXBzKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU0FWRV9TVEVQUyxcbiAgICBzdGVwc1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgTkVYVCA9IFwiTkVYVFwiO1xuZXhwb3J0IGZ1bmN0aW9uIG5leHQoKSB7XG4gIHJldHVybiB7IHR5cGU6IE5FWFQgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFRJQ0sgPSBcIlRJQ0tcIjtcbmV4cG9ydCBmdW5jdGlvbiB0aWNrKCkge1xuICByZXR1cm4geyB0eXBlOiBUSUNLIH07XG59XG5cbmV4cG9ydCBjb25zdCBUT0NLID0gXCJUT0NLXCI7XG5leHBvcnQgZnVuY3Rpb24gdG9jaygpIHtcbiAgcmV0dXJuIHsgdHlwZTogVE9DSyB9O1xufVxuXG5leHBvcnQgY29uc3QgRU5EX09GX1RSQUNFID0gXCJFT1RcIjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRUcmFjZSgpIHtcbiAgcmV0dXJuIHsgdHlwZTogRU5EX09GX1RSQUNFIH07XG59XG5cbmV4cG9ydCBjb25zdCBSRVNFVCA9IFwiVFJBQ0VfUkVTRVRcIjtcbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpIHtcbiAgcmV0dXJuIHsgdHlwZTogUkVTRVQgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFVOTE9BRF9UUkFOU0FDVElPTiA9IFwiVFJBQ0VfVU5MT0FEX1RSQU5TQUNUSU9OXCI7XG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkVHJhbnNhY3Rpb24oKSB7XG4gIHJldHVybiB7IHR5cGU6IFVOTE9BRF9UUkFOU0FDVElPTiB9O1xufVxuXG5leHBvcnQgY29uc3QgQkFDS1RJQ0sgPSBcIkJBQ0tUSUNLXCI7XG5leHBvcnQgZnVuY3Rpb24gYmFja3RpY2soKSB7XG4gIHJldHVybiB7IHR5cGU6IEJBQ0tUSUNLIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL3RyYWNlL2FjdGlvbnMvaW5kZXguanMiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6dHJhY2U6c2FnYXNcIik7XG5cbmltcG9ydCB7IHRha2UsIHRha2VFdmVyeSwgcHV0LCBzZWxlY3QgfSBmcm9tIFwicmVkdXgtc2FnYS9lZmZlY3RzXCI7XG5pbXBvcnQgeyBwcmVmaXhOYW1lLCBpc0NhbGxNbmVtb25pYywgaXNDcmVhdGVNbmVtb25pYyB9IGZyb20gXCJsaWIvaGVscGVyc1wiO1xuXG5pbXBvcnQgKiBhcyBEZWNvZGVVdGlscyBmcm9tIFwidHJ1ZmZsZS1kZWNvZGUtdXRpbHNcIjtcblxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9uc1wiO1xuXG5pbXBvcnQgdHJhY2UgZnJvbSBcIi4uL3NlbGVjdG9yc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24qIGFkdmFuY2UoKSB7XG4gIHlpZWxkIHB1dChhY3Rpb25zLm5leHQoKSk7XG5cbiAgZGVidWcoXCJUT0NLIHRvIHRha2VcIik7XG4gIHlpZWxkIHRha2UoW2FjdGlvbnMuVE9DSywgYWN0aW9ucy5FTkRfT0ZfVFJBQ0VdKTtcbiAgZGVidWcoXCJUT0NLIHRha2VuXCIpO1xufVxuXG5jb25zdCBTVUJNT0RVTEVfQ09VTlQgPSAzOyAvL2RhdGEsIGV2bSwgc29saWRpdHlcblxuZnVuY3Rpb24qIG5leHQoKSB7XG4gIGxldCByZW1haW5pbmcgPSB5aWVsZCBzZWxlY3QodHJhY2Uuc3RlcHNSZW1haW5pbmcpO1xuICBkZWJ1ZyhcInJlbWFpbmluZzogJW9cIiwgcmVtYWluaW5nKTtcbiAgbGV0IHN0ZXBzID0geWllbGQgc2VsZWN0KHRyYWNlLnN0ZXBzKTtcbiAgZGVidWcoXCJ0b3RhbCBzdGVwczogJW9cIiwgc3RlcHMubGVuZ3RoKTtcbiAgbGV0IHdhaXRpbmdGb3JTdWJtb2R1bGVzID0gMDtcblxuICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgIGRlYnVnKFwicHV0dGluZyBUSUNLXCIpO1xuICAgIC8vIHVwZGF0ZXMgc3RhdGUgZm9yIGN1cnJlbnQgc3RlcFxuICAgIHdhaXRpbmdGb3JTdWJtb2R1bGVzID0gU1VCTU9EVUxFX0NPVU5UO1xuICAgIHlpZWxkIHB1dChhY3Rpb25zLnRpY2soKSk7XG4gICAgZGVidWcoXCJwdXQgVElDS1wiKTtcblxuICAgIC8vd2FpdCBmb3IgYWxsIGJhY2t0aWNrcyBiZWZvcmUgY29udGludWluZ1xuICAgIHdoaWxlICh3YWl0aW5nRm9yU3VibW9kdWxlcyA+IDApIHtcbiAgICAgIHlpZWxkIHRha2UoYWN0aW9ucy5CQUNLVElDSyk7XG4gICAgICBkZWJ1ZyhcImdvdCBCQUNLVElDS1wiKTtcbiAgICAgIHdhaXRpbmdGb3JTdWJtb2R1bGVzLS07XG4gICAgfVxuXG4gICAgcmVtYWluaW5nLS07IC8vIGxvY2FsIHVwZGF0ZSwganVzdCBmb3IgY29udmVuaWVuY2VcbiAgfVxuXG4gIGlmIChyZW1haW5pbmcpIHtcbiAgICBkZWJ1ZyhcInB1dHRpbmcgVE9DS1wiKTtcbiAgICAvLyB1cGRhdGVzIHN0ZXAgdG8gbmV4dCBzdGVwIGluIHRyYWNlXG4gICAgeWllbGQgcHV0KGFjdGlvbnMudG9jaygpKTtcbiAgICBkZWJ1ZyhcInB1dCBUT0NLXCIpO1xuICB9IGVsc2Uge1xuICAgIGRlYnVnKFwicHV0dGluZyBFTkRfT0ZfVFJBQ0VcIik7XG4gICAgeWllbGQgcHV0KGFjdGlvbnMuZW5kVHJhY2UoKSk7XG4gICAgZGVidWcoXCJwdXQgRU5EX09GX1RSQUNFXCIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc2lnbmFsVGlja1NhZ2FDb21wbGV0aW9uKCkge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5iYWNrdGljaygpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBwcm9jZXNzVHJhY2Uoc3RlcHMpIHtcbiAgeWllbGQgcHV0KGFjdGlvbnMuc2F2ZVN0ZXBzKHN0ZXBzKSk7XG5cbiAgbGV0IGFkZHJlc3NlcyA9IFtcbiAgICAuLi5uZXcgU2V0KFxuICAgICAgc3RlcHNcbiAgICAgICAgLm1hcCgoeyBvcCwgc3RhY2ssIGRlcHRoIH0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGlzQ2FsbE1uZW1vbmljKG9wKSkge1xuICAgICAgICAgICAgLy9pZiBpdCdzIGEgY2FsbCwganVzdCBmZXRjaCB0aGUgYWRkcmVzcyBvZmYgdGhlIHN0YWNrXG4gICAgICAgICAgICByZXR1cm4gRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0FkZHJlc3Moc3RhY2tbc3RhY2subGVuZ3RoIC0gMl0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXNDcmVhdGVNbmVtb25pYyhvcCkpIHtcbiAgICAgICAgICAgIC8vaWYgaXQncyBhIGNyZWF0ZSwgbG9vayBhaGVhZCB0byB3aGVuIGl0IHJldHVybnMgYW5kIGdldCB0aGVcbiAgICAgICAgICAgIC8vYWRkcmVzcyBvZmYgdGhlIHN0YWNrXG4gICAgICAgICAgICBsZXQgcmV0dXJuU3RhY2sgPSBzdGVwc1xuICAgICAgICAgICAgICAuc2xpY2UoaW5kZXggKyAxKVxuICAgICAgICAgICAgICAuZmluZChzdGVwID0+IHN0ZXAuZGVwdGggPT09IGRlcHRoKS5zdGFjaztcbiAgICAgICAgICAgIHJldHVybiBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQWRkcmVzcyhcbiAgICAgICAgICAgICAgcmV0dXJuU3RhY2tbcmV0dXJuU3RhY2subGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vaWYgaXQncyBub3QgYSBjYWxsIG9yIGNyZWF0ZSwgdGhlcmUncyBubyBhZGRyZXNzIHRvIGdldFxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC8vZmlsdGVyIG91dCB6ZXJvIGFkZHJlc3NlcyBmcm9tIGZhaWxlZCBjcmVhdGVzIChhcyB3ZWxsIGFzIHVuZGVmaW5lZHMpXG4gICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgYWRkcmVzcyA9PlxuICAgICAgICAgICAgYWRkcmVzcyAhPT0gdW5kZWZpbmVkICYmIGFkZHJlc3MgIT09IERlY29kZVV0aWxzLkVWTS5aRVJPX0FERFJFU1NcbiAgICAgICAgKVxuICAgIClcbiAgXTtcblxuICByZXR1cm4gYWRkcmVzc2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIHJlc2V0KCkge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5yZXNldCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiB1bmxvYWQoKSB7XG4gIHlpZWxkIHB1dChhY3Rpb25zLnVubG9hZFRyYW5zYWN0aW9uKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIHNhZ2EoKSB7XG4gIHlpZWxkIHRha2VFdmVyeShhY3Rpb25zLk5FWFQsIG5leHQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwcmVmaXhOYW1lKFwidHJhY2VcIiwgc2FnYSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL3RyYWNlL3NhZ2FzL2luZGV4LmpzIiwiZXhwb3J0IGNvbnN0IFNUQVJUID0gXCJTRVNTSU9OX1NUQVJUXCI7XG5leHBvcnQgZnVuY3Rpb24gc3RhcnQocHJvdmlkZXIsIHR4SGFzaCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNUQVJULFxuICAgIHByb3ZpZGVyLFxuICAgIHR4SGFzaCAvL09QVElPTkFMXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBMT0FEX1RSQU5TQUNUSU9OID0gXCJMT0FEX1RSQU5TQUNUSU9OXCI7XG5leHBvcnQgZnVuY3Rpb24gbG9hZFRyYW5zYWN0aW9uKHR4SGFzaCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IExPQURfVFJBTlNBQ1RJT04sXG4gICAgdHhIYXNoXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBJTlRFUlJVUFQgPSBcIlNFU1NJT05fSU5URVJSVVBUXCI7XG5leHBvcnQgZnVuY3Rpb24gaW50ZXJydXB0KCkge1xuICByZXR1cm4geyB0eXBlOiBJTlRFUlJVUFQgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFVOTE9BRF9UUkFOU0FDVElPTiA9IFwiVU5MT0FEX1RSQU5TQUNUSU9OXCI7XG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkVHJhbnNhY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogVU5MT0FEX1RSQU5TQUNUSU9OXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBSRUFEWSA9IFwiU0VTU0lPTl9SRUFEWVwiO1xuZXhwb3J0IGZ1bmN0aW9uIHJlYWR5KCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFQURZXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBXQUlUID0gXCJTRVNTSU9OX1dBSVRcIjtcbmV4cG9ydCBmdW5jdGlvbiB3YWl0KCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFdBSVRcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IEVSUk9SID0gXCJTRVNTSU9OX0VSUk9SXCI7XG5leHBvcnQgZnVuY3Rpb24gZXJyb3IoZXJyb3IpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBFUlJPUixcbiAgICBlcnJvclxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgQ0xFQVJfRVJST1IgPSBcIkNMRUFSX0VSUk9SXCI7XG5leHBvcnQgZnVuY3Rpb24gY2xlYXJFcnJvcigpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBDTEVBUl9FUlJPUlxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgUkVDT1JEX0NPTlRSQUNUUyA9IFwiUkVDT1JEX0NPTlRSQUNUU1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHJlY29yZENvbnRyYWN0cyhjb250ZXh0cywgc291cmNlcykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFQ09SRF9DT05UUkFDVFMsXG4gICAgY29udGV4dHMsXG4gICAgc291cmNlc1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgU0FWRV9UUkFOU0FDVElPTiA9IFwiU0FWRV9UUkFOU0FDVElPTlwiO1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVUcmFuc2FjdGlvbih0cmFuc2FjdGlvbikge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNBVkVfVFJBTlNBQ1RJT04sXG4gICAgdHJhbnNhY3Rpb25cbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFNBVkVfUkVDRUlQVCA9IFwiU0FWRV9SRUNFSVBUXCI7XG5leHBvcnQgZnVuY3Rpb24gc2F2ZVJlY2VpcHQocmVjZWlwdCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNBVkVfUkVDRUlQVCxcbiAgICByZWNlaXB0XG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBTQVZFX0JMT0NLID0gXCJTQVZFX0JMT0NLXCI7XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUJsb2NrKGJsb2NrKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU0FWRV9CTE9DSyxcbiAgICBibG9ja1xuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9zZXNzaW9uL2FjdGlvbnMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJibi5qc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJuLmpzXCJcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qva2V5c1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qva2V5c1wiXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6ZGF0YTpzYWdhc1wiKTtcblxuaW1wb3J0IHsgcHV0LCB0YWtlRXZlcnksIHNlbGVjdCB9IGZyb20gXCJyZWR1eC1zYWdhL2VmZmVjdHNcIjtcblxuaW1wb3J0IHsgcHJlZml4TmFtZSwgc3RhYmxlS2VjY2FrMjU2LCBtYWtlQXNzaWdubWVudCB9IGZyb20gXCJsaWIvaGVscGVyc1wiO1xuXG5pbXBvcnQgeyBUSUNLIH0gZnJvbSBcImxpYi90cmFjZS9hY3Rpb25zXCI7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zXCI7XG5pbXBvcnQgKiBhcyB0cmFjZSBmcm9tIFwibGliL3RyYWNlL3NhZ2FzXCI7XG5pbXBvcnQgKiBhcyBldm0gZnJvbSBcImxpYi9ldm0vc2FnYXNcIjtcbmltcG9ydCAqIGFzIHdlYjMgZnJvbSBcImxpYi93ZWIzL3NhZ2FzXCI7XG5cbmltcG9ydCBkYXRhIGZyb20gXCIuLi9zZWxlY3RvcnNcIjtcblxuaW1wb3J0IHN1bSBmcm9tIFwibG9kYXNoLnN1bVwiO1xuXG5pbXBvcnQgKiBhcyBEZWNvZGVVdGlscyBmcm9tIFwidHJ1ZmZsZS1kZWNvZGUtdXRpbHNcIjtcbmltcG9ydCB7XG4gIGdldFN0b3JhZ2VBbGxvY2F0aW9ucyxcbiAgZ2V0TWVtb3J5QWxsb2NhdGlvbnMsXG4gIGdldENhbGxkYXRhQWxsb2NhdGlvbnMsXG4gIHJlYWRTdGFjayxcbiAgc3RvcmFnZVNpemUsXG4gIGZvckV2bVN0YXRlXG59IGZyb20gXCJ0cnVmZmxlLWRlY29kZXJcIjtcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uKiBzY29wZShub2RlSWQsIHBvaW50ZXIsIHBhcmVudElkLCBzb3VyY2VJZCkge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5zY29wZShub2RlSWQsIHBvaW50ZXIsIHBhcmVudElkLCBzb3VyY2VJZCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGRlY2xhcmUobm9kZSkge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5kZWNsYXJlKG5vZGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBkZWZpbmVUeXBlKG5vZGUpIHtcbiAgeWllbGQgcHV0KGFjdGlvbnMuZGVmaW5lVHlwZShub2RlKSk7XG59XG5cbmZ1bmN0aW9uKiB0aWNrU2FnYSgpIHtcbiAgZGVidWcoXCJnb3QgVElDS1wiKTtcblxuICB5aWVsZCogdmFyaWFibGVzQW5kTWFwcGluZ3NTYWdhKCk7XG4gIGRlYnVnKFwiYWJvdXQgdG8gU1VCVE9DS1wiKTtcbiAgeWllbGQqIHRyYWNlLnNpZ25hbFRpY2tTYWdhQ29tcGxldGlvbigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGRlY29kZShkZWZpbml0aW9uLCByZWYpIHtcbiAgbGV0IHJlZmVyZW5jZURlY2xhcmF0aW9ucyA9IHlpZWxkIHNlbGVjdChkYXRhLnZpZXdzLnJlZmVyZW5jZURlY2xhcmF0aW9ucyk7XG4gIGxldCBzdGF0ZSA9IHlpZWxkIHNlbGVjdChkYXRhLmN1cnJlbnQuc3RhdGUpO1xuICBsZXQgbWFwcGluZ0tleXMgPSB5aWVsZCBzZWxlY3QoZGF0YS52aWV3cy5tYXBwaW5nS2V5cyk7XG4gIGxldCBhbGxvY2F0aW9ucyA9IHlpZWxkIHNlbGVjdChkYXRhLmluZm8uYWxsb2NhdGlvbnMpO1xuICBsZXQgaW5zdGFuY2VzID0geWllbGQgc2VsZWN0KGRhdGEudmlld3MuaW5zdGFuY2VzKTtcbiAgbGV0IGNvbnRleHRzID0geWllbGQgc2VsZWN0KGRhdGEudmlld3MuY29udGV4dHMpO1xuICBsZXQgY3VycmVudENvbnRleHQgPSB5aWVsZCBzZWxlY3QoZGF0YS5jdXJyZW50LmNvbnRleHQpO1xuICBsZXQgaW50ZXJuYWxGdW5jdGlvbnNUYWJsZSA9IHlpZWxkIHNlbGVjdChcbiAgICBkYXRhLmN1cnJlbnQuZnVuY3Rpb25zQnlQcm9ncmFtQ291bnRlclxuICApO1xuICBsZXQgYmxvY2tOdW1iZXIgPSB5aWVsZCBzZWxlY3QoZGF0YS52aWV3cy5ibG9ja051bWJlcik7XG5cbiAgbGV0IFpFUk9fV09SRCA9IG5ldyBVaW50OEFycmF5KERlY29kZVV0aWxzLkVWTS5XT1JEX1NJWkUpO1xuICBaRVJPX1dPUkQuZmlsbCgwKTtcbiAgbGV0IE5PX0NPREUgPSBuZXcgVWludDhBcnJheSgpOyAvL2VtcHR5IGFycmF5XG5cbiAgbGV0IGRlY29kZXIgPSBmb3JFdm1TdGF0ZShkZWZpbml0aW9uLCByZWYsIHtcbiAgICByZWZlcmVuY2VEZWNsYXJhdGlvbnMsXG4gICAgc3RhdGUsXG4gICAgbWFwcGluZ0tleXMsXG4gICAgc3RvcmFnZUFsbG9jYXRpb25zOiBhbGxvY2F0aW9ucy5zdG9yYWdlLFxuICAgIG1lbW9yeUFsbG9jYXRpb25zOiBhbGxvY2F0aW9ucy5tZW1vcnksXG4gICAgY2FsbGRhdGFBbGxvY2F0aW9uczogYWxsb2NhdGlvbnMuY2FsbGRhdGEsXG4gICAgY29udGV4dHMsXG4gICAgY3VycmVudENvbnRleHQsXG4gICAgaW50ZXJuYWxGdW5jdGlvbnNUYWJsZVxuICB9KTtcblxuICBsZXQgcmVzdWx0ID0gZGVjb2Rlci5uZXh0KCk7XG4gIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcbiAgICBsZXQgcmVxdWVzdCA9IHJlc3VsdC52YWx1ZTtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgc3dpdGNoIChyZXF1ZXN0LnR5cGUpIHtcbiAgICAgIGNhc2UgXCJzdG9yYWdlXCI6XG4gICAgICAgIC8vdGhlIGRlYnVnZ2VyIHN1cHBsaWVzIGFsbCBzdG9yYWdlIGl0IGtub3dzIGF0IHRoZSBiZWdpbm5pbmcuXG4gICAgICAgIC8vYW55IHN0b3JhZ2UgaXQgZG9lcyBub3Qga25vdyBpcyBwcmVzdW1lZCB0byBiZSB6ZXJvLlxuICAgICAgICByZXNwb25zZSA9IFpFUk9fV09SRDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY29kZVwiOlxuICAgICAgICBsZXQgYWRkcmVzcyA9IHJlcXVlc3QuYWRkcmVzcztcbiAgICAgICAgaWYgKGFkZHJlc3MgaW4gaW5zdGFuY2VzKSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSBpbnN0YW5jZXNbYWRkcmVzc107XG4gICAgICAgIH0gZWxzZSBpZiAoYWRkcmVzcyA9PT0gRGVjb2RlVXRpbHMuRVZNLlpFUk9fQUREUkVTUykge1xuICAgICAgICAgIC8vSEFDSzogdG8gYXZvaWQgZGlzcGxheWluZyB0aGUgemVybyBhZGRyZXNzIHRvIHRoZSB1c2VyIGFzIGFuXG4gICAgICAgICAgLy9hZmZlY3RlZCBhZGRyZXNzIGp1c3QgYmVjYXVzZSB0aGV5IGRlY29kZWQgYSBjb250cmFjdCBvciBleHRlcm5hbFxuICAgICAgICAgIC8vZnVuY3Rpb24gdmFyaWFibGUgdGhhdCBoYWRuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIHdlIGdpdmUgdGhlXG4gICAgICAgICAgLy96ZXJvIGFkZHJlc3MncyBjb2RlbGVzc25lc3MgaXRzIG93biBwcml2YXRlIGNhY2hlIDpQXG4gICAgICAgICAgcmVzcG9uc2UgPSBOT19DT0RFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vSSBkb24ndCB3YW50IHRvIHdyaXRlIGEgbmV3IHdlYjMgc2FnYSwgc28gbGV0J3MganVzdCB1c2VcbiAgICAgICAgICAvL29idGFpbkJpbmFyaWVzIHdpdGggYSBvbmUtZWxlbWVudCBhcnJheVxuICAgICAgICAgIGRlYnVnKFwiZmV0Y2hpbmcgYmluYXJ5XCIpO1xuICAgICAgICAgIGxldCBiaW5hcnkgPSAoeWllbGQqIHdlYjMub2J0YWluQmluYXJpZXMoW2FkZHJlc3NdLCBibG9ja051bWJlcikpWzBdO1xuICAgICAgICAgIGRlYnVnKFwiYWRkaW5nIGluc3RhbmNlXCIpO1xuICAgICAgICAgIHlpZWxkKiBldm0uYWRkSW5zdGFuY2UoYWRkcmVzcywgYmluYXJ5KTtcbiAgICAgICAgICByZXNwb25zZSA9IERlY29kZVV0aWxzLkNvbnZlcnNpb24udG9CeXRlcyhiaW5hcnkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZGVidWcoXCJ1bnJlY29nbml6ZWQgcmVxdWVzdCB0eXBlIVwiKTtcbiAgICB9XG4gICAgcmVzdWx0ID0gZGVjb2Rlci5uZXh0KHJlc3BvbnNlKTtcbiAgfVxuICAvL2F0IHRoaXMgcG9pbnQsIHJlc3VsdC52YWx1ZSBob2xkcyB0aGUgZmluYWwgdmFsdWVcbiAgLy9ub3RlOiB3ZSdyZSBzdGlsbCB1c2luZyB0aGUgb2xkIGRlY29kZXIgb3V0cHV0IGZvcm1hdCwgc28gd2UgbmVlZCB0byBjbGVhblxuICAvL2NvbnRhaW5lcnMgYmVmb3JlIHJldHVybmluZyBzb21ldGhpbmcgdGhlIGRlYnVnZ2VyIGNhbiB1c2VcbiAgcmV0dXJuIERlY29kZVV0aWxzLkNvbnZlcnNpb24uY2xlYW5Db250YWluZXJzKHJlc3VsdC52YWx1ZSk7XG59XG5cbmZ1bmN0aW9uKiB2YXJpYWJsZXNBbmRNYXBwaW5nc1NhZ2EoKSB7XG4gIGxldCBub2RlID0geWllbGQgc2VsZWN0KGRhdGEuY3VycmVudC5ub2RlKTtcbiAgbGV0IHNjb3BlcyA9IHlpZWxkIHNlbGVjdChkYXRhLnZpZXdzLnNjb3Blcy5pbmxpbmVkKTtcbiAgbGV0IHJlZmVyZW5jZURlY2xhcmF0aW9ucyA9IHlpZWxkIHNlbGVjdChkYXRhLnZpZXdzLnJlZmVyZW5jZURlY2xhcmF0aW9ucyk7XG4gIGxldCBhbGxvY2F0aW9ucyA9IHlpZWxkIHNlbGVjdChkYXRhLmluZm8uYWxsb2NhdGlvbnMuc3RvcmFnZSk7XG4gIGxldCBjdXJyZW50QXNzaWdubWVudHMgPSB5aWVsZCBzZWxlY3QoZGF0YS5wcm9jLmFzc2lnbm1lbnRzKTtcbiAgbGV0IG1hcHBlZFBhdGhzID0geWllbGQgc2VsZWN0KGRhdGEucHJvYy5tYXBwZWRQYXRocyk7XG4gIGxldCBjdXJyZW50RGVwdGggPSB5aWVsZCBzZWxlY3QoZGF0YS5jdXJyZW50LmZ1bmN0aW9uRGVwdGgpO1xuICBsZXQgYWRkcmVzcyA9IHlpZWxkIHNlbGVjdChkYXRhLmN1cnJlbnQuYWRkcmVzcyk7XG4gIC8vc3RvcmFnZSBhZGRyZXNzLCBub3QgY29kZSBhZGRyZXNzXG5cbiAgbGV0IHN0YWNrID0geWllbGQgc2VsZWN0KGRhdGEubmV4dC5zdGF0ZS5zdGFjayk7IC8vbm90ZSB0aGUgdXNlIG9mIG5leHQhXG4gIC8vaW4gdGhpcyBzYWdhIHdlIGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqcmVzdWx0cyogb2YgdGhlIGN1cnJlbnQgaW5zdHJ1Y3Rpb25cbiAgLy9ub3RlIHRoYXQgdGhlIGRlY29kZXIgaXMgc3RpbGwgYmFzZWQgb24gZGF0YS5jdXJyZW50LnN0YXRlOyB0aGF0J3MgZmluZVxuICAvL3Rob3VnaC4gIFRoZXJlJ3MgYWxyZWFkeSBhIGRlbGF5IGJldHdlZW4gd2hlbiB3ZSByZWNvcmQgdGhpbmdzIG9mZiB0aGVcbiAgLy9zdGFjayBhbmQgd2hlbiB3ZSBkZWNvZGUgdGhlbSwgYWZ0ZXIgYWxsLiAgQmFzaWNhbGx5LCBub3RoaW5nIHNlcmlvdXNcbiAgLy9zaG91bGQgaGFwcGVuIGFmdGVyIGFuIGluZGV4IG5vZGUgYnV0IGJlZm9yZSB0aGUgaW5kZXggYWNjZXNzIG5vZGUgdGhhdFxuICAvL3dvdWxkIGNhdXNlIHN0b3JhZ2UsIG1lbW9yeSwgb3IgY2FsbGRhdGEgdG8gY2hhbmdlLCBtZWFuaW5nIHRoYXQgZXZlbiBpZlxuICAvL3RoZSBsaXRlcmFsIHdlIHJlY29yZGVkIHdhcyBhIHBvaW50ZXIsIGl0IHdpbGwgc3RpbGwgYmUgdmFsaWQgYXQgdGhlIHRpbWVcbiAgLy93ZSB1c2UgaXQuICAoVGhlIG90aGVyIGxpdGVyYWxzIHdlIG1ha2UgdXNlIG9mLCBmb3IgdGhlIGJhc2UgZXhwcmVzc2lvbnMsXG4gIC8vYXJlIG5vdCBkZWNvZGVkLCBzbyBubyBwb3RlbnRpYWwgbWlzbWF0Y2ggdGhlcmUgd291bGQgYmUgcmVsZXZhbnQgYW55d2F5LilcblxuICBsZXQgYWx0ZXJuYXRlU3RhY2sgPSB5aWVsZCBzZWxlY3QoZGF0YS5uZXh0TWFwcGVkLnN0YXRlLnN0YWNrKTtcbiAgLy9IQUNLOiB1bmZvcnR1bmF0ZWx5LCBpbiBzb21lIGNhc2VzLCBkYXRhLm5leHQuc3RhdGUuc3RhY2sgZ2V0cyB0aGUgd3JvbmdcbiAgLy9yZXN1bHRzIGR1ZSB0byB1bm1hcHBlZCBpbnN0cnVjdGlvbnMgaW50ZXJ2ZW5pbmcuICBTbywgd2UgZ2V0IHRoZSBzdGFjayBhdFxuICAvL3RoZSBuZXh0ICptYXBwZWQqIHN0YWNrIGluc3RlYWQuICBUaGlzIGlzIHNvbWV0aGluZyBvZiBhIGhhY2sgYW5kIHdvbid0XG4gIC8vd29yayBpZiB3ZSdyZSBhYm91dCB0byBjaGFuZ2UgY29udGV4dCwgYnV0IGl0IHNob3VsZCB3b3JrIGluIHRoZSBjYXNlcyB0aGF0XG4gIC8vbmVlZCBpdC5cblxuICBpZiAoIXN0YWNrKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRvcCA9IHN0YWNrLmxlbmd0aCAtIDE7XG4gIHZhciBhc3NpZ25tZW50LCBhc3NpZ25tZW50cywgcHJlYW1ibGVBc3NpZ25tZW50cywgYmFzZUV4cHJlc3Npb24sIHNsb3QsIHBhdGg7XG5cbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gc3RhY2sgaXMgb25seSByZWFkeSBmb3IgaW50ZXJwcmV0YXRpb24gYWZ0ZXIgdGhlIGxhc3Qgc3RlcCBvZiBlYWNoXG4gIC8vIHNvdXJjZSByYW5nZVxuICAvL1xuICAvLyB0aGUgZGF0YSBtb2R1bGUgYWx3YXlzIGxvb2tzIGF0IHRoZSByZXN1bHQgb2YgYSBwYXJ0aWN1bGFyIG9wY29kZVxuICAvLyAoaS5lLiwgdGhlIGZvbGxvd2luZyB0cmFjZSBzdGVwJ3Mgc3RhY2svbWVtb3J5L3N0b3JhZ2UpLCBzbyB0aGlzXG4gIC8vIGFzc2VydHMgdGhhdCB0aGUgX2N1cnJlbnRfIG9wZXJhdGlvbiBpcyB0aGUgZmluYWwgb25lIGJlZm9yZVxuICAvLyBwcm9jZWVkaW5nXG4gIGlmICghKHlpZWxkIHNlbGVjdChkYXRhLnZpZXdzLmF0TGFzdEluc3RydWN0aW9uRm9yU291cmNlUmFuZ2UpKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vSEFDSzogbW9kaWZpZXIgcHJlYW1ibGVcbiAgLy9tb2RpZmllciBkZWZpbml0aW9ucyBhcmUgdHlwaWNhbGx5IHNraXBwZWQgKHRoaXMgaW5jbHVkZXMgY29uc3RydWN0b3JcbiAgLy9kZWZpbml0aW9ucyB3aGVuIGNhbGxlZCBhcyBhIGJhc2UgY29uc3RydWN0b3IpOyBhcyBzdWNoIEkndmUgYWRkZWQgdGhpc1xuICAvL1wibW9kaWZpZXIgcHJlYW1ibGVcIiB0byBjYXRjaCB0aGVtXG4gIGlmICh5aWVsZCBzZWxlY3QoZGF0YS5jdXJyZW50LmFib3V0VG9Nb2RpZnkpKSB7XG4gICAgbGV0IG1vZGlmaWVyID0geWllbGQgc2VsZWN0KGRhdGEuY3VycmVudC5tb2RpZmllckJlaW5nSW52b2tlZCk7XG4gICAgLy9tYXkgYmUgZWl0aGVyIGEgbW9kaWZpZXIgb3IgYmFzZSBjb25zdHJ1Y3RvclxuICAgIGxldCBjdXJyZW50SW5kZXggPSB5aWVsZCBzZWxlY3QoZGF0YS5jdXJyZW50Lm1vZGlmaWVyQXJndW1lbnRJbmRleCk7XG4gICAgZGVidWcoXCJjdXJyZW50SW5kZXggJWRcIiwgY3VycmVudEluZGV4KTtcbiAgICBsZXQgcGFyYW1ldGVycyA9IG1vZGlmaWVyLnBhcmFtZXRlcnMucGFyYW1ldGVycztcbiAgICAvL25vdzogbG9vayBhdCB0aGUgcGFyYW1ldGVycyAqYWZ0ZXIqIHRoZSBjdXJyZW50IGluZGV4LiAgd2UnbGwgbmVlZCB0b1xuICAgIC8vYWRqdXN0IGZvciB0aG9zZS5cbiAgICBsZXQgcGFyYW1ldGVyc0xlZnQgPSBwYXJhbWV0ZXJzLnNsaWNlKGN1cnJlbnRJbmRleCArIDEpO1xuICAgIGxldCBhZGp1c3RtZW50ID0gc3VtKHBhcmFtZXRlcnNMZWZ0Lm1hcChEZWNvZGVVdGlscy5EZWZpbml0aW9uLnN0YWNrU2l6ZSkpO1xuICAgIGRlYnVnKFwiYWRqdXN0bWVudCAlZFwiLCBhZGp1c3RtZW50KTtcbiAgICBwcmVhbWJsZUFzc2lnbm1lbnRzID0gYXNzaWduUGFyYW1ldGVycyhcbiAgICAgIHBhcmFtZXRlcnMsXG4gICAgICB0b3AgKyBhZGp1c3RtZW50LFxuICAgICAgY3VycmVudERlcHRoXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBwcmVhbWJsZUFzc2lnbm1lbnRzID0ge307XG4gIH1cblxuICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICBjYXNlIFwiRnVuY3Rpb25EZWZpbml0aW9uXCI6XG4gICAgY2FzZSBcIk1vZGlmaWVyRGVmaW5pdGlvblwiOlxuICAgICAgLy9OT1RFOiB0aGlzIHdpbGwgKm5vdCogY2F0Y2ggbW9zdCBtb2RpZmllciBkZWZpbml0aW9ucyFcbiAgICAgIC8vdGhlIHJlc3QgaG9wZWZ1bGx5IHdpbGwgYmUgY2F1Z2h0IGJ5IHRoZSBtb2RpZmllciBwcmVhbWJsZVxuICAgICAgLy8oaW4gZmFjdCB0aGV5IHdvbid0IGFsbCBiZSwgYnV0Li4uKVxuXG4gICAgICAvL0hBQ0s6IGZpbHRlciBvdXQgc29tZSBnYXJiYWdlXG4gICAgICAvL3RoaXMgZmlsdGVycyBvdXQgdGhlIGNhc2Ugd2hlcmUgd2UncmUgcmVhbGx5IGluIGFuIGludm9jYXRpb24gb2YgYVxuICAgICAgLy9tb2RpZmllciBvciBiYXNlIGNvbnN0cnVjdG9yLCBidXQgaGF2ZSB0ZW1wb3JhcmlseSBoaXQgdGhlIGRlZmluaXRpb25cbiAgICAgIC8vbm9kZSBmb3Igc29tZSByZWFzb24uICBIb3dldmVyIHRoaXMgb2J2aW91c2x5IGNhbiBoYXZlIGEgZmFsc2UgcG9zaXRpdmVcbiAgICAgIC8vaW4gdGhlIGNhc2Ugd2hlcmUgYSBmdW5jdGlvbiBoYXMgdGhlIHNhbWUgbW9kaWZpZXIgdHdpY2UuXG4gICAgICBsZXQgbmV4dE1vZGlmaWVyID0geWllbGQgc2VsZWN0KGRhdGEubmV4dC5tb2RpZmllckJlaW5nSW52b2tlZCk7XG4gICAgICBpZiAobmV4dE1vZGlmaWVyICYmIG5leHRNb2RpZmllci5pZCA9PT0gbm9kZS5pZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbGV0IHBhcmFtZXRlcnMgPSBub2RlLnBhcmFtZXRlcnMucGFyYW1ldGVycztcbiAgICAgIC8vbm90ZSB0aGF0IHdlIGRvICpub3QqIGluY2x1ZGUgcmV0dXJuIHBhcmFtZXRlcnMsIHNpbmNlIHRob3NlIGFyZVxuICAgICAgLy9oYW5kbGVkIGJ5IHRoZSBWYXJpYWJsZURlY2xhcmF0aW9uIGNhc2UgKG5vLCBJIGRvbid0IGtub3cgd2h5IGl0XG4gICAgICAvL3dvcmtzIG91dCB0aGF0IHdheSlcblxuICAgICAgLy93ZSBjYW4gc2tpcCBwcmVhbWJsZUFzc2lnbm1lbnRzIGhlcmUsIHRoYXQgaXNuJ3QgdXNlZCBpbiB0aGlzIGNhc2VcbiAgICAgIGFzc2lnbm1lbnRzID0gYXNzaWduUGFyYW1ldGVycyhwYXJhbWV0ZXJzLCB0b3AsIGN1cnJlbnREZXB0aCk7XG5cbiAgICAgIGRlYnVnKFwiRnVuY3Rpb24gZGVmaW5pdGlvbiBjYXNlXCIpO1xuICAgICAgZGVidWcoXCJhc3NpZ25tZW50cyAlT1wiLCBhc3NpZ25tZW50cyk7XG5cbiAgICAgIHlpZWxkIHB1dChhY3Rpb25zLmFzc2lnbihhc3NpZ25tZW50cykpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiQ29udHJhY3REZWZpbml0aW9uXCI6XG4gICAgICBsZXQgYWxsb2NhdGlvbiA9IGFsbG9jYXRpb25zW25vZGUuaWRdO1xuXG4gICAgICBkZWJ1ZyhcIkNvbnRyYWN0IGRlZmluaXRpb24gY2FzZVwiKTtcbiAgICAgIGRlYnVnKFwiYWxsb2NhdGlvbnMgJU9cIiwgYWxsb2NhdGlvbnMpO1xuICAgICAgZGVidWcoXCJhbGxvY2F0aW9uICVPXCIsIGFsbG9jYXRpb24pO1xuICAgICAgYXNzaWdubWVudHMgPSB7fTtcbiAgICAgIGZvciAobGV0IGlkIGluIGFsbG9jYXRpb24ubWVtYmVycykge1xuICAgICAgICBpZCA9IE51bWJlcihpZCk7IC8vbm90IHN1cmUgd2h5IHdlJ3JlIGdldHRpbmcgdGhlbSBhcyBzdHJpbmdzLCBidXQuLi5cbiAgICAgICAgbGV0IGlkT2JqID0geyBhc3RJZDogaWQsIGFkZHJlc3MgfTtcbiAgICAgICAgbGV0IGZ1bGxJZCA9IHN0YWJsZUtlY2NhazI1NihpZE9iaik7XG4gICAgICAgIC8vd2UgZG9uJ3QgdXNlIG1ha2VBc3NpZ25tZW50IGhlcmUgYXMgd2UgaGFkIHRvIGNvbXB1dGUgdGhlIElEIGFueXdheVxuICAgICAgICBhc3NpZ25tZW50ID0ge1xuICAgICAgICAgIC4uLmlkT2JqLFxuICAgICAgICAgIGlkOiBmdWxsSWQsXG4gICAgICAgICAgcmVmOiB7XG4gICAgICAgICAgICAuLi4oKGN1cnJlbnRBc3NpZ25tZW50cy5ieUlkW2Z1bGxJZF0gfHwge30pLnJlZiB8fCB7fSksXG4gICAgICAgICAgICAuLi5hbGxvY2F0aW9uLm1lbWJlcnNbaWRdLnBvaW50ZXJcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2lnbm1lbnRzW2Z1bGxJZF0gPSBhc3NpZ25tZW50O1xuICAgICAgfVxuICAgICAgZGVidWcoXCJhc3NpZ25tZW50cyAlT1wiLCBhc3NpZ25tZW50cyk7XG5cbiAgICAgIC8vdGhpcyBjYXNlIGRvZXNuJ3QgbmVlZCBwcmVhbWJsZUFzc2lnbm1lbnRzIGVpdGhlclxuICAgICAgeWllbGQgcHV0KGFjdGlvbnMuYXNzaWduKGFzc2lnbm1lbnRzKSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJGdW5jdGlvblR5cGVOYW1lXCI6XG4gICAgICAvL0hBQ0tcbiAgICAgIC8vZm9yIHNvbWUgcmVhc29ucywgZm9yIGRlY2xhcmF0aW9ucyBvZiBsb2NhbCB2YXJpYWJsZXMgb2YgZnVuY3Rpb24gdHlwZSxcbiAgICAgIC8vd2UgbGFuZCBvbiB0aGUgRnVuY3Rpb25UeXBlTmFtZSBpbnN0ZWFkIG9mIHRoZSBWYXJpYWJsZURlY2xhcmF0aW9uLFxuICAgICAgLy9zbyB3ZSByZXBsYWNlIHRoZSBub2RlIHdpdGggaXRzIHBhcmVudCAodGhlIFZhcmlhYmxlRGVjbGFyYXRpb24pXG4gICAgICBub2RlID0gc2NvcGVzW3Njb3Blc1tub2RlLmlkXS5wYXJlbnRJZF0uZGVmaW5pdGlvbjtcbiAgICAgIC8vbGV0J3MgZG8gYSBxdWljayBjaGVjayB0aGF0IGl0ICppcyogYSBWYXJpYWJsZURlY2xhcmF0aW9uIGJlZm9yZVxuICAgICAgLy9jb250aW51aW5nXG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gXCJWYXJpYWJsZURlY2xhcmF0aW9uXCIpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgLy9vdGhlcndpc2UsIGRlbGliZXJhdGVseSBmYWxsIHRocm91Z2ggdG8gdGhlIFZhcmlhYmxlRGVjbGFyYXRpb24gY2FzZVxuICAgIC8vTk9URTogREVMSUJFUkFURSBGQUxMLVRIUk9VR0hcbiAgICBjYXNlIFwiVmFyaWFibGVEZWNsYXJhdGlvblwiOlxuICAgICAgbGV0IHZhcklkID0gbm9kZS5pZDtcbiAgICAgIGRlYnVnKFwiVmFyaWFibGUgZGVjbGFyYXRpb24gY2FzZVwiKTtcbiAgICAgIGRlYnVnKFwiY3VycmVudERlcHRoICVkIHZhcklkICVkXCIsIGN1cnJlbnREZXB0aCwgdmFySWQpO1xuXG4gICAgICAvL05PVEU6IFdlJ3JlIGdvaW5nIHRvIG1ha2UgdGhlIGFzc2lnbm1lbnQgY29uZGl0aW9uYWwgaGVyZTsgaGVyZSdzIHdoeS5cbiAgICAgIC8vVGhlcmUncyBhIGJ1ZyB3aGVyZSBjYWxsaW5nIHRoZSBhdXRvZ2VuZXJhdGVkIGFjY2Vzc29yIGZvciBhIHB1YmxpY1xuICAgICAgLy9jb250cmFjdCB2YXJpYWJsZSBjYXVzZXMgdGhlIGRlYnVnZ2VyIHRvIHNlZSB0d28gYWRkaXRpb25hbFxuICAgICAgLy9kZWNsYXJhdGlvbnMgZm9yIHRoYXQgdmFyaWFibGUuLi4gd2hpY2ggdGhpcyBjb2RlIHJlYWRzIGFzIGxvY2FsXG4gICAgICAvL3ZhcmlhYmxlIGRlY2xhcmF0aW9ucy4gIFJhdGhlciB0aGFuIHByZXZlbnQgdGhpcyBhdCB0aGUgc291cmNlLCB3ZSdyZVxuICAgICAgLy9qdXN0IGdvaW5nIHRvIGNoZWNrIGZvciBpdCBoZXJlLCBieSBub3QgYWRkaW5nIGEgbG9jYWwgdmFyaWFibGUgaWYgc2FpZFxuICAgICAgLy92YXJpYWJsZSBpcyBhbHJlYWR5IGEgY29udHJhY3QgdmFyaWFibGUuXG5cbiAgICAgIGlmIChcbiAgICAgICAgY3VycmVudEFzc2lnbm1lbnRzLmJ5QXN0SWRbdmFySWRdICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgY3VycmVudEFzc2lnbm1lbnRzLmJ5QXN0SWRbdmFySWRdLnNvbWUoXG4gICAgICAgICAgaWQgPT4gY3VycmVudEFzc2lnbm1lbnRzLmJ5SWRbaWRdLmFkZHJlc3MgIT09IHVuZGVmaW5lZFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgZGVidWcoXCJhbHJlYWR5IGEgY29udHJhY3QgdmFyaWFibGUhXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy9vdGhlcndpc2UsIGdvIGFoZWFkIGFuZCBtYWtlIHRoZSBhc3NpZ25tZW50XG4gICAgICBhc3NpZ25tZW50ID0gbWFrZUFzc2lnbm1lbnQoXG4gICAgICAgIHsgYXN0SWQ6IHZhcklkLCBzdGFja2ZyYW1lOiBjdXJyZW50RGVwdGggfSxcbiAgICAgICAge1xuICAgICAgICAgIHN0YWNrOiB7XG4gICAgICAgICAgICBmcm9tOiB0b3AgLSBEZWNvZGVVdGlscy5EZWZpbml0aW9uLnN0YWNrU2l6ZShub2RlKSArIDEsXG4gICAgICAgICAgICB0bzogdG9wXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgYXNzaWdubWVudHMgPSB7IFthc3NpZ25tZW50LmlkXTogYXNzaWdubWVudCB9O1xuICAgICAgLy90aGlzIGNhc2UgZG9lc24ndCBuZWVkIHByZWFtYmxlQXNzaWdubWVudHMgZWl0aGVyXG4gICAgICBkZWJ1ZyhcImFzc2lnbm1lbnRzOiAlT1wiLCBhc3NpZ25tZW50cyk7XG4gICAgICB5aWVsZCBwdXQoYWN0aW9ucy5hc3NpZ24oYXNzaWdubWVudHMpKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcIkluZGV4QWNjZXNzXCI6XG4gICAgICAvLyB0byB0cmFjayBgbWFwcGluZ2AgdHlwZXMga25vd24gaW5kaWNlc1xuICAgICAgLy8gKGFuZCBhbHNvICpzb21lKiBrbm93biBpbmRpY2VzIGZvciBhcnJheXMpXG5cbiAgICAgIC8vSEFDSzogd2UgdXNlIHRoZSBhbHRlcm5hdGUgc3RhY2sgaW4gdGhpcyBjYXNlXG5cbiAgICAgIGRlYnVnKFwiSW5kZXggYWNjZXNzIGNhc2VcIik7XG5cbiAgICAgIC8vd2UncmUgZ29pbmcgdG8gc3RhcnQgYnkgZG9pbmcgdGhlIHNhbWUgdGhpbmcgYXMgaW4gdGhlIGRlZmF1bHQgY2FzZVxuICAgICAgLy8oc2VlIGJlbG93KSAtLSBnZXR0aW5nIHRoaW5ncyByZWFkeSBmb3IgYW4gYXNzaWdubWVudC4gIFRoZW4gd2UncmVcbiAgICAgIC8vZ29pbmcgdG8gZm9yZ2V0IHRoaXMgZm9yIGEgYml0IHdoaWxlIHdlIGhhbmRsZSB0aGUgcmVzdC4uLlxuICAgICAgYXNzaWdubWVudHMgPSB7XG4gICAgICAgIC4uLnByZWFtYmxlQXNzaWdubWVudHMsXG4gICAgICAgIC4uLmxpdGVyYWxBc3NpZ25tZW50cyhub2RlLCBhbHRlcm5hdGVTdGFjaywgY3VycmVudERlcHRoKVxuICAgICAgfTtcblxuICAgICAgLy93ZSdsbCBuZWVkIHRoaXNcbiAgICAgIGJhc2VFeHByZXNzaW9uID0gbm9kZS5iYXNlRXhwcmVzc2lvbjtcblxuICAgICAgLy9idXQgZmlyc3QsIGEgZGl2ZXJzaW9uIC0tIGlzIHRoaXMgc29tZXRoaW5nIHRoYXQgY291bGQgbm90ICpwb3NzaWJseSpcbiAgICAgIC8vbGVhZCB0byBhIG1hcHBpbmc/ICBpLmUuLCBlaXRoZXIgYSBieXRlcywgb3IgYW4gYXJyYXkgb2Ygbm9uLXJlZmVyZW5jZVxuICAgICAgLy90eXBlcywgb3IgYSBub24tc3RvcmFnZSBhcnJheT9cbiAgICAgIC8vaWYgc28sIHdlJ2xsIGp1c3QgZG8gdGhlIGFzc2lnbiBhbmQgcXVpdCBvdXQgZWFybHlcbiAgICAgIC8vKG5vdGU6IHdlIHdyaXRlIGl0IHRoaXMgd2F5IGJlY2F1c2UgbWFwcGluZ3MgYXJlbid0IGNhdWdodCBieVxuICAgICAgLy9pc1JlZmVyZW5jZSlcbiAgICAgIGlmIChcbiAgICAgICAgRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi50eXBlQ2xhc3MoYmFzZUV4cHJlc3Npb24pID09PSBcImJ5dGVzXCIgfHxcbiAgICAgICAgKERlY29kZVV0aWxzLkRlZmluaXRpb24udHlwZUNsYXNzKGJhc2VFeHByZXNzaW9uKSA9PT0gXCJhcnJheVwiICYmXG4gICAgICAgICAgKERlY29kZVV0aWxzLkRlZmluaXRpb24uaXNSZWZlcmVuY2Uobm9kZSlcbiAgICAgICAgICAgID8gRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5yZWZlcmVuY2VUeXBlKGJhc2VFeHByZXNzaW9uKSAhPT0gXCJzdG9yYWdlXCJcbiAgICAgICAgICAgIDogIURlY29kZVV0aWxzLkRlZmluaXRpb24uaXNNYXBwaW5nKG5vZGUpKSlcbiAgICAgICkge1xuICAgICAgICBkZWJ1ZyhcIkluZGV4IGNhc2UgYmFpbGVkIG91dCBlYXJseVwiKTtcbiAgICAgICAgZGVidWcoXCJ0eXBlQ2xhc3MgJXNcIiwgRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi50eXBlQ2xhc3MoYmFzZUV4cHJlc3Npb24pKTtcbiAgICAgICAgZGVidWcoXG4gICAgICAgICAgXCJyZWZlcmVuY2VUeXBlICVzXCIsXG4gICAgICAgICAgRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5yZWZlcmVuY2VUeXBlKGJhc2VFeHByZXNzaW9uKVxuICAgICAgICApO1xuICAgICAgICBkZWJ1ZyhcImlzUmVmZXJlbmNlKG5vZGUpICVvXCIsIERlY29kZVV0aWxzLkRlZmluaXRpb24uaXNSZWZlcmVuY2Uobm9kZSkpO1xuICAgICAgICB5aWVsZCBwdXQoYWN0aW9ucy5hc3NpZ24oYXNzaWdubWVudHMpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGxldCBrZXlEZWZpbml0aW9uID0gRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5rZXlEZWZpbml0aW9uKFxuICAgICAgICBiYXNlRXhwcmVzc2lvbixcbiAgICAgICAgc2NvcGVzXG4gICAgICApO1xuICAgICAgLy9pZiB3ZSdyZSBkZWFsaW5nIHdpdGggYW4gYXJyYXksIHRoaXMgd2lsbCBqdXN0IGhhY2sgdXAgYSB1aW50IGRlZmluaXRpb25cbiAgICAgIC8vOilcblxuICAgICAgLy9iZWdpbiBzdWJzZWN0aW9uOiBrZXkgZGVjb2RpbmdcbiAgICAgIC8vKEkgdHJpZWQgZmFjdG9yaW5nIHRoaXMgb3V0IGludG8gaXRzIG93biBzYWdhIGJ1dCBpdCBkaWRuJ3Qgd29yayB3aGVuIElcbiAgICAgIC8vZGlkIDpQIClcblxuICAgICAgbGV0IGluZGV4VmFsdWU7XG4gICAgICBsZXQgaW5kZXhEZWZpbml0aW9uID0gbm9kZS5pbmRleEV4cHJlc3Npb247XG5cbiAgICAgIC8vd2h5IHRoZSBsb29wPyBzZWUgdGhlIGVuZCBvZiB0aGUgYmxvY2sgaXQgaGVhZHMgZm9yIGFuIGV4cGxhbmF0b3J5XG4gICAgICAvL2NvbW1lbnRcbiAgICAgIHdoaWxlIChpbmRleFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IGluZGV4SWQgPSBpbmRleERlZmluaXRpb24uaWQ7XG4gICAgICAgIC8vaW5kaWNlcyBuZWVkIHRvIGJlIGlkZW50aWZpZWQgYnkgc3RhY2tmcmFtZVxuICAgICAgICBsZXQgaW5kZXhJZE9iaiA9IHsgYXN0SWQ6IGluZGV4SWQsIHN0YWNrZnJhbWU6IGN1cnJlbnREZXB0aCB9O1xuICAgICAgICBsZXQgZnVsbEluZGV4SWQgPSBzdGFibGVLZWNjYWsyNTYoaW5kZXhJZE9iaik7XG5cbiAgICAgICAgY29uc3QgaW5kZXhSZWZlcmVuY2UgPSAoY3VycmVudEFzc2lnbm1lbnRzLmJ5SWRbZnVsbEluZGV4SWRdIHx8IHt9KS5yZWY7XG5cbiAgICAgICAgaWYgKERlY29kZVV0aWxzLkRlZmluaXRpb24uaXNTaW1wbGVDb25zdGFudChpbmRleERlZmluaXRpb24pKSB7XG4gICAgICAgICAgLy93aGlsZSB0aGUgbWFpbiBjYXNlIGlzIHRoZSBuZXh0IG9uZSwgd2hlcmUgd2UgbG9vayBmb3IgYSBwcmlvclxuICAgICAgICAgIC8vYXNzaWdubWVudCwgd2UgbmVlZCB0aGlzIGNhc2UgKGFuZCBuZWVkIGl0IGZpcnN0KSBmb3IgdHdvIHJlYXNvbnM6XG4gICAgICAgICAgLy8xLiBzb21lIGNvbnN0YW50IGV4cHJlc3Npb25zIChzcGVjaWZpY2FsbHksIHN0cmluZyBhbmQgaGV4IGxpdGVyYWxzKVxuICAgICAgICAgIC8vYXJlbid0IHNvdXJjZW1hcHBlZCB0byBhbmQgc28gd29uJ3QgaGF2ZSBhIHByaW9yIGFzc2lnbm1lbnRcbiAgICAgICAgICAvLzIuIGlmIHRoZSBrZXkgdHlwZSBpcyBieXRlc04gYnV0IHRoZSBleHByZXNzaW9uIGlzIGNvbnN0YW50LCB0aGVcbiAgICAgICAgICAvL3ZhbHVlIHdpbGwgZ28gb24gdGhlIHN0YWNrICpsZWZ0Ki1wYWRkZWQgaW5zdGVhZCBvZiByaWdodC1wYWRkZWQsXG4gICAgICAgICAgLy9zbyBsb29raW5nIGZvciBhIHByaW9yIGFzc2lnbm1lbnQgd2lsbCByZWFkIHRoZSB3cm9uZyB2YWx1ZS5cbiAgICAgICAgICAvL3NvIGluc3RlYWQgaXQncyBwcmVmZXJhYmxlIHRvIHVzZSB0aGUgY29uc3RhbnQgZGlyZWN0bHkuXG4gICAgICAgICAgZGVidWcoXCJhYm91dCB0byBkZWNvZGUgc2ltcGxlIGxpdGVyYWxcIik7XG4gICAgICAgICAgaW5kZXhWYWx1ZSA9IHlpZWxkKiBkZWNvZGUoa2V5RGVmaW5pdGlvbiwge1xuICAgICAgICAgICAgZGVmaW5pdGlvbjogaW5kZXhEZWZpbml0aW9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXhSZWZlcmVuY2UpIHtcbiAgICAgICAgICAvL2lmIGEgcHJpb3IgYXNzaWdubWVudCBpcyBmb3VuZFxuICAgICAgICAgIGxldCBzcGxpY2VkRGVmaW5pdGlvbjtcbiAgICAgICAgICAvL2luIGdlbmVyYWwsIHdlIHdhbnQgdG8gZGVjb2RlIHVzaW5nIHRoZSBrZXkgZGVmaW5pdGlvbiwgbm90IHRoZSBpbmRleFxuICAgICAgICAgIC8vZGVmaW5pdGlvbi4gaG93ZXZlciwgdGhlIGtleSBkZWZpbml0aW9uIG1heSBoYXZlIHRoZSB3cm9uZyBsb2NhdGlvblxuICAgICAgICAgIC8vb24gaXQuICBzbywgd2hlbiBhcHBsaWNhYmxlLCB3ZSBzcGxpY2UgdGhlIGluZGV4IGRlZmluaXRpb24gbG9jYXRpb25cbiAgICAgICAgICAvL29udG8gdGhlIGtleSBkZWZpbml0aW9uIGxvY2F0aW9uLlxuICAgICAgICAgIGlmIChEZWNvZGVVdGlscy5EZWZpbml0aW9uLmlzUmVmZXJlbmNlKGluZGV4RGVmaW5pdGlvbikpIHtcbiAgICAgICAgICAgIHNwbGljZWREZWZpbml0aW9uID0gRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5zcGxpY2VMb2NhdGlvbihcbiAgICAgICAgICAgICAga2V5RGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5yZWZlcmVuY2VUeXBlKGluZGV4RGVmaW5pdGlvbilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvL3dlIGNvdWxkIHB1dCBjb2RlIGhlcmUgdG8gYWRkIG9uIHRoZSBcIl9wdHJcIiBlbmRpbmcgd2hlbiBhYnNlbnQsXG4gICAgICAgICAgICAvL2J1dCB3ZSBwcmVzZW50bHkgaWdub3JlIHRoYXQgZW5kaW5nLCBzbyB3ZSdsbCBza2lwIHRoYXRcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3BsaWNlZERlZmluaXRpb24gPSBrZXlEZWZpbml0aW9uO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWJ1ZyhcImFib3V0IHRvIGRlY29kZVwiKTtcbiAgICAgICAgICBpbmRleFZhbHVlID0geWllbGQqIGRlY29kZShzcGxpY2VkRGVmaW5pdGlvbiwgaW5kZXhSZWZlcmVuY2UpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGluZGV4RGVmaW5pdGlvbi5yZWZlcmVuY2VkRGVjbGFyYXRpb24gJiZcbiAgICAgICAgICBzY29wZXNbaW5kZXhEZWZpbml0aW9uLnJlZmVyZW5jZURlY2xhcmF0aW9uXVxuICAgICAgICApIHtcbiAgICAgICAgICAvL3RoZXJlJ3Mgb25lIG1vcmUgcmVhc29uIHdlIG1pZ2h0IGhhdmUgZmFpbGVkIHRvIGRlY29kZSBpdDogaXQgbWlnaHQgYmUgYVxuICAgICAgICAgIC8vY29uc3RhbnQgc3RhdGUgdmFyaWFibGUuICBVbmZvcnR1bmF0ZWx5LCB3ZSBkb24ndCBrbm93IGhvdyB0byBkZWNvZGUgYWxsXG4gICAgICAgICAgLy90aG9zZSBhdCB0aGUgbW9tZW50LCBidXQgd2UgY2FuIGhhbmRsZSB0aGUgb25lcyB3ZSBkbyBrbm93IGhvdyB0byBkZWNvZGUuXG4gICAgICAgICAgLy9JbiB0aGUgZnV0dXJlIGhvcGVmdWxseSB3ZSB3aWxsIGRlY29kZSBhbGwgb2YgdGhlbVxuICAgICAgICAgIGRlYnVnKFxuICAgICAgICAgICAgXCJyZWZlcmVuY2VkRGVjbGFyYXRpb24gJWRcIixcbiAgICAgICAgICAgIGluZGV4RGVmaW5pdGlvbi5yZWZlcmVuY2VkRGVjbGFyYXRpb25cbiAgICAgICAgICApO1xuICAgICAgICAgIGxldCBpbmRleENvbnN0YW50RGVjbGFyYXRpb24gPVxuICAgICAgICAgICAgc2NvcGVzW2luZGV4RGVmaW5pdGlvbi5yZWZlcmVuY2VkRGVjbGFyYXRpb25dLmRlZmluaXRpb247XG4gICAgICAgICAgZGVidWcoXCJpbmRleENvbnN0YW50RGVjbGFyYXRpb24gJU9cIiwgaW5kZXhDb25zdGFudERlY2xhcmF0aW9uKTtcbiAgICAgICAgICBpZiAoaW5kZXhDb25zdGFudERlY2xhcmF0aW9uLmNvbnN0YW50KSB7XG4gICAgICAgICAgICBsZXQgaW5kZXhDb25zdGFudERlZmluaXRpb24gPSBpbmRleENvbnN0YW50RGVjbGFyYXRpb24udmFsdWU7XG4gICAgICAgICAgICAvL25leHQgbGluZSBmaWx0ZXJzIG91dCBjb25zdGFudHMgd2UgZG9uJ3Qga25vdyBob3cgdG8gaGFuZGxlXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIERlY29kZVV0aWxzLkRlZmluaXRpb24uaXNTaW1wbGVDb25zdGFudChpbmRleENvbnN0YW50RGVmaW5pdGlvbilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBkZWJ1ZyhcImFib3V0IHRvIGRlY29kZSBzaW1wbGUgY29uc3RhbnRcIik7XG4gICAgICAgICAgICAgIGluZGV4VmFsdWUgPSB5aWVsZCogZGVjb2RlKGtleURlZmluaXRpb24sIHtcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uOiBpbmRleENvbnN0YW50RGVjbGFyYXRpb24udmFsdWVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vdGhlcmUncyBzdGlsbCBvbmUgbW9yZSByZWFzb24gd2UgbWlnaHQgaGF2ZSBmYWlsZWQgdG8gZGVjb2RlIGl0OlxuICAgICAgICAvL2NlcnRhaW4gKHNpbGVudCkgdHlwZSBjb252ZXJzaW9ucyBhcmVuJ3Qgc291cmNlbWFwcGVkIGVpdGhlci5cbiAgICAgICAgLy8odGhhbmtmdWxseSwgYW55IHR5cGUgY29udmVyc2lvbiB0aGF0IGFjdHVhbGx5ICpkb2VzKiBzb21ldGhpbmcgc2VlbXNcbiAgICAgICAgLy90byBiZSBzb3VyY2VtYXBwZWQuKSAgU28gaWYgd2UndmUgZmFpbGVkIHRvIGRlY29kZSBpdCwgd2UgdHJ5IGFnYWluXG4gICAgICAgIC8vd2l0aCB0aGUgYXJndW1lbnQgb2YgdGhlIHR5cGUgY29udmVyc2lvbiwgaWYgaXQgaXMgb25lOyB3ZSBsZWF2ZVxuICAgICAgICAvL2luZGV4VmFsdWUgdW5kZWZpbmVkIHNvIHRoZSBsb29wIHdpbGwgY29udGludWVcbiAgICAgICAgLy8obm90ZSB0aGF0IHRoaXMgY2FzZSBpcyBsYXN0IGZvciBhIHJlYXNvbjsgaWYgdGhpcyB3ZXJlIGVhcmxpZXIsIGl0XG4gICAgICAgIC8vd291bGQgY2F0Y2ggKm5vbiotc2lsZW50IHR5cGUgY29udmVyc2lvbnMsIHdoaWNoIHdlIHdhbnQgdG8ganVzdCByZWFkXG4gICAgICAgIC8vb2ZmIHRoZSBzdGFjaylcbiAgICAgICAgZWxzZSBpZiAoaW5kZXhEZWZpbml0aW9uLmtpbmQgPT09IFwidHlwZUNvbnZlcnNpb25cIikge1xuICAgICAgICAgIGluZGV4RGVmaW5pdGlvbiA9IGluZGV4RGVmaW5pdGlvbi5hcmd1bWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgLy9vdGhlcndpc2UsIHdlJ3ZlIGp1c3QgdG90YWxseSBmYWlsZWQgdG8gZGVjb2RlIGl0LCBzbyB3ZSBtYXJrXG4gICAgICAgIC8vaW5kZXhWYWx1ZSBhcyBudWxsIChhcyBkaXN0aW5jdCBmcm9tIHVuZGVmaW5lZCkgdG8gaW5kaWNhdGUgdGhpcy4gIEluXG4gICAgICAgIC8vdGhlIGZ1dHVyZSwgd2Ugc2hvdWxkIGJlIGFibGUgdG8gZGVjb2RlIGFsbCBtYXBwaW5nIGtleXMsIGJ1dCB3ZSdyZVxuICAgICAgICAvL25vdCBxdWl0ZSB0aGVyZSB5ZXQsIHNvcnJ5IChiZWNhdXNlIHdlIGNhbid0IHlldCBoYW5kbGUgYWxsIGNvbnN0YW50XG4gICAgICAgIC8vc3RhdGUgdmFyaWFibGVzKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpbmRleFZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvL25vdywgYXMgbWVudGlvbmVkLCByZXRyeSBpbiB0aGUgdHlwZUNvbnZlcnNpb24gY2FzZVxuICAgICAgfVxuXG4gICAgICAvL2VuZCBzdWJzZWN0aW9uOiBrZXkgZGVjb2RpbmdcblxuICAgICAgZGVidWcoXCJpbmRleCB2YWx1ZSAlT1wiLCBpbmRleFZhbHVlKTtcbiAgICAgIGRlYnVnKFwia2V5RGVmaW5pdGlvbiAlb1wiLCBrZXlEZWZpbml0aW9uKTtcblxuICAgICAgLy93aGV3ISBCdXQgd2UncmUgbm90IGRvbmUgeWV0IC0tIHdlIG5lZWQgdG8gdHVybiB0aGlzIGRlY29kZWQga2V5IGludG9cbiAgICAgIC8vYW4gYWN0dWFsIHBhdGggKGFzc3VtaW5nIHdlICpkaWQqIGRlY29kZSBpdClcbiAgICAgIC8vT0ssIG5vdCBhbiBhY3R1YWwgcGF0aCAtLSB3ZSdyZSBqdXN0IGdvaW5nIHRvIHVzZSBhIHNpbXBsZSBvZmZzZXQgZm9yXG4gICAgICAvL3RoZSBwYXRoLiAgQnV0IHRoYXQncyBPSywgYmVjYXVzZSB0aGUgbWFwcGVkUGF0aHMgcmVkdWNlciB3aWxsIHR1cm5cbiAgICAgIC8vaXQgaW50byBhbiBhY3R1YWwgcGF0aC5cbiAgICAgIGlmIChpbmRleFZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgIHBhdGggPSBmZXRjaEJhc2VQYXRoKFxuICAgICAgICAgIGJhc2VFeHByZXNzaW9uLFxuICAgICAgICAgIG1hcHBlZFBhdGhzLFxuICAgICAgICAgIGN1cnJlbnRBc3NpZ25tZW50cyxcbiAgICAgICAgICBjdXJyZW50RGVwdGhcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgc2xvdCA9IHsgcGF0aCB9O1xuXG4gICAgICAgIC8vd2UgbmVlZCB0byBkbyB0aGluZ3MgZGlmZmVyZW50bHkgZGVwZW5kaW5nIG9uIHdoZXRoZXIgd2UncmUgZGVhbGluZ1xuICAgICAgICAvL3dpdGggYW4gYXJyYXkgb3IgbWFwcGluZ1xuICAgICAgICBzd2l0Y2ggKERlY29kZVV0aWxzLkRlZmluaXRpb24udHlwZUNsYXNzKGJhc2VFeHByZXNzaW9uKSkge1xuICAgICAgICAgIGNhc2UgXCJhcnJheVwiOlxuICAgICAgICAgICAgc2xvdC5oYXNoUGF0aCA9IERlY29kZVV0aWxzLkRlZmluaXRpb24uaXNEeW5hbWljQXJyYXkoXG4gICAgICAgICAgICAgIGJhc2VFeHByZXNzaW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc2xvdC5vZmZzZXQgPSBpbmRleFZhbHVlLm11bG4oXG4gICAgICAgICAgICAgIHN0b3JhZ2VTaXplKG5vZGUsIHJlZmVyZW5jZURlY2xhcmF0aW9ucywgYWxsb2NhdGlvbnMpLndvcmRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIm1hcHBpbmdcIjpcbiAgICAgICAgICAgIHNsb3Qua2V5ID0gaW5kZXhWYWx1ZTtcbiAgICAgICAgICAgIHNsb3Qua2V5RW5jb2RpbmcgPSBEZWNvZGVVdGlscy5EZWZpbml0aW9uLmtleUVuY29kaW5nKFxuICAgICAgICAgICAgICBrZXlEZWZpbml0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc2xvdC5vZmZzZXQgPSBuZXcgQk4oMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZGVidWcoXCJ1bnJlY29nbml6ZWQgaW5kZXggYWNjZXNzIVwiKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyhcInNsb3QgJU9cIiwgc2xvdCk7XG5cbiAgICAgICAgLy9ub3csIG1hcCBpdCEgKGFuZCBkbyB0aGUgYXNzaWduIGFzIHdlbGwpXG4gICAgICAgIHlpZWxkIHB1dChcbiAgICAgICAgICBhY3Rpb25zLm1hcFBhdGhBbmRBc3NpZ24oXG4gICAgICAgICAgICBhZGRyZXNzLFxuICAgICAgICAgICAgc2xvdCxcbiAgICAgICAgICAgIGFzc2lnbm1lbnRzLFxuICAgICAgICAgICAgRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi50eXBlSWRlbnRpZmllcihub2RlKSxcbiAgICAgICAgICAgIERlY29kZVV0aWxzLkRlZmluaXRpb24udHlwZUlkZW50aWZpZXIoYmFzZUV4cHJlc3Npb24pXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9pZiB3ZSBmYWlsZWQgdG8gZGVjb2RlLCBqdXN0IGRvIHRoZSBhc3NpZ24gZnJvbSBhYm92ZVxuICAgICAgICBkZWJ1ZyhcImZhaWxlZCB0byBkZWNvZGUsIGp1c3QgYXNzaWduaW5nXCIpO1xuICAgICAgICB5aWVsZCBwdXQoYWN0aW9ucy5hc3NpZ24oYXNzaWdubWVudHMpKTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiTWVtYmVyQWNjZXNzXCI6XG4gICAgICAvL0hBQ0s6IHdlIHVzZSB0aGUgYWx0ZXJuYXRlIHN0YWNrIGluIHRoaXMgY2FzZVxuXG4gICAgICAvL3dlJ3JlIGdvaW5nIHRvIHN0YXJ0IGJ5IGRvaW5nIHRoZSBzYW1lIHRoaW5nIGFzIGluIHRoZSBkZWZhdWx0IGNhc2VcbiAgICAgIC8vKHNlZSBiZWxvdykgLS0gZ2V0dGluZyB0aGluZ3MgcmVhZHkgZm9yIGFuIGFzc2lnbm1lbnQuICBUaGVuIHdlJ3JlXG4gICAgICAvL2dvaW5nIHRvIGZvcmdldCB0aGlzIGZvciBhIGJpdCB3aGlsZSB3ZSBoYW5kbGUgdGhlIHJlc3QuLi5cbiAgICAgIGFzc2lnbm1lbnRzID0ge1xuICAgICAgICAuLi5wcmVhbWJsZUFzc2lnbm1lbnRzLFxuICAgICAgICAuLi5saXRlcmFsQXNzaWdubWVudHMobm9kZSwgYWx0ZXJuYXRlU3RhY2ssIGN1cnJlbnREZXB0aClcbiAgICAgIH07XG5cbiAgICAgIGRlYnVnKFwiTWVtYmVyIGFjY2VzcyBjYXNlXCIpO1xuXG4gICAgICAvL01lbWJlckFjY2VzcyB1c2VzIGV4cHJlc3Npb24sIG5vdCBiYXNlRXhwcmVzc2lvblxuICAgICAgYmFzZUV4cHJlc3Npb24gPSBub2RlLmV4cHJlc3Npb247XG5cbiAgICAgIC8vaWYgdGhpcyBpc24ndCBhIHN0b3JhZ2Ugc3RydWN0LCBvciB0aGUgZWxlbWVudCBpc24ndCBvZiByZWZlcmVuY2UgdHlwZSxcbiAgICAgIC8vd2UnbGwganVzdCBkbyB0aGUgYXNzaWdubWVudCBhbmQgcXVpdCBvdXQgKGFnYWluLCBub3RlIHRoYXQgbWFwcGluZ3NcbiAgICAgIC8vYXJlbid0IGNhdWdodCBieSBpc1JlZmVyZW5jZSlcbiAgICAgIGlmIChcbiAgICAgICAgRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi50eXBlQ2xhc3MoYmFzZUV4cHJlc3Npb24pICE9PSBcInN0cnVjdFwiIHx8XG4gICAgICAgIChEZWNvZGVVdGlscy5EZWZpbml0aW9uLmlzUmVmZXJlbmNlKG5vZGUpXG4gICAgICAgICAgPyBEZWNvZGVVdGlscy5EZWZpbml0aW9uLnJlZmVyZW5jZVR5cGUoYmFzZUV4cHJlc3Npb24pICE9PSBcInN0b3JhZ2VcIlxuICAgICAgICAgIDogIURlY29kZVV0aWxzLkRlZmluaXRpb24uaXNNYXBwaW5nKG5vZGUpKVxuICAgICAgKSB7XG4gICAgICAgIGRlYnVnKFwiTWVtYmVyIGNhc2UgYmFpbGVkIG91dCBlYXJseVwiKTtcbiAgICAgICAgeWllbGQgcHV0KGFjdGlvbnMuYXNzaWduKGFzc2lnbm1lbnRzKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvL2J1dCBpZiBpdCBpcyBhIHN0b3JhZ2Ugc3RydWN0LCB3ZSBoYXZlIHRvIG1hcCB0aGUgcGF0aCBhcyB3ZWxsXG4gICAgICBwYXRoID0gZmV0Y2hCYXNlUGF0aChcbiAgICAgICAgYmFzZUV4cHJlc3Npb24sXG4gICAgICAgIG1hcHBlZFBhdGhzLFxuICAgICAgICBjdXJyZW50QXNzaWdubWVudHMsXG4gICAgICAgIGN1cnJlbnREZXB0aFxuICAgICAgKTtcblxuICAgICAgc2xvdCA9IHsgcGF0aCB9O1xuXG4gICAgICBsZXQgc3RydWN0SWQgPSBEZWNvZGVVdGlscy5EZWZpbml0aW9uLnR5cGVJZChiYXNlRXhwcmVzc2lvbik7XG4gICAgICBsZXQgbWVtYmVyQWxsb2NhdGlvbiA9XG4gICAgICAgIGFsbG9jYXRpb25zW3N0cnVjdElkXS5tZW1iZXJzW25vZGUucmVmZXJlbmNlZERlY2xhcmF0aW9uXTtcblxuICAgICAgc2xvdC5vZmZzZXQgPSBtZW1iZXJBbGxvY2F0aW9uLnBvaW50ZXIuc3RvcmFnZS5mcm9tLnNsb3Qub2Zmc2V0LmNsb25lKCk7XG5cbiAgICAgIGRlYnVnKFwic2xvdCAlb1wiLCBzbG90KTtcbiAgICAgIHlpZWxkIHB1dChcbiAgICAgICAgYWN0aW9ucy5tYXBQYXRoQW5kQXNzaWduKFxuICAgICAgICAgIGFkZHJlc3MsXG4gICAgICAgICAgc2xvdCxcbiAgICAgICAgICBhc3NpZ25tZW50cyxcbiAgICAgICAgICBEZWNvZGVVdGlscy5EZWZpbml0aW9uLnR5cGVJZGVudGlmaWVyKG5vZGUpLFxuICAgICAgICAgIERlY29kZVV0aWxzLkRlZmluaXRpb24udHlwZUlkZW50aWZpZXIoYmFzZUV4cHJlc3Npb24pXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKG5vZGUudHlwZURlc2NyaXB0aW9ucyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGRlYnVnKFwiZGVjb2RpbmcgZXhwcmVzc2lvbiB2YWx1ZSAlT1wiLCBub2RlLnR5cGVEZXNjcmlwdGlvbnMpO1xuICAgICAgZGVidWcoXCJkZWZhdWx0IGNhc2VcIik7XG4gICAgICBkZWJ1ZyhcImN1cnJlbnREZXB0aCAlZCBub2RlLmlkICVkXCIsIGN1cnJlbnREZXB0aCwgbm9kZS5pZCk7XG5cbiAgICAgIGFzc2lnbm1lbnRzID0ge1xuICAgICAgICAuLi5wcmVhbWJsZUFzc2lnbm1lbnRzLFxuICAgICAgICAuLi5saXRlcmFsQXNzaWdubWVudHMobm9kZSwgc3RhY2ssIGN1cnJlbnREZXB0aClcbiAgICAgIH07XG4gICAgICB5aWVsZCBwdXQoYWN0aW9ucy5hc3NpZ24oYXNzaWdubWVudHMpKTtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogcmVzZXQoKSB7XG4gIHlpZWxkIHB1dChhY3Rpb25zLnJlc2V0KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIHJlY29yZEFsbG9jYXRpb25zKCkge1xuICBjb25zdCBjb250cmFjdHMgPSB5aWVsZCBzZWxlY3QoXG4gICAgZGF0YS52aWV3cy51c2VyRGVmaW5lZFR5cGVzLmNvbnRyYWN0RGVmaW5pdGlvbnNcbiAgKTtcbiAgZGVidWcoXCJjb250cmFjdHMgJU9cIiwgY29udHJhY3RzKTtcbiAgY29uc3QgcmVmZXJlbmNlRGVjbGFyYXRpb25zID0geWllbGQgc2VsZWN0KGRhdGEudmlld3MucmVmZXJlbmNlRGVjbGFyYXRpb25zKTtcbiAgZGVidWcoXCJyZWZlcmVuY2VEZWNsYXJhdGlvbnMgJU9cIiwgcmVmZXJlbmNlRGVjbGFyYXRpb25zKTtcbiAgY29uc3Qgc3RvcmFnZUFsbG9jYXRpb25zID0gZ2V0U3RvcmFnZUFsbG9jYXRpb25zKFxuICAgIHJlZmVyZW5jZURlY2xhcmF0aW9ucyxcbiAgICBjb250cmFjdHNcbiAgKTtcbiAgZGVidWcoXCJzdG9yYWdlQWxsb2NhdGlvbnMgJU9cIiwgc3RvcmFnZUFsbG9jYXRpb25zKTtcbiAgY29uc3QgbWVtb3J5QWxsb2NhdGlvbnMgPSBnZXRNZW1vcnlBbGxvY2F0aW9ucyhyZWZlcmVuY2VEZWNsYXJhdGlvbnMpO1xuICBjb25zdCBjYWxsZGF0YUFsbG9jYXRpb25zID0gZ2V0Q2FsbGRhdGFBbGxvY2F0aW9ucyhyZWZlcmVuY2VEZWNsYXJhdGlvbnMpO1xuICB5aWVsZCBwdXQoXG4gICAgYWN0aW9ucy5hbGxvY2F0ZShzdG9yYWdlQWxsb2NhdGlvbnMsIG1lbW9yeUFsbG9jYXRpb25zLCBjYWxsZGF0YUFsbG9jYXRpb25zKVxuICApO1xufVxuXG5mdW5jdGlvbiBsaXRlcmFsQXNzaWdubWVudHMobm9kZSwgc3RhY2ssIGN1cnJlbnREZXB0aCkge1xuICBsZXQgdG9wID0gc3RhY2subGVuZ3RoIC0gMTtcblxuICBsZXQgbGl0ZXJhbCA9IHJlYWRTdGFjayhcbiAgICBzdGFjayxcbiAgICB0b3AgLSBEZWNvZGVVdGlscy5EZWZpbml0aW9uLnN0YWNrU2l6ZShub2RlKSArIDEsXG4gICAgdG9wXG4gICk7XG5cbiAgbGV0IGFzc2lnbm1lbnQgPSBtYWtlQXNzaWdubWVudChcbiAgICB7IGFzdElkOiBub2RlLmlkLCBzdGFja2ZyYW1lOiBjdXJyZW50RGVwdGggfSxcbiAgICB7IGxpdGVyYWwgfVxuICApO1xuXG4gIHJldHVybiB7IFthc3NpZ25tZW50LmlkXTogYXNzaWdubWVudCB9O1xufVxuXG4vL3Rha2VzIGEgcGFyYW1ldGVyIGxpc3QgYXMgZ2l2ZW4gaW4gdGhlIEFTVFxuZnVuY3Rpb24gYXNzaWduUGFyYW1ldGVycyhwYXJhbWV0ZXJzLCB0b3AsIGZ1bmN0aW9uRGVwdGgpIHtcbiAgbGV0IHJldmVyc2VQYXJhbWV0ZXJzID0gcGFyYW1ldGVycy5zbGljZSgpLnJldmVyc2UoKTtcbiAgLy9yZXZlcnNlIGlzIGluLXBsYWNlLCBzbyB3ZSB1c2Ugc2xpY2UoKSB0byBjbG9uZSBmaXJzdFxuICBkZWJ1ZyhcInJldmVyc2VQYXJhbWV0ZXJzICVvXCIsIHBhcmFtZXRlcnMpO1xuXG4gIGxldCBjdXJyZW50UG9zaXRpb24gPSB0b3A7XG4gIGxldCBhc3NpZ25tZW50cyA9IHt9O1xuXG4gIGZvciAobGV0IHBhcmFtZXRlciBvZiByZXZlcnNlUGFyYW1ldGVycykge1xuICAgIGxldCB3b3JkcyA9IERlY29kZVV0aWxzLkRlZmluaXRpb24uc3RhY2tTaXplKHBhcmFtZXRlcik7XG4gICAgbGV0IHBvaW50ZXIgPSB7XG4gICAgICBzdGFjazoge1xuICAgICAgICBmcm9tOiBjdXJyZW50UG9zaXRpb24gLSB3b3JkcyArIDEsXG4gICAgICAgIHRvOiBjdXJyZW50UG9zaXRpb25cbiAgICAgIH1cbiAgICB9O1xuICAgIGxldCBhc3NpZ25tZW50ID0gbWFrZUFzc2lnbm1lbnQoXG4gICAgICB7IGFzdElkOiBwYXJhbWV0ZXIuaWQsIHN0YWNrZnJhbWU6IGZ1bmN0aW9uRGVwdGggfSxcbiAgICAgIHBvaW50ZXJcbiAgICApO1xuICAgIGFzc2lnbm1lbnRzW2Fzc2lnbm1lbnQuaWRdID0gYXNzaWdubWVudDtcbiAgICBjdXJyZW50UG9zaXRpb24gLT0gd29yZHM7XG4gIH1cbiAgcmV0dXJuIGFzc2lnbm1lbnRzO1xufVxuXG5mdW5jdGlvbiBmZXRjaEJhc2VQYXRoKFxuICBiYXNlTm9kZSxcbiAgbWFwcGVkUGF0aHMsXG4gIGN1cnJlbnRBc3NpZ25tZW50cyxcbiAgY3VycmVudERlcHRoXG4pIHtcbiAgbGV0IGZ1bGxJZCA9IHN0YWJsZUtlY2NhazI1Nih7XG4gICAgYXN0SWQ6IGJhc2VOb2RlLmlkLFxuICAgIHN0YWNrZnJhbWU6IGN1cnJlbnREZXB0aFxuICB9KTtcbiAgLy9iYXNlIGV4cHJlc3Npb24gaXMgYW4gZXhwcmVzc2lvbiwgYW5kIHNvIGhhcyBhIGxpdGVyYWwgYXNzaWduZWQgdG9cbiAgLy9pdFxuICBsZXQgb2Zmc2V0ID0gRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0JOKFxuICAgIGN1cnJlbnRBc3NpZ25tZW50cy5ieUlkW2Z1bGxJZF0ucmVmLmxpdGVyYWxcbiAgKTtcbiAgcmV0dXJuIHsgb2Zmc2V0IH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc2FnYSgpIHtcbiAgeWllbGQgdGFrZUV2ZXJ5KFRJQ0ssIHRpY2tTYWdhKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJlZml4TmFtZShcImRhdGFcIiwgc2FnYSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL2RhdGEvc2FnYXMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvYXN5bmNUb0dlbmVyYXRvclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yXCJcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvdmFsdWVzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC92YWx1ZXNcIlxuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNvbnN0IEFEVkFOQ0UgPSBcIkFEVkFOQ0VcIjtcbmV4cG9ydCBmdW5jdGlvbiBhZHZhbmNlKGNvdW50KSB7XG4gIHJldHVybiB7IHR5cGU6IEFEVkFOQ0UsIGNvdW50IH07XG59XG5cbmV4cG9ydCBjb25zdCBTVEVQX05FWFQgPSBcIlNURVBfTkVYVFwiO1xuZXhwb3J0IGZ1bmN0aW9uIHN0ZXBOZXh0KCkge1xuICByZXR1cm4geyB0eXBlOiBTVEVQX05FWFQgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFNURVBfT1ZFUiA9IFwiU1RFUF9PVkVSXCI7XG5leHBvcnQgZnVuY3Rpb24gc3RlcE92ZXIoKSB7XG4gIHJldHVybiB7IHR5cGU6IFNURVBfT1ZFUiB9O1xufVxuXG5leHBvcnQgY29uc3QgU1RFUF9JTlRPID0gXCJTVEVQX0lOVE9cIjtcbmV4cG9ydCBmdW5jdGlvbiBzdGVwSW50bygpIHtcbiAgcmV0dXJuIHsgdHlwZTogU1RFUF9JTlRPIH07XG59XG5cbmV4cG9ydCBjb25zdCBTVEVQX09VVCA9IFwiU1RFUF9PVVRcIjtcbmV4cG9ydCBmdW5jdGlvbiBzdGVwT3V0KCkge1xuICByZXR1cm4geyB0eXBlOiBTVEVQX09VVCB9O1xufVxuXG5leHBvcnQgY29uc3QgUkVTRVQgPSBcIlJFU0VUXCI7XG5leHBvcnQgZnVuY3Rpb24gcmVzZXQoKSB7XG4gIHJldHVybiB7IHR5cGU6IFJFU0VUIH07XG59XG5cbmV4cG9ydCBjb25zdCBJTlRFUlJVUFQgPSBcIkNPTlRST0xMRVJfSU5URVJSVVBUXCI7XG5leHBvcnQgZnVuY3Rpb24gaW50ZXJydXB0KCkge1xuICByZXR1cm4geyB0eXBlOiBJTlRFUlJVUFQgfTtcbn1cblxuZXhwb3J0IGNvbnN0IENPTlRJTlVFID0gXCJDT05USU5VRVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnRpbnVlVW50aWxCcmVha3BvaW50KGJyZWFrcG9pbnRzKSB7XG4gIC8vXCJjb250aW51ZVwiIGlzIG5vdCBhIGxlZ2FsIG5hbWVcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBDT05USU5VRSxcbiAgICBicmVha3BvaW50c1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgQUREX0JSRUFLUE9JTlQgPSBcIkFERF9CUkVBS1BPSU5UXCI7XG5leHBvcnQgZnVuY3Rpb24gYWRkQnJlYWtwb2ludChicmVha3BvaW50KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQUREX0JSRUFLUE9JTlQsXG4gICAgYnJlYWtwb2ludFxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgUkVNT1ZFX0JSRUFLUE9JTlQgPSBcIlJFTU9WRV9CUkVBS1BPSU5UXCI7XG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQnJlYWtwb2ludChicmVha3BvaW50KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogUkVNT1ZFX0JSRUFLUE9JTlQsXG4gICAgYnJlYWtwb2ludFxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgUkVNT1ZFX0FMTF9CUkVBS1BPSU5UUyA9IFwiUkVNT1ZFX0FMTF9CUkVBS1BPSU5UU1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbEJyZWFrcG9pbnRzKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFTU9WRV9BTExfQlJFQUtQT0lOVFNcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFNUQVJUX1NURVBQSU5HID0gXCJTVEFSVF9TVEVQUElOR1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0U3RlcHBpbmcoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU1RBUlRfU1RFUFBJTkdcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IERPTkVfU1RFUFBJTkcgPSBcIkRPTkVfU1RFUFBJTkdcIjtcbmV4cG9ydCBmdW5jdGlvbiBkb25lU3RlcHBpbmcoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogRE9ORV9TVEVQUElOR1xuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9jb250cm9sbGVyL2FjdGlvbnMvaW5kZXguanMiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6ZGF0YTpzZWxlY3RvcnNcIik7XG5cbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yVHJlZSwgY3JlYXRlTGVhZiB9IGZyb20gXCJyZXNlbGVjdC10cmVlXCI7XG5pbXBvcnQganNvbnBvaW50ZXIgZnJvbSBcImpzb24tcG9pbnRlclwiO1xuXG5pbXBvcnQgeyBzdGFibGVLZWNjYWsyNTYgfSBmcm9tIFwibGliL2hlbHBlcnNcIjtcblxuaW1wb3J0IGV2bSBmcm9tIFwibGliL2V2bS9zZWxlY3RvcnNcIjtcbmltcG9ydCBzb2xpZGl0eSBmcm9tIFwibGliL3NvbGlkaXR5L3NlbGVjdG9yc1wiO1xuXG5pbXBvcnQgKiBhcyBEZWNvZGVVdGlscyBmcm9tIFwidHJ1ZmZsZS1kZWNvZGUtdXRpbHNcIjtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcblxuZnVuY3Rpb24gZmluZEFuY2VzdG9yT2ZUeXBlKG5vZGUsIHR5cGVzLCBzY29wZXMpIHtcbiAgLy9ub3RlOiBJJ20gbm90IGluY2x1ZGluZyBhbnkgcHJvdGVjdGlvbiBhZ2FpbnN0IG51bGwgaW4gdGhpcyBmdW5jdGlvbi5cbiAgLy9Zb3UgYXJlIGFkdmlzZWQgdG8gaW5jbHVkZSBcIlNvdXJjZVVuaXRcIiBhcyBhIGZhbGxiYWNrIHR5cGUuXG4gIHdoaWxlIChub2RlICYmICF0eXBlcy5pbmNsdWRlcyhub2RlLm5vZGVUeXBlKSkge1xuICAgIG5vZGUgPSBzY29wZXNbc2NvcGVzW25vZGUuaWRdLnBhcmVudElkXS5kZWZpbml0aW9uO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vL2dpdmVuIGEgbW9kaWZpZXIgaW52b2NhdGlvbiAob3IgaW5oZXJpdGFuY2Ugc3BlY2lmaWVyKSBub2RlLFxuLy9nZXQgdGhlIG5vZGUgZm9yIHRoZSBhY3R1YWwgbW9kaWZpZXIgKG9yIGNvbnN0cnVjdG9yKVxuZnVuY3Rpb24gbW9kaWZpZXJGb3JJbnZvY2F0aW9uKGludm9jYXRpb24sIHNjb3Blcykge1xuICBsZXQgcmF3SWQ7IC8vcmF3IHJlZmVyZW5jZWREZWNsYXJhdGlvbiBJRCBleHRyYWN0ZWQgZnJvbSB0aGUgQVNULlxuICAvL2lmIGl0J3MgYSBtb2RpZmllciB0aGlzIGlzIHdoYXQgd2Ugd2FudCwgYnV0IGlmIGl0J3MgYmFzZVxuICAvL2NvbnN0cnVjdG9yLCB3ZSdsbCBnZXQgdGhlIGNvbnRyYWN0IGluc3RlYWQsIGFuZCBuZWVkIHRvIGZpbmQgaXRzXG4gIC8vY29uc3RydWN0b3IuXG4gIHN3aXRjaCAoaW52b2NhdGlvbi5ub2RlVHlwZSkge1xuICAgIGNhc2UgXCJNb2RpZmllckludm9jYXRpb25cIjpcbiAgICAgIHJhd0lkID0gaW52b2NhdGlvbi5tb2RpZmllck5hbWUucmVmZXJlbmNlZERlY2xhcmF0aW9uO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkluaGVyaXRhbmNlU3BlY2lmaWVyXCI6XG4gICAgICByYXdJZCA9IGludm9jYXRpb24uYmFzZU5hbWUucmVmZXJlbmNlZERlY2xhcmF0aW9uO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGRlYnVnKFwiYmFkIGludm9jYXRpb24gbm9kZVwiKTtcbiAgfVxuICBsZXQgcmF3Tm9kZSA9IHNjb3Blc1tyYXdJZF0uZGVmaW5pdGlvbjtcbiAgc3dpdGNoIChyYXdOb2RlLm5vZGVUeXBlKSB7XG4gICAgY2FzZSBcIk1vZGlmaWVyRGVmaW5pdGlvblwiOlxuICAgICAgcmV0dXJuIHJhd05vZGU7XG4gICAgY2FzZSBcIkNvbnRyYWN0RGVmaW5pdGlvblwiOlxuICAgICAgcmV0dXJuIHJhd05vZGUubm9kZXMuZmluZChcbiAgICAgICAgbm9kZSA9PlxuICAgICAgICAgIG5vZGUubm9kZVR5cGUgPT09IFwiRnVuY3Rpb25EZWZpbml0aW9uXCIgJiYgbm9kZS5raW5kID09PSBcImNvbnN0cnVjdG9yXCJcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vd2Ugc2hvdWxkIG5ldmVyIGhpdCB0aGlzIGNhc2VcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLy9zZWUgZGF0YS52aWV3cy5jb250ZXh0cyBmb3IgYW4gZXhwbGFuYXRpb25cbmZ1bmN0aW9uIGRlYnVnZ2VyQ29udGV4dFRvRGVjb2RlckNvbnRleHQoY29udGV4dCkge1xuICBsZXQge1xuICAgIGNvbnRyYWN0TmFtZSxcbiAgICBiaW5hcnksXG4gICAgY29udHJhY3RJZCxcbiAgICBjb250cmFjdEtpbmQsXG4gICAgaXNDb25zdHJ1Y3RvcixcbiAgICBhYmlcbiAgfSA9IGNvbnRleHQ7XG4gIHJldHVybiB7XG4gICAgY29udHJhY3ROYW1lLFxuICAgIGJpbmFyeSxcbiAgICBjb250cmFjdElkLFxuICAgIGNvbnRyYWN0S2luZCxcbiAgICBpc0NvbnN0cnVjdG9yLFxuICAgIGFiaTogRGVjb2RlVXRpbHMuQ29udGV4dHMuYWJpVG9GdW5jdGlvbkFiaVdpdGhTaWduYXR1cmVzKGFiaSlcbiAgfTtcbn1cblxuY29uc3QgZGF0YSA9IGNyZWF0ZVNlbGVjdG9yVHJlZSh7XG4gIHN0YXRlOiBzdGF0ZSA9PiBzdGF0ZS5kYXRhLFxuXG4gIC8qKlxuICAgKiBkYXRhLnZpZXdzXG4gICAqL1xuICB2aWV3czoge1xuICAgIC8qXG4gICAgICogZGF0YS52aWV3cy5hdExhc3RJbnN0cnVjdGlvbkZvclNvdXJjZVJhbmdlXG4gICAgICovXG4gICAgYXRMYXN0SW5zdHJ1Y3Rpb25Gb3JTb3VyY2VSYW5nZTogY3JlYXRlTGVhZihcbiAgICAgIFtzb2xpZGl0eS5jdXJyZW50LmlzU291cmNlUmFuZ2VGaW5hbF0sXG4gICAgICBmaW5hbCA9PiBmaW5hbFxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBkYXRhLnZpZXdzLnNjb3BlcyAobmFtZXNwYWNlKVxuICAgICAqL1xuICAgIHNjb3Blczoge1xuICAgICAgLyoqXG4gICAgICAgKiBkYXRhLnZpZXdzLnNjb3Blcy5pbmxpbmVkIChuYW1lc3BhY2UpXG4gICAgICAgKi9cbiAgICAgIGlubGluZWQ6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGRhdGEudmlld3Muc2NvcGVzLmlubGluZWQgKHNlbGVjdG9yKVxuICAgICAgICAgKiBzZWUgZGF0YS5pbmZvLnNjb3BlcyBmb3IgaG93IHRoaXMgZGlmZmVycyBmcm9tIHRoZSByYXcgdmVyc2lvblxuICAgICAgICAgKi9cbiAgICAgICAgXzogY3JlYXRlTGVhZihbXCIvaW5mby9zY29wZXNcIiwgXCIuL3Jhd1wiXSwgKHNjb3BlcywgaW5saW5lZCkgPT5cbiAgICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICAuLi5PYmplY3QuZW50cmllcyhpbmxpbmVkKS5tYXAoKFtpZCwgaW5mb10pID0+IHtcbiAgICAgICAgICAgICAgbGV0IG5ld0luZm8gPSB7IC4uLmluZm8gfTtcbiAgICAgICAgICAgICAgbmV3SW5mby52YXJpYWJsZXMgPSBzY29wZXNbaWRdLnZhcmlhYmxlcztcbiAgICAgICAgICAgICAgcmV0dXJuIHsgW2lkXTogbmV3SW5mbyB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApXG4gICAgICAgICksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGRhdGEudmlld3Muc2NvcGVzLmlubGluZWQucmF3XG4gICAgICAgICAqL1xuICAgICAgICByYXc6IGNyZWF0ZUxlYWYoXG4gICAgICAgICAgW1wiL2luZm8vc2NvcGVzL3Jhd1wiLCBzb2xpZGl0eS5pbmZvLnNvdXJjZXNdLFxuXG4gICAgICAgICAgKHNjb3Blcywgc291cmNlcykgPT5cbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAuLi5PYmplY3QuZW50cmllcyhzY29wZXMpLm1hcCgoW2lkLCBlbnRyeV0pID0+ICh7XG4gICAgICAgICAgICAgICAgW2lkXToge1xuICAgICAgICAgICAgICAgICAgLi4uZW50cnksXG5cbiAgICAgICAgICAgICAgICAgIGRlZmluaXRpb246IGpzb25wb2ludGVyLmdldChcbiAgICAgICAgICAgICAgICAgICAgc291cmNlc1tlbnRyeS5zb3VyY2VJZF0uYXN0LFxuICAgICAgICAgICAgICAgICAgICBlbnRyeS5wb2ludGVyXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIGRhdGEudmlld3MudXNlckRlZmluZWRUeXBlc1xuICAgICAqL1xuICAgIHVzZXJEZWZpbmVkVHlwZXM6IHtcbiAgICAgIC8qXG4gICAgICAgKiBkYXRhLnZpZXdzLnVzZXJEZWZpbmVkVHlwZXMuY29udHJhY3REZWZpbml0aW9uc1xuICAgICAgICogcmVzdHJpY3QgdG8gY29udHJhY3RzIG9ubHksIGFuZCBnZXQgdGhlaXIgZGVmaW5pdGlvbnNcbiAgICAgICAqL1xuICAgICAgY29udHJhY3REZWZpbml0aW9uczogY3JlYXRlTGVhZihcbiAgICAgICAgW1wiL2luZm8vdXNlckRlZmluZWRUeXBlc1wiLCBcIi92aWV3cy9zY29wZXMvaW5saW5lZFwiXSxcbiAgICAgICAgKHR5cGVJZHMsIHNjb3BlcykgPT5cbiAgICAgICAgICB0eXBlSWRzXG4gICAgICAgICAgICAubWFwKGlkID0+IHNjb3Blc1tpZF0uZGVmaW5pdGlvbilcbiAgICAgICAgICAgIC5maWx0ZXIobm9kZSA9PiBub2RlLm5vZGVUeXBlID09PSBcIkNvbnRyYWN0RGVmaW5pdGlvblwiKVxuICAgICAgKVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIGRhdGEudmlld3MucmVmZXJlbmNlRGVjbGFyYXRpb25zXG4gICAgICovXG4gICAgcmVmZXJlbmNlRGVjbGFyYXRpb25zOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9zY29wZXMvaW5saW5lZFwiLCBcIi9pbmZvL3VzZXJEZWZpbmVkVHlwZXNcIl0sXG4gICAgICAoc2NvcGVzLCB1c2VyRGVmaW5lZFR5cGVzKSA9PlxuICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIC4uLnVzZXJEZWZpbmVkVHlwZXMubWFwKGlkID0+ICh7IFtpZF06IHNjb3Blc1tpZF0uZGVmaW5pdGlvbiB9KSlcbiAgICAgICAgKVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBkYXRhLnZpZXdzLm1hcHBpbmdLZXlzXG4gICAgICovXG4gICAgbWFwcGluZ0tleXM6IGNyZWF0ZUxlYWYoXG4gICAgICBbXCIvcHJvYy9tYXBwZWRQYXRoc1wiLCBcIi9jdXJyZW50L2FkZHJlc3NcIl0sXG4gICAgICAobWFwcGVkUGF0aHMsIGFkZHJlc3MpID0+XG4gICAgICAgIFtdXG4gICAgICAgICAgLmNvbmNhdChcbiAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMoXG4gICAgICAgICAgICAgIChtYXBwZWRQYXRocy5ieUFkZHJlc3NbYWRkcmVzc10gfHwgeyBieVR5cGU6IHt9IH0pLmJ5VHlwZVxuICAgICAgICAgICAgKS5tYXAoKHsgYnlTbG90QWRkcmVzcyB9KSA9PiBPYmplY3QudmFsdWVzKGJ5U2xvdEFkZHJlc3MpKVxuICAgICAgICAgIClcbiAgICAgICAgICAuZmlsdGVyKHNsb3QgPT4gc2xvdC5rZXkgIT09IHVuZGVmaW5lZClcbiAgICApLFxuXG4gICAgLypcbiAgICAgKiBkYXRhLnZpZXdzLmJsb2NrTnVtYmVyXG4gICAgICogcmV0dXJucyBibG9jayBudW1iZXIgYXMgc3RyaW5nXG4gICAgICovXG4gICAgYmxvY2tOdW1iZXI6IGNyZWF0ZUxlYWYoW2V2bS50cmFuc2FjdGlvbi5nbG9iYWxzLmJsb2NrXSwgYmxvY2sgPT5cbiAgICAgIGJsb2NrLm51bWJlci50b1N0cmluZygpXG4gICAgKSxcblxuICAgIC8qXG4gICAgICogZGF0YS52aWV3cy5pbnN0YW5jZXNcbiAgICAgKiBzYW1lIGFzIGV2bS5pbmZvLmluc3RhbmNlcywgYnV0IHdlIGp1c3QgbWFwIGFkZHJlc3MgPT4gYmluYXJ5LFxuICAgICAqIHdlIGRvbid0IGJvdGhlciB3aXRoIGNvbnRleHRcbiAgICAgKi9cbiAgICBpbnN0YW5jZXM6IGNyZWF0ZUxlYWYoW2V2bS50cmFuc2FjdGlvbi5pbnN0YW5jZXNdLCBpbnN0YW5jZXMgPT5cbiAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHt9LFxuICAgICAgICAuLi5PYmplY3QuZW50cmllcyhpbnN0YW5jZXMpLm1hcCgoW2FkZHJlc3MsIHsgYmluYXJ5IH1dKSA9PiAoe1xuICAgICAgICAgIFthZGRyZXNzXTogRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0J5dGVzKGJpbmFyeSlcbiAgICAgICAgfSkpXG4gICAgICApXG4gICAgKSxcblxuICAgIC8qXG4gICAgICogZGF0YS52aWV3cy5jb250ZXh0c1xuICAgICAqIHNhbWUgYXMgZXZtLmluZm8uY29udGV4dHMsIGJ1dDpcbiAgICAgKiAwLiB3ZSBvbmx5IGluY2x1ZGUgbm9uLWNvbnN0cnVjdG9yIGNvbnRleHRzXG4gICAgICogMS4gd2Ugbm93IGluZGV4IGJ5IGNvbnRyYWN0IElEIHJhdGhlciB0aGFuIGhhc2hcbiAgICAgKiAyLiB3ZSBzdHJpcCBvdXQgY29udGV4dCwgc291cmNlTWFwLCBwcmltYXJ5U291cmNlLCBhbmQgY29tcGlsZXJcbiAgICAgKiAzLiB3ZSBhbHRlciBhYmkgaW4gc2V2ZXJhbCB3YXlzOlxuICAgICAqIDNhLiB3ZSBzdHJpcCBhYmkgZG93biB0byBqdXN0IChvcmRpbmFyeSkgZnVuY3Rpb25zXG4gICAgICogM2IuIHdlIGF1Z21lbnQgdGhlc2UgZnVuY3Rpb25zIHdpdGggc2lnbmF0dXJlcyAoaGVyZSBtZWFuaW5nIHNlbGVjdG9ycylcbiAgICAgKiAzYy4gYWJpIGlzIG5vdyBhbiBvYmplY3QsIG5vdCBhbiBhcnJheSwgYW5kIGluZGV4ZWQgYnkgdGhlc2Ugc2lnbmF0dXJlc1xuICAgICAqL1xuICAgIGNvbnRleHRzOiBjcmVhdGVMZWFmKFtldm0uaW5mby5jb250ZXh0c10sIGNvbnRleHRzID0+XG4gICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICB7fSxcbiAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhjb250ZXh0cylcbiAgICAgICAgICAuZmlsdGVyKGNvbnRleHQgPT4gIWNvbnRleHQuaXNDb25zdHJ1Y3RvcilcbiAgICAgICAgICAubWFwKGNvbnRleHQgPT4gKHtcbiAgICAgICAgICAgIFtjb250ZXh0LmNvbnRleHRdOiBkZWJ1Z2dlckNvbnRleHRUb0RlY29kZXJDb250ZXh0KGNvbnRleHQpXG4gICAgICAgICAgfSkpXG4gICAgICApXG4gICAgKVxuICB9LFxuXG4gIC8qKlxuICAgKiBkYXRhLmluZm9cbiAgICovXG4gIGluZm86IHtcbiAgICAvKipcbiAgICAgKiBkYXRhLmluZm8uc2NvcGVzIChuYW1lc3BhY2UpXG4gICAgICovXG4gICAgc2NvcGVzOiB7XG4gICAgICAvKipcbiAgICAgICAqIGRhdGEuaW5mby5zY29wZXMgKHNlbGVjdG9yKVxuICAgICAgICogdGhlIHJhdyB2ZXJzaW9uIGlzIGJlbG93OyB0aGlzIHZlcnNpb24gYWNjb3VudHMgZm9yIGluaGVyaXRhbmNlXG4gICAgICAgKiBOT1RFOiBkb2Vzbid0IHRoaXMgc2VsZWN0b3IgcmVhbGx5IGJlbG9uZyBpbiBkYXRhLnZpZXdzPyAgWWVzLlxuICAgICAgICogQnV0LCBzaW5jZSBpdCdzIHJlcGxhY2luZyB0aGUgb2xkIGRhdGEuaW5mby5zY29wZXMgKHdoaWNoIGlzIG5vd1xuICAgICAgICogZGF0YS5pbmZvLnNjb3Blcy5yYXcpLCBJIGRpZG4ndCB3YW50IHRvIG1vdmUgaXQuXG4gICAgICAgKi9cbiAgICAgIF86IGNyZWF0ZUxlYWYoW1wiLi9yYXdcIiwgXCIvdmlld3Mvc2NvcGVzL2lubGluZWQvcmF3XCJdLCAoc2NvcGVzLCBpbmxpbmVkKSA9PlxuICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIC4uLk9iamVjdC5lbnRyaWVzKHNjb3BlcykubWFwKChbaWQsIHNjb3BlXSkgPT4ge1xuICAgICAgICAgICAgbGV0IGRlZmluaXRpb24gPSBpbmxpbmVkW2lkXS5kZWZpbml0aW9uO1xuICAgICAgICAgICAgaWYgKGRlZmluaXRpb24ubm9kZVR5cGUgIT09IFwiQ29udHJhY3REZWZpbml0aW9uXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgW2lkXTogc2NvcGUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgd2UndmUgcmVhY2hlZCB0aGlzIHBvaW50LCB3ZSBzaG91bGQgYmUgZGVhbGluZyB3aXRoIGFcbiAgICAgICAgICAgIC8vY29udHJhY3QsIGFuZCBzcGVjaWZpY2FsbHkgYSBjb250cmFjdCAtLSBub3QgYW4gaW50ZXJmYWNlIG9yXG4gICAgICAgICAgICAvL2xpYnJhcnkgKHRob3NlIGRvbid0IGdldCBcInZhcmlhYmxlc1wiIGVudHJpZXMgaW4gdGhlaXIgc2NvcGVzKVxuICAgICAgICAgICAgZGVidWcoXCJjb250cmFjdCBpZCAlZFwiLCBpZCk7XG4gICAgICAgICAgICBsZXQgbmV3U2NvcGUgPSB7IC4uLnNjb3BlIH07XG4gICAgICAgICAgICAvL25vdGUgdGhhdCBTb2xpZGl0eSBnaXZlcyB1cyB0aGUgbGluZWFyaXphdGlvbiBpbiBvcmRlciBmcm9tIG1vc3RcbiAgICAgICAgICAgIC8vZGVyaXZlZCB0byBtb3N0IGJhc2UsIGJ1dCB3ZSB3YW50IG1vc3QgYmFzZSB0byBtb3N0IGRlcml2ZWQ7XG4gICAgICAgICAgICAvL2Fubm95aW5nbHksIHJldmVyc2UoKSBpcyBpbi1wbGFjZSwgc28gd2UgY2xvbmUgd2l0aCBzbGljZSgpIGZpcnN0XG4gICAgICAgICAgICBsZXQgbGluZWFyaXplZEJhc2VDb250cmFjdHNGcm9tQmFzZSA9IGRlZmluaXRpb24ubGluZWFyaXplZEJhc2VDb250cmFjdHNcbiAgICAgICAgICAgICAgLnNsaWNlKClcbiAgICAgICAgICAgICAgLnJldmVyc2UoKTtcbiAgICAgICAgICAgIC8vbm93LCB3ZSBwdXQgaXQgYWxsIHRvZ2V0aGVyXG4gICAgICAgICAgICBuZXdTY29wZS52YXJpYWJsZXMgPSBbXVxuICAgICAgICAgICAgICAuY29uY2F0KFxuICAgICAgICAgICAgICAgIC4uLmxpbmVhcml6ZWRCYXNlQ29udHJhY3RzRnJvbUJhc2UubWFwKFxuICAgICAgICAgICAgICAgICAgY29udHJhY3RJZCA9PiBzY29wZXNbY29udHJhY3RJZF0udmFyaWFibGVzIHx8IFtdXG4gICAgICAgICAgICAgICAgICAvL3dlIG5lZWQgdGhlIHx8IFtdIGJlY2F1c2UgY29udHJhY3RzIHdpdGggbm8gc3RhdGUgdmFyaWFibGVzXG4gICAgICAgICAgICAgICAgICAvL2hhdmUgdmFyaWFibGVzIHVuZGVmaW5lZCByYXRoZXIgdGhhbiBlbXB0eSBsaWtlIHlvdSdkIGV4cGVjdFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAuZmlsdGVyKHZhcmlhYmxlID0+IHtcbiAgICAgICAgICAgICAgICAvLy4uLmV4Y2VwdCwgSEFDSywgbGV0J3MgZmlsdGVyIG91dCB0aG9zZSBjb25zdGFudHMgd2UgZG9uJ3Qga25vd1xuICAgICAgICAgICAgICAgIC8vaG93IHRvIHJlYWQuICB0aGV5J2xsIGp1c3QgY2x1dHRlciB0aGluZ3MgdXAuXG4gICAgICAgICAgICAgICAgZGVidWcoXCJ2YXJpYWJsZSAlT1wiLCB2YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgbGV0IGRlZmluaXRpb24gPSBpbmxpbmVkW3ZhcmlhYmxlLmlkXS5kZWZpbml0aW9uO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAhZGVmaW5pdGlvbi5jb25zdGFudCB8fFxuICAgICAgICAgICAgICAgICAgRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5pc1NpbXBsZUNvbnN0YW50KGRlZmluaXRpb24udmFsdWUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IFtpZF06IG5ld1Njb3BlIH07XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKSxcblxuICAgICAgLypcbiAgICAgICAqIGRhdGEuaW5mby5zY29wZXMucmF3XG4gICAgICAgKi9cbiAgICAgIHJhdzogY3JlYXRlTGVhZihbXCIvc3RhdGVcIl0sIHN0YXRlID0+IHN0YXRlLmluZm8uc2NvcGVzLmJ5SWQpXG4gICAgfSxcblxuICAgIC8qXG4gICAgICogZGF0YS5pbmZvLmFsbG9jYXRpb25zXG4gICAgICovXG4gICAgYWxsb2NhdGlvbnM6IHtcbiAgICAgIC8qXG4gICAgICAgKiBkYXRhLmluZm8uYWxsb2NhdGlvbnMuc3RvcmFnZVxuICAgICAgICovXG4gICAgICBzdG9yYWdlOiBjcmVhdGVMZWFmKFtcIi9zdGF0ZVwiXSwgc3RhdGUgPT4gc3RhdGUuaW5mby5hbGxvY2F0aW9ucy5zdG9yYWdlKSxcblxuICAgICAgLypcbiAgICAgICAqIGRhdGEuaW5mby5hbGxvY2F0aW9ucy5tZW1vcnlcbiAgICAgICAqL1xuICAgICAgbWVtb3J5OiBjcmVhdGVMZWFmKFtcIi9zdGF0ZVwiXSwgc3RhdGUgPT4gc3RhdGUuaW5mby5hbGxvY2F0aW9ucy5tZW1vcnkpLFxuXG4gICAgICAvKlxuICAgICAgICogZGF0YS5pbmZvLmFsbG9jYXRpb25zLmNhbGxkYXRhXG4gICAgICAgKi9cbiAgICAgIGNhbGxkYXRhOiBjcmVhdGVMZWFmKFtcIi9zdGF0ZVwiXSwgc3RhdGUgPT4gc3RhdGUuaW5mby5hbGxvY2F0aW9ucy5jYWxsZGF0YSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZGF0YS5pbmZvLnVzZXJEZWZpbmVkVHlwZXNcbiAgICAgKi9cbiAgICB1c2VyRGVmaW5lZFR5cGVzOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiL3N0YXRlXCJdLFxuICAgICAgc3RhdGUgPT4gc3RhdGUuaW5mby51c2VyRGVmaW5lZFR5cGVzXG4gICAgKVxuICB9LFxuXG4gIC8qKlxuICAgKiBkYXRhLnByb2NcbiAgICovXG4gIHByb2M6IHtcbiAgICAvKipcbiAgICAgKiBkYXRhLnByb2MuYXNzaWdubWVudHNcbiAgICAgKi9cbiAgICBhc3NpZ25tZW50czogY3JlYXRlTGVhZihcbiAgICAgIFtcIi9zdGF0ZVwiXSxcbiAgICAgIHN0YXRlID0+IHN0YXRlLnByb2MuYXNzaWdubWVudHNcbiAgICAgIC8vbm90ZTogdGhpcyBubyBsb25nZXIgZmV0Y2hlcyBqdXN0IHRoZSBieUlkLCBidXQgcmF0aGVyIHRoZSB3aG9sZVxuICAgICAgLy9hc3NpZ25tZW50cyBvYmplY3RcbiAgICApLFxuXG4gICAgLypcbiAgICAgKiBkYXRhLnByb2MubWFwcGVkUGF0aHNcbiAgICAgKi9cbiAgICBtYXBwZWRQYXRoczogY3JlYXRlTGVhZihbXCIvc3RhdGVcIl0sIHN0YXRlID0+IHN0YXRlLnByb2MubWFwcGVkUGF0aHMpLFxuXG4gICAgLyoqXG4gICAgICogZGF0YS5wcm9jLmRlY29kaW5nS2V5c1xuICAgICAqXG4gICAgICogbnVtYmVyIG9mIGtleXMgdGhhdCBhcmUgc3RpbGwgZGVjb2RpbmdcbiAgICAgKi9cbiAgICBkZWNvZGluZ0tleXM6IGNyZWF0ZUxlYWYoXG4gICAgICBbXCIuL21hcHBlZFBhdGhzXCJdLFxuICAgICAgbWFwcGVkUGF0aHMgPT4gbWFwcGVkUGF0aHMuZGVjb2RpbmdTdGFydGVkXG4gICAgKVxuICB9LFxuXG4gIC8qKlxuICAgKiBkYXRhLmN1cnJlbnRcbiAgICovXG4gIGN1cnJlbnQ6IHtcbiAgICAvKipcbiAgICAgKiBkYXRhLmN1cnJlbnQuc3RhdGVcbiAgICAgKi9cbiAgICBzdGF0ZToge1xuICAgICAgLyoqXG4gICAgICAgKiBkYXRhLmN1cnJlbnQuc3RhdGUuc3RhY2tcbiAgICAgICAqL1xuICAgICAgc3RhY2s6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtldm0uY3VycmVudC5zdGF0ZS5zdGFja10sXG5cbiAgICAgICAgd29yZHMgPT4gKHdvcmRzIHx8IFtdKS5tYXAod29yZCA9PiBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQnl0ZXMod29yZCkpXG4gICAgICApLFxuXG4gICAgICAvKipcbiAgICAgICAqIGRhdGEuY3VycmVudC5zdGF0ZS5tZW1vcnlcbiAgICAgICAqL1xuICAgICAgbWVtb3J5OiBjcmVhdGVMZWFmKFxuICAgICAgICBbZXZtLmN1cnJlbnQuc3RhdGUubWVtb3J5XSxcblxuICAgICAgICB3b3JkcyA9PiBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQnl0ZXMod29yZHMuam9pbihcIlwiKSlcbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogZGF0YS5jdXJyZW50LnN0YXRlLmNhbGxkYXRhXG4gICAgICAgKi9cbiAgICAgIGNhbGxkYXRhOiBjcmVhdGVMZWFmKFxuICAgICAgICBbZXZtLmN1cnJlbnQuY2FsbF0sXG5cbiAgICAgICAgKHsgZGF0YSB9KSA9PiBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQnl0ZXMoZGF0YSlcbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogZGF0YS5jdXJyZW50LnN0YXRlLnN0b3JhZ2VcbiAgICAgICAqL1xuICAgICAgc3RvcmFnZTogY3JlYXRlTGVhZihcbiAgICAgICAgW2V2bS5jdXJyZW50LmNvZGV4LnN0b3JhZ2VdLFxuXG4gICAgICAgIG1hcHBpbmcgPT5cbiAgICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICAuLi5PYmplY3QuZW50cmllcyhtYXBwaW5nKS5tYXAoKFthZGRyZXNzLCB3b3JkXSkgPT4gKHtcbiAgICAgICAgICAgICAgW2AweCR7YWRkcmVzc31gXTogRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0J5dGVzKHdvcmQpXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICApXG4gICAgICApLFxuXG4gICAgICAvKlxuICAgICAgICogZGF0YS5jdXJyZW50LnN0YXRlLnNwZWNpYWxzXG4gICAgICAgKiBJJ3ZlIG5hbWVkIHRoZXNlIGFmdGVyIHRoZSBzb2xpZGl0eSB2YXJpYWJsZXMgdGhleSBjb3JyZXNwb25kIHRvLFxuICAgICAgICogd2hpY2ggYXJlICptb3N0bHkqIHRoZSBzYW1lIGFzIHRoZSBjb3JyZXNwb25kaW5nIEVWTSBvcGNvZGVzXG4gICAgICAgKiAoRldJVzogdGhpcyA9IEFERFJFU1MsIHNlbmRlciA9IENBTExFUiwgdmFsdWUgPSBDQUxMVkFMVUUpXG4gICAgICAgKi9cbiAgICAgIHNwZWNpYWxzOiBjcmVhdGVMZWFmKFxuICAgICAgICBbXCIvY3VycmVudC9hZGRyZXNzXCIsIGV2bS5jdXJyZW50LmNhbGwsIGV2bS50cmFuc2FjdGlvbi5nbG9iYWxzXSxcbiAgICAgICAgKGFkZHJlc3MsIHsgc2VuZGVyLCB2YWx1ZSB9LCB7IHR4LCBibG9jayB9KSA9PiAoe1xuICAgICAgICAgIHRoaXM6IERlY29kZVV0aWxzLkNvbnZlcnNpb24udG9CeXRlcyhhZGRyZXNzKSxcblxuICAgICAgICAgIHNlbmRlcjogRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0J5dGVzKHNlbmRlciksXG5cbiAgICAgICAgICB2YWx1ZTogRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0J5dGVzKHZhbHVlKSxcblxuICAgICAgICAgIC8vbGV0J3MgY3JhY2sgb3BlbiB0aGF0IHR4IGFuZCBibG9jayFcbiAgICAgICAgICAuLi5PYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICAuLi5PYmplY3QuZW50cmllcyh0eCkubWFwKChbdmFyaWFibGUsIHZhbHVlXSkgPT4gKHtcbiAgICAgICAgICAgICAgW3ZhcmlhYmxlXTogRGVjb2RlVXRpbHMuQ29udmVyc2lvbi50b0J5dGVzKHZhbHVlKVxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgKSxcblxuICAgICAgICAgIC4uLk9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgIC4uLk9iamVjdC5lbnRyaWVzKGJsb2NrKS5tYXAoKFt2YXJpYWJsZSwgdmFsdWVdKSA9PiAoe1xuICAgICAgICAgICAgICBbdmFyaWFibGVdOiBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQnl0ZXModmFsdWUpXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRhdGEuY3VycmVudC5ub2RlXG4gICAgICovXG4gICAgbm9kZTogY3JlYXRlTGVhZihbc29saWRpdHkuY3VycmVudC5ub2RlXSwgaWRlbnRpdHkpLFxuXG4gICAgLyoqXG4gICAgICogZGF0YS5jdXJyZW50LnNjb3BlXG4gICAgICogb2xkIGFsaWFzIGZvciBkYXRhLmN1cnJlbnQubm9kZSAoZGVwcmVjYXRlZClcbiAgICAgKi9cbiAgICBzY29wZTogY3JlYXRlTGVhZihbXCIuL25vZGVcIl0sIGlkZW50aXR5KSxcblxuICAgIC8qXG4gICAgICogZGF0YS5jdXJyZW50LmNvbnRyYWN0XG4gICAgICogd2FybmluZzogbWF5IHJldHVybiBudWxsIG9yIHNpbWlsYXIsIGV2ZW4gdGhvdWdoIFNvdXJjZVVuaXQgaXMgaW5jbHVkZWRcbiAgICAgKiBhcyBmYWxsYmFja1xuICAgICAqL1xuICAgIGNvbnRyYWN0OiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9ub2RlXCIsIFwiL3ZpZXdzL3Njb3Blcy9pbmxpbmVkXCJdLFxuICAgICAgKG5vZGUsIHNjb3BlcykgPT4ge1xuICAgICAgICBjb25zdCB0eXBlcyA9IFtcIkNvbnRyYWN0RGVmaW5pdGlvblwiLCBcIlNvdXJjZVVuaXRcIl07XG4gICAgICAgIC8vU291cmNlVW5pdCBpbmNsdWRlZCBhcyBmYWxsYmFja1xuICAgICAgICByZXR1cm4gZmluZEFuY2VzdG9yT2ZUeXBlKG5vZGUsIHR5cGVzLCBzY29wZXMpO1xuICAgICAgfVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBkYXRhLmN1cnJlbnQuZnVuY3Rpb25EZXB0aFxuICAgICAqL1xuXG4gICAgZnVuY3Rpb25EZXB0aDogY3JlYXRlTGVhZihbc29saWRpdHkuY3VycmVudC5mdW5jdGlvbkRlcHRoXSwgaWRlbnRpdHkpLFxuXG4gICAgLyoqXG4gICAgICogZGF0YS5jdXJyZW50LmFkZHJlc3NcbiAgICAgKiBOT1RFOiB0aGlzIGlzIHRoZSBTVE9SQUdFIGFkZHJlc3MgZm9yIHRoZSBjdXJyZW50IGNhbGwsIG5vdCB0aGUgQ09ERVxuICAgICAqIGFkZHJlc3NcbiAgICAgKi9cblxuICAgIGFkZHJlc3M6IGNyZWF0ZUxlYWYoW2V2bS5jdXJyZW50LmNhbGxdLCBjYWxsID0+IGNhbGwuc3RvcmFnZUFkZHJlc3MpLFxuXG4gICAgLypcbiAgICAgKiBkYXRhLmN1cnJlbnQuZnVuY3Rpb25zQnlQcm9ncmFtQ291bnRlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uc0J5UHJvZ3JhbUNvdW50ZXI6IGNyZWF0ZUxlYWYoXG4gICAgICBbc29saWRpdHkuY3VycmVudC5mdW5jdGlvbnNCeVByb2dyYW1Db3VudGVyXSxcbiAgICAgIGZ1bmN0aW9ucyA9PiBmdW5jdGlvbnNcbiAgICApLFxuXG4gICAgLypcbiAgICAgKiBkYXRhLmN1cnJlbnQuY29udGV4dFxuICAgICAqL1xuICAgIGNvbnRleHQ6IGNyZWF0ZUxlYWYoW2V2bS5jdXJyZW50LmNvbnRleHRdLCBkZWJ1Z2dlckNvbnRleHRUb0RlY29kZXJDb250ZXh0KSxcblxuICAgIC8qXG4gICAgICogZGF0YS5jdXJyZW50LmFib3V0VG9Nb2RpZnlcbiAgICAgKiBIQUNLXG4gICAgICogVGhpcyBzZWxlY3RvciBpcyB1c2VkIHRvIGNhdGNoIHRob3NlIHRpbWVzIHdoZW4gd2UgZ28gc3RyYWlnaHQgZnJvbSBhXG4gICAgICogbW9kaWZpZXIgaW52b2NhdGlvbiBpbnRvIHRoZSBtb2RpZmllciBpdHNlbGYsIHNraXBwaW5nIG92ZXIgdGhlXG4gICAgICogZGVmaW5pdGlvbiBub2RlICh0aGlzIGluY2x1ZGVzIGJhc2UgY29uc3RydWN0b3IgY2FsbHMpLiAgU28gaXQgc2hvdWxkXG4gICAgICogcmV0dXJuIHRydWUgd2hlbjpcbiAgICAgKiAxLiB3ZSdyZSBvbiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIGFuIGFyZ3VtZW50IHRvIGEgbW9kaWZpZXJcbiAgICAgKiBpbnZvY2F0aW9uIG9yIGJhc2UgY29uc3RydWN0b3IgY2FsbCwgb3IsIGlmIHNhaWQgYXJndW1lbnQgaXMgYSB0eXBlXG4gICAgICogY29udmVyc2lvbiwgaXRzIGFyZ3VtZW50IChvciBuZXN0ZWQgYXJndW1lbnQpXG4gICAgICogMi4gdGhlIG5leHQgbm9kZSBpcyBub3QgYSBGdW5jdGlvbkRlZmluaXRpb24sIE1vZGlmaWVyRGVmaW5pdGlvbiwgb3JcbiAgICAgKiBpbiB0aGUgc2FtZSBtb2RpZmllciAvIGJhc2UgY29uc3RydWN0b3IgaW52b2NhdGlvblxuICAgICAqL1xuICAgIGFib3V0VG9Nb2RpZnk6IGNyZWF0ZUxlYWYoXG4gICAgICBbXG4gICAgICAgIFwiLi9ub2RlXCIsXG4gICAgICAgIFwiLi9tb2RpZmllckludm9jYXRpb25cIixcbiAgICAgICAgXCIuL21vZGlmaWVyQXJndW1lbnRJbmRleFwiLFxuICAgICAgICBcIi9uZXh0L25vZGVcIixcbiAgICAgICAgXCIvbmV4dC9tb2RpZmllckludm9jYXRpb25cIixcbiAgICAgICAgZXZtLmN1cnJlbnQuc3RlcC5pc0NvbnRleHRDaGFuZ2VcbiAgICAgIF0sXG4gICAgICAobm9kZSwgaW52b2NhdGlvbiwgaW5kZXgsIG5leHQsIG5leHRJbnZvY2F0aW9uLCBpc0NvbnRleHRDaGFuZ2UpID0+IHtcbiAgICAgICAgLy9lbnN1cmU6IGN1cnJlbnQgaW5zdHJ1Y3Rpb24gaXMgbm90IGEgY29udGV4dCBjaGFuZ2UgKGJlY2F1c2UgaWYgaXQgaXNcbiAgICAgICAgLy93ZSBjYW5ub3QgcmVseSBvbiB0aGUgZGF0YS5uZXh0IHNlbGVjdG9ycywgYnV0IGFsc28gaWYgaXQgaXMgd2Uga25vd1xuICAgICAgICAvL3dlJ3JlIG5vdCBhYm91dCB0byBjYWxsIGEgbW9kaWZpZXIgb3IgYmFzZSBjb25zdHJ1Y3RvciEpXG4gICAgICAgIC8vd2UgYWxzbyB3YW50IHRvIHJldHVybiBmYWxzZSBpZiB3ZSBjYW4ndCBmaW5kIHRoaW5ncyBmb3Igd2hhdGV2ZXJcbiAgICAgICAgLy9yZWFzb25cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzQ29udGV4dENoYW5nZSB8fFxuICAgICAgICAgICFub2RlIHx8XG4gICAgICAgICAgIW5leHQgfHxcbiAgICAgICAgICAhaW52b2NhdGlvbiB8fFxuICAgICAgICAgICFuZXh0SW52b2NhdGlvblxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvL2Vuc3VyZTogY3VycmVudCBwb3NpdGlvbiBpcyBpbiBhIE1vZGlmaWVySW52b2NhdGlvbiBvclxuICAgICAgICAvL0luaGVyaXRhbmNlU3BlY2lmaWVyIChyZWNhbGwgdGhhdCBTb3VyY2VVbml0IHdhcyBpbmNsdWRlZCBhc1xuICAgICAgICAvL2ZhbGxiYWNrKVxuICAgICAgICBpZiAoaW52b2NhdGlvbi5ub2RlVHlwZSA9PT0gXCJTb3VyY2VVbml0XCIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvL2Vuc3VyZTogbmV4dCBub2RlIGlzIG5vdCBhIGZ1bmN0aW9uIGRlZmluaXRpb24gb3IgbW9kaWZpZXIgZGVmaW5pdGlvblxuICAgICAgICBpZiAoXG4gICAgICAgICAgbmV4dC5ub2RlVHlwZSA9PT0gXCJGdW5jdGlvbkRlZmluaXRpb25cIiB8fFxuICAgICAgICAgIG5leHQubm9kZVR5cGUgPT09IFwiTW9kaWZpZXJEZWZpbml0aW9uXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9lbnN1cmU6IG5leHQgbm9kZSBpcyBub3QgaW4gdGhlIHNhbWUgaW52b2NhdGlvblxuICAgICAgICBpZiAoXG4gICAgICAgICAgbmV4dEludm9jYXRpb24ubm9kZVR5cGUgIT09IFwiU291cmNlVW5pdFwiICYmXG4gICAgICAgICAgbmV4dEludm9jYXRpb24uaWQgPT09IGludm9jYXRpb24uaWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9ub3c6IGFyZSB3ZSBvbiB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIGFuIGFyZ3VtZW50LCBvciwgaWZcbiAgICAgICAgLy9pdCdzIGEgdHlwZSBjb252ZXJzaW9uLCBpdHMgbmVzdGVkIGFyZ3VtZW50P1xuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXJndW1lbnQgPSBpbnZvY2F0aW9uLmFyZ3VtZW50c1tpbmRleF07XG4gICAgICAgIHdoaWxlIChhcmd1bWVudC5raW5kID09PSBcInR5cGVDb252ZXJzaW9uXCIpIHtcbiAgICAgICAgICBpZiAobm9kZS5pZCA9PT0gYXJndW1lbnQuaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhcmd1bWVudCA9IGFyZ3VtZW50LmFyZ3VtZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5pZCA9PT0gYXJndW1lbnQuaWQ7XG4gICAgICB9XG4gICAgKSxcblxuICAgIC8qXG4gICAgICogZGF0YS5jdXJyZW50Lm1vZGlmaWVySW52b2NhdGlvblxuICAgICAqL1xuICAgIG1vZGlmaWVySW52b2NhdGlvbjogY3JlYXRlTGVhZihcbiAgICAgIFtcIi4vbm9kZVwiLCBcIi92aWV3cy9zY29wZXMvaW5saW5lZFwiXSxcbiAgICAgIChub2RlLCBzY29wZXMpID0+IHtcbiAgICAgICAgY29uc3QgdHlwZXMgPSBbXG4gICAgICAgICAgXCJNb2RpZmllckludm9jYXRpb25cIixcbiAgICAgICAgICBcIkluaGVyaXRhbmNlU3BlY2lmaWVyXCIsXG4gICAgICAgICAgXCJTb3VyY2VVbml0XCJcbiAgICAgICAgXTtcbiAgICAgICAgLy9hZ2FpbiwgU291cmNlVW5pdCBpbmNsdWRlZCBhcyBmYWxsYmFja1xuICAgICAgICByZXR1cm4gZmluZEFuY2VzdG9yT2ZUeXBlKG5vZGUsIHR5cGVzLCBzY29wZXMpO1xuICAgICAgfVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBkYXRhLmN1cnJlbnQubW9kaWZpZXJBcmd1bWVudEluZGV4XG4gICAgICogZ2V0cyB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgbW9kaWZpZXIgYXJndW1lbnQgdGhhdCB5b3UncmUgaW5cbiAgICAgKiAodW5kZWZpbmVkIHdoZW4gbm90IGluIGEgbW9kaWZpZXIgYXJndW1lbnQpXG4gICAgICovXG4gICAgbW9kaWZpZXJBcmd1bWVudEluZGV4OiBjcmVhdGVMZWFmKFxuICAgICAgW1wiL2luZm8vc2NvcGVzXCIsIFwiLi9ub2RlXCIsIFwiLi9tb2RpZmllckludm9jYXRpb25cIl0sXG4gICAgICAoc2NvcGVzLCBub2RlLCBpbnZvY2F0aW9uKSA9PiB7XG4gICAgICAgIGlmIChpbnZvY2F0aW9uLm5vZGVUeXBlID09PSBcIlNvdXJjZVVuaXRcIikge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcG9pbnRlciA9IHNjb3Blc1tub2RlLmlkXS5wb2ludGVyO1xuICAgICAgICBsZXQgaW52b2NhdGlvblBvaW50ZXIgPSBzY29wZXNbaW52b2NhdGlvbi5pZF0ucG9pbnRlcjtcblxuICAgICAgICAvL3NsaWNlIHRoZSBpbnZvY2F0aW9uIHBvaW50ZXIgb2ZmIHRoZSBiZWdpbm5pbmdcbiAgICAgICAgbGV0IGRpZmZlcmVuY2UgPSBwb2ludGVyLnJlcGxhY2UoaW52b2NhdGlvblBvaW50ZXIsIFwiXCIpO1xuICAgICAgICBkZWJ1ZyhcImRpZmZlcmVuY2UgJXNcIiwgZGlmZmVyZW5jZSk7XG4gICAgICAgIGxldCByYXdJbmRleCA9IGRpZmZlcmVuY2UubWF0Y2goL15cXC9hcmd1bWVudHNcXC8oXFxkKykvKTtcbiAgICAgICAgLy9ub3RlIHRoYXQgdGhhdCBcXGQrIGlzIGdyZWVkeVxuICAgICAgICBkZWJ1ZyhcInJhd0luZGV4ICVvXCIsIHJhd0luZGV4KTtcbiAgICAgICAgaWYgKHJhd0luZGV4ID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQocmF3SW5kZXhbMV0pO1xuICAgICAgfVxuICAgICksXG5cbiAgICAvKlxuICAgICAqIGRhdGEuY3VycmVudC5tb2RpZmllckJlaW5nSW52b2tlZFxuICAgICAqIGdldHMgdGhlIG5vZGUgY29ycmVzcG9uZGluZyB0byB0aGUgbW9kaWZpZXIgb3IgYmFzZSBjb25zdHJ1Y3RvclxuICAgICAqIGJlaW5nIGludm9rZWRcbiAgICAgKi9cbiAgICBtb2RpZmllckJlaW5nSW52b2tlZDogY3JlYXRlTGVhZihcbiAgICAgIFtcIi4vbW9kaWZpZXJJbnZvY2F0aW9uXCIsIFwiL3ZpZXdzL3Njb3Blcy9pbmxpbmVkXCJdLFxuICAgICAgKGludm9jYXRpb24sIHNjb3BlcykgPT4ge1xuICAgICAgICBpZiAoIWludm9jYXRpb24gfHwgaW52b2NhdGlvbi5ub2RlVHlwZSA9PT0gXCJTb3VyY2VVbml0XCIpIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vZGlmaWVyRm9ySW52b2NhdGlvbihpbnZvY2F0aW9uLCBzY29wZXMpO1xuICAgICAgfVxuICAgICksXG5cbiAgICAvKipcbiAgICAgKiBkYXRhLmN1cnJlbnQuaWRlbnRpZmllcnMgKG5hbWVzcGFjZSlcbiAgICAgKi9cbiAgICBpZGVudGlmaWVyczoge1xuICAgICAgLyoqXG4gICAgICAgKiBkYXRhLmN1cnJlbnQuaWRlbnRpZmllcnMgKHNlbGVjdG9yKVxuICAgICAgICpcbiAgICAgICAqIHJldHVybnMgaWRlbnRpZmVycyBhbmQgY29ycmVzcG9uZGluZyBkZWZpbml0aW9uIG5vZGUgSUQgb3IgYnVpbHRpbiBuYW1lXG4gICAgICAgKiAob2JqZWN0IGVudHJpZXMgbG9vayBsaWtlIFtuYW1lXToge2FzdElkOiBpZH0gb3IgbGlrZSBbbmFtZV06IHtidWlsdGluOiBuYW1lfVxuICAgICAgICovXG4gICAgICBfOiBjcmVhdGVMZWFmKFxuICAgICAgICBbXCIvdmlld3Mvc2NvcGVzL2lubGluZWRcIiwgXCIvY3VycmVudC9ub2RlXCJdLFxuXG4gICAgICAgIChzY29wZXMsIHNjb3BlKSA9PiB7XG4gICAgICAgICAgbGV0IHZhcmlhYmxlcyA9IHt9O1xuICAgICAgICAgIGlmIChzY29wZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsZXQgY3VyID0gc2NvcGUuaWQ7XG5cbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgdmFyaWFibGVzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgLi4uKHNjb3Blc1tjdXJdLnZhcmlhYmxlcyB8fCBbXSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIodiA9PiB2Lm5hbWUgIT09IFwiXCIpIC8vZXhjbHVkZSBhbm9ueW1vdXMgb3V0cHV0IHBhcmFtc1xuICAgICAgICAgICAgICAgICAgLmZpbHRlcih2ID0+IHZhcmlhYmxlc1t2Lm5hbWVdID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgIC5tYXAodiA9PiAoeyBbdi5uYW1lXTogeyBhc3RJZDogdi5pZCB9IH0pKVxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGN1ciA9IHNjb3Blc1tjdXJdLnBhcmVudElkO1xuICAgICAgICAgICAgfSB3aGlsZSAoY3VyICE9IG51bGwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBidWlsdGlucyA9IHtcbiAgICAgICAgICAgIG1zZzogeyBidWlsdGluOiBcIm1zZ1wiIH0sXG4gICAgICAgICAgICB0eDogeyBidWlsdGluOiBcInR4XCIgfSxcbiAgICAgICAgICAgIGJsb2NrOiB7IGJ1aWx0aW46IFwiYmxvY2tcIiB9LFxuICAgICAgICAgICAgdGhpczogeyBidWlsdGluOiBcInRoaXNcIiB9LFxuICAgICAgICAgICAgbm93OiB7IGJ1aWx0aW46IFwibm93XCIgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4geyAuLi52YXJpYWJsZXMsIC4uLmJ1aWx0aW5zIH07XG4gICAgICAgIH1cbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogZGF0YS5jdXJyZW50LmlkZW50aWZpZXJzLmRlZmluaXRpb25zIChuYW1lc3BhY2UpXG4gICAgICAgKi9cbiAgICAgIGRlZmluaXRpb25zOiB7XG4gICAgICAgIC8qIGRhdGEuY3VycmVudC5pZGVudGlmaWVycy5kZWZpbml0aW9ucyAoc2VsZWN0b3IpXG4gICAgICAgICAqIGRlZmluaXRpb25zIGZvciBjdXJyZW50IHZhcmlhYmxlcywgYnkgaWRlbnRpZmllclxuICAgICAgICAgKi9cbiAgICAgICAgXzogY3JlYXRlTGVhZihcbiAgICAgICAgICBbXCIvdmlld3Mvc2NvcGVzL2lubGluZWRcIiwgXCIuLi9fXCIsIFwiLi90aGlzXCJdLFxuXG4gICAgICAgICAgKHNjb3BlcywgaWRlbnRpZmllcnMsIHRoaXNEZWZpbml0aW9uKSA9PiB7XG4gICAgICAgICAgICBsZXQgdmFyaWFibGVzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgIC4uLk9iamVjdC5lbnRyaWVzKGlkZW50aWZpZXJzKS5tYXAoKFtpZGVudGlmaWVyLCB7IGFzdElkIH1dKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGFzdElkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIC8vd2lsbCBiZSB1bmRlZmluZWQgZm9yIGJ1aWx0aW5zXG4gICAgICAgICAgICAgICAgICBsZXQgeyBkZWZpbml0aW9uIH0gPSBzY29wZXNbYXN0SWRdO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgW2lkZW50aWZpZXJdOiBkZWZpbml0aW9uIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7fTsgLy9za2lwIG92ZXIgYnVpbHRpbnM7IHdlJ2xsIGhhbmRsZSB0aG9zZSBzZXBhcmF0ZWx5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBidWlsdGlucyA9IHtcbiAgICAgICAgICAgICAgbXNnOiBEZWNvZGVVdGlscy5EZWZpbml0aW9uLk1TR19ERUZJTklUSU9OLFxuICAgICAgICAgICAgICB0eDogRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5UWF9ERUZJTklUSU9OLFxuICAgICAgICAgICAgICBibG9jazogRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5CTE9DS19ERUZJTklUSU9OLFxuICAgICAgICAgICAgICBub3c6IERlY29kZVV0aWxzLkRlZmluaXRpb24uc3Bvb2ZVaW50RGVmaW5pdGlvbihcIm5vd1wiKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vb25seSBpbmNsdWRlIHRoaXMgd2hlbiBpdCBoYXMgYSBwcm9wZXIgZGVmaW5pdGlvblxuICAgICAgICAgICAgaWYgKHRoaXNEZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgIGJ1aWx0aW5zLnRoaXMgPSB0aGlzRGVmaW5pdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IC4uLnZhcmlhYmxlcywgLi4uYnVpbHRpbnMgfTtcbiAgICAgICAgICB9XG4gICAgICAgICksXG5cbiAgICAgICAgLypcbiAgICAgICAgICogZGF0YS5jdXJyZW50LmlkZW50aWZpZXJzLmRlZmluaXRpb25zLnRoaXNcbiAgICAgICAgICpcbiAgICAgICAgICogcmV0dXJucyBhIHNwb29mZWQgZGVmaW5pdGlvbiBmb3IgdGhlIHRoaXMgdmFyaWFibGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXM6IGNyZWF0ZUxlYWYoXG4gICAgICAgICAgW1wiL2N1cnJlbnQvY29udHJhY3RcIl0sXG4gICAgICAgICAgY29udHJhY3ROb2RlID0+XG4gICAgICAgICAgICBjb250cmFjdE5vZGUgJiYgY29udHJhY3ROb2RlLm5vZGVUeXBlID09PSBcIkNvbnRyYWN0RGVmaW5pdGlvblwiXG4gICAgICAgICAgICAgID8gRGVjb2RlVXRpbHMuRGVmaW5pdGlvbi5zcG9vZlRoaXNEZWZpbml0aW9uKFxuICAgICAgICAgICAgICAgICAgY29udHJhY3ROb2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgICBjb250cmFjdE5vZGUuaWRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICApXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIGRhdGEuY3VycmVudC5pZGVudGlmaWVycy5yZWZzXG4gICAgICAgKlxuICAgICAgICogY3VycmVudCB2YXJpYWJsZXMnIHZhbHVlIHJlZnNcbiAgICAgICAqL1xuICAgICAgcmVmczogY3JlYXRlTGVhZihcbiAgICAgICAgW1xuICAgICAgICAgIFwiL3Byb2MvYXNzaWdubWVudHNcIixcbiAgICAgICAgICBcIi4vX1wiLFxuICAgICAgICAgIFwiL2N1cnJlbnQvZnVuY3Rpb25EZXB0aFwiLCAvL2ZvciBwcnVuaW5nIHRoaW5ncyB0b28gZGVlcCBvbiBzdGFja1xuICAgICAgICAgIFwiL2N1cnJlbnQvYWRkcmVzc1wiIC8vZm9yIGNvbnRyYWN0IHZhcmlhYmxlc1xuICAgICAgICBdLFxuXG4gICAgICAgIChhc3NpZ25tZW50cywgaWRlbnRpZmllcnMsIGN1cnJlbnREZXB0aCwgYWRkcmVzcykgPT5cbiAgICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICAuLi5PYmplY3QuZW50cmllcyhpZGVudGlmaWVycykubWFwKFxuICAgICAgICAgICAgICAoW2lkZW50aWZpZXIsIHsgYXN0SWQsIGJ1aWx0aW4gfV0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaWQ7XG5cbiAgICAgICAgICAgICAgICAvL2lzIHRoaXMgYW4gb3JkaW5hcnkgdmFyaWFibGUgb3IgYSBidWlsdGluP1xuICAgICAgICAgICAgICAgIGlmIChhc3RJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAvL2lmIG5vdCBhIGJ1aWx0aW4sIGZpcnN0IGNoZWNrIGlmIGl0J3MgYSBjb250cmFjdCB2YXJcbiAgICAgICAgICAgICAgICAgIGxldCBtYXRjaElkcyA9IChhc3NpZ25tZW50cy5ieUFzdElkW2FzdElkXSB8fCBbXSkuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICBpZEhhc2ggPT4gYXNzaWdubWVudHMuYnlJZFtpZEhhc2hdLmFkZHJlc3MgPT09IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBpZiAobWF0Y2hJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZCA9IG1hdGNoSWRzWzBdOyAvL3RoZXJlIHNob3VsZCBvbmx5IGJlIG9uZSFcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgLy9pZiBub3QgY29udHJhY3QsIGl0J3MgbG9jYWwsIHNvIGZpbmQgdGhlIGlubmVybW9zdFxuICAgICAgICAgICAgICAgICAgLy8oYnV0IG5vdCBiZXlvbmQgY3VycmVudCBkZXB0aClcbiAgICAgICAgICAgICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaEZyYW1lcyA9IChhc3NpZ25tZW50cy5ieUFzdElkW2FzdElkXSB8fCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAubWFwKGlkID0+IGFzc2lnbm1lbnRzLmJ5SWRbaWRdLnN0YWNrZnJhbWUpXG4gICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihzdGFja2ZyYW1lID0+IHN0YWNrZnJhbWUgIT09IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoRnJhbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMgY2hlY2sgaXNuJ3QgKnJlYWxseSpcbiAgICAgICAgICAgICAgICAgICAgICAvL25lY2Vzc2FyeSwgYnV0IG1heSBhcyB3ZWxsIHByZXZlbnQgc3R1cGlkIHN0dWZmXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IG1heE1hdGNoID0gTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGVwdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heCguLi5tYXRjaEZyYW1lcylcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgIGlkID0gc3RhYmxlS2VjY2FrMjU2KHsgYXN0SWQsIHN0YWNrZnJhbWU6IG1heE1hdGNoIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vb3RoZXJ3aXNlLCBpdCdzIGEgYnVpbHRpblxuICAgICAgICAgICAgICAgICAgLy9OT1RFOiBmb3Igbm93IHdlIGFzc3VtZSB0aGVyZSBpcyBvbmx5IG9uZSBhc3NpZ25tZW50IHBlclxuICAgICAgICAgICAgICAgICAgLy9idWlsdGluLCBidXQgdGhpcyB3aWxsIGNoYW5nZSBpbiB0aGUgZnV0dXJlXG4gICAgICAgICAgICAgICAgICBpZCA9IGFzc2lnbm1lbnRzLmJ5QnVpbHRpbltidWlsdGluXVswXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL2lmIHdlIHN0aWxsIGRpZG4ndCBmaW5kIGl0LCBvaCB3ZWxsXG5cbiAgICAgICAgICAgICAgICBsZXQgeyByZWYgfSA9IGFzc2lnbm1lbnRzLmJ5SWRbaWRdIHx8IHt9O1xuICAgICAgICAgICAgICAgIGlmICghcmVmKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBbaWRlbnRpZmllcl06IHJlZlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBkYXRhLm5leHRcbiAgICovXG4gIG5leHQ6IHtcbiAgICAvKipcbiAgICAgKiBkYXRhLm5leHQuc3RhdGVcbiAgICAgKiBZZXMsIEknbSBqdXN0IHJlcGVhdGluZyB0aGUgY29kZSBmb3IgZGF0YS5jdXJyZW50LnN0YXRlLnN0YWNrIGhlcmU7XG4gICAgICogbm90IHdvcnRoIHRoZSB0cm91YmxlIHRvIGZhY3RvciBvdXRcbiAgICAgKi9cbiAgICBzdGF0ZToge1xuICAgICAgLyoqXG4gICAgICAgKiBkYXRhLm5leHQuc3RhdGUuc3RhY2tcbiAgICAgICAqL1xuICAgICAgc3RhY2s6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtldm0ubmV4dC5zdGF0ZS5zdGFja10sXG5cbiAgICAgICAgd29yZHMgPT4gKHdvcmRzIHx8IFtdKS5tYXAod29yZCA9PiBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQnl0ZXMod29yZCkpXG4gICAgICApXG4gICAgfSxcblxuICAgIC8vSEFDSyBXQVJOSU5HXG4gICAgLy90aGUgZm9sbG93aW5nIHNlbGVjdG9ycyBkZXBlbmQgb24gc29saWRpdHkubmV4dFxuICAgIC8vZG8gbm90IHVzZSB0aGVtIHdoZW4gdGhlIGN1cnJlbnQgaW5zdHJ1Y3Rpb24gaXMgYSBjb250ZXh0IGNoYW5nZSFcblxuICAgIC8qKlxuICAgICAqIGRhdGEubmV4dC5ub2RlXG4gICAgICovXG4gICAgbm9kZTogY3JlYXRlTGVhZihbc29saWRpdHkubmV4dC5ub2RlXSwgaWRlbnRpdHkpLFxuXG4gICAgLyoqXG4gICAgICogZGF0YS5uZXh0Lm1vZGlmaWVySW52b2NhdGlvblxuICAgICAqIE5vdGU6IHllcywgSSdtIGp1c3QgcmVwZWF0aW5nIHRoZSBjb2RlIGZyb20gZGF0YS5jdXJyZW50IGhlcmUgYnV0IHdpdGhcbiAgICAgKiBpbnZhbGlkIGFkZGVkXG4gICAgICovXG4gICAgbW9kaWZpZXJJbnZvY2F0aW9uOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9ub2RlXCIsIFwiL3ZpZXdzL3Njb3Blcy9pbmxpbmVkXCIsIGV2bS5jdXJyZW50LnN0ZXAuaXNDb250ZXh0Q2hhbmdlXSxcbiAgICAgIChub2RlLCBzY29wZXMsIGludmFsaWQpID0+IHtcbiAgICAgICAgLy9kb24ndCBhdHRlbXB0IHRoaXMgYXQgYSBjb250ZXh0IGNoYW5nZSFcbiAgICAgICAgLy8oYWxzbyBkb24ndCBhdHRlbXB0IHRoaXMgaWYgd2UgY2FuJ3QgZmluZCB0aGUgbm9kZSBmb3Igd2hhdGV2ZXJcbiAgICAgICAgLy9yZWFzb24pXG4gICAgICAgIGlmIChpbnZhbGlkIHx8ICFub2RlKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0eXBlcyA9IFtcbiAgICAgICAgICBcIk1vZGlmaWVySW52b2NhdGlvblwiLFxuICAgICAgICAgIFwiSW5oZXJpdGFuY2VTcGVjaWZpZXJcIixcbiAgICAgICAgICBcIlNvdXJjZVVuaXRcIlxuICAgICAgICBdO1xuICAgICAgICAvL2FnYWluLCBTb3VyY2VVbml0IGluY2x1ZGVkIGFzIGZhbGxiYWNrXG4gICAgICAgIHJldHVybiBmaW5kQW5jZXN0b3JPZlR5cGUobm9kZSwgdHlwZXMsIHNjb3Blcyk7XG4gICAgICB9XG4gICAgKSxcblxuICAgIC8qXG4gICAgICogZGF0YS5uZXh0Lm1vZGlmaWVyQmVpbmdJbnZva2VkXG4gICAgICovXG4gICAgbW9kaWZpZXJCZWluZ0ludm9rZWQ6IGNyZWF0ZUxlYWYoXG4gICAgICBbXG4gICAgICAgIFwiLi9tb2RpZmllckludm9jYXRpb25cIixcbiAgICAgICAgXCIvdmlld3Mvc2NvcGVzL2lubGluZWRcIixcbiAgICAgICAgZXZtLmN1cnJlbnQuc3RlcC5pc0NvbnRleHRDaGFuZ2VcbiAgICAgIF0sXG4gICAgICAoaW52b2NhdGlvbiwgc2NvcGVzLCBpbnZhbGlkKSA9PiB7XG4gICAgICAgIGlmIChpbnZhbGlkIHx8ICFpbnZvY2F0aW9uIHx8IGludm9jYXRpb24ubm9kZVR5cGUgPT09IFwiU291cmNlVW5pdFwiKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2RpZmllckZvckludm9jYXRpb24oaW52b2NhdGlvbiwgc2NvcGVzKTtcbiAgICAgIH1cbiAgICApXG4gICAgLy9FTkQgSEFDSyBXQVJOSU5HXG4gIH0sXG5cbiAgLyoqXG4gICAqIGRhdGEubmV4dE1hcHBlZFxuICAgKi9cbiAgbmV4dE1hcHBlZDoge1xuICAgIC8qKlxuICAgICAqIGRhdGEubmV4dE1hcHBlZC5zdGF0ZVxuICAgICAqIFllcywgSSdtIGp1c3QgcmVwZWF0aW5nIHRoZSBjb2RlIGZvciBkYXRhLmN1cnJlbnQuc3RhdGUuc3RhY2sgaGVyZTtcbiAgICAgKiBub3Qgd29ydGggdGhlIHRyb3VibGUgdG8gZmFjdG9yIG91dFxuICAgICAqIEhBQ0s6IHRoaXMgYXNzdW1lcyB3ZSdyZSBub3QgYWJvdXQgdG8gY2hhbmdlIGNvbnRleHQhIGRvbid0IHVzZSB0aGlzIGlmIHdlXG4gICAgICogYXJlIVxuICAgICAqL1xuICAgIHN0YXRlOiB7XG4gICAgICAvKipcbiAgICAgICAqIGRhdGEubmV4dE1hcHBlZC5zdGF0ZS5zdGFja1xuICAgICAgICovXG4gICAgICBzdGFjazogY3JlYXRlTGVhZihcbiAgICAgICAgW3NvbGlkaXR5LmN1cnJlbnQubmV4dE1hcHBlZF0sXG5cbiAgICAgICAgc3RlcCA9PlxuICAgICAgICAgICgoc3RlcCB8fCB7fSkuc3RhY2sgfHwgW10pLm1hcCh3b3JkID0+XG4gICAgICAgICAgICBEZWNvZGVVdGlscy5Db252ZXJzaW9uLnRvQnl0ZXMod29yZClcbiAgICAgICAgICApXG4gICAgICApXG4gICAgfVxuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGF0YTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvZGF0YS9zZWxlY3RvcnMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29uLXBvaW50ZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJqc29uLXBvaW50ZXJcIlxuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3NldFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9zZXRcIlxuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOmV2bTpzYWdhc1wiKTtcblxuaW1wb3J0IHsgcHV0LCB0YWtlRXZlcnksIHNlbGVjdCB9IGZyb20gXCJyZWR1eC1zYWdhL2VmZmVjdHNcIjtcbmltcG9ydCB7IHByZWZpeE5hbWUsIGtlY2NhazI1NiB9IGZyb20gXCJsaWIvaGVscGVyc1wiO1xuXG5pbXBvcnQgeyBUSUNLIH0gZnJvbSBcImxpYi90cmFjZS9hY3Rpb25zXCI7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zXCI7XG5cbmltcG9ydCBldm0gZnJvbSBcIi4uL3NlbGVjdG9yc1wiO1xuXG5pbXBvcnQgKiBhcyB0cmFjZSBmcm9tIFwibGliL3RyYWNlL3NhZ2FzXCI7XG5cbi8qKlxuICogQWRkcyBFVk0gYnl0ZWNvZGUgY29udGV4dFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gSUQgKDB4LXByZWZpeGVkIGtlY2NhayBvZiBiaW5hcnkpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiogYWRkQ29udGV4dChjb250ZXh0KSB7XG4gIGNvbnN0IGNvbnRleHRIYXNoID0ga2VjY2FrMjU2KHsgdHlwZTogXCJzdHJpbmdcIiwgdmFsdWU6IGNvbnRleHQuYmluYXJ5IH0pO1xuICAvL05PVEU6IHdlIHRha2UgaGFzaCBhcyAqc3RyaW5nKiwgbm90IGFzIGJ5dGVzLCBiZWNhdXNlIHRoZSBiaW5hcnkgbWF5XG4gIC8vY29udGFpbiBsaW5rIHJlZmVyZW5jZXMhXG5cbiAgZGVidWcoXCJjb250ZXh0ICVPXCIsIGNvbnRleHQpO1xuICB5aWVsZCBwdXQoYWN0aW9ucy5hZGRDb250ZXh0KGNvbnRleHQpKTtcblxuICByZXR1cm4gY29udGV4dEhhc2g7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogbm9ybWFsaXplQ29udGV4dHMoKSB7XG4gIHlpZWxkIHB1dChhY3Rpb25zLm5vcm1hbGl6ZUNvbnRleHRzKCkpO1xufVxuXG4vKipcbiAqIEFkZHMga25vd24gZGVwbG95ZWQgaW5zdGFuY2Ugb2YgYmluYXJ5IGF0IGFkZHJlc3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmluYXJ5IC0gbWF5IGJlIHVuZGVmaW5lZCAoZS5nLiBwcmVjb21waWxlcylcbiAqIEByZXR1cm4ge3N0cmluZ30gSUQgKDB4LXByZWZpeGVkIGtlY2NhayBvZiBiaW5hcnkpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiogYWRkSW5zdGFuY2UoYWRkcmVzcywgYmluYXJ5KSB7XG4gIGxldCBzZWFyY2ggPSB5aWVsZCBzZWxlY3QoZXZtLmluZm8uYmluYXJpZXMuc2VhcmNoKTtcbiAgbGV0IGNvbnRleHQgPSBzZWFyY2goYmluYXJ5KTtcblxuICAvLyBpbiBjYXNlIGJpbmFyeSBpcyB1bmtub3duLCBhZGQgYSBjb250ZXh0IGZvciBpdFxuICBpZiAoY29udGV4dCA9PT0gbnVsbCkge1xuICAgIGNvbnRleHQgPSB5aWVsZCogYWRkQ29udGV4dCh7XG4gICAgICBiaW5hcnksXG4gICAgICBpc0NvbnN0cnVjdG9yOiBmYWxzZVxuICAgICAgLy9hZGRJbnN0YW5jZSBpcyBvbmx5IHVzZWQgZm9yIGFkZGluZyBkZXBsb3llZCBpbnN0YW5jZXMsIHNvIGl0IHdpbGxcbiAgICAgIC8vbmV2ZXIgYmUgYSBjb25zdHJ1Y3RvclxuICAgIH0pO1xuICB9XG5cbiAgLy9ub3csIHdoZXRoZXIgd2UgbmVlZGVkIGEgbmV3IGNvbnRleHQgb3Igbm90LCBhZGQgdGhlIGluc3RhbmNlXG4gIHlpZWxkIHB1dChhY3Rpb25zLmFkZEluc3RhbmNlKGFkZHJlc3MsIGNvbnRleHQsIGJpbmFyeSkpO1xuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGJlZ2luKHtcbiAgYWRkcmVzcyxcbiAgYmluYXJ5LFxuICBkYXRhLFxuICBzdG9yYWdlQWRkcmVzcyxcbiAgc2VuZGVyLFxuICB2YWx1ZSxcbiAgZ2FzcHJpY2UsXG4gIGJsb2NrXG59KSB7XG4gIHlpZWxkIHB1dChhY3Rpb25zLnNhdmVHbG9iYWxzKHNlbmRlciwgZ2FzcHJpY2UsIGJsb2NrKSk7XG4gIGlmIChhZGRyZXNzKSB7XG4gICAgeWllbGQgcHV0KGFjdGlvbnMuY2FsbChhZGRyZXNzLCBkYXRhLCBzdG9yYWdlQWRkcmVzcywgc2VuZGVyLCB2YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIHlpZWxkIHB1dChhY3Rpb25zLmNyZWF0ZShiaW5hcnksIHN0b3JhZ2VBZGRyZXNzLCBzZW5kZXIsIHZhbHVlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24qIHRpY2tTYWdhKCkge1xuICBkZWJ1ZyhcImdvdCBUSUNLXCIpO1xuXG4gIHlpZWxkKiBjYWxsc3RhY2tBbmRDb2RleFNhZ2EoKTtcbiAgeWllbGQqIHRyYWNlLnNpZ25hbFRpY2tTYWdhQ29tcGxldGlvbigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGNhbGxzdGFja0FuZENvZGV4U2FnYSgpIHtcbiAgaWYgKHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5zdGVwLmlzRXhjZXB0aW9uYWxIYWx0aW5nKSkge1xuICAgIC8vbGV0J3MgaGFuZGxlIHRoaXMgY2FzZSBmaXJzdCBzbyB3ZSBjYW4gYmUgc3VyZSBldmVyeXRoaW5nIGVsc2UgaXMgKm5vdCpcbiAgICAvL2FuIGV4Y2VwdGlvbmFsIGhhbHRcbiAgICBkZWJ1ZyhcImV4Y2VwdGlvbmFsIGhhbHQhXCIpO1xuXG4gICAgeWllbGQgcHV0KGFjdGlvbnMuZmFpbCgpKTtcbiAgfSBlbHNlIGlmICh5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuc3RlcC5pc0NhbGwpKSB7XG4gICAgZGVidWcoXCJnb3QgY2FsbFwiKTtcbiAgICAvLyBpZiB0aGVyZSBpcyBubyBiaW5hcnkgKGUuZy4gaW4gdGhlIGNhc2Ugb2YgcHJlY29tcGlsZWQgY29udHJhY3RzIG9yXG4gICAgLy8gZXh0ZXJuYWxseSBvd25lZCBhY2NvdW50cyksIHRoZW4gdGhlcmUgd2lsbCBiZSBubyB0cmFjZSBzdGVwcyBmb3IgdGhlXG4gICAgLy8gY2FsbGVkIGNvZGUsIGFuZCBzbyB3ZSBzaG91bGRuJ3QgdGVsbCB0aGUgZGVidWdnZXIgdGhhdCB3ZSdyZSBlbnRlcmluZ1xuICAgIC8vIGFub3RoZXIgZXhlY3V0aW9uIGNvbnRleHRcbiAgICBpZiAoeWllbGQgc2VsZWN0KGV2bS5jdXJyZW50LnN0ZXAuY2FsbHNQcmVjb21waWxlT3JFeHRlcm5hbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgYWRkcmVzcyA9IHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5zdGVwLmNhbGxBZGRyZXNzKTtcbiAgICBsZXQgZGF0YSA9IHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5zdGVwLmNhbGxEYXRhKTtcblxuICAgIGRlYnVnKFwiY2FsbGluZyBhZGRyZXNzICVzXCIsIGFkZHJlc3MpO1xuXG4gICAgaWYgKHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5zdGVwLmlzRGVsZWdhdGVDYWxsU3RyaWN0KSkge1xuICAgICAgLy9pZiBkZWxlZ2F0aW5nLCBsZWF2ZSBzdG9yYWdlQWRkcmVzcywgc2VuZGVyLCBhbmQgdmFsdWUgdGhlIHNhbWVcbiAgICAgIGxldCB7IHN0b3JhZ2VBZGRyZXNzLCBzZW5kZXIsIHZhbHVlIH0gPSB5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuY2FsbCk7XG4gICAgICB5aWVsZCBwdXQoYWN0aW9ucy5jYWxsKGFkZHJlc3MsIGRhdGEsIHN0b3JhZ2VBZGRyZXNzLCBzZW5kZXIsIHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vdGhpcyBicmFuY2ggY292ZXJzIENBTEwsIENBTExDT0RFLCBhbmQgU1RBVElDQ0FMTFxuICAgICAgbGV0IGN1cnJlbnRDYWxsID0geWllbGQgc2VsZWN0KGV2bS5jdXJyZW50LmNhbGwpO1xuICAgICAgbGV0IHN0b3JhZ2VBZGRyZXNzID0gKHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5zdGVwLmlzRGVsZWdhdGVDYWxsQnJvYWQpKVxuICAgICAgICA/IGN1cnJlbnRDYWxsLnN0b3JhZ2VBZGRyZXNzIC8vZm9yIENBTExDT0RFXG4gICAgICAgIDogYWRkcmVzcztcbiAgICAgIGxldCBzZW5kZXIgPSBjdXJyZW50Q2FsbC5zdG9yYWdlQWRkcmVzczsgLy9ub3QgdGhlIGNvZGUgYWRkcmVzcyFcbiAgICAgIGxldCB2YWx1ZSA9IHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5zdGVwLmNhbGxWYWx1ZSk7IC8vMCBpZiBzdGF0aWNcbiAgICAgIHlpZWxkIHB1dChhY3Rpb25zLmNhbGwoYWRkcmVzcywgZGF0YSwgc3RvcmFnZUFkZHJlc3MsIHNlbmRlciwgdmFsdWUpKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoeWllbGQgc2VsZWN0KGV2bS5jdXJyZW50LnN0ZXAuaXNDcmVhdGUpKSB7XG4gICAgZGVidWcoXCJnb3QgY3JlYXRlXCIpO1xuICAgIGxldCBiaW5hcnkgPSB5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuc3RlcC5jcmVhdGVCaW5hcnkpO1xuICAgIGxldCBjcmVhdGVkQWRkcmVzcyA9IHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5zdGVwLmNyZWF0ZWRBZGRyZXNzKTtcbiAgICBsZXQgdmFsdWUgPSB5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuc3RlcC5jcmVhdGVWYWx1ZSk7XG4gICAgbGV0IHNlbmRlciA9ICh5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuY2FsbCkpLnN0b3JhZ2VBZGRyZXNzO1xuICAgIC8vbm90IHRoZSBjb2RlIGFkZHJlc3MhXG5cbiAgICB5aWVsZCBwdXQoYWN0aW9ucy5jcmVhdGUoYmluYXJ5LCBjcmVhdGVkQWRkcmVzcywgc2VuZGVyLCB2YWx1ZSkpO1xuICAgIC8vYXMgYWJvdmUsIHN0b3JhZ2VBZGRyZXNzIGhhbmRsZXMgd2hlbiBjYWxsaW5nIGZyb20gYSBjcmVhdGlvbiBjYWxsXG4gIH0gZWxzZSBpZiAoeWllbGQgc2VsZWN0KGV2bS5jdXJyZW50LnN0ZXAuaXNIYWx0aW5nKSkge1xuICAgIGRlYnVnKFwiZ290IHJldHVyblwiKTtcblxuICAgIHlpZWxkIHB1dChhY3Rpb25zLnJldHVybkNhbGwoKSk7XG4gIH0gZWxzZSBpZiAoeWllbGQgc2VsZWN0KGV2bS5jdXJyZW50LnN0ZXAudG91Y2hlc1N0b3JhZ2UpKSB7XG4gICAgbGV0IHN0b3JhZ2VBZGRyZXNzID0gKHlpZWxkIHNlbGVjdChldm0uY3VycmVudC5jYWxsKSkuc3RvcmFnZUFkZHJlc3M7XG4gICAgbGV0IHNsb3QgPSB5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuc3RlcC5zdG9yYWdlQWZmZWN0ZWQpO1xuICAgIC8vbm90ZSB3ZSBnZXQgbmV4dCBzdG9yYWdlLCBzaW5jZSB3ZSdyZSB1cGRhdGluZyB0byB0aGF0XG4gICAgbGV0IHN0b3JhZ2UgPSB5aWVsZCBzZWxlY3QoZXZtLm5leHQuc3RhdGUuc3RvcmFnZSk7XG4gICAgLy9ub3JtYWxseSB3ZSdkIG5lZWQgYSAwIGZhbGxiYWNrIGZvciB0aGlzIG5leHQgbGluZSwgYnV0IGluIHRoaXMgY2FzZSB3ZVxuICAgIC8vY2FuIGJlIHN1cmUgdGhlIHZhbHVlIHdpbGwgYmUgdGhlcmUsIHNpbmNlIHdlJ3JlIHRvdWNoaW5nIHRoYXQgc3RvcmFnZVxuICAgIGlmICh5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuc3RlcC5pc1N0b3JlKSkge1xuICAgICAgeWllbGQgcHV0KGFjdGlvbnMuc3RvcmUoc3RvcmFnZUFkZHJlc3MsIHNsb3QsIHN0b3JhZ2Vbc2xvdF0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9vdGhlcndpc2UsIGl0J3MgYSBsb2FkXG4gICAgICB5aWVsZCBwdXQoYWN0aW9ucy5sb2FkKHN0b3JhZ2VBZGRyZXNzLCBzbG90LCBzdG9yYWdlW3Nsb3RdKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogcmVzZXQoKSB7XG4gIGxldCBpbml0aWFsQWRkcmVzcyA9ICh5aWVsZCBzZWxlY3QoZXZtLmN1cnJlbnQuY2FsbHN0YWNrKSlbMF0uc3RvcmFnZUFkZHJlc3M7XG4gIHlpZWxkIHB1dChhY3Rpb25zLnJlc2V0KGluaXRpYWxBZGRyZXNzKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogdW5sb2FkKCkge1xuICB5aWVsZCBwdXQoYWN0aW9ucy51bmxvYWRUcmFuc2FjdGlvbigpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBzYWdhKCkge1xuICB5aWVsZCB0YWtlRXZlcnkoVElDSywgdGlja1NhZ2EpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwcmVmaXhOYW1lKFwiZXZtXCIsIHNhZ2EpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9ldm0vc2FnYXMvaW5kZXguanMiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6Y29udHJvbGxlcjpzZWxlY3RvcnNcIik7IC8vZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvclRyZWUsIGNyZWF0ZUxlYWYgfSBmcm9tIFwicmVzZWxlY3QtdHJlZVwiO1xuXG5pbXBvcnQgZXZtIGZyb20gXCJsaWIvZXZtL3NlbGVjdG9yc1wiO1xuaW1wb3J0IHNvbGlkaXR5IGZyb20gXCJsaWIvc29saWRpdHkvc2VsZWN0b3JzXCI7XG5pbXBvcnQgdHJhY2UgZnJvbSBcImxpYi90cmFjZS9zZWxlY3RvcnNcIjtcblxuaW1wb3J0IHsgYW55Tm9uU2tpcHBlZEluUmFuZ2UgfSBmcm9tIFwibGliL2FzdC9tYXBcIjtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcblxuLyoqXG4gKiBjb250cm9sbGVyXG4gKi9cbmNvbnN0IGNvbnRyb2xsZXIgPSBjcmVhdGVTZWxlY3RvclRyZWUoe1xuICAvKipcbiAgICogY29udHJvbGxlci5zdGF0ZVxuICAgKi9cbiAgc3RhdGU6IHN0YXRlID0+IHN0YXRlLmNvbnRyb2xsZXIsXG4gIC8qKlxuICAgKiBjb250cm9sbGVyLmN1cnJlbnRcbiAgICovXG4gIGN1cnJlbnQ6IHtcbiAgICAvKipcbiAgICAgKiBjb250cm9sbGVyLmN1cnJlbnQuZnVuY3Rpb25EZXB0aFxuICAgICAqL1xuICAgIGZ1bmN0aW9uRGVwdGg6IGNyZWF0ZUxlYWYoW3NvbGlkaXR5LmN1cnJlbnQuZnVuY3Rpb25EZXB0aF0sIGlkZW50aXR5KSxcblxuICAgIC8qKlxuICAgICAqIGNvbnRyb2xsZXIuY3VycmVudC5leGVjdXRpb25Db250ZXh0XG4gICAgICovXG4gICAgZXhlY3V0aW9uQ29udGV4dDogY3JlYXRlTGVhZihbZXZtLmN1cnJlbnQuY2FsbF0sIGlkZW50aXR5KSxcblxuICAgIC8qKlxuICAgICAqIGNvbnRyb2xsZXIuY3VycmVudC53aWxsSnVtcFxuICAgICAqL1xuICAgIHdpbGxKdW1wOiBjcmVhdGVMZWFmKFtldm0uY3VycmVudC5zdGVwLmlzSnVtcF0sIGlkZW50aXR5KSxcblxuICAgIC8qKlxuICAgICAqIGNvbnRyb2xsZXIuY3VycmVudC5sb2NhdGlvblxuICAgICAqL1xuICAgIGxvY2F0aW9uOiB7XG4gICAgICAvKipcbiAgICAgICAqIGNvbnRyb2xsZXIuY3VycmVudC5sb2NhdGlvbi5zb3VyY2VSYW5nZVxuICAgICAgICovXG4gICAgICBzb3VyY2VSYW5nZTogY3JlYXRlTGVhZihcbiAgICAgICAgW3NvbGlkaXR5LmN1cnJlbnQuc291cmNlUmFuZ2UsIFwiL2N1cnJlbnQvdHJhY2UvbG9hZGVkXCJdLFxuICAgICAgICAocmFuZ2UsIGxvYWRlZCkgPT4gKGxvYWRlZCA/IHJhbmdlIDogbnVsbClcbiAgICAgICksXG5cbiAgICAgIC8qKlxuICAgICAgICogY29udHJvbGxlci5jdXJyZW50LmxvY2F0aW9uLnNvdXJjZVxuICAgICAgICovXG4gICAgICBzb3VyY2U6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtzb2xpZGl0eS5jdXJyZW50LnNvdXJjZSwgXCIvY3VycmVudC90cmFjZS9sb2FkZWRcIl0sXG4gICAgICAgIChzb3VyY2UsIGxvYWRlZCkgPT4gKGxvYWRlZCA/IHNvdXJjZSA6IG51bGwpXG4gICAgICApLFxuXG4gICAgICAvKipcbiAgICAgICAqIGNvbnRyb2xsZXIuY3VycmVudC5sb2NhdGlvbi5ub2RlXG4gICAgICAgKi9cbiAgICAgIG5vZGU6IGNyZWF0ZUxlYWYoXG4gICAgICAgIFtzb2xpZGl0eS5jdXJyZW50Lm5vZGUsIFwiL2N1cnJlbnQvdHJhY2UvbG9hZGVkXCJdLFxuICAgICAgICAobm9kZSwgbG9hZGVkKSA9PiAobG9hZGVkID8gbm9kZSA6IG51bGwpXG4gICAgICApLFxuXG4gICAgICAvKipcbiAgICAgICAqIGNvbnRyb2xsZXIuY3VycmVudC5sb2NhdGlvbi5pc011bHRpbGluZVxuICAgICAgICovXG4gICAgICBpc011bHRpbGluZTogY3JlYXRlTGVhZihcbiAgICAgICAgW3NvbGlkaXR5LmN1cnJlbnQuaXNNdWx0aWxpbmUsIFwiL2N1cnJlbnQvdHJhY2UvbG9hZGVkXCJdLFxuICAgICAgICAocmF3LCBsb2FkZWQpID0+IChsb2FkZWQgPyByYXcgOiBmYWxzZSlcbiAgICAgIClcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBjb250cm9sbGVyLmN1cnJlbnQudHJhY2VcbiAgICAgKi9cbiAgICB0cmFjZToge1xuICAgICAgLyoqXG4gICAgICAgKiBjb250cm9sbGVyLmN1cnJlbnQudHJhY2UuZmluaXNoZWRcbiAgICAgICAqL1xuICAgICAgZmluaXNoZWQ6IGNyZWF0ZUxlYWYoW3RyYWNlLmZpbmlzaGVkXSwgaWRlbnRpdHkpLFxuXG4gICAgICAvKipcbiAgICAgICAqIGNvbnRyb2xsZXIuY3VycmVudC50cmFjZS5sb2FkZWRcbiAgICAgICAqL1xuICAgICAgbG9hZGVkOiBjcmVhdGVMZWFmKFt0cmFjZS5sb2FkZWRdLCBpZGVudGl0eSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIGNvbnRyb2xsZXIuYnJlYWtwb2ludHMgKG5hbWVzcGFjZSlcbiAgICovXG4gIGJyZWFrcG9pbnRzOiB7XG4gICAgLyoqXG4gICAgICogY29udHJvbGxlci5icmVha3BvaW50cyAoc2VsZWN0b3IpXG4gICAgICovXG4gICAgXzogY3JlYXRlTGVhZihbXCIvc3RhdGVcIl0sIHN0YXRlID0+IHN0YXRlLmJyZWFrcG9pbnRzKSxcblxuICAgIC8qKlxuICAgICAqIGNvbnRyb2xsZXIuYnJlYWtwb2ludHMucmVzb2x2ZXIgKHNlbGVjdG9yKVxuICAgICAqIHRoaXMgc2VsZWN0b3IgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWRqdXN0cyBhIGdpdmVuIGxpbmUtYmFzZWRcbiAgICAgKiBicmVha3BvaW50IChvbiBub2RlLWJhc2VkIGJyZWFrcG9pbnRzIGl0IHNpbXBseSByZXR1cm5zIHRoZSBpbnB1dCkgYnlcbiAgICAgKiByZXBlYXRlZGx5IG1vdmluZyBpdCBkb3duIGEgbGluZSB1bnRpbCBpdCBsYW5kcyBvbiBhIGxpbmUgd2hlcmUgdGhlcmUnc1xuICAgICAqIGFjdHVhbGx5IHNvbWV3aGVyZSB0byBicmVhay4gIGlmIG5vIHN1Y2ggbGluZSBleGlzdHMgYmV5b25kIHRoYXQgcG9pbnQsIGl0XG4gICAgICogcmV0dXJucyBudWxsIGluc3RlYWQuXG4gICAgICovXG4gICAgcmVzb2x2ZXI6IGNyZWF0ZUxlYWYoW3NvbGlkaXR5LmluZm8uc291cmNlc10sIHNvdXJjZXMgPT4gYnJlYWtwb2ludCA9PiB7XG4gICAgICBsZXQgYWRqdXN0ZWRCcmVha3BvaW50O1xuICAgICAgaWYgKGJyZWFrcG9pbnQubm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBsaW5lID0gYnJlYWtwb2ludC5saW5lO1xuICAgICAgICBsZXQgeyBzb3VyY2UsIGFzdCB9ID0gc291cmNlc1ticmVha3BvaW50LnNvdXJjZUlkXTtcbiAgICAgICAgbGV0IGxpbmVMZW5ndGhzID0gc291cmNlLnNwbGl0KFwiXFxuXCIpLm1hcChsaW5lID0+IGxpbmUubGVuZ3RoKTtcbiAgICAgICAgLy93aHkgZG9lcyBuZWl0aGVyIEpTIG5vciBsb2Rhc2ggaGF2ZSBhIHNjYW4gZnVuY3Rpb24gbGlrZSBIYXNrZWxsPz9cbiAgICAgICAgLy9ndWVzcyB3ZSdsbCBoYXZlIHRvIGRvIG91ciBzY2FuIG1hbnVhbGx5XG4gICAgICAgIGxldCBsaW5lU3RhcnRzID0gWzBdO1xuICAgICAgICBmb3IgKGxldCBsZW5ndGggb2YgbGluZUxlbmd0aHMpIHtcbiAgICAgICAgICBsaW5lU3RhcnRzLnB1c2gobGluZVN0YXJ0c1tsaW5lU3RhcnRzLmxlbmd0aCAtIDFdICsgbGVuZ3RoICsgMSk7XG4gICAgICAgICAgLy8rMSBmb3IgdGhlIC9uIGl0c2VsZlxuICAgICAgICB9XG4gICAgICAgIGRlYnVnKFxuICAgICAgICAgIFwibGluZTogJXNcIixcbiAgICAgICAgICBzb3VyY2Uuc2xpY2UobGluZVN0YXJ0c1tsaW5lXSwgbGluZVN0YXJ0c1tsaW5lXSArIGxpbmVMZW5ndGhzW2xpbmVdKVxuICAgICAgICApO1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgbGluZSA8IGxpbmVMZW5ndGhzLmxlbmd0aCAmJlxuICAgICAgICAgICFhbnlOb25Ta2lwcGVkSW5SYW5nZShhc3QsIGxpbmVTdGFydHNbbGluZV0sIGxpbmVMZW5ndGhzW2xpbmVdKVxuICAgICAgICApIHtcbiAgICAgICAgICBkZWJ1ZyhcImluY3JlbWVudGluZ1wiKTtcbiAgICAgICAgICBsaW5lKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmUgPj0gbGluZUxlbmd0aHMubGVuZ3RoKSB7XG4gICAgICAgICAgYWRqdXN0ZWRCcmVha3BvaW50ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZGp1c3RlZEJyZWFrcG9pbnQgPSB7IC4uLmJyZWFrcG9pbnQsIGxpbmUgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVidWcoXCJub2RlLWJhc2VkIGJyZWFrcG9pbnRcIik7XG4gICAgICAgIGFkanVzdGVkQnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWRqdXN0ZWRCcmVha3BvaW50O1xuICAgIH0pXG4gIH0sXG5cbiAgLyoqXG4gICAqIGNvbnRyb2xsZXIuZmluaXNoZWRcbiAgICogZGVwcmVjYXRlZCBhbGlhcyBmb3IgY29udHJvbGxlci5jdXJyZW50LnRyYWNlLmZpbmlzaGVkXG4gICAqL1xuICBmaW5pc2hlZDogY3JlYXRlTGVhZihbXCIvY3VycmVudC9maW5pc2hlZFwiXSwgZmluaXNoZWQgPT4gZmluaXNoZWQpLFxuXG4gIC8qKlxuICAgKiBjb250cm9sbGVyLmlzU3RlcHBpbmdcbiAgICovXG4gIGlzU3RlcHBpbmc6IGNyZWF0ZUxlYWYoW1wiLi9zdGF0ZVwiXSwgc3RhdGUgPT4gc3RhdGUuaXNTdGVwcGluZylcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjb250cm9sbGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9jb250cm9sbGVyL3NlbGVjdG9ycy9pbmRleC5qcyIsImltcG9ydCBkZWJ1Z01vZHVsZSBmcm9tIFwiZGVidWdcIjtcbmNvbnN0IGRlYnVnID0gZGVidWdNb2R1bGUoXCJkZWJ1Z2dlcjphc3Q6bWFwXCIpO1xuXG5pbXBvcnQgSW50ZXJ2YWxUcmVlIGZyb20gXCJub2RlLWludGVydmFsLXRyZWVcIjtcbmltcG9ydCBqc29ucG9pbnRlciBmcm9tIFwianNvbi1wb2ludGVyXCI7XG5pbXBvcnQgeyBpc1NraXBwZWROb2RlVHlwZSB9IGZyb20gXCJsaWIvaGVscGVyc1wiO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5nZShub2RlKSB7XG4gIC8vIHNyYzogXCI8c3RhcnQ+OjxsZW5ndGg+OjxfPlwiXG4gIC8vIHJldHVybnMgW3N0YXJ0LCBlbmRdXG4gIGxldCBbc3RhcnQsIGxlbmd0aF0gPSBub2RlLnNyY1xuICAgIC5zcGxpdChcIjpcIilcbiAgICAuc2xpY2UoMCwgMilcbiAgICAubWFwKGkgPT4gcGFyc2VJbnQoaSkpO1xuXG4gIHJldHVybiBbc3RhcnQsIHN0YXJ0ICsgbGVuZ3RoXTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VOb2Rlcyhub2RlLCBwb2ludGVyID0gXCJcIikge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdChcbiAgICAgIC4uLm5vZGUubWFwKChzdWIsIGkpID0+IHJhbmdlTm9kZXMoc3ViLCBgJHtwb2ludGVyfS8ke2l9YCkpXG4gICAgKTtcbiAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdHMgPSBbXTtcblxuICAgIGlmIChub2RlLnNyYyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy90aGVyZSBhcmUgc29tZSBcInBzZXVkby1ub2Rlc1wiIHdpdGggYSBzcmMgYnV0IG5vIGlkLlxuICAgICAgLy90aGVzZSB3aWxsIGNhdXNlIHByb2JsZW1zLCBzbyB3ZSB3YW50IHRvIGV4Y2x1ZGUgdGhlbS5cbiAgICAgIC8vKHRvIG15IGtub3dsZWRnZSB0aGlzIG9ubHkgaGFwcGVucyB3aXRoIHRoZSBleHRlcm5hbFJlZmVyZW5jZXNcbiAgICAgIC8vdG8gYW4gSW5saW5lQXNzZW1ibHkgbm9kZSwgc28gZXhjbHVkaW5nIHRoZW0ganVzdCBtZWFucyB3ZSBmaW5kXG4gICAgICAvL3RoZSBJbmxpbmVBc3NlbWJseSBub2RlIGluc3RlYWQsIHdoaWNoIGlzIGZpbmUpXG4gICAgICByZXN1bHRzLnB1c2goeyBwb2ludGVyLCByYW5nZTogZ2V0UmFuZ2Uobm9kZSkgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHMuY29uY2F0KFxuICAgICAgLi4uT2JqZWN0LmtleXMobm9kZSkubWFwKGtleSA9PlxuICAgICAgICByYW5nZU5vZGVzKG5vZGVba2V5XSwgYCR7cG9pbnRlcn0vJHtrZXl9YClcbiAgICAgIClcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kT3ZlcmxhcHBpbmdSYW5nZShub2RlLCBzb3VyY2VTdGFydCwgc291cmNlTGVuZ3RoKSB7XG4gIGxldCByYW5nZXMgPSByYW5nZU5vZGVzKG5vZGUpO1xuICBsZXQgdHJlZSA9IG5ldyBJbnRlcnZhbFRyZWUoKTtcblxuICBmb3IgKGxldCB7IHJhbmdlLCBwb2ludGVyIH0gb2YgcmFuZ2VzKSB7XG4gICAgbGV0IFtzdGFydCwgZW5kXSA9IHJhbmdlO1xuICAgIHRyZWUuaW5zZXJ0KHN0YXJ0LCBlbmQsIHsgcmFuZ2UsIHBvaW50ZXIgfSk7XG4gIH1cblxuICBsZXQgc291cmNlRW5kID0gc291cmNlU3RhcnQgKyBzb3VyY2VMZW5ndGg7XG5cbiAgcmV0dXJuIHRyZWUuc2VhcmNoKHNvdXJjZVN0YXJ0LCBzb3VyY2VFbmQpO1xuICAvL3JldHVybnMgZXZlcnl0aGluZyBvdmVybGFwcGluZyB0aGUgZ2l2ZW4gcmFuZ2Vcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFJhbmdlKG5vZGUsIHNvdXJjZVN0YXJ0LCBzb3VyY2VMZW5ndGgpIHtcbiAgLy8gZmluZCBub2RlcyB0aGF0IGZ1bGx5IGNvbnRhaW4gcmVxdWVzdGVkIHJhbmdlLFxuICAvLyByZXR1cm4gbG9uZ2VzdCBwb2ludGVyXG4gIGxldCBzb3VyY2VFbmQgPSBzb3VyY2VTdGFydCArIHNvdXJjZUxlbmd0aDtcbiAgcmV0dXJuIGZpbmRPdmVybGFwcGluZ1JhbmdlKG5vZGUsIHNvdXJjZVN0YXJ0LCBzb3VyY2VMZW5ndGgpXG4gICAgLmZpbHRlcigoeyByYW5nZSB9KSA9PiBzb3VyY2VTdGFydCA+PSByYW5nZVswXSAmJiBzb3VyY2VFbmQgPD0gcmFuZ2VbMV0pXG4gICAgLm1hcCgoeyBwb2ludGVyIH0pID0+IHBvaW50ZXIpXG4gICAgLnJlZHVjZSgoYSwgYikgPT4gKGEubGVuZ3RoID4gYi5sZW5ndGggPyBhIDogYiksIFwiXCIpO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbnlOb25Ta2lwcGVkSW5SYW5nZShub2RlLCBzb3VyY2VTdGFydCwgc291cmNlTGVuZ3RoKSB7XG4gIGxldCBzb3VyY2VFbmQgPSBzb3VyY2VTdGFydCArIHNvdXJjZUxlbmd0aDtcbiAgcmV0dXJuIGZpbmRPdmVybGFwcGluZ1JhbmdlKG5vZGUsIHNvdXJjZVN0YXJ0LCBzb3VyY2VMZW5ndGgpLnNvbWUoXG4gICAgKHsgcmFuZ2UsIHBvaW50ZXIgfSkgPT5cbiAgICAgIHNvdXJjZVN0YXJ0IDw9IHJhbmdlWzBdICYmIC8vd2Ugd2FudCB0byBnbyBieSBzdGFydGluZyBsaW5lXG4gICAgICByYW5nZVswXSA8IHNvdXJjZUVuZCAmJlxuICAgICAgIWlzU2tpcHBlZE5vZGVUeXBlKGpzb25wb2ludGVyLmdldChub2RlLCBwb2ludGVyKSlcbiAgICAvL05PVEU6IHRoaXMgZG9lc24ndCBhY3R1YWxseSBjYXRjaCBldmVyeXRoaW5nIHNraXBwZWQhICBCdXQgZG9pbmcgYmV0dGVyXG4gICAgLy9pcyBoYXJkXG4gICk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL2FzdC9tYXAuanMiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6c2Vzc2lvbjpzZWxlY3RvcnNcIik7XG5cbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yVHJlZSwgY3JlYXRlTGVhZiB9IGZyb20gXCJyZXNlbGVjdC10cmVlXCI7XG5cbmltcG9ydCBldm0gZnJvbSBcImxpYi9ldm0vc2VsZWN0b3JzXCI7XG5pbXBvcnQgdHJhY2UgZnJvbSBcImxpYi90cmFjZS9zZWxlY3RvcnNcIjtcbmltcG9ydCBzb2xpZGl0eSBmcm9tIFwibGliL3NvbGlkaXR5L3NlbGVjdG9yc1wiO1xuXG5jb25zdCBzZXNzaW9uID0gY3JlYXRlU2VsZWN0b3JUcmVlKHtcbiAgLypcbiAgICogc2Vzc2lvbi5zdGF0ZVxuICAgKi9cbiAgc3RhdGU6IHN0YXRlID0+IHN0YXRlLnNlc3Npb24sXG5cbiAgLyoqXG4gICAqIHNlc3Npb24uaW5mb1xuICAgKi9cbiAgaW5mbzoge1xuICAgIC8qKlxuICAgICAqIHNlc3Npb24uaW5mby5hZmZlY3RlZEluc3RhbmNlc1xuICAgICAqL1xuICAgIGFmZmVjdGVkSW5zdGFuY2VzOiBjcmVhdGVMZWFmKFxuICAgICAgW2V2bS50cmFuc2FjdGlvbi5pbnN0YW5jZXMsIGV2bS5pbmZvLmNvbnRleHRzLCBzb2xpZGl0eS5pbmZvLnNvdXJjZXNdLFxuXG4gICAgICAoaW5zdGFuY2VzLCBjb250ZXh0cywgc291cmNlcykgPT5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB7fSxcbiAgICAgICAgICAuLi5PYmplY3QuZW50cmllcyhpbnN0YW5jZXMpLm1hcCgoW2FkZHJlc3MsIHsgY29udGV4dCwgYmluYXJ5IH1dKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZyhcImluc3RhbmNlcyAlT1wiLCBpbnN0YW5jZXMpO1xuICAgICAgICAgICAgZGVidWcoXCJjb250ZXh0cyAlT1wiLCBjb250ZXh0cyk7XG4gICAgICAgICAgICBsZXQgeyBjb250cmFjdE5hbWUsIHByaW1hcnlTb3VyY2UgfSA9IGNvbnRleHRzW2NvbnRleHRdO1xuXG4gICAgICAgICAgICBsZXQgc291cmNlID1cbiAgICAgICAgICAgICAgcHJpbWFyeVNvdXJjZSAhPT0gdW5kZWZpbmVkID8gc291cmNlc1twcmltYXJ5U291cmNlXSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgW2FkZHJlc3NdOiB7XG4gICAgICAgICAgICAgICAgY29udHJhY3ROYW1lLFxuICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICBiaW5hcnlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgKVxuICB9LFxuXG4gIC8qKlxuICAgKiBzZXNzaW9uLnRyYW5zYWN0aW9uIChuYW1lc3BhY2UpXG4gICAqL1xuICB0cmFuc2FjdGlvbjoge1xuICAgIC8qKlxuICAgICAqIHNlc3Npb24udHJhbnNhY3Rpb24gKHNlbGVjdG9yKVxuICAgICAqIGNvbnRhaW5zIHRoZSB3ZWIzIHRyYW5zYWN0aW9uIG9iamVjdFxuICAgICAqL1xuICAgIF86IGNyZWF0ZUxlYWYoW1wiL3N0YXRlXCJdLCBzdGF0ZSA9PiBzdGF0ZS50cmFuc2FjdGlvbiksXG5cbiAgICAvKipcbiAgICAgKiBzZXNzaW9uLnRyYW5zYWN0aW9uLnJlY2VpcHRcbiAgICAgKiBjb250YWlucyB0aGUgd2ViMyByZWNlaXB0IG9iamVjdFxuICAgICAqL1xuICAgIHJlY2VpcHQ6IGNyZWF0ZUxlYWYoW1wiL3N0YXRlXCJdLCBzdGF0ZSA9PiBzdGF0ZS5yZWNlaXB0KSxcblxuICAgIC8qKlxuICAgICAqIHNlc3Npb24udHJhbnNhY3Rpb24uYmxvY2tcbiAgICAgKiBjb250YWlucyB0aGUgd2ViMyBibG9jayBvYmplY3RcbiAgICAgKi9cbiAgICBibG9jazogY3JlYXRlTGVhZihbXCIvc3RhdGVcIl0sIHN0YXRlID0+IHN0YXRlLmJsb2NrKVxuICB9LFxuXG4gIC8qXG4gICAqIHNlc3Npb24uc3RhdHVzIChuYW1lc3BhY2UpXG4gICAqL1xuICBzdGF0dXM6IHtcbiAgICAvKlxuICAgICAqIHNlc3Npb24uc3RhdHVzLnJlYWR5T3JFcnJvclxuICAgICAqL1xuICAgIHJlYWR5T3JFcnJvcjogY3JlYXRlTGVhZihbXCIvc3RhdGVcIl0sIHN0YXRlID0+IHN0YXRlLnJlYWR5KSxcblxuICAgIC8qXG4gICAgICogc2Vzc2lvbi5zdGF0dXMucmVhZHlcbiAgICAgKi9cbiAgICByZWFkeTogY3JlYXRlTGVhZihcbiAgICAgIFtcIi4vcmVhZHlPckVycm9yXCIsIFwiLi9pc0Vycm9yXCJdLFxuICAgICAgKHJlYWR5T3JFcnJvciwgZXJyb3IpID0+IHJlYWR5T3JFcnJvciAmJiAhZXJyb3JcbiAgICApLFxuXG4gICAgLypcbiAgICAgKiBzZXNzaW9uLnN0YXR1cy53YWl0aW5nXG4gICAgICovXG4gICAgd2FpdGluZzogY3JlYXRlTGVhZihbXCIvc3RhdGVcIl0sIHN0YXRlID0+ICFzdGF0ZS5yZWFkeSksXG5cbiAgICAvKlxuICAgICAqIHNlc3Npb24uc3RhdHVzLmVycm9yXG4gICAgICovXG4gICAgZXJyb3I6IGNyZWF0ZUxlYWYoW1wiL3N0YXRlXCJdLCBzdGF0ZSA9PiBzdGF0ZS5sYXN0TG9hZGluZ0Vycm9yKSxcblxuICAgIC8qXG4gICAgICogc2Vzc2lvbi5zdGF0dXMuaXNFcnJvclxuICAgICAqL1xuICAgIGlzRXJyb3I6IGNyZWF0ZUxlYWYoW1wiLi9lcnJvclwiXSwgZXJyb3IgPT4gZXJyb3IgIT09IG51bGwpLFxuXG4gICAgLypcbiAgICAgKiBzZXNzaW9uLnN0YXR1cy5zdWNjZXNzXG4gICAgICovXG4gICAgc3VjY2VzczogY3JlYXRlTGVhZihbXCIuL2Vycm9yXCJdLCBlcnJvciA9PiBlcnJvciA9PT0gbnVsbCksXG5cbiAgICAvKlxuICAgICAqIHNlc3Npb24uc3RhdHVzLmVycm9yZWRcbiAgICAgKi9cbiAgICBlcnJvcmVkOiBjcmVhdGVMZWFmKFxuICAgICAgW1wiLi9yZWFkeU9yRXJyb3JcIiwgXCIuL2lzRXJyb3JcIl0sXG4gICAgICAocmVhZHlPckVycm9yLCBlcnJvcikgPT4gcmVhZHlPckVycm9yICYmIGVycm9yXG4gICAgKSxcblxuICAgIC8qXG4gICAgICogc2Vzc2lvbi5zdGF0dXMubG9hZGVkXG4gICAgICovXG4gICAgbG9hZGVkOiBjcmVhdGVMZWFmKFt0cmFjZS5sb2FkZWRdLCBsb2FkZWQgPT4gbG9hZGVkKSxcblxuICAgIC8qXG4gICAgICogc2Vzc2lvbi5zdGF0dXMucHJvamVjdEluZm9Db21wdXRlZFxuICAgICAqL1xuICAgIHByb2plY3RJbmZvQ29tcHV0ZWQ6IGNyZWF0ZUxlYWYoXG4gICAgICBbXCIvc3RhdGVcIl0sXG4gICAgICBzdGF0ZSA9PiBzdGF0ZS5wcm9qZWN0SW5mb0NvbXB1dGVkXG4gICAgKVxuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgc2Vzc2lvbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvc2Vzc2lvbi9zZWxlY3RvcnMvaW5kZXguanMiLCJleHBvcnQgY29uc3QgU0NPUEUgPSBcIlNDT1BFXCI7XG5leHBvcnQgZnVuY3Rpb24gc2NvcGUoaWQsIHBvaW50ZXIsIHBhcmVudElkLCBzb3VyY2VJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNDT1BFLFxuICAgIGlkLFxuICAgIHBvaW50ZXIsXG4gICAgcGFyZW50SWQsXG4gICAgc291cmNlSWRcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IERFQ0xBUkUgPSBcIkRFQ0xBUkVfVkFSSUFCTEVcIjtcbmV4cG9ydCBmdW5jdGlvbiBkZWNsYXJlKG5vZGUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBERUNMQVJFLFxuICAgIG5vZGVcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IEFTU0lHTiA9IFwiQVNTSUdOXCI7XG5leHBvcnQgZnVuY3Rpb24gYXNzaWduKGFzc2lnbm1lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQVNTSUdOLFxuICAgIGFzc2lnbm1lbnRzXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBNQVBfUEFUSF9BTkRfQVNTSUdOID0gXCJNQVBfUEFUSF9BTkRfQVNTSUdOXCI7XG5leHBvcnQgZnVuY3Rpb24gbWFwUGF0aEFuZEFzc2lnbihcbiAgYWRkcmVzcyxcbiAgc2xvdCxcbiAgYXNzaWdubWVudHMsXG4gIHR5cGVJZGVudGlmaWVyLFxuICBwYXJlbnRUeXBlXG4pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBNQVBfUEFUSF9BTkRfQVNTSUdOLFxuICAgIGFkZHJlc3MsXG4gICAgc2xvdCxcbiAgICBhc3NpZ25tZW50cyxcbiAgICB0eXBlSWRlbnRpZmllcixcbiAgICBwYXJlbnRUeXBlXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBSRVNFVCA9IFwiREFUQV9SRVNFVFwiO1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0KCkge1xuICByZXR1cm4geyB0eXBlOiBSRVNFVCB9O1xufVxuXG5leHBvcnQgY29uc3QgREVGSU5FX1RZUEUgPSBcIkRFRklORV9UWVBFXCI7XG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lVHlwZShub2RlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogREVGSU5FX1RZUEUsXG4gICAgbm9kZVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgQUxMT0NBVEUgPSBcIkFMTE9DQVRFXCI7XG5leHBvcnQgZnVuY3Rpb24gYWxsb2NhdGUoc3RvcmFnZSwgbWVtb3J5LCBjYWxsZGF0YSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFMTE9DQVRFLFxuICAgIHN0b3JhZ2UsXG4gICAgbWVtb3J5LFxuICAgIGNhbGxkYXRhXG4gIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL2RhdGEvYWN0aW9ucy9pbmRleC5qcyIsImV4cG9ydCBjb25zdCBBRERfQ09OVEVYVCA9IFwiRVZNX0FERF9DT05URVhUXCI7XG5leHBvcnQgZnVuY3Rpb24gYWRkQ29udGV4dCh7XG4gIGNvbnRyYWN0TmFtZSxcbiAgYmluYXJ5LFxuICBzb3VyY2VNYXAsXG4gIGNvbXBpbGVyLFxuICBhYmksXG4gIGNvbnRyYWN0SWQsXG4gIGNvbnRyYWN0S2luZCxcbiAgaXNDb25zdHJ1Y3RvclxufSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFERF9DT05URVhULFxuICAgIGNvbnRyYWN0TmFtZSxcbiAgICBiaW5hcnksXG4gICAgc291cmNlTWFwLFxuICAgIGNvbXBpbGVyLFxuICAgIGFiaSxcbiAgICBjb250cmFjdElkLFxuICAgIGNvbnRyYWN0S2luZCxcbiAgICBpc0NvbnN0cnVjdG9yXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBOT1JNQUxJWkVfQ09OVEVYVFMgPSBcIkVWTV9OT1JNQUxJWkVfQ09OVEVYVFNcIjtcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVDb250ZXh0cygpIHtcbiAgcmV0dXJuIHsgdHlwZTogTk9STUFMSVpFX0NPTlRFWFRTIH07XG59XG5cbmV4cG9ydCBjb25zdCBBRERfSU5TVEFOQ0UgPSBcIkVWTV9BRERfSU5TVEFOQ0VcIjtcbmV4cG9ydCBmdW5jdGlvbiBhZGRJbnN0YW5jZShhZGRyZXNzLCBjb250ZXh0LCBiaW5hcnkpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBRERfSU5TVEFOQ0UsXG4gICAgYWRkcmVzcyxcbiAgICBjb250ZXh0LFxuICAgIGJpbmFyeVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgU0FWRV9HTE9CQUxTID0gXCJTQVZFX0dMT0JBTFNcIjtcbmV4cG9ydCBmdW5jdGlvbiBzYXZlR2xvYmFscyhvcmlnaW4sIGdhc3ByaWNlLCBibG9jaykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFNBVkVfR0xPQkFMUyxcbiAgICBvcmlnaW4sXG4gICAgZ2FzcHJpY2UsXG4gICAgYmxvY2tcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IENBTEwgPSBcIkNBTExcIjtcbmV4cG9ydCBmdW5jdGlvbiBjYWxsKGFkZHJlc3MsIGRhdGEsIHN0b3JhZ2VBZGRyZXNzLCBzZW5kZXIsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQ0FMTCxcbiAgICBhZGRyZXNzLFxuICAgIGRhdGEsXG4gICAgc3RvcmFnZUFkZHJlc3MsXG4gICAgc2VuZGVyLFxuICAgIHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBDUkVBVEUgPSBcIkNSRUFURVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShiaW5hcnksIHN0b3JhZ2VBZGRyZXNzLCBzZW5kZXIsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQ1JFQVRFLFxuICAgIGJpbmFyeSxcbiAgICBzdG9yYWdlQWRkcmVzcyxcbiAgICBzZW5kZXIsXG4gICAgdmFsdWVcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFJFVFVSTiA9IFwiUkVUVVJOXCI7XG5leHBvcnQgZnVuY3Rpb24gcmV0dXJuQ2FsbCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRVRVUk5cbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IEZBSUwgPSBcIkZBSUxcIjtcbmV4cG9ydCBmdW5jdGlvbiBmYWlsKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEZBSUxcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFNUT1JFID0gXCJTVE9SRVwiO1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3JlKGFkZHJlc3MsIHNsb3QsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogU1RPUkUsXG4gICAgYWRkcmVzcyxcbiAgICBzbG90LFxuICAgIHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBMT0FEID0gXCJMT0FEXCI7XG5leHBvcnQgZnVuY3Rpb24gbG9hZChhZGRyZXNzLCBzbG90LCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IExPQUQsXG4gICAgYWRkcmVzcyxcbiAgICBzbG90LFxuICAgIHZhbHVlXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBSRVNFVCA9IFwiRVZNX1JFU0VUXCI7XG5leHBvcnQgZnVuY3Rpb24gcmVzZXQoc3RvcmFnZUFkZHJlc3MpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRVNFVCxcbiAgICBzdG9yYWdlQWRkcmVzc1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgVU5MT0FEX1RSQU5TQUNUSU9OID0gXCJFVk1fVU5MT0FEX1RSQU5TQUNUSU9OXCI7XG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkVHJhbnNhY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogVU5MT0FEX1RSQU5TQUNUSU9OXG4gIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL2V2bS9hY3Rpb25zL2luZGV4LmpzIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOndlYjM6c2FnYXNcIik7XG5cbmltcG9ydCB7XG4gIGFsbCxcbiAgdGFrZUV2ZXJ5LFxuICBhcHBseSxcbiAgZm9yayxcbiAgam9pbixcbiAgdGFrZSxcbiAgcHV0XG59IGZyb20gXCJyZWR1eC1zYWdhL2VmZmVjdHNcIjtcbmltcG9ydCB7IHByZWZpeE5hbWUgfSBmcm9tIFwibGliL2hlbHBlcnNcIjtcblxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9uc1wiO1xuaW1wb3J0ICogYXMgc2Vzc2lvbiBmcm9tIFwibGliL3Nlc3Npb24vYWN0aW9uc1wiO1xuXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCI7XG5pbXBvcnQgV2ViMyBmcm9tIFwid2ViM1wiOyAvL2p1c3QgZm9yIHV0aWxzIVxuaW1wb3J0ICogYXMgRGVjb2RlVXRpbHMgZnJvbSBcInRydWZmbGUtZGVjb2RlLXV0aWxzXCI7XG5cbmltcG9ydCBXZWIzQWRhcHRlciBmcm9tIFwiLi4vYWRhcHRlclwiO1xuXG5mdW5jdGlvbiogZmV0Y2hUcmFuc2FjdGlvbkluZm8oYWRhcHRlciwgeyB0eEhhc2ggfSkge1xuICBkZWJ1ZyhcImluc3BlY3RpbmcgdHJhbnNhY3Rpb25cIik7XG4gIHZhciB0cmFjZTtcbiAgdHJ5IHtcbiAgICB0cmFjZSA9IHlpZWxkIGFwcGx5KGFkYXB0ZXIsIGFkYXB0ZXIuZ2V0VHJhY2UsIFt0eEhhc2hdKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGRlYnVnKFwicHV0dGluZyBlcnJvclwiKTtcbiAgICB5aWVsZCBwdXQoYWN0aW9ucy5lcnJvcihlKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGVidWcoXCJnb3QgdHJhY2VcIik7XG4gIHlpZWxkIHB1dChhY3Rpb25zLnJlY2VpdmVUcmFjZSh0cmFjZSkpO1xuXG4gIGxldCB0eCA9IHlpZWxkIGFwcGx5KGFkYXB0ZXIsIGFkYXB0ZXIuZ2V0VHJhbnNhY3Rpb24sIFt0eEhhc2hdKTtcbiAgZGVidWcoXCJ0eCAlT1wiLCB0eCk7XG4gIGxldCByZWNlaXB0ID0geWllbGQgYXBwbHkoYWRhcHRlciwgYWRhcHRlci5nZXRSZWNlaXB0LCBbdHhIYXNoXSk7XG4gIGRlYnVnKFwicmVjZWlwdCAlT1wiLCByZWNlaXB0KTtcbiAgbGV0IGJsb2NrID0geWllbGQgYXBwbHkoYWRhcHRlciwgYWRhcHRlci5nZXRCbG9jaywgW3R4LmJsb2NrTnVtYmVyXSk7XG4gIGRlYnVnKFwiYmxvY2sgJU9cIiwgYmxvY2spO1xuXG4gIHlpZWxkIHB1dChzZXNzaW9uLnNhdmVUcmFuc2FjdGlvbih0eCkpO1xuICB5aWVsZCBwdXQoc2Vzc2lvbi5zYXZlUmVjZWlwdChyZWNlaXB0KSk7XG4gIHlpZWxkIHB1dChzZXNzaW9uLnNhdmVCbG9jayhibG9jaykpO1xuXG4gIC8vdGhlc2Ugb25lcyBnZXQgZ3JvdXBlZCB0b2dldGhlciBmb3IgY29udmVuaWVuY2VcbiAgbGV0IHNvbGlkaXR5QmxvY2sgPSB7XG4gICAgY29pbmJhc2U6IGJsb2NrLm1pbmVyLFxuICAgIGRpZmZpY3VsdHk6IG5ldyBCTihibG9jay5kaWZmaWN1bHR5KSxcbiAgICBnYXNsaW1pdDogbmV3IEJOKGJsb2NrLmdhc0xpbWl0KSxcbiAgICBudW1iZXI6IG5ldyBCTihibG9jay5udW1iZXIpLFxuICAgIHRpbWVzdGFtcDogbmV3IEJOKGJsb2NrLnRpbWVzdGFtcClcbiAgfTtcblxuICBpZiAodHgudG8gIT0gbnVsbCkge1xuICAgIHlpZWxkIHB1dChcbiAgICAgIGFjdGlvbnMucmVjZWl2ZUNhbGwoe1xuICAgICAgICBhZGRyZXNzOiB0eC50byxcbiAgICAgICAgZGF0YTogdHguaW5wdXQsXG4gICAgICAgIHN0b3JhZ2VBZGRyZXNzOiB0eC50byxcbiAgICAgICAgc2VuZGVyOiB0eC5mcm9tLFxuICAgICAgICB2YWx1ZTogbmV3IEJOKHR4LnZhbHVlKSxcbiAgICAgICAgZ2FzcHJpY2U6IG5ldyBCTih0eC5nYXNQcmljZSksXG4gICAgICAgIGJsb2NrOiBzb2xpZGl0eUJsb2NrXG4gICAgICB9KVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHN0b3JhZ2VBZGRyZXNzID0gV2ViMy51dGlscy5pc0FkZHJlc3MocmVjZWlwdC5jb250cmFjdEFkZHJlc3MpXG4gICAgICA/IHJlY2VpcHQuY29udHJhY3RBZGRyZXNzXG4gICAgICA6IERlY29kZVV0aWxzLkVWTS5aRVJPX0FERFJFU1M7XG4gICAgeWllbGQgcHV0KFxuICAgICAgYWN0aW9ucy5yZWNlaXZlQ2FsbCh7XG4gICAgICAgIGJpbmFyeTogdHguaW5wdXQsXG4gICAgICAgIHN0b3JhZ2VBZGRyZXNzLFxuICAgICAgICBzdGF0dXM6IHJlY2VpcHQuc3RhdHVzLFxuICAgICAgICBzZW5kZXI6IHR4LmZyb20sXG4gICAgICAgIHZhbHVlOiBuZXcgQk4odHgudmFsdWUpLFxuICAgICAgICBnYXNwcmljZTogbmV3IEJOKHR4Lmdhc1ByaWNlKSxcbiAgICAgICAgYmxvY2s6IHNvbGlkaXR5QmxvY2tcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiogZmV0Y2hCaW5hcnkoYWRhcHRlciwgeyBhZGRyZXNzLCBibG9jayB9KSB7XG4gIGRlYnVnKFwiZmV0Y2hpbmcgYmluYXJ5IGZvciAlc1wiLCBhZGRyZXNzKTtcbiAgbGV0IGJpbmFyeSA9IHlpZWxkIGFwcGx5KGFkYXB0ZXIsIGFkYXB0ZXIuZ2V0RGVwbG95ZWRDb2RlLCBbYWRkcmVzcywgYmxvY2tdKTtcblxuICBkZWJ1ZyhcInJlY2VpdmVkIGJpbmFyeSBmb3IgJXNcIiwgYWRkcmVzcyk7XG4gIHlpZWxkIHB1dChhY3Rpb25zLnJlY2VpdmVCaW5hcnkoYWRkcmVzcywgYmluYXJ5KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogaW5zcGVjdFRyYW5zYWN0aW9uKHR4SGFzaCkge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5pbnNwZWN0KHR4SGFzaCkpO1xuXG4gIGxldCBhY3Rpb24gPSB5aWVsZCB0YWtlKFthY3Rpb25zLlJFQ0VJVkVfVFJBQ0UsIGFjdGlvbnMuRVJST1JfV0VCM10pO1xuICBkZWJ1ZyhcImFjdGlvbiAlb1wiLCBhY3Rpb24pO1xuXG4gIHZhciB0cmFjZTtcbiAgaWYgKGFjdGlvbi50eXBlID09IGFjdGlvbnMuUkVDRUlWRV9UUkFDRSkge1xuICAgIHRyYWNlID0gYWN0aW9uLnRyYWNlO1xuICAgIGRlYnVnKFwicmVjZWl2ZWQgdHJhY2VcIik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICB9XG5cbiAgbGV0IHtcbiAgICBhZGRyZXNzLFxuICAgIGJpbmFyeSxcbiAgICBkYXRhLFxuICAgIHN0b3JhZ2VBZGRyZXNzLFxuICAgIHN0YXR1cyxcbiAgICBzZW5kZXIsXG4gICAgdmFsdWUsXG4gICAgZ2FzcHJpY2UsXG4gICAgYmxvY2tcbiAgfSA9IHlpZWxkIHRha2UoYWN0aW9ucy5SRUNFSVZFX0NBTEwpO1xuICBkZWJ1ZyhcInJlY2VpdmVkIGNhbGxcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB0cmFjZSxcbiAgICBhZGRyZXNzLFxuICAgIGJpbmFyeSxcbiAgICBkYXRhLFxuICAgIHN0b3JhZ2VBZGRyZXNzLFxuICAgIHN0YXR1cyxcbiAgICBzZW5kZXIsXG4gICAgdmFsdWUsXG4gICAgZ2FzcHJpY2UsXG4gICAgYmxvY2tcbiAgfTtcbn1cblxuLy9OT1RFOiB0aGUgYmxvY2sgYXJndW1lbnQgaXMgb3B0aW9uYWxcbmV4cG9ydCBmdW5jdGlvbiogb2J0YWluQmluYXJpZXMoYWRkcmVzc2VzLCBibG9jaykge1xuICBsZXQgdGFza3MgPSB5aWVsZCBhbGwoYWRkcmVzc2VzLm1hcChhZGRyZXNzID0+IGZvcmsocmVjZWl2ZUJpbmFyeSwgYWRkcmVzcykpKTtcblxuICBkZWJ1ZyhcInJlcXVlc3RpbmcgYmluYXJpZXNcIik7XG4gIHlpZWxkIGFsbChhZGRyZXNzZXMubWFwKGFkZHJlc3MgPT4gcHV0KGFjdGlvbnMuZmV0Y2hCaW5hcnkoYWRkcmVzcywgYmxvY2spKSkpO1xuXG4gIGxldCBiaW5hcmllcyA9IFtdO1xuICBiaW5hcmllcyA9IHlpZWxkIGpvaW4odGFza3MpO1xuXG4gIGRlYnVnKFwiYmluYXJpZXMgJW9cIiwgYmluYXJpZXMpO1xuXG4gIHJldHVybiBiaW5hcmllcztcbn1cblxuZnVuY3Rpb24qIHJlY2VpdmVCaW5hcnkoYWRkcmVzcykge1xuICBsZXQgeyBiaW5hcnkgfSA9IHlpZWxkIHRha2UoXG4gICAgYWN0aW9uID0+IGFjdGlvbi50eXBlID09IGFjdGlvbnMuUkVDRUlWRV9CSU5BUlkgJiYgYWN0aW9uLmFkZHJlc3MgPT0gYWRkcmVzc1xuICApO1xuICBkZWJ1ZyhcImdvdCBiaW5hcnkgZm9yICVzXCIsIGFkZHJlc3MpO1xuXG4gIHJldHVybiBiaW5hcnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogaW5pdChwcm92aWRlcikge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5pbml0KHByb3ZpZGVyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc2FnYSgpIHtcbiAgLy8gd2FpdCBmb3Igd2ViMyBpbml0IHNpZ25hbFxuICBsZXQgeyBwcm92aWRlciB9ID0geWllbGQgdGFrZShhY3Rpb25zLklOSVRfV0VCMyk7XG4gIGxldCBhZGFwdGVyID0gbmV3IFdlYjNBZGFwdGVyKHByb3ZpZGVyKTtcblxuICB5aWVsZCB0YWtlRXZlcnkoYWN0aW9ucy5JTlNQRUNULCBmZXRjaFRyYW5zYWN0aW9uSW5mbywgYWRhcHRlcik7XG4gIHlpZWxkIHRha2VFdmVyeShhY3Rpb25zLkZFVENIX0JJTkFSWSwgZmV0Y2hCaW5hcnksIGFkYXB0ZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwcmVmaXhOYW1lKFwid2ViM1wiLCBzYWdhKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvd2ViMy9zYWdhcy9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndlYjNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ3ZWIzXCJcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRydWZmbGUtZGVjb2RlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInRydWZmbGUtZGVjb2RlclwiXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6Y29udHJvbGxlcjpzYWdhc1wiKTtcblxuaW1wb3J0IHsgcHV0LCBjYWxsLCByYWNlLCB0YWtlLCBzZWxlY3QgfSBmcm9tIFwicmVkdXgtc2FnYS9lZmZlY3RzXCI7XG5cbmltcG9ydCB7IHByZWZpeE5hbWUsIGlzRGVsaWJlcmF0ZWx5U2tpcHBlZE5vZGVUeXBlIH0gZnJvbSBcImxpYi9oZWxwZXJzXCI7XG5cbmltcG9ydCAqIGFzIHRyYWNlIGZyb20gXCJsaWIvdHJhY2Uvc2FnYXNcIjtcbmltcG9ydCAqIGFzIGRhdGEgZnJvbSBcImxpYi9kYXRhL3NhZ2FzXCI7XG5pbXBvcnQgKiBhcyBldm0gZnJvbSBcImxpYi9ldm0vc2FnYXNcIjtcbmltcG9ydCAqIGFzIHNvbGlkaXR5IGZyb20gXCJsaWIvc29saWRpdHkvc2FnYXNcIjtcblxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tIFwiLi4vYWN0aW9uc1wiO1xuXG5pbXBvcnQgY29udHJvbGxlciBmcm9tIFwiLi4vc2VsZWN0b3JzXCI7XG5cbmNvbnN0IFNURVBfU0FHQVMgPSB7XG4gIFthY3Rpb25zLkFEVkFOQ0VdOiBhZHZhbmNlLFxuICBbYWN0aW9ucy5TVEVQX05FWFRdOiBzdGVwTmV4dCxcbiAgW2FjdGlvbnMuU1RFUF9PVkVSXTogc3RlcE92ZXIsXG4gIFthY3Rpb25zLlNURVBfSU5UT106IHN0ZXBJbnRvLFxuICBbYWN0aW9ucy5TVEVQX09VVF06IHN0ZXBPdXQsXG4gIFthY3Rpb25zLkNPTlRJTlVFXTogY29udGludWVVbnRpbEJyZWFrcG9pbnRcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiogc2FnYSgpIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBkZWJ1ZyhcIndhaXRpbmcgZm9yIGNvbnRyb2wgYWN0aW9uXCIpO1xuICAgIGxldCBhY3Rpb24gPSB5aWVsZCB0YWtlKE9iamVjdC5rZXlzKFNURVBfU0FHQVMpKTtcbiAgICBpZiAoISh5aWVsZCBzZWxlY3QoY29udHJvbGxlci5jdXJyZW50LnRyYWNlLmxvYWRlZCkpKSB7XG4gICAgICBjb250aW51ZTsgLy93aGlsZSBubyB0cmFjZSBpcyBsb2FkZWQsIHN0ZXAgYWN0aW9ucyBhcmUgaWdub3JlZFxuICAgIH1cbiAgICBkZWJ1ZyhcImdvdCBjb250cm9sIGFjdGlvblwiKTtcbiAgICBsZXQgc2FnYSA9IFNURVBfU0FHQVNbYWN0aW9uLnR5cGVdO1xuXG4gICAgeWllbGQgcHV0KGFjdGlvbnMuc3RhcnRTdGVwcGluZygpKTtcbiAgICB5aWVsZCByYWNlKHtcbiAgICAgIGV4ZWM6IGNhbGwoc2FnYSwgYWN0aW9uKSwgLy9ub3QgYWxsIHdpbGwgdXNlIHRoaXNcbiAgICAgIGludGVycnVwdDogdGFrZShhY3Rpb25zLklOVEVSUlVQVClcbiAgICB9KTtcbiAgICB5aWVsZCBwdXQoYWN0aW9ucy5kb25lU3RlcHBpbmcoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJlZml4TmFtZShcImNvbnRyb2xsZXJcIiwgc2FnYSk7XG5cbi8qXG4gKiBBZHZhbmNlIHRoZSBzdGF0ZSBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIGluc3RydWN0aW9ucyAoYnV0IG5vdCBwYXN0IHRoZSBlbmQpXG4gKiAoaWYgbm8gY291bnQgZ2l2ZW4sIGFkdmFuY2UgMSlcbiAqL1xuZnVuY3Rpb24qIGFkdmFuY2UoYWN0aW9uKSB7XG4gIGxldCBjb3VudCA9XG4gICAgYWN0aW9uICE9PSB1bmRlZmluZWQgJiYgYWN0aW9uLmNvdW50ICE9PSB1bmRlZmluZWQgPyBhY3Rpb24uY291bnQgOiAxO1xuICAvL2RlZmF1bHQgaXMsIGFzIG1lbnRpb25lZCwgdG8gYWR2YW5jZSAxXG4gIGZvciAoXG4gICAgbGV0IGkgPSAwO1xuICAgIGkgPCBjb3VudCAmJiAhKHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQudHJhY2UuZmluaXNoZWQpKTtcbiAgICBpKytcbiAgKSB7XG4gICAgeWllbGQqIHRyYWNlLmFkdmFuY2UoKTtcbiAgfVxufVxuXG4vKipcbiAqIHN0ZXBOZXh0IC0gc3RlcCB0byB0aGUgbmV4dCBsb2dpY2FsIGNvZGUgc2VnbWVudFxuICpcbiAqIE5vdGU6IEl0IG1pZ2h0IHRha2UgbXVsdGlwbGUgaW5zdHJ1Y3Rpb25zIHRvIGV4cHJlc3MgdGhlIHNhbWUgc2VjdGlvbiBvZiBjb2RlLlxuICogXCJTdGVwcGluZ1wiLCB0aGVuLCBpcyBzdGVwcGluZyB0byB0aGUgbmV4dCBsb2dpY2FsIGl0ZW0sIG5vdCBzdGVwcGluZyB0byB0aGUgbmV4dFxuICogaW5zdHJ1Y3Rpb24uIFNlZSBhZHZhbmNlKCkgaWYgeW91J2QgbGlrZSB0byBhZHZhbmNlIGJ5IG9uZSBpbnN0cnVjdGlvbi5cbiAqL1xuZnVuY3Rpb24qIHN0ZXBOZXh0KCkge1xuICBjb25zdCBzdGFydGluZ1JhbmdlID0geWllbGQgc2VsZWN0KGNvbnRyb2xsZXIuY3VycmVudC5sb2NhdGlvbi5zb3VyY2VSYW5nZSk7XG5cbiAgdmFyIHVwY29taW5nLCBmaW5pc2hlZDtcblxuICBkbyB7XG4gICAgLy8gYWR2YW5jZSBhdCBsZWFzdCBvbmNlIHN0ZXBcbiAgICB5aWVsZCogYWR2YW5jZSgpO1xuXG4gICAgLy8gYW5kIGNoZWNrIHRoZSBuZXh0IHNvdXJjZSByYW5nZVxuICAgIHRyeSB7XG4gICAgICB1cGNvbWluZyA9IHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQubG9jYXRpb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHVwY29taW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBmaW5pc2hlZCA9IHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQudHJhY2UuZmluaXNoZWQpO1xuXG4gICAgLy8gaWYgdGhlIG5leHQgc3RlcCdzIHNvdXJjZSByYW5nZSBpcyBzdGlsbCB0aGUgc2FtZSwga2VlcCBnb2luZ1xuICB9IHdoaWxlIChcbiAgICAhZmluaXNoZWQgJiZcbiAgICAoIXVwY29taW5nIHx8XG4gICAgICAhdXBjb21pbmcubm9kZSB8fFxuICAgICAgaXNEZWxpYmVyYXRlbHlTa2lwcGVkTm9kZVR5cGUodXBjb21pbmcubm9kZSkgfHxcbiAgICAgICh1cGNvbWluZy5zb3VyY2VSYW5nZS5zdGFydCA9PSBzdGFydGluZ1JhbmdlLnN0YXJ0ICYmXG4gICAgICAgIHVwY29taW5nLnNvdXJjZVJhbmdlLmxlbmd0aCA9PSBzdGFydGluZ1JhbmdlLmxlbmd0aCkpXG4gICk7XG59XG5cbi8qKlxuICogc3RlcEludG8gLSBzdGVwIGludG8gdGhlIGN1cnJlbnQgZnVuY3Rpb25cbiAqXG4gKiBDb25jZXB0dWFsbHkgdGhpcyBpcyBlYXN5LCBidXQgZnJvbSBhIHByb2dyYW1taW5nIHN0YW5kcG9pbnQgaXQncyBoYXJkLlxuICogQ29kZSBsaWtlIGBnZXRCYWxhbmNlKG1zZy5zZW5kZXIpYCBtaWdodCBiZSBoaWdobGlnaHRlZCwgYnV0IHRoZXJlIGNvdWxkXG4gKiBiZSBhIG51bWJlciBvZiBkaWZmZXJlbnQgaW50ZXJtZWRpYXRlIHN0ZXBzIChsaWtlIGV2YWx1YXRpbmcgYG1zZy5zZW5kZXJgKVxuICogYmVmb3JlIGBnZXRCYWxhbmNlYCBpcyBzdGVwcGVkIGludG8uIFRoaXMgZnVuY3Rpb24gd2lsbCBzdGVwIGludG8gdGhlIGZpcnN0XG4gKiBmdW5jdGlvbiBhdmFpbGFibGUgKHdoZXJlIGluc3RydWN0aW9uLmp1bXAgPT0gXCJpXCIpLCBpZ25vcmluZyBhbnkgaW50ZXJtZWRpYXRlXG4gKiBzdGVwcyB0aGF0IGZhbGwgd2l0aGluIHRoZSBzYW1lIGNvZGUgcmFuZ2UuIElmIHRoZXJlJ3MgYSBzdGVwIGVuY291bnRlcmVkXG4gKiB0aGF0IGV4aXN0cyBvdXRzaWRlIG9mIHRoZSByYW5nZSwgdGhlbiBzdGVwSW50byB3aWxsIG9ubHkgZXhlY3V0ZSB1bnRpbCB0aGF0XG4gKiBzdGVwLlxuICovXG5mdW5jdGlvbiogc3RlcEludG8oKSB7XG4gIGlmICh5aWVsZCBzZWxlY3QoY29udHJvbGxlci5jdXJyZW50LndpbGxKdW1wKSkge1xuICAgIHlpZWxkKiBzdGVwTmV4dCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh5aWVsZCBzZWxlY3QoY29udHJvbGxlci5jdXJyZW50LmxvY2F0aW9uLmlzTXVsdGlsaW5lKSkge1xuICAgIHlpZWxkKiBzdGVwT3ZlcigpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0aW5nRGVwdGggPSB5aWVsZCBzZWxlY3QoY29udHJvbGxlci5jdXJyZW50LmZ1bmN0aW9uRGVwdGgpO1xuICBjb25zdCBzdGFydGluZ1JhbmdlID0geWllbGQgc2VsZWN0KGNvbnRyb2xsZXIuY3VycmVudC5sb2NhdGlvbi5zb3VyY2VSYW5nZSk7XG4gIHZhciBjdXJyZW50RGVwdGg7XG4gIHZhciBjdXJyZW50UmFuZ2U7XG5cbiAgZG8ge1xuICAgIHlpZWxkKiBzdGVwTmV4dCgpO1xuXG4gICAgY3VycmVudERlcHRoID0geWllbGQgc2VsZWN0KGNvbnRyb2xsZXIuY3VycmVudC5mdW5jdGlvbkRlcHRoKTtcbiAgICBjdXJyZW50UmFuZ2UgPSB5aWVsZCBzZWxlY3QoY29udHJvbGxlci5jdXJyZW50LmxvY2F0aW9uLnNvdXJjZVJhbmdlKTtcbiAgfSB3aGlsZSAoXG4gICAgLy8gdGhlIGZ1bmN0aW9uIHN0YWNrIGhhcyBub3QgaW5jcmVhc2VkLFxuICAgIGN1cnJlbnREZXB0aCA8PSBzdGFydGluZ0RlcHRoICYmXG4gICAgLy8gdGhlIGN1cnJlbnQgc291cmNlIHJhbmdlIGJlZ2lucyBvbiBvciBhZnRlciB0aGUgc3RhcnRpbmcgcmFuZ2VcbiAgICBjdXJyZW50UmFuZ2Uuc3RhcnQgPj0gc3RhcnRpbmdSYW5nZS5zdGFydCAmJlxuICAgIC8vIGFuZCB0aGUgY3VycmVudCByYW5nZSBlbmRzIG9uIG9yIGJlZm9yZSB0aGUgc3RhcnRpbmcgcmFuZ2UgZW5kc1xuICAgIGN1cnJlbnRSYW5nZS5zdGFydCArIGN1cnJlbnRSYW5nZS5sZW5ndGggPD1cbiAgICAgIHN0YXJ0aW5nUmFuZ2Uuc3RhcnQgKyBzdGFydGluZ1JhbmdlLmxlbmd0aFxuICApO1xufVxuXG4vKipcbiAqIFN0ZXAgb3V0IG9mIHRoZSBjdXJyZW50IGZ1bmN0aW9uXG4gKlxuICogVGhpcyB3aWxsIHJ1biB1bnRpbCB0aGUgZGVidWdnZXIgZW5jb3VudGVycyBhIGRlY3JlYXNlIGluIGZ1bmN0aW9uIGRlcHRoLlxuICovXG5mdW5jdGlvbiogc3RlcE91dCgpIHtcbiAgaWYgKHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQubG9jYXRpb24uaXNNdWx0aWxpbmUpKSB7XG4gICAgeWllbGQqIHN0ZXBPdmVyKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhcnRpbmdEZXB0aCA9IHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQuZnVuY3Rpb25EZXB0aCk7XG4gIHZhciBjdXJyZW50RGVwdGg7XG5cbiAgZG8ge1xuICAgIHlpZWxkKiBzdGVwTmV4dCgpO1xuXG4gICAgY3VycmVudERlcHRoID0geWllbGQgc2VsZWN0KGNvbnRyb2xsZXIuY3VycmVudC5mdW5jdGlvbkRlcHRoKTtcbiAgfSB3aGlsZSAoY3VycmVudERlcHRoID49IHN0YXJ0aW5nRGVwdGgpO1xufVxuXG4vKipcbiAqIHN0ZXBPdmVyIC0gc3RlcCBvdmVyIHRoZSBjdXJyZW50IGxpbmVcbiAqXG4gKiBTdGVwIG92ZXIgdGhlIGN1cnJlbnQgbGluZS4gVGhpcyB3aWxsIHN0ZXAgdG8gdGhlIG5leHQgaW5zdHJ1Y3Rpb24gdGhhdFxuICogZXhpc3RzIG9uIGEgZGlmZmVyZW50IGxpbmUgb2YgY29kZSB3aXRoaW4gdGhlIHNhbWUgZnVuY3Rpb24gZGVwdGguXG4gKi9cbmZ1bmN0aW9uKiBzdGVwT3ZlcigpIHtcbiAgY29uc3Qgc3RhcnRpbmdEZXB0aCA9IHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQuZnVuY3Rpb25EZXB0aCk7XG4gIGNvbnN0IHN0YXJ0aW5nUmFuZ2UgPSB5aWVsZCBzZWxlY3QoY29udHJvbGxlci5jdXJyZW50LmxvY2F0aW9uLnNvdXJjZVJhbmdlKTtcbiAgdmFyIGN1cnJlbnREZXB0aDtcbiAgdmFyIGN1cnJlbnRSYW5nZTtcblxuICBkbyB7XG4gICAgeWllbGQqIHN0ZXBOZXh0KCk7XG5cbiAgICBjdXJyZW50RGVwdGggPSB5aWVsZCBzZWxlY3QoY29udHJvbGxlci5jdXJyZW50LmZ1bmN0aW9uRGVwdGgpO1xuICAgIGN1cnJlbnRSYW5nZSA9IHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQubG9jYXRpb24uc291cmNlUmFuZ2UpO1xuICB9IHdoaWxlIChcbiAgICAvLyBrZWVwIHN0ZXBwaW5nIHByb3ZpZGVkOlxuICAgIC8vXG4gICAgLy8gd2UgaGF2ZW4ndCBqdW1wZWQgb3V0XG4gICAgIShjdXJyZW50RGVwdGggPCBzdGFydGluZ0RlcHRoKSAmJlxuICAgIC8vIGVpdGhlcjogZnVuY3Rpb24gZGVwdGggaXMgZ3JlYXRlciB0aGFuIHN0YXJ0aW5nIChpZ25vcmUgZnVuY3Rpb24gY2FsbHMpXG4gICAgLy8gb3IsIGlmIHdlJ3JlIGF0IHRoZSBzYW1lIGRlcHRoLCBrZWVwIHN0ZXBwaW5nIHVudGlsIHdlJ3JlIG9uIGEgbmV3XG4gICAgLy8gbGluZS5cbiAgICAoY3VycmVudERlcHRoID4gc3RhcnRpbmdEZXB0aCB8fFxuICAgICAgY3VycmVudFJhbmdlLmxpbmVzLnN0YXJ0LmxpbmUgPT0gc3RhcnRpbmdSYW5nZS5saW5lcy5zdGFydC5saW5lKVxuICApO1xufVxuXG4vKipcbiAqIGNvbnRpbnVlVW50aWxCcmVha3BvaW50IC0gc3RlcCB0aHJvdWdoIGV4ZWN1dGlvbiB1bnRpbCBhIGJyZWFrcG9pbnRcbiAqL1xuZnVuY3Rpb24qIGNvbnRpbnVlVW50aWxCcmVha3BvaW50KGFjdGlvbikge1xuICB2YXIgY3VycmVudExvY2F0aW9uLCBjdXJyZW50Tm9kZSwgY3VycmVudExpbmUsIGN1cnJlbnRTb3VyY2VJZDtcbiAgdmFyIGZpbmlzaGVkO1xuICB2YXIgcHJldmlvdXNMaW5lLCBwcmV2aW91c1NvdXJjZUlkO1xuXG4gIC8vaWYgYnJlYWtwb2ludHMgd2FzIG5vdCBzcGVjaWZpZWQsIHVzZSB0aGUgc3RvcmVkIGxpc3QgZnJvbSB0aGUgc3RhdGUuXG4gIC8vaWYgaXQgd2FzLCBvdmVycmlkZSB0aGF0IHdpdGggdGhlIHNwZWNpZmllZCBsaXN0LlxuICAvL25vdGUgdGhhdCBleHBsaWNpdGx5IHNwZWNpZnlpbmcgYW4gZW1wdHkgbGlzdCB3aWxsIGFkdmFuY2UgdG8gdGhlIGVuZC5cbiAgbGV0IGJyZWFrcG9pbnRzID1cbiAgICBhY3Rpb24gIT09IHVuZGVmaW5lZCAmJiBhY3Rpb24uYnJlYWtwb2ludHMgIT09IHVuZGVmaW5lZFxuICAgICAgPyBhY3Rpb24uYnJlYWtwb2ludHNcbiAgICAgIDogeWllbGQgc2VsZWN0KGNvbnRyb2xsZXIuYnJlYWtwb2ludHMpO1xuXG4gIGxldCBicmVha3BvaW50SGl0ID0gZmFsc2U7XG5cbiAgY3VycmVudExvY2F0aW9uID0geWllbGQgc2VsZWN0KGNvbnRyb2xsZXIuY3VycmVudC5sb2NhdGlvbik7XG4gIGN1cnJlbnROb2RlID0gY3VycmVudExvY2F0aW9uLm5vZGUuaWQ7XG4gIGN1cnJlbnRMaW5lID0gY3VycmVudExvY2F0aW9uLnNvdXJjZVJhbmdlLmxpbmVzLnN0YXJ0LmxpbmU7XG4gIGN1cnJlbnRTb3VyY2VJZCA9IGN1cnJlbnRMb2NhdGlvbi5zb3VyY2UuaWQ7XG5cbiAgZG8ge1xuICAgIHlpZWxkKiBzdGVwTmV4dCgpO1xuXG4gICAgcHJldmlvdXNMaW5lID0gY3VycmVudExpbmU7XG4gICAgcHJldmlvdXNTb3VyY2VJZCA9IGN1cnJlbnRTb3VyY2VJZDtcblxuICAgIGN1cnJlbnRMb2NhdGlvbiA9IHlpZWxkIHNlbGVjdChjb250cm9sbGVyLmN1cnJlbnQubG9jYXRpb24pO1xuICAgIGZpbmlzaGVkID0geWllbGQgc2VsZWN0KGNvbnRyb2xsZXIuY3VycmVudC50cmFjZS5maW5pc2hlZCk7XG4gICAgZGVidWcoXCJmaW5pc2hlZCAlb1wiLCBmaW5pc2hlZCk7XG5cbiAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnRMb2NhdGlvbi5ub2RlLmlkO1xuICAgIGN1cnJlbnRMaW5lID0gY3VycmVudExvY2F0aW9uLnNvdXJjZVJhbmdlLmxpbmVzLnN0YXJ0LmxpbmU7XG4gICAgY3VycmVudFNvdXJjZUlkID0gY3VycmVudExvY2F0aW9uLnNvdXJjZS5pZDtcblxuICAgIGJyZWFrcG9pbnRIaXQgPVxuICAgICAgYnJlYWtwb2ludHMuZmlsdGVyKCh7IHNvdXJjZUlkLCBsaW5lLCBub2RlIH0pID0+IHtcbiAgICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRlYnVnKFwibm9kZSAlZCBjdXJyZW50Tm9kZSAlZFwiLCBub2RlLCBjdXJyZW50Tm9kZSk7XG4gICAgICAgICAgcmV0dXJuIHNvdXJjZUlkID09PSBjdXJyZW50U291cmNlSWQgJiYgbm9kZSA9PT0gY3VycmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgLy9vdGhlcndpc2UsIHdlIGhhdmUgYSBsaW5lLXN0eWxlIGJyZWFrcG9pbnQ7IHdlIHdhbnQgdG8gc3RvcCBhdCB0aGVcbiAgICAgICAgLy8qZmlyc3QqIHBvaW50IG9uIHRoZSBsaW5lXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgc291cmNlSWQgPT09IGN1cnJlbnRTb3VyY2VJZCAmJlxuICAgICAgICAgIGxpbmUgPT09IGN1cnJlbnRMaW5lICYmXG4gICAgICAgICAgKGN1cnJlbnRTb3VyY2VJZCAhPT0gcHJldmlvdXNTb3VyY2VJZCB8fCBjdXJyZW50TGluZSAhPT0gcHJldmlvdXNMaW5lKVxuICAgICAgICApO1xuICAgICAgfSkubGVuZ3RoID4gMDtcbiAgfSB3aGlsZSAoIWJyZWFrcG9pbnRIaXQgJiYgIWZpbmlzaGVkKTtcbn1cblxuLyoqXG4gKiByZXNldCAtLSByZXNldCB0aGUgc3RhdGUgb2YgdGhlIGRlYnVnZ2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiogcmVzZXQoKSB7XG4gIHlpZWxkKiBkYXRhLnJlc2V0KCk7XG4gIHlpZWxkKiBldm0ucmVzZXQoKTtcbiAgeWllbGQqIHNvbGlkaXR5LnJlc2V0KCk7XG4gIHlpZWxkKiB0cmFjZS5yZXNldCgpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9jb250cm9sbGVyL3NhZ2FzL2luZGV4LmpzIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOnNvbGlkaXR5OnNhZ2FzXCIpO1xuXG5pbXBvcnQgeyBwdXQsIHRha2VFdmVyeSwgc2VsZWN0IH0gZnJvbSBcInJlZHV4LXNhZ2EvZWZmZWN0c1wiO1xuaW1wb3J0IHsgcHJlZml4TmFtZSB9IGZyb20gXCJsaWIvaGVscGVyc1wiO1xuXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gXCIuLi9hY3Rpb25zXCI7XG5pbXBvcnQgeyBUSUNLIH0gZnJvbSBcImxpYi90cmFjZS9hY3Rpb25zXCI7XG5pbXBvcnQgKiBhcyB0cmFjZSBmcm9tIFwibGliL3RyYWNlL3NhZ2FzXCI7XG5cbmltcG9ydCBzb2xpZGl0eSBmcm9tIFwiLi4vc2VsZWN0b3JzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiogYWRkU291cmNlKHNvdXJjZSwgc291cmNlUGF0aCwgYXN0LCBjb21waWxlcikge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5hZGRTb3VyY2Uoc291cmNlLCBzb3VyY2VQYXRoLCBhc3QsIGNvbXBpbGVyKSk7XG59XG5cbmZ1bmN0aW9uKiB0aWNrU2FnYSgpIHtcbiAgZGVidWcoXCJnb3QgVElDS1wiKTtcblxuICB5aWVsZCogZnVuY3Rpb25EZXB0aFNhZ2EoKTtcbiAgeWllbGQqIHRyYWNlLnNpZ25hbFRpY2tTYWdhQ29tcGxldGlvbigpO1xufVxuXG5mdW5jdGlvbiogZnVuY3Rpb25EZXB0aFNhZ2EoKSB7XG4gIGlmICh5aWVsZCBzZWxlY3Qoc29saWRpdHkuY3VycmVudC53aWxsRmFpbCkpIHtcbiAgICAvL3dlIGRvIHRoaXMgY2FzZSBmaXJzdCBzbyB3ZSBjYW4gYmUgc3VyZSB3ZSdyZSBub3QgZmFpbGluZyBpbiBhbnkgb2YgdGhlXG4gICAgLy9vdGhlciBjYXNlcyBiZWxvdyFcbiAgICB5aWVsZCBwdXQoYWN0aW9ucy5leHRlcm5hbFJldHVybigpKTtcbiAgfSBlbHNlIGlmICh5aWVsZCBzZWxlY3Qoc29saWRpdHkuY3VycmVudC53aWxsSnVtcCkpIHtcbiAgICBsZXQganVtcERpcmVjdGlvbiA9IHlpZWxkIHNlbGVjdChzb2xpZGl0eS5jdXJyZW50Lmp1bXBEaXJlY3Rpb24pO1xuICAgIHlpZWxkIHB1dChhY3Rpb25zLmp1bXAoanVtcERpcmVjdGlvbikpO1xuICB9IGVsc2UgaWYgKHlpZWxkIHNlbGVjdChzb2xpZGl0eS5jdXJyZW50LndpbGxDYWxsKSkge1xuICAgIGRlYnVnKFwiYWJvdXQgdG8gY2FsbFwiKTtcbiAgICBpZiAoeWllbGQgc2VsZWN0KHNvbGlkaXR5LmN1cnJlbnQuY2FsbHNQcmVjb21waWxlT3JFeHRlcm5hbCkpIHtcbiAgICAgIC8vY2FsbCB0byBwcmVjb21waWxlIG9yIGV4dGVybmFsbHktb3duZWQgYWNjb3VudDsgZG8gbm90aGluZ1xuICAgIH0gZWxzZSB7XG4gICAgICB5aWVsZCBwdXQoYWN0aW9ucy5leHRlcm5hbENhbGwoKSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHlpZWxkIHNlbGVjdChzb2xpZGl0eS5jdXJyZW50LndpbGxDcmVhdGUpKSB7XG4gICAgeWllbGQgcHV0KGFjdGlvbnMuZXh0ZXJuYWxDYWxsKCkpO1xuICB9IGVsc2UgaWYgKHlpZWxkIHNlbGVjdChzb2xpZGl0eS5jdXJyZW50LndpbGxSZXR1cm4pKSB7XG4gICAgeWllbGQgcHV0KGFjdGlvbnMuZXh0ZXJuYWxSZXR1cm4oKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiByZXNldCgpIHtcbiAgeWllbGQgcHV0KGFjdGlvbnMucmVzZXQoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogc2FnYSgpIHtcbiAgeWllbGQgdGFrZUV2ZXJ5KFRJQ0ssIHRpY2tTYWdhKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcHJlZml4TmFtZShcInNvbGlkaXR5XCIsIHNhZ2EpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9zb2xpZGl0eS9zYWdhcy9pbmRleC5qcyIsImV4cG9ydCBjb25zdCBBRERfU09VUkNFID0gXCJTT0xJRElUWV9BRERfU09VUkNFXCI7XG5leHBvcnQgZnVuY3Rpb24gYWRkU291cmNlKHNvdXJjZSwgc291cmNlUGF0aCwgYXN0LCBjb21waWxlcikge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFERF9TT1VSQ0UsXG4gICAgc291cmNlLFxuICAgIHNvdXJjZVBhdGgsXG4gICAgYXN0LFxuICAgIGNvbXBpbGVyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBKVU1QID0gXCJKVU1QXCI7XG5leHBvcnQgZnVuY3Rpb24ganVtcChqdW1wRGlyZWN0aW9uKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogSlVNUCxcbiAgICBqdW1wRGlyZWN0aW9uXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBFWFRFUk5BTF9DQUxMID0gXCJFWFRFUk5BTF9DQUxMXCI7XG5leHBvcnQgZnVuY3Rpb24gZXh0ZXJuYWxDYWxsKCkge1xuICByZXR1cm4geyB0eXBlOiBFWFRFUk5BTF9DQUxMIH07XG59XG5cbmV4cG9ydCBjb25zdCBFWFRFUk5BTF9SRVRVUk4gPSBcIkVYVEVSTkFMX1JFVFVSTlwiO1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVybmFsUmV0dXJuKCkge1xuICByZXR1cm4geyB0eXBlOiBFWFRFUk5BTF9SRVRVUk4gfTtcbn1cblxuZXhwb3J0IGNvbnN0IFJFU0VUID0gXCJTT0xJRElUWV9SRVNFVFwiO1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0KCkge1xuICByZXR1cm4geyB0eXBlOiBSRVNFVCB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9zb2xpZGl0eS9hY3Rpb25zL2luZGV4LmpzIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOmFzdDpzZWxlY3RvcnNcIik7XG5cbmltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yVHJlZSwgY3JlYXRlTGVhZiB9IGZyb20gXCJyZXNlbGVjdC10cmVlXCI7XG5cbmltcG9ydCBzb2xpZGl0eSBmcm9tIFwibGliL3NvbGlkaXR5L3NlbGVjdG9yc1wiO1xuXG4vKipcbiAqIGFzdFxuICovXG5jb25zdCBhc3QgPSBjcmVhdGVTZWxlY3RvclRyZWUoe1xuICAvKipcbiAgICogYXN0LnZpZXdzXG4gICAqL1xuICB2aWV3czoge1xuICAgIC8qKlxuICAgICAqIGFzdC52aWV3cy5zb3VyY2VzXG4gICAgICovXG4gICAgc291cmNlczogY3JlYXRlTGVhZihbc29saWRpdHkuaW5mby5zb3VyY2VzXSwgc291cmNlcyA9PiBzb3VyY2VzKVxuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYXN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9hc3Qvc2VsZWN0b3JzL2luZGV4LmpzIiwidmFyIERlYnVnZ2VyID0gcmVxdWlyZShcIi4vbGliL2RlYnVnZ2VyXCIpLmRlZmF1bHQ7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVidWdnZXI7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZGVidWdnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBkZWJ1Z01vZHVsZSBmcm9tIFwiZGVidWdcIjtcbmNvbnN0IGRlYnVnID0gZGVidWdNb2R1bGUoXCJkZWJ1Z2dlclwiKTtcbmltcG9ydCBleHBlY3QgZnJvbSBcInRydWZmbGUtZXhwZWN0XCI7XG5cbmltcG9ydCBTZXNzaW9uIGZyb20gXCIuL3Nlc3Npb25cIjtcblxuaW1wb3J0IHsgY3JlYXRlTmVzdGVkU2VsZWN0b3IgfSBmcm9tIFwicmVzZWxlY3QtdHJlZVwiO1xuXG5pbXBvcnQgZGF0YVNlbGVjdG9yIGZyb20gXCIuL2RhdGEvc2VsZWN0b3JzXCI7XG5pbXBvcnQgYXN0U2VsZWN0b3IgZnJvbSBcIi4vYXN0L3NlbGVjdG9yc1wiO1xuaW1wb3J0IHRyYWNlU2VsZWN0b3IgZnJvbSBcIi4vdHJhY2Uvc2VsZWN0b3JzXCI7XG5pbXBvcnQgZXZtU2VsZWN0b3IgZnJvbSBcIi4vZXZtL3NlbGVjdG9yc1wiO1xuaW1wb3J0IHNvbGlkaXR5U2VsZWN0b3IgZnJvbSBcIi4vc29saWRpdHkvc2VsZWN0b3JzXCI7XG5pbXBvcnQgc2Vzc2lvblNlbGVjdG9yIGZyb20gXCIuL3Nlc3Npb24vc2VsZWN0b3JzXCI7XG5pbXBvcnQgY29udHJvbGxlclNlbGVjdG9yIGZyb20gXCIuL2NvbnRyb2xsZXIvc2VsZWN0b3JzXCI7XG5cbi8qKlxuICogQGV4YW1wbGVcbiAqIGxldCBzZXNzaW9uID0gRGVidWdnZXJcbiAqICAgLmZvclR4KDx0eEhhc2g+LCB7XG4gKiAgICAgY29udHJhY3RzOiBbPGNvbnRyYWN0IG9iaj4sIC4uLl0sXG4gKiAgICAgcHJvdmlkZXI6IDxwcm92aWRlciBpbnN0YW5jZT5cbiAqICAgfSlcbiAqICAgLmNvbm5lY3QoKTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVidWdnZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtTZXNzaW9ufSBzZXNzaW9uIC0gZGVidWdnZXIgc2Vzc2lvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2Vzc2lvbikge1xuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fc2Vzc2lvbiA9IHNlc3Npb247XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFudGlhdGVzIGEgRGVidWdnZXIgZm9yIGEgZ2l2ZW4gdHJhbnNhY3Rpb24gaGFzaC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR4SGFzaCAtIHRyYW5zYWN0aW9uIGhhc2ggd2l0aCBsZWFkaW5nIFwiMHhcIlxuICAgKiBAcGFyYW0ge3tjb250cmFjdHM6IEFycmF5PENvbnRyYWN0PiwgZmlsZXM6IEFycmF5PFN0cmluZz4sIHByb3ZpZGVyOiBXZWIzUHJvdmlkZXJ9fSBvcHRpb25zIC1cbiAgICogQHJldHVybiB7RGVidWdnZXJ9IGluc3RhbmNlXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgZm9yVHgodHhIYXNoLCBvcHRpb25zID0ge30pIHtcbiAgICBleHBlY3Qub3B0aW9ucyhvcHRpb25zLCBbXCJjb250cmFjdHNcIiwgXCJwcm92aWRlclwiXSk7XG5cbiAgICBsZXQgc2Vzc2lvbiA9IG5ldyBTZXNzaW9uKFxuICAgICAgb3B0aW9ucy5jb250cmFjdHMsXG4gICAgICBvcHRpb25zLmZpbGVzLFxuICAgICAgb3B0aW9ucy5wcm92aWRlcixcbiAgICAgIHR4SGFzaFxuICAgICk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgc2Vzc2lvbi5yZWFkeSgpO1xuICAgICAgZGVidWcoXCJzZXNzaW9uIHJlYWR5XCIpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlYnVnKFwiZXJyb3Igb2NjdXJyZWQsIHVubG9hZGVkXCIpO1xuICAgICAgc2Vzc2lvbi51bmxvYWQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IHRoaXMoc2Vzc2lvbik7XG4gIH1cblxuICAvKlxuICAgKiBJbnN0YW50aWF0ZXMgYSBEZWJ1Z2dlciBmb3IgYSBnaXZlbiBwcm9qZWN0ICh3aXRoIG5vIHRyYW5zYWN0aW9uIGxvYWRlZClcbiAgICpcbiAgICogQHBhcmFtIHt7Y29udHJhY3RzOiBBcnJheTxDb250cmFjdD4sIGZpbGVzOiBBcnJheTxTdHJpbmc+LCBwcm92aWRlcjogV2ViM1Byb3ZpZGVyfX0gb3B0aW9ucyAtXG4gICAqIEByZXR1cm4ge0RlYnVnZ2VyfSBpbnN0YW5jZVxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGZvclByb2plY3Qob3B0aW9ucyA9IHt9KSB7XG4gICAgZXhwZWN0Lm9wdGlvbnMob3B0aW9ucywgW1wiY29udHJhY3RzXCIsIFwicHJvdmlkZXJcIl0pO1xuXG4gICAgbGV0IHNlc3Npb24gPSBuZXcgU2Vzc2lvbihcbiAgICAgIG9wdGlvbnMuY29udHJhY3RzLFxuICAgICAgb3B0aW9ucy5maWxlcyxcbiAgICAgIG9wdGlvbnMucHJvdmlkZXJcbiAgICApO1xuXG4gICAgYXdhaXQgc2Vzc2lvbi5yZWFkeSgpO1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzKHNlc3Npb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3RzIHRvIHRoZSBpbnN0YW50aWF0ZWQgRGVidWdnZXIuXG4gICAqXG4gICAqIEByZXR1cm4ge1Nlc3Npb259IHNlc3Npb24gaW5zdGFuY2VcbiAgICovXG4gIGNvbm5lY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Nlc3Npb247XG4gIH1cblxuICAvKipcbiAgICogRXhwb3J0ZWQgc2VsZWN0b3JzXG4gICAqXG4gICAqIFNlZSBpbmRpdmlkdWFsIHNlbGVjdG9yIGRvY3MgZm9yIGZ1bGwgbGlzdGluZ1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBEZWJ1Z2dlci5zZWxlY3RvcnMuYXN0LmN1cnJlbnQudHJlZVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBEZWJ1Z2dlci5zZWxlY3RvcnMuc29saWRpdHkuY3VycmVudC5pbnN0cnVjdGlvblxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBEZWJ1Z2dlci5zZWxlY3RvcnMudHJhY2Uuc3RlcHNcbiAgICovXG4gIHN0YXRpYyBnZXQgc2VsZWN0b3JzKCkge1xuICAgIHJldHVybiBjcmVhdGVOZXN0ZWRTZWxlY3Rvcih7XG4gICAgICBhc3Q6IGFzdFNlbGVjdG9yLFxuICAgICAgZGF0YTogZGF0YVNlbGVjdG9yLFxuICAgICAgdHJhY2U6IHRyYWNlU2VsZWN0b3IsXG4gICAgICBldm06IGV2bVNlbGVjdG9yLFxuICAgICAgc29saWRpdHk6IHNvbGlkaXR5U2VsZWN0b3IsXG4gICAgICBzZXNzaW9uOiBzZXNzaW9uU2VsZWN0b3IsXG4gICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyU2VsZWN0b3JcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENvbnRyYWN0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gY29udHJhY3ROYW1lIGNvbnRyYWN0IG5hbWVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzb3VyY2Ugc29saWRpdHkgc291cmNlIGNvZGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzb3VyY2VQYXRoIHBhdGggdG8gc291cmNlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5hcnkgMHgtcHJlZml4ZWQgaGV4IHN0cmluZyB3aXRoIGNyZWF0ZSBieXRlY29kZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNvdXJjZU1hcCBzb2xpZGl0eSBzb3VyY2UgbWFwIGZvciBjcmVhdGUgYnl0ZWNvZGVcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBhc3QgQWJzdHJhY3QgU3ludGF4IFRyZWUgZnJvbSBTb2xpZGl0eVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlcGxveWVkQmluYXJ5IDB4LXByZWZpeGVkIGNvbXBpbGVkIGJpbmFyeSAob24gY2hhaW4pXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGVwbG95ZWRTb3VyY2VNYXAgc29saWRpdHkgc291cmNlIG1hcCBmb3Igb24tY2hhaW4gYnl0ZWNvZGVcbiAqL1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9kZWJ1Z2dlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRydWZmbGUtZXhwZWN0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidHJ1ZmZsZS1leHBlY3RcIlxuLy8gbW9kdWxlIGlkID0gMzlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOnNlc3Npb25cIik7XG5cbmltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tIFwibGliL3N0b3JlXCI7XG5cbmltcG9ydCAqIGFzIGNvbnRyb2xsZXIgZnJvbSBcImxpYi9jb250cm9sbGVyL2FjdGlvbnNcIjtcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSBcIi4vYWN0aW9uc1wiO1xuaW1wb3J0IGRhdGEgZnJvbSBcImxpYi9kYXRhL3NlbGVjdG9yc1wiO1xuaW1wb3J0IHNlc3Npb24gZnJvbSBcImxpYi9zZXNzaW9uL3NlbGVjdG9yc1wiO1xuaW1wb3J0ICogYXMgZGF0YVNhZ2FzIGZyb20gXCJsaWIvZGF0YS9zYWdhc1wiO1xuaW1wb3J0ICogYXMgY29udHJvbGxlclNhZ2FzIGZyb20gXCJsaWIvY29udHJvbGxlci9zYWdhc1wiO1xuaW1wb3J0ICogYXMgc2FnYXMgZnJvbSBcIi4vc2FnYXNcIjtcbmltcG9ydCBjb250cm9sbGVyU2VsZWN0b3IgZnJvbSBcImxpYi9jb250cm9sbGVyL3NlbGVjdG9yc1wiO1xuXG5pbXBvcnQgcm9vdFNhZ2EgZnJvbSBcIi4vc2FnYXNcIjtcbmltcG9ydCByZWR1Y2VyIGZyb20gXCIuL3JlZHVjZXJzXCI7XG5cbi8qKlxuICogRGVidWdnZXIgU2Vzc2lvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXNzaW9uIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXk8Q29udHJhY3Q+fSBjb250cmFjdHMgLSBjb250cmFjdCBkZWZpbml0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGZpbGVzIC0gYXJyYXkgb2YgZmlsZW5hbWVzIGZvciBzb3VyY2VNYXAgaW5kZXhlc1xuICAgKiBAcGFyYW0ge1dlYjNQcm92aWRlcn0gcHJvdmlkZXIgLSB3ZWIzIHByb3ZpZGVyXG4gICAqIHR4SGFzaCBwYXJhbWV0ZXIgaXMgbm93IG9wdGlvbmFsIVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29udHJhY3RzLCBmaWxlcywgcHJvdmlkZXIsIHR4SGFzaCkge1xuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgbGV0IHsgc3RvcmUsIHNhZ2FNaWRkbGV3YXJlIH0gPSBjb25maWd1cmVTdG9yZShyZWR1Y2VyLCByb290U2FnYSk7XG4gICAgdGhpcy5fc3RvcmUgPSBzdG9yZTtcbiAgICB0aGlzLl9zYWdhTWlkZGxld2FyZSA9IHNhZ2FNaWRkbGV3YXJlO1xuXG4gICAgbGV0IHsgY29udGV4dHMsIHNvdXJjZXMgfSA9IFNlc3Npb24ubm9ybWFsaXplKGNvbnRyYWN0cywgZmlsZXMpO1xuXG4gICAgLy8gcmVjb3JkIGNvbnRyYWN0c1xuICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKGFjdGlvbnMucmVjb3JkQ29udHJhY3RzKGNvbnRleHRzLCBzb3VyY2VzKSk7XG5cbiAgICAvL3NldCB1cCB0aGUgcmVhZHkgbGlzdGVuZXJcbiAgICB0aGlzLl9yZWFkeSA9IG5ldyBQcm9taXNlKChhY2NlcHQsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdW5zdWJzY3JpYmUgPSB0aGlzLl9zdG9yZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy52aWV3KHNlc3Npb24uc3RhdHVzLnJlYWR5KSkge1xuICAgICAgICAgIGRlYnVnKFwicmVhZHkhXCIpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgYWNjZXB0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52aWV3KHNlc3Npb24uc3RhdHVzLmVycm9yZWQpKSB7XG4gICAgICAgICAgZGVidWcoXCJlcnJvciFcIik7XG4gICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICByZWplY3QodGhpcy52aWV3KHNlc3Npb24uc3RhdHVzLmVycm9yKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy9ub3RlIHRoYXQgdHhIYXNoIGlzIG5vdyBvcHRpb25hbFxuICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKGFjdGlvbnMuc3RhcnQocHJvdmlkZXIsIHR4SGFzaCkpO1xuICB9XG5cbiAgYXN5bmMgcmVhZHkoKSB7XG4gICAgYXdhaXQgdGhpcy5fcmVhZHk7XG4gIH1cblxuICBhc3luYyByZWFkeUFnYWluQWZ0ZXJMb2FkaW5nKHNlc3Npb25BY3Rpb24pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKGFjY2VwdCwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgaGFzU3RhcnRlZFdhaXRpbmcgPSBmYWxzZTtcbiAgICAgIGRlYnVnKFwicmVyZWFkeSBsaXN0ZW5lciBzZXQgdXBcIik7XG4gICAgICBjb25zdCB1bnN1YnNjcmliZSA9IHRoaXMuX3N0b3JlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGRlYnVnKFwicmVyZWFkeT9cIik7XG4gICAgICAgIGlmIChoYXNTdGFydGVkV2FpdGluZykge1xuICAgICAgICAgIGlmICh0aGlzLnZpZXcoc2Vzc2lvbi5zdGF0dXMucmVhZHkpKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcInJlcmVhZHkhXCIpO1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGFjY2VwdCh0cnVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmlldyhzZXNzaW9uLnN0YXR1cy5lcnJvcmVkKSkge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGRlYnVnKFwiZXJyb3IhXCIpO1xuICAgICAgICAgICAgcmVqZWN0KHRoaXMudmlldyhzZXNzaW9uLnN0YXR1cy5lcnJvcikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy52aWV3KHNlc3Npb24uc3RhdHVzLndhaXRpbmcpKSB7XG4gICAgICAgICAgICBkZWJ1ZyhcInN0YXJ0ZWQgd2FpdGluZ1wiKTtcbiAgICAgICAgICAgIGhhc1N0YXJ0ZWRXYWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlzcGF0Y2goc2Vzc2lvbkFjdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgdXAgYXJ0aWZhY3RzIGludG8gXCJjb250ZXh0c1wiIGFuZCBcInNvdXJjZXNcIiwgZGl2aWRpbmcgYXJ0aWZhY3RcbiAgICogZGF0YSBpbnRvIGFwcHJvcHJpYXRlIGJ1Y2tldHMuXG4gICAqXG4gICAqIE11bHRpcGxlIGNvbnRyYWN0cyBjYW4gYmUgZGVmaW5lZCBpbiB0aGUgc2FtZSBzb3VyY2UgZmlsZSwgYnV0IGhhdmVcbiAgICogZGlmZmVyZW50IGJ5dGVjb2Rlcy5cbiAgICpcbiAgICogVGhpcyBpdGVyYXRlcyBvdmVyIHRoZSBjb250cmFjdHMgYW5kIGNvbGxlY3RzIGJpbmFyaWVzIHNlcGFyYXRlbHlcbiAgICogZnJvbSBzb3VyY2VzLCB1c2luZyB0aGUgb3B0aW9uYWwgYGZpbGVzYCBhcmd1bWVudCB0byBmb3JjZVxuICAgKiBzb3VyY2Ugb3JkZXJpbmcuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgbm9ybWFsaXplKGNvbnRyYWN0cywgZmlsZXMgPSBudWxsKSB7XG4gICAgbGV0IHNvdXJjZXNCeVBhdGggPSB7fTtcbiAgICBsZXQgY29udGV4dHMgPSBbXTtcbiAgICBsZXQgc291cmNlcztcblxuICAgIGZvciAobGV0IGNvbnRyYWN0IG9mIGNvbnRyYWN0cykge1xuICAgICAgbGV0IHtcbiAgICAgICAgY29udHJhY3ROYW1lLFxuICAgICAgICBiaW5hcnksXG4gICAgICAgIHNvdXJjZU1hcCxcbiAgICAgICAgZGVwbG95ZWRCaW5hcnksXG4gICAgICAgIGRlcGxveWVkU291cmNlTWFwLFxuICAgICAgICBzb3VyY2VQYXRoLFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIGFzdCxcbiAgICAgICAgYWJpLFxuICAgICAgICBjb21waWxlclxuICAgICAgfSA9IGNvbnRyYWN0O1xuXG4gICAgICBsZXQgY29udHJhY3ROb2RlID0gYXN0Lm5vZGVzLmZpbmQoXG4gICAgICAgIG5vZGUgPT5cbiAgICAgICAgICBub2RlLm5vZGVUeXBlID09PSBcIkNvbnRyYWN0RGVmaW5pdGlvblwiICYmIG5vZGUubmFtZSA9PT0gY29udHJhY3ROYW1lXG4gICAgICApOyAvL2lkZWFsbHkgd2UnZCBob2xkIHRoaXMgb2ZmIHRpbGwgbGF0ZXIsIGJ1dCB0aGF0IHdvdWxkIGJyZWFrIHRoZVxuICAgICAgLy9kaXJlY3Rpb24gb2YgdGhlIGV2bS9zb2xpZGl0eSBkZXBlbmRlbmNlLCBzbyB3ZSBkbyBpdCBub3dcblxuICAgICAgbGV0IGNvbnRyYWN0SWQgPSBjb250cmFjdE5vZGUuaWQ7XG4gICAgICBsZXQgY29udHJhY3RLaW5kID0gY29udHJhY3ROb2RlLmNvbnRyYWN0S2luZDtcblxuICAgICAgZGVidWcoXCJjb250cmFjdE5hbWUgJXNcIiwgY29udHJhY3ROYW1lKTtcbiAgICAgIGRlYnVnKFwic291cmNlTWFwICVvXCIsIHNvdXJjZU1hcCk7XG4gICAgICBkZWJ1ZyhcImNvbXBpbGVyICVvXCIsIGNvbXBpbGVyKTtcbiAgICAgIGRlYnVnKFwiYWJpICVPXCIsIGFiaSk7XG5cbiAgICAgIHNvdXJjZXNCeVBhdGhbc291cmNlUGF0aF0gPSB7IHNvdXJjZVBhdGgsIHNvdXJjZSwgYXN0LCBjb21waWxlciB9O1xuXG4gICAgICBpZiAoYmluYXJ5ICYmIGJpbmFyeSAhPSBcIjB4XCIpIHtcbiAgICAgICAgY29udGV4dHMucHVzaCh7XG4gICAgICAgICAgY29udHJhY3ROYW1lLFxuICAgICAgICAgIGJpbmFyeSxcbiAgICAgICAgICBzb3VyY2VNYXAsXG4gICAgICAgICAgYWJpLFxuICAgICAgICAgIGNvbXBpbGVyLFxuICAgICAgICAgIGNvbnRyYWN0SWQsXG4gICAgICAgICAgY29udHJhY3RLaW5kLFxuICAgICAgICAgIGlzQ29uc3RydWN0b3I6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXBsb3llZEJpbmFyeSAmJiBkZXBsb3llZEJpbmFyeSAhPSBcIjB4XCIpIHtcbiAgICAgICAgY29udGV4dHMucHVzaCh7XG4gICAgICAgICAgY29udHJhY3ROYW1lLFxuICAgICAgICAgIGJpbmFyeTogZGVwbG95ZWRCaW5hcnksXG4gICAgICAgICAgc291cmNlTWFwOiBkZXBsb3llZFNvdXJjZU1hcCxcbiAgICAgICAgICBhYmksXG4gICAgICAgICAgY29tcGlsZXIsXG4gICAgICAgICAgY29udHJhY3RJZCxcbiAgICAgICAgICBjb250cmFjdEtpbmQsXG4gICAgICAgICAgaXNDb25zdHJ1Y3RvcjogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmaWxlcykge1xuICAgICAgc291cmNlcyA9IE9iamVjdC52YWx1ZXMoc291cmNlc0J5UGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvdXJjZXMgPSBmaWxlcy5tYXAoZmlsZSA9PiBzb3VyY2VzQnlQYXRoW2ZpbGVdKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBjb250ZXh0cywgc291cmNlcyB9O1xuICB9XG5cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdG9yZS5nZXRTdGF0ZSgpO1xuICB9XG5cbiAgdmlldyhzZWxlY3Rvcikge1xuICAgIHJldHVybiBzZWxlY3Rvcih0aGlzLnN0YXRlKTtcbiAgfVxuXG4gIGFzeW5jIGRpc3BhdGNoKGFjdGlvbikge1xuICAgIHRoaXMuX3N0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBBbGxvd3MgcnVubmluZyBhbnkgc2FnYSAtLSBmb3IgaW50ZXJuYWwgdXNlIG9ubHkhXG4gICAqIFVzaW5nIHRoaXMgY291bGQgc2VyaW91c2x5IHNjcmV3IHVwIHRoZSBkZWJ1Z2dlciBzdGF0ZSBpZiB5b3VcbiAgICogZG9uJ3Qga25vdyB3aGF0IHlvdSdyZSBkb2luZyFcbiAgICovXG4gIGFzeW5jIF9ydW5TYWdhKHNhZ2EsIC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fc2FnYU1pZGRsZXdhcmUucnVuKHNhZ2EsIC4uLmFyZ3MpLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgYXN5bmMgaW50ZXJydXB0KCkge1xuICAgIGF3YWl0IHRoaXMuZGlzcGF0Y2goYWN0aW9ucy5pbnRlcnJ1cHQoKSk7XG4gICAgYXdhaXQgdGhpcy5kaXNwYXRjaChjb250cm9sbGVyLmludGVycnVwdCgpKTtcbiAgfVxuXG4gIGFzeW5jIGRvbmVTdGVwcGluZyhzdGVwcGVyQWN0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IGhhc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gdGhpcy5fc3RvcmUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgaXNTdGVwcGluZyA9IHRoaXMudmlldyhjb250cm9sbGVyU2VsZWN0b3IuaXNTdGVwcGluZyk7XG5cbiAgICAgICAgaWYgKGlzU3RlcHBpbmcgJiYgIWhhc1N0YXJ0ZWQpIHtcbiAgICAgICAgICBoYXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICBkZWJ1ZyhcImhlYXJkIHN0ZXAgc3RhcnRcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1N0ZXBwaW5nICYmIGhhc1N0YXJ0ZWQpIHtcbiAgICAgICAgICBkZWJ1ZyhcImhlYXJkIHN0ZXAgc3RvcFwiKTtcbiAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaChzdGVwcGVyQWN0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vcmV0dXJucyB0cnVlIG9uIHN1Y2Nlc3MsIGZhbHNlIG9uIGFscmVhZHkgbG9hZGVkLCBlcnJvciBvYmplY3Qgb24gZmFpbHVyZVxuICBhc3luYyBsb2FkKHR4SGFzaCkge1xuICAgIGlmICh0aGlzLnZpZXcoc2Vzc2lvbi5zdGF0dXMubG9hZGVkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVhZHlBZ2FpbkFmdGVyTG9hZGluZyhhY3Rpb25zLmxvYWRUcmFuc2FjdGlvbih0eEhhc2gpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLl9ydW5TYWdhKHNhZ2FzLnVubG9hZCk7XG4gICAgICByZXR1cm4gZTtcbiAgICB9XG4gIH1cblxuICAvL3JldHVybnMgdHJ1ZSBvbiBzdWNjZXNzLCBmYWxzZSBvbiBhbHJlYWR5IHVubG9hZGVkXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICBpZiAoIXRoaXMudmlldyhzZXNzaW9uLnN0YXR1cy5sb2FkZWQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGRlYnVnKFwidW5sb2FkaW5nXCIpO1xuICAgIGF3YWl0IHRoaXMuX3J1blNhZ2Eoc2FnYXMudW5sb2FkKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vTm90ZTogY291bnQgaXMgYW4gb3B0aW9uYWwgYXJndW1lbnQ7IGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gYWR2YW5jZSAxXG4gIGFzeW5jIGFkdmFuY2UoY291bnQpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5kb25lU3RlcHBpbmcoY29udHJvbGxlci5hZHZhbmNlKGNvdW50KSk7XG4gIH1cblxuICBhc3luYyBzdGVwTmV4dCgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5kb25lU3RlcHBpbmcoY29udHJvbGxlci5zdGVwTmV4dCgpKTtcbiAgfVxuXG4gIGFzeW5jIHN0ZXBPdmVyKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmRvbmVTdGVwcGluZyhjb250cm9sbGVyLnN0ZXBPdmVyKCkpO1xuICB9XG5cbiAgYXN5bmMgc3RlcEludG8oKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZG9uZVN0ZXBwaW5nKGNvbnRyb2xsZXIuc3RlcEludG8oKSk7XG4gIH1cblxuICBhc3luYyBzdGVwT3V0KCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmRvbmVTdGVwcGluZyhjb250cm9sbGVyLnN0ZXBPdXQoKSk7XG4gIH1cblxuICBhc3luYyByZXNldCgpIHtcbiAgICBsZXQgbG9hZGVkID0gdGhpcy52aWV3KHNlc3Npb24uc3RhdHVzLmxvYWRlZCk7XG4gICAgaWYgKCFsb2FkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3J1blNhZ2EoY29udHJvbGxlclNhZ2FzLnJlc2V0KTtcbiAgfVxuXG4gIC8vTk9URTogYnJlYWtwb2ludHMgaXMgYW4gT1BUSU9OQUwgYXJndW1lbnQgZm9yIGlmIHlvdSB3YW50IHRvIHN1cHBseSB5b3VyXG4gIC8vb3duIGxpc3Qgb2YgYnJlYWtwb2ludHM7IGxlYXZlIGl0IG91dCB0byB1c2UgdGhlIGludGVybmFsIG9uZSAoYXNcbiAgLy9jb250cm9sbGVkIGJ5IHRoZSBmdW5jdGlvbnMgYmVsb3cpXG4gIGFzeW5jIGNvbnRpbnVlVW50aWxCcmVha3BvaW50KGJyZWFrcG9pbnRzKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZG9uZVN0ZXBwaW5nKFxuICAgICAgY29udHJvbGxlci5jb250aW51ZVVudGlsQnJlYWtwb2ludChicmVha3BvaW50cylcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgYWRkQnJlYWtwb2ludChicmVha3BvaW50KSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZGlzcGF0Y2goY29udHJvbGxlci5hZGRCcmVha3BvaW50KGJyZWFrcG9pbnQpKTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZUJyZWFrcG9pbnQoYnJlYWtwb2ludCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmRpc3BhdGNoKGNvbnRyb2xsZXIucmVtb3ZlQnJlYWtwb2ludChicmVha3BvaW50KSk7XG4gIH1cblxuICBhc3luYyByZW1vdmVBbGxCcmVha3BvaW50cygpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5kaXNwYXRjaChjb250cm9sbGVyLnJlbW92ZUFsbEJyZWFrcG9pbnRzKCkpO1xuICB9XG5cbiAgLy9kZXByZWNhdGVkIC0tIGRlY29kZSBpcyBub3cgKmFsd2F5cyogcmVhZHkhXG4gIGFzeW5jIGRlY29kZVJlYWR5KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgdmFyaWFibGUobmFtZSkge1xuICAgIGNvbnN0IGRlZmluaXRpb25zID0gdGhpcy52aWV3KGRhdGEuY3VycmVudC5pZGVudGlmaWVycy5kZWZpbml0aW9ucyk7XG4gICAgY29uc3QgcmVmcyA9IHRoaXMudmlldyhkYXRhLmN1cnJlbnQuaWRlbnRpZmllcnMucmVmcyk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fcnVuU2FnYShkYXRhU2FnYXMuZGVjb2RlLCBkZWZpbml0aW9uc1tuYW1lXSwgcmVmc1tuYW1lXSk7XG4gIH1cblxuICBhc3luYyB2YXJpYWJsZXMoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcoc2Vzc2lvbi5zdGF0dXMubG9hZGVkKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBsZXQgZGVmaW5pdGlvbnMgPSB0aGlzLnZpZXcoZGF0YS5jdXJyZW50LmlkZW50aWZpZXJzLmRlZmluaXRpb25zKTtcbiAgICBsZXQgcmVmcyA9IHRoaXMudmlldyhkYXRhLmN1cnJlbnQuaWRlbnRpZmllcnMucmVmcyk7XG4gICAgbGV0IGRlY29kZWQgPSB7fTtcbiAgICBmb3IgKGxldCBbaWRlbnRpZmllciwgcmVmXSBvZiBPYmplY3QuZW50cmllcyhyZWZzKSkge1xuICAgICAgaWYgKGlkZW50aWZpZXIgaW4gZGVmaW5pdGlvbnMpIHtcbiAgICAgICAgZGVjb2RlZFtpZGVudGlmaWVyXSA9IGF3YWl0IHRoaXMuX3J1blNhZ2EoXG4gICAgICAgICAgZGF0YVNhZ2FzLmRlY29kZSxcbiAgICAgICAgICBkZWZpbml0aW9uc1tpZGVudGlmaWVyXSxcbiAgICAgICAgICByZWZcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlY29kZWQ7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvc2Vzc2lvbi9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2VcIlxuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIikge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3Byb2R1Y3Rpb25cIik7XG59IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIikge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3Rlc3RcIik7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2RldmVsb3BtZW50XCIpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9zdG9yZS9pbmRleC5qcyIsImltcG9ydCBjb25maWd1cmVTdG9yZSBmcm9tIFwiLi9jb21tb25cIjtcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ3VyZVN0b3JlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9zdG9yZS9wcm9kdWN0aW9uLmpzIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOnN0b3JlOmNvbW1vblwiKTtcbmNvbnN0IHJlZHV4RGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOnJlZHV4XCIpO1xuXG5pbXBvcnQgeyBjb21wb3NlLCBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlIH0gZnJvbSBcInJlZHV4XCI7XG5pbXBvcnQgY3JlYXRlU2FnYU1pZGRsZXdhcmUgZnJvbSBcInJlZHV4LXNhZ2FcIjtcbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSBcInJlZHV4LWNsaS1sb2dnZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFiYnJldmlhdGVWYWx1ZXModmFsdWUsIG9wdGlvbnMgPSB7fSwgZGVwdGggPSAwKSB7XG4gIG9wdGlvbnMuc3RyaW5nTGltaXQgPSBvcHRpb25zLnN0cmluZ0xpbWl0IHx8IDY2O1xuICBvcHRpb25zLmFycmF5TGltaXQgPSBvcHRpb25zLmFycmF5TGltaXQgfHwgODtcbiAgb3B0aW9ucy5yZWN1cnNlTGltaXQgPSBvcHRpb25zLnJlY3Vyc2VMaW1pdCB8fCA0O1xuXG4gIGlmIChkZXB0aCA+IG9wdGlvbnMucmVjdXJzZUxpbWl0KSB7XG4gICAgcmV0dXJuIFwiLi4uXCI7XG4gIH1cblxuICBjb25zdCByZWN1cnNlID0gY2hpbGQgPT4gYWJicmV2aWF0ZVZhbHVlcyhjaGlsZCwgb3B0aW9ucywgZGVwdGggKyAxKTtcblxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGlmICh2YWx1ZS5sZW5ndGggPiBvcHRpb25zLmFycmF5TGltaXQpIHtcbiAgICAgIHZhbHVlID0gW1xuICAgICAgICAuLi52YWx1ZS5zbGljZSgwLCBvcHRpb25zLmFycmF5TGltaXQgLyAyKSxcbiAgICAgICAgXCIuLi5cIixcbiAgICAgICAgLi4udmFsdWUuc2xpY2UodmFsdWUubGVuZ3RoIC0gb3B0aW9ucy5hcnJheUxpbWl0IC8gMiArIDEpXG4gICAgICBdO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZS5tYXAocmVjdXJzZSk7XG4gIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgLi4uT2JqZWN0LmVudHJpZXModmFsdWUpLm1hcCgoW2ssIHZdKSA9PiAoeyBbcmVjdXJzZShrKV06IHJlY3Vyc2UodikgfSkpXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUubGVuZ3RoID4gb3B0aW9ucy5zdHJpbmdMaW1pdCkge1xuICAgIGxldCBpbm5lciA9IFwiLi4uXCI7XG4gICAgbGV0IGV4dHJhY3RBbW91bnQgPSAob3B0aW9ucy5zdHJpbmdMaW1pdCAtIGlubmVyLmxlbmd0aCkgLyAyO1xuICAgIGxldCBsZWFkaW5nID0gdmFsdWUuc2xpY2UoMCwgTWF0aC5jZWlsKGV4dHJhY3RBbW91bnQpKTtcbiAgICBsZXQgdHJhaWxpbmcgPSB2YWx1ZS5zbGljZSh2YWx1ZS5sZW5ndGggLSBNYXRoLmZsb29yKGV4dHJhY3RBbW91bnQpKTtcbiAgICByZXR1cm4gYCR7bGVhZGluZ30ke2lubmVyfSR7dHJhaWxpbmd9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uZmlndXJlU3RvcmUoXG4gIHJlZHVjZXIsXG4gIHNhZ2EsXG4gIGluaXRpYWxTdGF0ZSxcbiAgY29tcG9zZUVuaGFuY2Vyc1xuKSB7XG4gIGNvbnN0IHNhZ2FNaWRkbGV3YXJlID0gY3JlYXRlU2FnYU1pZGRsZXdhcmUoKTtcblxuICBpZiAoIWNvbXBvc2VFbmhhbmNlcnMpIHtcbiAgICBjb21wb3NlRW5oYW5jZXJzID0gY29tcG9zZTtcbiAgfVxuXG4gIGNvbnN0IGxvZ2dlck1pZGRsZXdhcmUgPSBjcmVhdGVMb2dnZXIoe1xuICAgIGxvZzogcmVkdXhEZWJ1ZyxcbiAgICBzdGF0ZVRyYW5zZm9ybWVyOiBzdGF0ZSA9PlxuICAgICAgYWJicmV2aWF0ZVZhbHVlcyhzdGF0ZSwge1xuICAgICAgICBhcnJheUxpbWl0OiA0LFxuICAgICAgICByZWN1cnNlTGltaXQ6IDNcbiAgICAgIH0pLFxuICAgIGFjdGlvblRyYW5zZm9ybWVyOiBhYmJyZXZpYXRlVmFsdWVzXG4gIH0pO1xuXG4gIGxldCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxuICAgIHJlZHVjZXIsXG4gICAgaW5pdGlhbFN0YXRlLFxuXG4gICAgY29tcG9zZUVuaGFuY2VycyhhcHBseU1pZGRsZXdhcmUoc2FnYU1pZGRsZXdhcmUsIGxvZ2dlck1pZGRsZXdhcmUpKVxuICApO1xuXG4gIHNhZ2FNaWRkbGV3YXJlLnJ1bihzYWdhKTtcblxuICByZXR1cm4geyBzdG9yZSwgc2FnYU1pZGRsZXdhcmUgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvc3RvcmUvY29tbW9uLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVkdXgtc2FnYVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4LXNhZ2FcIlxuLy8gbW9kdWxlIGlkID0gNDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVkdXgtY2xpLWxvZ2dlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4LWNsaS1sb2dnZXJcIlxuLy8gbW9kdWxlIGlkID0gNDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGpzb24gPSB0eXBlb2YgSlNPTiAhPT0gJ3VuZGVmaW5lZCcgPyBKU09OIDogcmVxdWlyZSgnanNvbmlmeScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmosIG9wdHMpIHtcbiAgICBpZiAoIW9wdHMpIG9wdHMgPSB7fTtcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIG9wdHMgPSB7IGNtcDogb3B0cyB9O1xuICAgIHZhciBzcGFjZSA9IG9wdHMuc3BhY2UgfHwgJyc7XG4gICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gJ251bWJlcicpIHNwYWNlID0gQXJyYXkoc3BhY2UrMSkuam9pbignICcpO1xuICAgIHZhciBjeWNsZXMgPSAodHlwZW9mIG9wdHMuY3ljbGVzID09PSAnYm9vbGVhbicpID8gb3B0cy5jeWNsZXMgOiBmYWxzZTtcbiAgICB2YXIgcmVwbGFjZXIgPSBvcHRzLnJlcGxhY2VyIHx8IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gICAgdmFyIGNtcCA9IG9wdHMuY21wICYmIChmdW5jdGlvbiAoZikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHZhciBhb2JqID0geyBrZXk6IGEsIHZhbHVlOiBub2RlW2FdIH07XG4gICAgICAgICAgICAgICAgdmFyIGJvYmogPSB7IGtleTogYiwgdmFsdWU6IG5vZGVbYl0gfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZihhb2JqLCBib2JqKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfSkob3B0cy5jbXApO1xuXG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICByZXR1cm4gKGZ1bmN0aW9uIHN0cmluZ2lmeSAocGFyZW50LCBrZXksIG5vZGUsIGxldmVsKSB7XG4gICAgICAgIHZhciBpbmRlbnQgPSBzcGFjZSA/ICgnXFxuJyArIG5ldyBBcnJheShsZXZlbCArIDEpLmpvaW4oc3BhY2UpKSA6ICcnO1xuICAgICAgICB2YXIgY29sb25TZXBhcmF0b3IgPSBzcGFjZSA/ICc6ICcgOiAnOic7XG5cbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS50b0pTT04gJiYgdHlwZW9mIG5vZGUudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS50b0pTT04oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUgPSByZXBsYWNlci5jYWxsKHBhcmVudCwga2V5LCBub2RlKTtcblxuICAgICAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBub2RlICE9PSAnb2JqZWN0JyB8fCBub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ganNvbi5zdHJpbmdpZnkobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXkobm9kZSkpIHtcbiAgICAgICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gc3RyaW5naWZ5KG5vZGUsIGksIG5vZGVbaV0sIGxldmVsKzEpIHx8IGpzb24uc3RyaW5naWZ5KG51bGwpO1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKGluZGVudCArIHNwYWNlICsgaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgb3V0LmpvaW4oJywnKSArIGluZGVudCArICddJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWVuLmluZGV4T2Yobm9kZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN5Y2xlcykgcmV0dXJuIGpzb24uc3RyaW5naWZ5KCdfX2N5Y2xlX18nKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHNlZW4ucHVzaChub2RlKTtcblxuICAgICAgICAgICAgdmFyIGtleXMgPSBvYmplY3RLZXlzKG5vZGUpLnNvcnQoY21wICYmIGNtcChub2RlKSk7XG4gICAgICAgICAgICB2YXIgb3V0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzdHJpbmdpZnkobm9kZSwga2V5LCBub2RlW2tleV0sIGxldmVsKzEpO1xuXG4gICAgICAgICAgICAgICAgaWYoIXZhbHVlKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHZhciBrZXlWYWx1ZSA9IGpzb24uc3RyaW5naWZ5KGtleSlcbiAgICAgICAgICAgICAgICAgICAgKyBjb2xvblNlcGFyYXRvclxuICAgICAgICAgICAgICAgICAgICArIHZhbHVlO1xuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBvdXQucHVzaChpbmRlbnQgKyBzcGFjZSArIGtleVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlZW4uc3BsaWNlKHNlZW4uaW5kZXhPZihub2RlKSwgMSk7XG4gICAgICAgICAgICByZXR1cm4gJ3snICsgb3V0LmpvaW4oJywnKSArIGluZGVudCArICd9JztcbiAgICAgICAgfVxuICAgIH0pKHsgJyc6IG9iaiB9LCAnJywgb2JqLCAwKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkgfHwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZSB9O1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL3R5bGVyL3Byb2plY3RzL3RydWZmbGUvbm9kZV9tb2R1bGVzL2pzb24tc3RhYmxlLXN0cmluZ2lmeS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vbGliL3BhcnNlJyk7XG5leHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ2lmeScpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL3R5bGVyL3Byb2plY3RzL3RydWZmbGUvbm9kZV9tb2R1bGVzL2pzb25pZnkvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBhdCwgLy8gVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IGNoYXJhY3RlclxuICAgIGNoLCAvLyBUaGUgY3VycmVudCBjaGFyYWN0ZXJcbiAgICBlc2NhcGVlID0ge1xuICAgICAgICAnXCInOiAgJ1wiJyxcbiAgICAgICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgICAgICcvJzogICcvJyxcbiAgICAgICAgYjogICAgJ1xcYicsXG4gICAgICAgIGY6ICAgICdcXGYnLFxuICAgICAgICBuOiAgICAnXFxuJyxcbiAgICAgICAgcjogICAgJ1xccicsXG4gICAgICAgIHQ6ICAgICdcXHQnXG4gICAgfSxcbiAgICB0ZXh0LFxuXG4gICAgZXJyb3IgPSBmdW5jdGlvbiAobSkge1xuICAgICAgICAvLyBDYWxsIGVycm9yIHdoZW4gc29tZXRoaW5nIGlzIHdyb25nLlxuICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICBuYW1lOiAgICAnU3ludGF4RXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogbSxcbiAgICAgICAgICAgIGF0OiAgICAgIGF0LFxuICAgICAgICAgICAgdGV4dDogICAgdGV4dFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgXG4gICAgbmV4dCA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIC8vIElmIGEgYyBwYXJhbWV0ZXIgaXMgcHJvdmlkZWQsIHZlcmlmeSB0aGF0IGl0IG1hdGNoZXMgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxuICAgICAgICBpZiAoYyAmJiBjICE9PSBjaCkge1xuICAgICAgICAgICAgZXJyb3IoXCJFeHBlY3RlZCAnXCIgKyBjICsgXCInIGluc3RlYWQgb2YgJ1wiICsgY2ggKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCBjaGFyYWN0ZXIuIFdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcuXG4gICAgICAgIFxuICAgICAgICBjaCA9IHRleHQuY2hhckF0KGF0KTtcbiAgICAgICAgYXQgKz0gMTtcbiAgICAgICAgcmV0dXJuIGNoO1xuICAgIH0sXG4gICAgXG4gICAgbnVtYmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBQYXJzZSBhIG51bWJlciB2YWx1ZS5cbiAgICAgICAgdmFyIG51bWJlcixcbiAgICAgICAgICAgIHN0cmluZyA9ICcnO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNoID09PSAnLScpIHtcbiAgICAgICAgICAgIHN0cmluZyA9ICctJztcbiAgICAgICAgICAgIG5leHQoJy0nKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoY2ggPj0gJzAnICYmIGNoIDw9ICc5Jykge1xuICAgICAgICAgICAgc3RyaW5nICs9IGNoO1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gJy4nO1xuICAgICAgICAgICAgd2hpbGUgKG5leHQoKSAmJiBjaCA+PSAnMCcgJiYgY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgc3RyaW5nICs9IGNoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjaCA9PT0gJ2UnIHx8IGNoID09PSAnRScpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSBjaDtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJy0nIHx8IGNoID09PSAnKycpIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gY2g7XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKGNoID49ICcwJyAmJiBjaCA8PSAnOScpIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gY2g7XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG51bWJlciA9ICtzdHJpbmc7XG4gICAgICAgIGlmICghaXNGaW5pdGUobnVtYmVyKSkge1xuICAgICAgICAgICAgZXJyb3IoXCJCYWQgbnVtYmVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgc3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBQYXJzZSBhIHN0cmluZyB2YWx1ZS5cbiAgICAgICAgdmFyIGhleCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgIHVmZmZmO1xuICAgICAgICBcbiAgICAgICAgLy8gV2hlbiBwYXJzaW5nIGZvciBzdHJpbmcgdmFsdWVzLCB3ZSBtdXN0IGxvb2sgZm9yIFwiIGFuZCBcXCBjaGFyYWN0ZXJzLlxuICAgICAgICBpZiAoY2ggPT09ICdcIicpIHtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ3UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGV4ID0gcGFyc2VJbnQobmV4dCgpLCAxNik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShoZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IHVmZmZmICogMTYgKyBoZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh1ZmZmZik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVzY2FwZWVbY2hdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IGVzY2FwZWVbY2hdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gY2g7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVycm9yKFwiQmFkIHN0cmluZ1wiKTtcbiAgICB9LFxuXG4gICAgd2hpdGUgPSBmdW5jdGlvbiAoKSB7XG5cbi8vIFNraXAgd2hpdGVzcGFjZS5cblxuICAgICAgICB3aGlsZSAoY2ggJiYgY2ggPD0gJyAnKSB7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgd29yZCA9IGZ1bmN0aW9uICgpIHtcblxuLy8gdHJ1ZSwgZmFsc2UsIG9yIG51bGwuXG5cbiAgICAgICAgc3dpdGNoIChjaCkge1xuICAgICAgICBjYXNlICd0JzpcbiAgICAgICAgICAgIG5leHQoJ3QnKTtcbiAgICAgICAgICAgIG5leHQoJ3InKTtcbiAgICAgICAgICAgIG5leHQoJ3UnKTtcbiAgICAgICAgICAgIG5leHQoJ2UnKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlICdmJzpcbiAgICAgICAgICAgIG5leHQoJ2YnKTtcbiAgICAgICAgICAgIG5leHQoJ2EnKTtcbiAgICAgICAgICAgIG5leHQoJ2wnKTtcbiAgICAgICAgICAgIG5leHQoJ3MnKTtcbiAgICAgICAgICAgIG5leHQoJ2UnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY2FzZSAnbic6XG4gICAgICAgICAgICBuZXh0KCduJyk7XG4gICAgICAgICAgICBuZXh0KCd1Jyk7XG4gICAgICAgICAgICBuZXh0KCdsJyk7XG4gICAgICAgICAgICBuZXh0KCdsJyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlcnJvcihcIlVuZXhwZWN0ZWQgJ1wiICsgY2ggKyBcIidcIik7XG4gICAgfSxcblxuICAgIHZhbHVlLCAgLy8gUGxhY2UgaG9sZGVyIGZvciB0aGUgdmFsdWUgZnVuY3Rpb24uXG5cbiAgICBhcnJheSA9IGZ1bmN0aW9uICgpIHtcblxuLy8gUGFyc2UgYW4gYXJyYXkgdmFsdWUuXG5cbiAgICAgICAgdmFyIGFycmF5ID0gW107XG5cbiAgICAgICAgaWYgKGNoID09PSAnWycpIHtcbiAgICAgICAgICAgIG5leHQoJ1snKTtcbiAgICAgICAgICAgIHdoaXRlKCk7XG4gICAgICAgICAgICBpZiAoY2ggPT09ICddJykge1xuICAgICAgICAgICAgICAgIG5leHQoJ10nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7ICAgLy8gZW1wdHkgYXJyYXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChjaCkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2godmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgd2hpdGUoKTtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICddJykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCddJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV4dCgnLCcpO1xuICAgICAgICAgICAgICAgIHdoaXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IoXCJCYWQgYXJyYXlcIik7XG4gICAgfSxcblxuICAgIG9iamVjdCA9IGZ1bmN0aW9uICgpIHtcblxuLy8gUGFyc2UgYW4gb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBvYmplY3QgPSB7fTtcblxuICAgICAgICBpZiAoY2ggPT09ICd7Jykge1xuICAgICAgICAgICAgbmV4dCgneycpO1xuICAgICAgICAgICAgd2hpdGUoKTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgbmV4dCgnfScpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7ICAgLy8gZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoY2gpIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBzdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB3aGl0ZSgpO1xuICAgICAgICAgICAgICAgIG5leHQoJzonKTtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKCdEdXBsaWNhdGUga2V5IFwiJyArIGtleSArICdcIicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IHZhbHVlKCk7XG4gICAgICAgICAgICAgICAgd2hpdGUoKTtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICd9Jykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCd9Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5leHQoJywnKTtcbiAgICAgICAgICAgICAgICB3aGl0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVycm9yKFwiQmFkIG9iamVjdFwiKTtcbiAgICB9O1xuXG52YWx1ZSA9IGZ1bmN0aW9uICgpIHtcblxuLy8gUGFyc2UgYSBKU09OIHZhbHVlLiBJdCBjb3VsZCBiZSBhbiBvYmplY3QsIGFuIGFycmF5LCBhIHN0cmluZywgYSBudW1iZXIsXG4vLyBvciBhIHdvcmQuXG5cbiAgICB3aGl0ZSgpO1xuICAgIHN3aXRjaCAoY2gpIHtcbiAgICBjYXNlICd7JzpcbiAgICAgICAgcmV0dXJuIG9iamVjdCgpO1xuICAgIGNhc2UgJ1snOlxuICAgICAgICByZXR1cm4gYXJyYXkoKTtcbiAgICBjYXNlICdcIic6XG4gICAgICAgIHJldHVybiBzdHJpbmcoKTtcbiAgICBjYXNlICctJzpcbiAgICAgICAgcmV0dXJuIG51bWJlcigpO1xuICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBjaCA+PSAnMCcgJiYgY2ggPD0gJzknID8gbnVtYmVyKCkgOiB3b3JkKCk7XG4gICAgfVxufTtcblxuLy8gUmV0dXJuIHRoZSBqc29uX3BhcnNlIGZ1bmN0aW9uLiBJdCB3aWxsIGhhdmUgYWNjZXNzIHRvIGFsbCBvZiB0aGUgYWJvdmVcbi8vIGZ1bmN0aW9ucyBhbmQgdmFyaWFibGVzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzb3VyY2UsIHJldml2ZXIpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIFxuICAgIHRleHQgPSBzb3VyY2U7XG4gICAgYXQgPSAwO1xuICAgIGNoID0gJyAnO1xuICAgIHJlc3VsdCA9IHZhbHVlKCk7XG4gICAgd2hpdGUoKTtcbiAgICBpZiAoY2gpIHtcbiAgICAgICAgZXJyb3IoXCJTeW50YXggZXJyb3JcIik7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLFxuICAgIC8vIHBhc3NpbmcgZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gdGhlIHJldml2ZXIgZnVuY3Rpb24gZm9yIHBvc3NpYmxlXG4gICAgLy8gdHJhbnNmb3JtYXRpb24sIHN0YXJ0aW5nIHdpdGggYSB0ZW1wb3Jhcnkgcm9vdCBvYmplY3QgdGhhdCBob2xkcyB0aGUgcmVzdWx0XG4gICAgLy8gaW4gYW4gZW1wdHkga2V5LiBJZiB0aGVyZSBpcyBub3QgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSBzaW1wbHkgcmV0dXJuIHRoZVxuICAgIC8vIHJlc3VsdC5cblxuICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJyA/IChmdW5jdGlvbiB3YWxrKGhvbGRlciwga2V5KSB7XG4gICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgdiA9IHdhbGsodmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVba107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgIH0oeycnOiByZXN1bHR9LCAnJykpIDogcmVzdWx0O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy90eWxlci9wcm9qZWN0cy90cnVmZmxlL25vZGVfbW9kdWxlcy9qc29uaWZ5L2xpYi9wYXJzZS5qc1xuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGN4ID0gL1tcXHUwMDAwXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2csXG4gICAgZXNjYXBhYmxlID0gL1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4OWZcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZyxcbiAgICBnYXAsXG4gICAgaW5kZW50LFxuICAgIG1ldGEgPSB7ICAgIC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICdcXGInOiAnXFxcXGInLFxuICAgICAgICAnXFx0JzogJ1xcXFx0JyxcbiAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICAgICAnXFxyJzogJ1xcXFxyJyxcbiAgICAgICAgJ1wiJyA6ICdcXFxcXCInLFxuICAgICAgICAnXFxcXCc6ICdcXFxcXFxcXCdcbiAgICB9LFxuICAgIHJlcDtcblxuZnVuY3Rpb24gcXVvdGUoc3RyaW5nKSB7XG4gICAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xuICAgIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4gICAgLy8gT3RoZXJ3aXNlIHdlIG11c3QgYWxzbyByZXBsYWNlIHRoZSBvZmZlbmRpbmcgY2hhcmFjdGVycyB3aXRoIHNhZmUgZXNjYXBlXG4gICAgLy8gc2VxdWVuY2VzLlxuICAgIFxuICAgIGVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiBlc2NhcGFibGUudGVzdChzdHJpbmcpID8gJ1wiJyArIHN0cmluZy5yZXBsYWNlKGVzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIGMgPSBtZXRhW2FdO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnID8gYyA6XG4gICAgICAgICAgICAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICB9KSArICdcIicgOiAnXCInICsgc3RyaW5nICsgJ1wiJztcbn1cblxuZnVuY3Rpb24gc3RyKGtleSwgaG9sZGVyKSB7XG4gICAgLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuICAgIHZhciBpLCAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgICAgICBrLCAgICAgICAgICAvLyBUaGUgbWVtYmVyIGtleS5cbiAgICAgICAgdiwgICAgICAgICAgLy8gVGhlIG1lbWJlciB2YWx1ZS5cbiAgICAgICAgbGVuZ3RoLFxuICAgICAgICBtaW5kID0gZ2FwLFxuICAgICAgICBwYXJ0aWFsLFxuICAgICAgICB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgIFxuICAgIC8vIElmIHRoZSB2YWx1ZSBoYXMgYSB0b0pTT04gbWV0aG9kLCBjYWxsIGl0IHRvIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKGtleSk7XG4gICAgfVxuICAgIFxuICAgIC8vIElmIHdlIHdlcmUgY2FsbGVkIHdpdGggYSByZXBsYWNlciBmdW5jdGlvbiwgdGhlbiBjYWxsIHRoZSByZXBsYWNlciB0b1xuICAgIC8vIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuICAgIGlmICh0eXBlb2YgcmVwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gcmVwLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gV2hhdCBoYXBwZW5zIG5leHQgZGVwZW5kcyBvbiB0aGUgdmFsdWUncyB0eXBlLlxuICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICByZXR1cm4gcXVvdGUodmFsdWUpO1xuICAgICAgICBcbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIC8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gRW5jb2RlIG5vbi1maW5pdGUgbnVtYmVycyBhcyBudWxsLlxuICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IFN0cmluZyh2YWx1ZSkgOiAnbnVsbCc7XG4gICAgICAgIFxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgICAgICAvLyBJZiB0aGUgdmFsdWUgaXMgYSBib29sZWFuIG9yIG51bGwsIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcuIE5vdGU6XG4gICAgICAgICAgICAvLyB0eXBlb2YgbnVsbCBkb2VzIG5vdCBwcm9kdWNlICdudWxsJy4gVGhlIGNhc2UgaXMgaW5jbHVkZWQgaGVyZSBpblxuICAgICAgICAgICAgLy8gdGhlIHJlbW90ZSBjaGFuY2UgdGhhdCB0aGlzIGdldHMgZml4ZWQgc29tZWRheS5cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gJ251bGwnO1xuICAgICAgICAgICAgZ2FwICs9IGluZGVudDtcbiAgICAgICAgICAgIHBhcnRpYWwgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQXJyYXkuaXNBcnJheVxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsW2ldID0gc3RyKGksIHZhbHVlKSB8fCAnbnVsbCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEpvaW4gYWxsIG9mIHRoZSBlbGVtZW50cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLCBhbmRcbiAgICAgICAgICAgICAgICAvLyB3cmFwIHRoZW0gaW4gYnJhY2tldHMuXG4gICAgICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ1tdJyA6IGdhcCA/XG4gICAgICAgICAgICAgICAgICAgICdbXFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ10nIDpcbiAgICAgICAgICAgICAgICAgICAgJ1snICsgcGFydGlhbC5qb2luKCcsJykgKyAnXSc7XG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gSWYgdGhlIHJlcGxhY2VyIGlzIGFuIGFycmF5LCB1c2UgaXQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlXG4gICAgICAgICAgICAvLyBzdHJpbmdpZmllZC5cbiAgICAgICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBrID0gcmVwW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGsgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2YgdGhlIGtleXMgaW4gdGhlIG9iamVjdC5cbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBzdHIoaywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2gocXVvdGUoaykgKyAoZ2FwID8gJzogJyA6ICc6JykgKyB2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAvLyBKb2luIGFsbCBvZiB0aGUgbWVtYmVyIHRleHRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsXG4gICAgICAgIC8vIGFuZCB3cmFwIHRoZW0gaW4gYnJhY2VzLlxuXG4gICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMCA/ICd7fScgOiBnYXAgP1xuICAgICAgICAgICAgJ3tcXG4nICsgZ2FwICsgcGFydGlhbC5qb2luKCcsXFxuJyArIGdhcCkgKyAnXFxuJyArIG1pbmQgKyAnfScgOlxuICAgICAgICAgICAgJ3snICsgcGFydGlhbC5qb2luKCcsJykgKyAnfSc7XG4gICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xuICAgIHZhciBpO1xuICAgIGdhcCA9ICcnO1xuICAgIGluZGVudCA9ICcnO1xuICAgIFxuICAgIC8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBudW1iZXIsIG1ha2UgYW4gaW5kZW50IHN0cmluZyBjb250YWluaW5nIHRoYXRcbiAgICAvLyBtYW55IHNwYWNlcy5cbiAgICBpZiAodHlwZW9mIHNwYWNlID09PSAnbnVtYmVyJykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhY2U7IGkgKz0gMSkge1xuICAgICAgICAgICAgaW5kZW50ICs9ICcgJztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGluZGVudCBzdHJpbmcuXG4gICAgZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpbmRlbnQgPSBzcGFjZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIHJlcGxhY2VyLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkuXG4gICAgLy8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvci5cbiAgICByZXAgPSByZXBsYWNlcjtcbiAgICBpZiAocmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyICE9PSAnZnVuY3Rpb24nXG4gICAgJiYgKHR5cGVvZiByZXBsYWNlciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIHJlcGxhY2VyLmxlbmd0aCAhPT0gJ251bWJlcicpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTi5zdHJpbmdpZnknKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiAnJy5cbiAgICAvLyBSZXR1cm4gdGhlIHJlc3VsdCBvZiBzdHJpbmdpZnlpbmcgdGhlIHZhbHVlLlxuICAgIHJldHVybiBzdHIoJycsIHsnJzogdmFsdWV9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAvVXNlcnMvdHlsZXIvcHJvamVjdHMvdHJ1ZmZsZS9ub2RlX21vZHVsZXMvanNvbmlmeS9saWIvc3RyaW5naWZ5LmpzXG4vLyBtb2R1bGUgaWQgPSA1MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0cnVmZmxlLXNvbGlkaXR5LXV0aWxzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidHJ1ZmZsZS1zb2xpZGl0eS11dGlsc1wiXG4vLyBtb2R1bGUgaWQgPSA1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0cnVmZmxlLWNvZGUtdXRpbHNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ0cnVmZmxlLWNvZGUtdXRpbHNcIlxuLy8gbW9kdWxlIGlkID0gNTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIEFuIGF1Z21lbnRlZCBBVkwgVHJlZSB3aGVyZSBlYWNoIG5vZGUgbWFpbnRhaW5zIGEgbGlzdCBvZiByZWNvcmRzIGFuZCB0aGVpciBzZWFyY2ggaW50ZXJ2YWxzLlxyXG4vLyBSZWNvcmQgaXMgY29tcG9zZWQgb2YgYW4gaW50ZXJ2YWwgYW5kIGl0cyB1bmRlcmx5aW5nIGRhdGEsIHNlbnQgYnkgYSBjbGllbnQuIFRoaXMgYWxsb3dzIHRoZVxyXG4vLyBpbnRlcnZhbCB0cmVlIHRvIGhhdmUgdGhlIHNhbWUgaW50ZXJ2YWwgaW5zZXJ0ZWQgbXVsdGlwbGUgdGltZXMsIGFzIGxvbmcgaXRzIGRhdGEgaXMgZGlmZmVyZW50LlxyXG4vLyBCb3RoIGluc2VydGlvbiBhbmQgZGVsZXRpb24gcmVxdWlyZSBPKGxvZyBuKSB0aW1lLiBTZWFyY2hpbmcgcmVxdWlyZXMgTyhrKmxvZ24pIHRpbWUsIHdoZXJlIGBrYFxyXG4vLyBpcyB0aGUgbnVtYmVyIG9mIGludGVydmFscyBpbiB0aGUgb3V0cHV0IGxpc3QuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGlzU2FtZSA9IHJlcXVpcmUoXCJzaGFsbG93ZXF1YWxcIik7XHJcbmZ1bmN0aW9uIGhlaWdodChub2RlKSB7XHJcbiAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuaGVpZ2h0O1xyXG4gICAgfVxyXG59XHJcbnZhciBOb2RlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTm9kZShpbnRlcnZhbFRyZWUsIHJlY29yZCkge1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxUcmVlID0gaW50ZXJ2YWxUcmVlO1xyXG4gICAgICAgIHRoaXMucmVjb3JkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLmtleSA9IHJlY29yZC5sb3c7XHJcbiAgICAgICAgdGhpcy5tYXggPSByZWNvcmQuaGlnaDtcclxuICAgICAgICAvLyBTYXZlIHRoZSBhcnJheSBvZiBhbGwgcmVjb3JkcyB3aXRoIHRoZSBzYW1lIGtleSBmb3IgdGhpcyBub2RlXHJcbiAgICAgICAgdGhpcy5yZWNvcmRzLnB1c2gocmVjb3JkKTtcclxuICAgIH1cclxuICAgIC8vIEdldHMgdGhlIGhpZ2hlc3QgcmVjb3JkLmhpZ2ggdmFsdWUgZm9yIHRoaXMgbm9kZVxyXG4gICAgTm9kZS5wcm90b3R5cGUuZ2V0Tm9kZUhpZ2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGhpZ2ggPSB0aGlzLnJlY29yZHNbMF0uaGlnaDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRoaXMucmVjb3Jkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWNvcmRzW2ldLmhpZ2ggPiBoaWdoKSB7XHJcbiAgICAgICAgICAgICAgICBoaWdoID0gdGhpcy5yZWNvcmRzW2ldLmhpZ2g7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhpZ2g7XHJcbiAgICB9O1xyXG4gICAgLy8gVXBkYXRlcyBoZWlnaHQgdmFsdWUgb2YgdGhlIG5vZGUuIENhbGxlZCBkdXJpbmcgaW5zZXJ0aW9uLCByZWJhbGFuY2UsIHJlbW92YWxcclxuICAgIE5vZGUucHJvdG90eXBlLnVwZGF0ZUhlaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IE1hdGgubWF4KGhlaWdodCh0aGlzLmxlZnQpLCBoZWlnaHQodGhpcy5yaWdodCkpICsgMTtcclxuICAgIH07XHJcbiAgICAvLyBVcGRhdGVzIHRoZSBtYXggdmFsdWUgb2YgYWxsIHRoZSBwYXJlbnRzIGFmdGVyIGluc2VydGluZyBpbnRvIGFscmVhZHkgZXhpc3Rpbmcgbm9kZSwgYXMgd2VsbCBhc1xyXG4gICAgLy8gcmVtb3ZpbmcgdGhlIG5vZGUgY29tcGxldGVseSBvciByZW1vdmluZyB0aGUgcmVjb3JkIG9mIGFuIGFscmVhZHkgZXhpc3Rpbmcgbm9kZS4gU3RhcnRzIHdpdGhcclxuICAgIC8vIHRoZSBwYXJlbnQgb2YgYW4gYWZmZWN0ZWQgbm9kZSBhbmQgYnViYmxlcyB1cCB0byByb290XHJcbiAgICBOb2RlLnByb3RvdHlwZS51cGRhdGVNYXhPZlBhcmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0aGlzSGlnaCA9IHRoaXMuZ2V0Tm9kZUhpZ2goKTtcclxuICAgICAgICBpZiAodGhpcy5sZWZ0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4ID0gTWF0aC5tYXgoTWF0aC5tYXgodGhpcy5sZWZ0Lm1heCwgdGhpcy5yaWdodC5tYXgpLCB0aGlzSGlnaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMubGVmdCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1heCA9IE1hdGgubWF4KHRoaXMubGVmdC5tYXgsIHRoaXNIaWdoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5sZWZ0ID09PSB1bmRlZmluZWQgJiYgdGhpcy5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4ID0gTWF0aC5tYXgodGhpcy5yaWdodC5tYXgsIHRoaXNIaWdoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4ID0gdGhpc0hpZ2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC51cGRhdGVNYXhPZlBhcmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLypcclxuICAgIExlZnQtTGVmdCBjYXNlOlxyXG4gIFxyXG4gICAgICAgICAgIHogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlcclxuICAgICAgICAgIC8gXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8gICBcXFxyXG4gICAgICAgICB5ICAgVDQgICAgICBSaWdodCBSb3RhdGUgKHopICAgICAgICAgIHggICAgIHpcclxuICAgICAgICAvIFxcICAgICAgICAgIC0gLSAtIC0gLSAtIC0gLSAtPiAgICAgICAvIFxcICAgLyBcXFxyXG4gICAgICAgeCAgIFQzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUMSBUMiBUMyBUNFxyXG4gICAgICAvIFxcXHJcbiAgICBUMSAgIFQyXHJcbiAgXHJcbiAgICBMZWZ0LVJpZ2h0IGNhc2U6XHJcbiAgXHJcbiAgICAgICAgIHogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeiAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcclxuICAgICAgICAvIFxcICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvIFxcICAgICAgICAgICAgICAgICAgICAgICAgLyAgIFxcXHJcbiAgICAgICB5ICAgVDQgIExlZnQgUm90YXRlICh5KSAgICAgICAgIHggIFQ0ICBSaWdodCBSb3RhdGUoeikgICAgIHkgICAgIHpcclxuICAgICAgLyBcXCAgICAgIC0gLSAtIC0gLSAtIC0gLSAtPiAgICAgLyBcXCAgICAgIC0gLSAtIC0gLSAtIC0gLT4gIC8gXFwgICAvIFxcXHJcbiAgICBUMSAgIHggICAgICAgICAgICAgICAgICAgICAgICAgICB5ICBUMyAgICAgICAgICAgICAgICAgICAgICBUMSBUMiBUMyBUNFxyXG4gICAgICAgIC8gXFwgICAgICAgICAgICAgICAgICAgICAgICAgLyBcXFxyXG4gICAgICBUMiAgIFQzICAgICAgICAgICAgICAgICAgICAgIFQxIFQyXHJcbiAgICAqL1xyXG4gICAgLy8gSGFuZGxlcyBMZWZ0LUxlZnQgY2FzZSBhbmQgTGVmdC1SaWdodCBjYXNlIGFmdGVyIHJlYmFsYW5jaW5nIEFWTCB0cmVlXHJcbiAgICBOb2RlLnByb3RvdHlwZS5fdXBkYXRlTWF4QWZ0ZXJSaWdodFJvdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XHJcbiAgICAgICAgdmFyIGxlZnQgPSBwYXJlbnQubGVmdDtcclxuICAgICAgICAvLyBVcGRhdGUgbWF4IG9mIGxlZnQgc2libGluZyAoeCBpbiBmaXJzdCBjYXNlLCB5IGluIHNlY29uZClcclxuICAgICAgICB2YXIgdGhpc1BhcmVudExlZnRIaWdoID0gbGVmdC5nZXROb2RlSGlnaCgpO1xyXG4gICAgICAgIGlmIChsZWZ0LmxlZnQgPT09IHVuZGVmaW5lZCAmJiBsZWZ0LnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGVmdC5tYXggPSBNYXRoLm1heCh0aGlzUGFyZW50TGVmdEhpZ2gsIGxlZnQucmlnaHQubWF4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobGVmdC5sZWZ0ICE9PSB1bmRlZmluZWQgJiYgbGVmdC5yaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxlZnQubWF4ID0gTWF0aC5tYXgodGhpc1BhcmVudExlZnRIaWdoLCBsZWZ0LmxlZnQubWF4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobGVmdC5sZWZ0ID09PSB1bmRlZmluZWQgJiYgbGVmdC5yaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxlZnQubWF4ID0gdGhpc1BhcmVudExlZnRIaWdoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGVmdC5tYXggPSBNYXRoLm1heChNYXRoLm1heChsZWZ0LmxlZnQubWF4LCBsZWZ0LnJpZ2h0Lm1heCksIHRoaXNQYXJlbnRMZWZ0SGlnaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFVwZGF0ZSBtYXggb2YgaXRzZWxmICh6KVxyXG4gICAgICAgIHZhciB0aGlzSGlnaCA9IHRoaXMuZ2V0Tm9kZUhpZ2goKTtcclxuICAgICAgICBpZiAodGhpcy5sZWZ0ID09PSB1bmRlZmluZWQgJiYgdGhpcy5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4ID0gTWF0aC5tYXgodGhpc0hpZ2gsIHRoaXMucmlnaHQubWF4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5sZWZ0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4ID0gTWF0aC5tYXgodGhpc0hpZ2gsIHRoaXMubGVmdC5tYXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmxlZnQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJpZ2h0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXggPSB0aGlzSGlnaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4ID0gTWF0aC5tYXgoTWF0aC5tYXgodGhpcy5sZWZ0Lm1heCwgdGhpcy5yaWdodC5tYXgpLCB0aGlzSGlnaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFVwZGF0ZSBtYXggb2YgcGFyZW50ICh5IGluIGZpcnN0IGNhc2UsIHggaW4gc2Vjb25kKVxyXG4gICAgICAgIHBhcmVudC5tYXggPSBNYXRoLm1heChNYXRoLm1heChwYXJlbnQubGVmdC5tYXgsIHBhcmVudC5yaWdodC5tYXgpLCBwYXJlbnQuZ2V0Tm9kZUhpZ2goKSk7XHJcbiAgICB9O1xyXG4gICAgLypcclxuICAgIFJpZ2h0LVJpZ2h0IGNhc2U6XHJcbiAgXHJcbiAgICAgIHogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeVxyXG4gICAgIC8gXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyAgIFxcXHJcbiAgICBUMSAgeSAgICAgTGVmdCBSb3RhdGUoeikgICAgICAgeiAgICAgeFxyXG4gICAgICAgLyBcXCAgIC0gLSAtIC0gLSAtIC0gLT4gICAgIC8gXFwgICAvIFxcXHJcbiAgICAgIFQyICB4ICAgICAgICAgICAgICAgICAgICAgIFQxIFQyIFQzIFQ0XHJcbiAgICAgICAgIC8gXFxcclxuICAgICAgICBUMyBUNFxyXG4gIFxyXG4gICAgUmlnaHQtTGVmdCBjYXNlOlxyXG4gIFxyXG4gICAgICAgeiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcclxuICAgICAgLyBcXCAgICAgICAgICAgICAgICAgICAgICAgICAgLyBcXCAgICAgICAgICAgICAgICAgICAgICAgICAvICAgXFxcclxuICAgICBUMSAgeSAgIFJpZ2h0IFJvdGF0ZSAoeSkgICAgIFQxICB4ICAgICAgTGVmdCBSb3RhdGUoeikgICB6ICAgICB5XHJcbiAgICAgICAgLyBcXCAgLSAtIC0gLSAtIC0gLSAtIC0+ICAgICAgLyBcXCAgIC0gLSAtIC0gLSAtIC0gLT4gIC8gXFwgICAvIFxcXHJcbiAgICAgICB4ICBUNCAgICAgICAgICAgICAgICAgICAgICAgIFQyICB5ICAgICAgICAgICAgICAgICAgIFQxIFQyIFQzIFQ0XHJcbiAgICAgIC8gXFwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvIFxcXHJcbiAgICBUMiAgIFQzICAgICAgICAgICAgICAgICAgICAgICAgICAgVDMgVDRcclxuICAgICovXHJcbiAgICAvLyBIYW5kbGVzIFJpZ2h0LVJpZ2h0IGNhc2UgYW5kIFJpZ2h0LUxlZnQgY2FzZSBpbiByZWJhbGFuY2luZyBBVkwgdHJlZVxyXG4gICAgTm9kZS5wcm90b3R5cGUuX3VwZGF0ZU1heEFmdGVyTGVmdFJvdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XHJcbiAgICAgICAgdmFyIHJpZ2h0ID0gcGFyZW50LnJpZ2h0O1xyXG4gICAgICAgIC8vIFVwZGF0ZSBtYXggb2YgcmlnaHQgc2libGluZyAoeCBpbiBmaXJzdCBjYXNlLCB5IGluIHNlY29uZClcclxuICAgICAgICB2YXIgdGhpc1BhcmVudFJpZ2h0SGlnaCA9IHJpZ2h0LmdldE5vZGVIaWdoKCk7XHJcbiAgICAgICAgaWYgKHJpZ2h0LmxlZnQgPT09IHVuZGVmaW5lZCAmJiByaWdodC5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJpZ2h0Lm1heCA9IE1hdGgubWF4KHRoaXNQYXJlbnRSaWdodEhpZ2gsIHJpZ2h0LnJpZ2h0Lm1heCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJpZ2h0LmxlZnQgIT09IHVuZGVmaW5lZCAmJiByaWdodC5yaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJpZ2h0Lm1heCA9IE1hdGgubWF4KHRoaXNQYXJlbnRSaWdodEhpZ2gsIHJpZ2h0LmxlZnQubWF4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmlnaHQubGVmdCA9PT0gdW5kZWZpbmVkICYmIHJpZ2h0LnJpZ2h0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmlnaHQubWF4ID0gdGhpc1BhcmVudFJpZ2h0SGlnaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJpZ2h0Lm1heCA9IE1hdGgubWF4KE1hdGgubWF4KHJpZ2h0LmxlZnQubWF4LCByaWdodC5yaWdodC5tYXgpLCB0aGlzUGFyZW50UmlnaHRIaWdoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVXBkYXRlIG1heCBvZiBpdHNlbGYgKHopXHJcbiAgICAgICAgdmFyIHRoaXNIaWdoID0gdGhpcy5nZXROb2RlSGlnaCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmxlZnQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzSGlnaCwgdGhpcy5yaWdodC5tYXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmxlZnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJpZ2h0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzSGlnaCwgdGhpcy5sZWZ0Lm1heCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMubGVmdCA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1heCA9IHRoaXNIaWdoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tYXggPSBNYXRoLm1heChNYXRoLm1heCh0aGlzLmxlZnQubWF4LCB0aGlzLnJpZ2h0Lm1heCksIHRoaXNIaWdoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVXBkYXRlIG1heCBvZiBwYXJlbnQgKHkgaW4gZmlyc3QgY2FzZSwgeCBpbiBzZWNvbmQpXHJcbiAgICAgICAgcGFyZW50Lm1heCA9IE1hdGgubWF4KE1hdGgubWF4KHBhcmVudC5sZWZ0Lm1heCwgcmlnaHQubWF4KSwgcGFyZW50LmdldE5vZGVIaWdoKCkpO1xyXG4gICAgfTtcclxuICAgIE5vZGUucHJvdG90eXBlLl9sZWZ0Um90YXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByaWdodENoaWxkID0gdGhpcy5yaWdodDtcclxuICAgICAgICByaWdodENoaWxkLnBhcmVudCA9IHRoaXMucGFyZW50O1xyXG4gICAgICAgIGlmIChyaWdodENoaWxkLnBhcmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxUcmVlLnJvb3QgPSByaWdodENoaWxkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0Q2hpbGQucGFyZW50LmxlZnQgPT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIHJpZ2h0Q2hpbGQucGFyZW50LmxlZnQgPSByaWdodENoaWxkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJpZ2h0Q2hpbGQucGFyZW50LnJpZ2h0ID09PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICByaWdodENoaWxkLnBhcmVudC5yaWdodCA9IHJpZ2h0Q2hpbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0Q2hpbGQubGVmdDtcclxuICAgICAgICBpZiAodGhpcy5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmlnaHQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmlnaHRDaGlsZC5sZWZ0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHJpZ2h0Q2hpbGQ7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKTtcclxuICAgICAgICByaWdodENoaWxkLnVwZGF0ZUhlaWdodCgpO1xyXG4gICAgfTtcclxuICAgIE5vZGUucHJvdG90eXBlLl9yaWdodFJvdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGVmdENoaWxkID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgIGxlZnRDaGlsZC5wYXJlbnQgPSB0aGlzLnBhcmVudDtcclxuICAgICAgICBpZiAobGVmdENoaWxkLnBhcmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxUcmVlLnJvb3QgPSBsZWZ0Q2hpbGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobGVmdENoaWxkLnBhcmVudC5sZWZ0ID09PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0Q2hpbGQucGFyZW50LmxlZnQgPSBsZWZ0Q2hpbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobGVmdENoaWxkLnBhcmVudC5yaWdodCA9PT0gdGhpcykge1xyXG4gICAgICAgICAgICAgICAgbGVmdENoaWxkLnBhcmVudC5yaWdodCA9IGxlZnRDaGlsZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0Q2hpbGQucmlnaHQ7XHJcbiAgICAgICAgaWYgKHRoaXMubGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVmdC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZWZ0Q2hpbGQucmlnaHQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gbGVmdENoaWxkO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KCk7XHJcbiAgICAgICAgbGVmdENoaWxkLnVwZGF0ZUhlaWdodCgpO1xyXG4gICAgfTtcclxuICAgIC8vIFJlYmFsYW5jZXMgdGhlIHRyZWUgaWYgdGhlIGhlaWdodCB2YWx1ZSBiZXR3ZWVuIHR3byBub2RlcyBvZiB0aGUgc2FtZSBwYXJlbnQgaXMgZ3JlYXRlciB0aGFuXHJcbiAgICAvLyB0d28uIFRoZXJlIGFyZSA0IGNhc2VzIHRoYXQgY2FuIGhhcHBlbiB3aGljaCBhcmUgb3V0bGluZWQgaW4gdGhlIGdyYXBoaWNzIGFib3ZlXHJcbiAgICBOb2RlLnByb3RvdHlwZS5fcmViYWxhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChoZWlnaHQodGhpcy5sZWZ0KSA+PSAyICsgaGVpZ2h0KHRoaXMucmlnaHQpKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgICAgICBpZiAoaGVpZ2h0KGxlZnQubGVmdCkgPj0gaGVpZ2h0KGxlZnQucmlnaHQpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMZWZ0LUxlZnQgY2FzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmlnaHRSb3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1heEFmdGVyUmlnaHRSb3RhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIExlZnQtUmlnaHQgY2FzZVxyXG4gICAgICAgICAgICAgICAgbGVmdC5fbGVmdFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmlnaHRSb3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1heEFmdGVyUmlnaHRSb3RhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoZWlnaHQodGhpcy5yaWdodCkgPj0gMiArIGhlaWdodCh0aGlzLmxlZnQpKSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IHRoaXMucmlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChoZWlnaHQocmlnaHQucmlnaHQpID49IGhlaWdodChyaWdodC5sZWZ0KSkge1xyXG4gICAgICAgICAgICAgICAgLy8gUmlnaHQtUmlnaHQgY2FzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF4QWZ0ZXJMZWZ0Um90YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSaWdodC1MZWZ0IGNhc2VcclxuICAgICAgICAgICAgICAgIHJpZ2h0Ll9yaWdodFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdFJvdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF4QWZ0ZXJMZWZ0Um90YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTm9kZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKHJlY29yZCkge1xyXG4gICAgICAgIGlmIChyZWNvcmQubG93IDwgdGhpcy5rZXkpIHtcclxuICAgICAgICAgICAgLy8gSW5zZXJ0IGludG8gbGVmdCBzdWJ0cmVlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxlZnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gbmV3IE5vZGUodGhpcy5pbnRlcnZhbFRyZWUsIHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnQucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVmdC5pbnNlcnQocmVjb3JkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSW5zZXJ0IGludG8gcmlnaHQgc3VidHJlZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5yaWdodCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gbmV3IE5vZGUodGhpcy5pbnRlcnZhbFRyZWUsIHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0LnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Lmluc2VydChyZWNvcmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgbWF4IHZhbHVlIG9mIHRoaXMgYW5jZXN0b3IgaWYgbmVlZGVkXHJcbiAgICAgICAgaWYgKHRoaXMubWF4IDwgcmVjb3JkLmhpZ2gpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXggPSByZWNvcmQuaGlnaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVXBkYXRlIGhlaWdodCBvZiBlYWNoIG5vZGVcclxuICAgICAgICB0aGlzLnVwZGF0ZUhlaWdodCgpO1xyXG4gICAgICAgIC8vIFJlYmFsYW5jZSB0aGUgdHJlZSB0byBlbnN1cmUgYWxsIG9wZXJhdGlvbnMgYXJlIGV4ZWN1dGVkIGluIE8obG9nbikgdGltZS4gVGhpcyBpcyBlc3BlY2lhbGx5XHJcbiAgICAgICAgLy8gaW1wb3J0YW50IGluIHNlYXJjaGluZywgYXMgdGhlIHRyZWUgaGFzIGEgaGlnaCBjaGFuY2Ugb2YgZGVnZW5lcmF0aW5nIHdpdGhvdXQgdGhlIHJlYmFsYW5jaW5nXHJcbiAgICAgICAgdGhpcy5fcmViYWxhbmNlKCk7XHJcbiAgICB9O1xyXG4gICAgTm9kZS5wcm90b3R5cGUuX2dldE92ZXJsYXBwaW5nUmVjb3JkcyA9IGZ1bmN0aW9uIChjdXJyZW50Tm9kZSwgbG93LCBoaWdoKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnROb2RlLmtleSA8PSBoaWdoICYmIGxvdyA8PSBjdXJyZW50Tm9kZS5nZXROb2RlSGlnaCgpKSB7XHJcbiAgICAgICAgICAgIC8vIE5vZGVzIGFyZSBvdmVybGFwcGluZywgY2hlY2sgaWYgaW5kaXZpZHVhbCByZWNvcmRzIGluIHRoZSBub2RlIGFyZSBvdmVybGFwcGluZ1xyXG4gICAgICAgICAgICB2YXIgdGVtcFJlc3VsdHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5yZWNvcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vZGUucmVjb3Jkc1tpXS5oaWdoID49IGxvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBSZXN1bHRzLnB1c2goY3VycmVudE5vZGUucmVjb3Jkc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBSZXN1bHRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9O1xyXG4gICAgTm9kZS5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24gKGxvdywgaGlnaCkge1xyXG4gICAgICAgIC8vIERvbid0IHNlYXJjaCBub2RlcyB0aGF0IGRvbid0IGV4aXN0XHJcbiAgICAgICAgaWYgKHRoaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWZ0U2VhcmNoID0gW107XHJcbiAgICAgICAgdmFyIG93blNlYXJjaCA9IFtdO1xyXG4gICAgICAgIHZhciByaWdodFNlYXJjaCA9IFtdO1xyXG4gICAgICAgIC8vIElmIGludGVydmFsIGlzIHRvIHRoZSByaWdodCBvZiB0aGUgcmlnaHRtb3N0IHBvaW50IG9mIGFueSBpbnRlcnZhbCBpbiB0aGlzIG5vZGUgYW5kIGFsbCBpdHNcclxuICAgICAgICAvLyBjaGlsZHJlbiwgdGhlcmUgd29uJ3QgYmUgYW55IG1hdGNoZXNcclxuICAgICAgICBpZiAobG93ID4gdGhpcy5tYXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTZWFyY2ggbGVmdCBjaGlsZHJlblxyXG4gICAgICAgIGlmICh0aGlzLmxlZnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmxlZnQubWF4ID49IGxvdykge1xyXG4gICAgICAgICAgICBsZWZ0U2VhcmNoID0gdGhpcy5sZWZ0LnNlYXJjaChsb3csIGhpZ2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDaGVjayB0aGlzIG5vZGVcclxuICAgICAgICBvd25TZWFyY2ggPSB0aGlzLl9nZXRPdmVybGFwcGluZ1JlY29yZHModGhpcywgbG93LCBoaWdoKTtcclxuICAgICAgICAvLyBJZiBpbnRlcnZhbCBpcyB0byB0aGUgbGVmdCBvZiB0aGUgc3RhcnQgb2YgdGhpcyBpbnRlcnZhbCwgdGhlbiBpdCBjYW4ndCBiZSBpbiBhbnkgY2hpbGQgdG9cclxuICAgICAgICAvLyB0aGUgcmlnaHRcclxuICAgICAgICBpZiAoaGlnaCA8IHRoaXMua2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsZWZ0U2VhcmNoLmNvbmNhdChvd25TZWFyY2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UsIHNlYXJjaCByaWdodCBjaGlsZHJlblxyXG4gICAgICAgIGlmICh0aGlzLnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmlnaHRTZWFyY2ggPSB0aGlzLnJpZ2h0LnNlYXJjaChsb3csIGhpZ2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZXR1cm4gYWNjdW11bGF0ZWQgcmVzdWx0cywgaWYgYW55XHJcbiAgICAgICAgcmV0dXJuIGxlZnRTZWFyY2guY29uY2F0KG93blNlYXJjaCwgcmlnaHRTZWFyY2gpO1xyXG4gICAgfTtcclxuICAgIC8vIFNlYXJjaGVzIGZvciBhIG5vZGUgYnkgYSBga2V5YCB2YWx1ZVxyXG4gICAgTm9kZS5wcm90b3R5cGUuc2VhcmNoRXhpc3RpbmcgPSBmdW5jdGlvbiAobG93KSB7XHJcbiAgICAgICAgaWYgKHRoaXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5rZXkgPT09IGxvdykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobG93IDwgdGhpcy5rZXkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWZ0LnNlYXJjaEV4aXN0aW5nKGxvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJpZ2h0LnNlYXJjaEV4aXN0aW5nKGxvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICAvLyBSZXR1cm5zIHRoZSBzbWFsbGVzdCBub2RlIG9mIHRoZSBzdWJ0cmVlXHJcbiAgICBOb2RlLnByb3RvdHlwZS5fbWluVmFsdWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVmdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVmdC5fbWluVmFsdWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTm9kZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XHJcbiAgICAgICAgaWYgKG5vZGUua2V5IDwgdGhpcy5rZXkpIHtcclxuICAgICAgICAgICAgLy8gTm9kZSB0byBiZSByZW1vdmVkIGlzIG9uIHRoZSBsZWZ0IHNpZGVcclxuICAgICAgICAgICAgaWYgKHRoaXMubGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWZ0LnJlbW92ZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobm9kZS5rZXkgPiB0aGlzLmtleSkge1xyXG4gICAgICAgICAgICAvLyBOb2RlIHRvIGJlIHJlbW92ZWQgaXMgb24gdGhlIHJpZ2h0IHNpZGVcclxuICAgICAgICAgICAgaWYgKHRoaXMucmlnaHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmlnaHQucmVtb3ZlKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGVmdCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmlnaHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gTm9kZSBoYXMgdHdvIGNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWluVmFsdWUgPSB0aGlzLnJpZ2h0Ll9taW5WYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXkgPSBtaW5WYWx1ZS5rZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY29yZHMgPSBtaW5WYWx1ZS5yZWNvcmRzO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmlnaHQucmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBhcmVudC5sZWZ0ID09PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPbmUgY2hpbGQgb3Igbm8gY2hpbGQgY2FzZSBvbiBsZWZ0IHNpZGVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQubGVmdCA9IHRoaXMucmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodC5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQubGVmdCA9IHRoaXMubGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0LnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQudXBkYXRlTWF4T2ZQYXJlbnRzKCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQudXBkYXRlSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuX3JlYmFsYW5jZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGFyZW50LnJpZ2h0ID09PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBPbmUgY2hpbGQgb3Igbm8gY2hpbGQgY2FzZSBvbiByaWdodCBzaWRlXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJpZ2h0ID0gdGhpcy5yaWdodDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0LnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yaWdodCA9IHRoaXMubGVmdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0LnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQudXBkYXRlTWF4T2ZQYXJlbnRzKCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQudXBkYXRlSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuX3JlYmFsYW5jZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE5vZGU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTm9kZSA9IE5vZGU7XHJcbnZhciBJbnRlcnZhbFRyZWUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBJbnRlcnZhbFRyZWUoKSB7XHJcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XHJcbiAgICB9XHJcbiAgICBJbnRlcnZhbFRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChyZWNvcmQpIHtcclxuICAgICAgICBpZiAocmVjb3JkLmxvdyA+IHJlY29yZC5oaWdoKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYGxvd2AgdmFsdWUgbXVzdCBiZSBsb3dlciBvciBlcXVhbCB0byBgaGlnaGAgdmFsdWUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIEJhc2UgY2FzZTogVHJlZSBpcyBlbXB0eSwgbmV3IG5vZGUgYmVjb21lcyByb290XHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5ldyBOb2RlKHRoaXMsIHJlY29yZCk7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnQrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNoZWNrIGlmIG5vZGUgYWxyZWFkeSBleGlzdHMgd2l0aCB0aGUgc2FtZSBrZXlcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnJvb3Quc2VhcmNoRXhpc3RpbmcocmVjb3JkLmxvdyk7XHJcbiAgICAgICAgICAgIGlmIChub2RlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoZSByZWNvcmRzIGluIHRoaXMgbm9kZSBpZiB0aGVyZSBhbHJlYWR5IGlzIHRoZSBvbmUgd2l0aCBzYW1lIGxvdywgaGlnaCwgZGF0YVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLnJlY29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNTYW1lKG5vZGUucmVjb3Jkc1tpXSwgcmVjb3JkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHJlY29yZCBpcyBzYW1lIGFzIHRoZSBvbmUgd2UncmUgdHJ5aW5nIHRvIGluc2VydDsgcmV0dXJuIGZhbHNlIHRvIGluZGljYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgaGFzIGJlZW4gaW5zZXJ0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVjb3JkIHRvIHRoZSBub2RlXHJcbiAgICAgICAgICAgICAgICBub2RlLnJlY29yZHMucHVzaChyZWNvcmQpO1xyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIG1heCBvZiB0aGUgbm9kZSBhbmQgaXRzIHBhcmVudHMgaWYgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkLmhpZ2ggPiBub2RlLm1heCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUubWF4ID0gcmVjb3JkLmhpZ2g7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50LnVwZGF0ZU1heE9mUGFyZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY291bnQrKztcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gTm9kZSB3aXRoIHRoaXMga2V5IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC4gQ2FsbCBpbnNlcnQgZnVuY3Rpb24gb24gcm9vdCdzIG5vZGVcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5pbnNlcnQocmVjb3JkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY291bnQrKztcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEludGVydmFsVHJlZS5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24gKGxvdywgaGlnaCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJvb3QgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBUcmVlIGlzIGVtcHR5OyByZXR1cm4gZW1wdHkgYXJyYXlcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5zZWFyY2gobG93LCBoaWdoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgSW50ZXJ2YWxUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAocmVjb3JkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucm9vdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIFRyZWUgaXMgZW1wdHk7IG5vdGhpbmcgdG8gcmVtb3ZlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5yb290LnNlYXJjaEV4aXN0aW5nKHJlY29yZC5sb3cpO1xyXG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5yZWNvcmRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZW1vdmVkUmVjb3JkID0gdm9pZCAwO1xyXG4gICAgICAgICAgICAgICAgLy8gTm9kZSB3aXRoIHRoaXMga2V5IGhhcyAyIG9yIG1vcmUgcmVjb3Jkcy4gRmluZCB0aGUgb25lIHdlIG5lZWQgYW5kIHJlbW92ZSBpdFxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLnJlY29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNTYW1lKG5vZGUucmVjb3Jkc1tpXSwgcmVjb3JkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkUmVjb3JkID0gbm9kZS5yZWNvcmRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJlY29yZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlZFJlY29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRSZWNvcmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIG1heCBvZiB0aGF0IG5vZGUgYW5kIGl0cyBwYXJlbnRzIGlmIG5lY2Vzc2FyeVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQuaGlnaCA9PT0gbm9kZS5tYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVIaWdoID0gbm9kZS5nZXROb2RlSGlnaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5sZWZ0ICE9PSB1bmRlZmluZWQgJiYgbm9kZS5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLm1heCA9IE1hdGgubWF4KE1hdGgubWF4KG5vZGUubGVmdC5tYXgsIG5vZGUucmlnaHQubWF4KSwgbm9kZUhpZ2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUubGVmdCAhPT0gdW5kZWZpbmVkICYmIG5vZGUucmlnaHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5tYXggPSBNYXRoLm1heChub2RlLmxlZnQubWF4LCBub2RlSGlnaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5sZWZ0ID09PSB1bmRlZmluZWQgJiYgbm9kZS5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLm1heCA9IE1hdGgubWF4KG5vZGUucmlnaHQubWF4LCBub2RlSGlnaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLm1heCA9IG5vZGVIaWdoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQudXBkYXRlTWF4T2ZQYXJlbnRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucmVjb3Jkcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIE5vZGUgd2l0aCB0aGlzIGtleSBoYXMgb25seSAxIHJlY29yZC4gQ2hlY2sgaWYgdGhlIHJlbWFpbmluZyByZWNvcmQgaW4gdGhpcyBub2RlIGlzXHJcbiAgICAgICAgICAgICAgICAvLyBhY3R1YWxseSB0aGUgb25lIHdlIHdhbnQgdG8gcmVtb3ZlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNTYW1lKG5vZGUucmVjb3Jkc1swXSwgcmVjb3JkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSByZW1haW5pbmcgcmVjb3JkIGlzIHRoZSBvbmUgd2Ugd2FudCB0byByZW1vdmUuIFJlbW92ZSB0aGUgd2hvbGUgbm9kZSBmcm9tIHRoZSB0cmVlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdC5rZXkgPT09IG5vZGUua2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlJ3JlIHJlbW92aW5nIHRoZSByb290IGVsZW1lbnQuIENyZWF0ZSBhIGR1bW15IG5vZGUgdGhhdCB3aWxsIHRlbXBvcmFyaWx5IHRha2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcm9vdCdzIHBhcmVudCByb2xlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb290UGFyZW50ID0gbmV3IE5vZGUodGhpcywgeyBsb3c6IHJlY29yZC5sb3csIGhpZ2g6IHJlY29yZC5sb3cgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQYXJlbnQubGVmdCA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LnBhcmVudCA9IHJvb3RQYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZW1vdmVkTm9kZSA9IHRoaXMucm9vdC5yZW1vdmUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHJvb3RQYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QucGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZW1vdmVkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZE5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50LS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlbW92ZWROb2RlID0gdGhpcy5yb290LnJlbW92ZShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbW92ZWROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY291bnQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHJlbWFpbmluZyByZWNvcmQgaXMgbm90IHRoZSBvbmUgd2Ugd2FudCB0byByZW1vdmVcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBObyByZWNvcmRzIGF0IGFsbCBpbiB0aGlzIG5vZGU/ISBTaG91bGRuJ3QgaGFwcGVuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgSW50ZXJ2YWxUcmVlLnByb3RvdHlwZS5pbk9yZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5PcmRlcih0aGlzLnJvb3QpO1xyXG4gICAgfTtcclxuICAgIEludGVydmFsVHJlZS5wcm90b3R5cGUucHJlT3JkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVPcmRlcih0aGlzLnJvb3QpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBJbnRlcnZhbFRyZWU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuSW50ZXJ2YWxUcmVlID0gSW50ZXJ2YWxUcmVlO1xyXG52YXIgRGF0YUludGVydmFsVHJlZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIERhdGFJbnRlcnZhbFRyZWUoKSB7XHJcbiAgICAgICAgdGhpcy50cmVlID0gbmV3IEludGVydmFsVHJlZSgpO1xyXG4gICAgfVxyXG4gICAgRGF0YUludGVydmFsVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGxvdywgaGlnaCwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWUuaW5zZXJ0KHsgbG93OiBsb3csIGhpZ2g6IGhpZ2gsIGRhdGE6IGRhdGEgfSk7XHJcbiAgICB9O1xyXG4gICAgRGF0YUludGVydmFsVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGxvdywgaGlnaCwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWUucmVtb3ZlKHsgbG93OiBsb3csIGhpZ2g6IGhpZ2gsIGRhdGE6IGRhdGEgfSk7XHJcbiAgICB9O1xyXG4gICAgRGF0YUludGVydmFsVHJlZS5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24gKGxvdywgaGlnaCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWUuc2VhcmNoKGxvdywgaGlnaCkubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LmRhdGE7IH0pO1xyXG4gICAgfTtcclxuICAgIERhdGFJbnRlcnZhbFRyZWUucHJvdG90eXBlLmluT3JkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5pbk9yZGVyKCk7XHJcbiAgICB9O1xyXG4gICAgRGF0YUludGVydmFsVHJlZS5wcm90b3R5cGUucHJlT3JkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5wcmVPcmRlcigpO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEYXRhSW50ZXJ2YWxUcmVlLnByb3RvdHlwZSwgXCJjb3VudFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyZWUuY291bnQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gRGF0YUludGVydmFsVHJlZTtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRGF0YUludGVydmFsVHJlZTtcclxudmFyIEluT3JkZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBJbk9yZGVyKHN0YXJ0Tm9kZSkge1xyXG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcclxuICAgICAgICBpZiAoc3RhcnROb2RlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKHN0YXJ0Tm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSW5PcmRlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBXaWxsIG9ubHkgaGFwcGVuIGlmIHN0YWNrIGlzIGVtcHR5IGFuZCBwb3AgaXMgY2FsbGVkXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZG9uZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFByb2Nlc3MgdGhpcyBub2RlXHJcbiAgICAgICAgaWYgKHRoaXMuaSA8IHRoaXMuY3VycmVudE5vZGUucmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuY3VycmVudE5vZGUucmVjb3Jkc1t0aGlzLmkrK10sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlLnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKHRoaXMuY3VycmVudE5vZGUucmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTWlnaHQgcG9wIHRoZSBsYXN0IGFuZCBzZXQgdGhpcy5jdXJyZW50Tm9kZSA9IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0KCk7XHJcbiAgICB9O1xyXG4gICAgSW5PcmRlci5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgdGhpcy5pID0gMDtcclxuICAgICAgICB3aGlsZSAodGhpcy5jdXJyZW50Tm9kZS5sZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHRoaXMuY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5jdXJyZW50Tm9kZS5sZWZ0O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBJbk9yZGVyLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuc3RhY2sucG9wKCk7XHJcbiAgICAgICAgdGhpcy5pID0gMDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gSW5PcmRlcjtcclxufSgpKTtcclxuZXhwb3J0cy5Jbk9yZGVyID0gSW5PcmRlcjtcclxuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIEluT3JkZXIucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xyXG59XHJcbnZhciBQcmVPcmRlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFByZU9yZGVyKHN0YXJ0Tm9kZSkge1xyXG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcclxuICAgICAgICB0aGlzLmkgPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBzdGFydE5vZGU7XHJcbiAgICB9XHJcbiAgICBQcmVPcmRlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBXaWxsIG9ubHkgaGFwcGVuIGlmIHN0YWNrIGlzIGVtcHR5IGFuZCBwb3AgaXMgY2FsbGVkLFxyXG4gICAgICAgIC8vIHdoaWNoIG9ubHkgaGFwcGVucyBpZiB0aGVyZSBpcyBubyByaWdodCBub2RlIChpLmUgd2UgYXJlIGRvbmUpXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZG9uZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFByb2Nlc3MgdGhpcyBub2RlXHJcbiAgICAgICAgaWYgKHRoaXMuaSA8IHRoaXMuY3VycmVudE5vZGUucmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuY3VycmVudE5vZGUucmVjb3Jkc1t0aGlzLmkrK10sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlLnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKHRoaXMuY3VycmVudE5vZGUucmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZS5sZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKHRoaXMuY3VycmVudE5vZGUubGVmdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dCgpO1xyXG4gICAgfTtcclxuICAgIFByZU9yZGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICB0aGlzLnN0YWNrLnB1c2gobm9kZSk7XHJcbiAgICB9O1xyXG4gICAgUHJlT3JkZXIucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5zdGFjay5wb3AoKTtcclxuICAgICAgICB0aGlzLmkgPSAwO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQcmVPcmRlcjtcclxufSgpKTtcclxuZXhwb3J0cy5QcmVPcmRlciA9IFByZU9yZGVyO1xyXG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgUHJlT3JkZXIucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy90eWxlci9wcm9qZWN0cy90cnVmZmxlL25vZGVfbW9kdWxlcy9ub2RlLWludGVydmFsLXRyZWUvbGliL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA1M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYWxsb3dFcXVhbChvYmpBLCBvYmpCLCBjb21wYXJlLCBjb21wYXJlQ29udGV4dCkge1xuICB2YXIgcmV0ID0gY29tcGFyZSA/IGNvbXBhcmUuY2FsbChjb21wYXJlQ29udGV4dCwgb2JqQSwgb2JqQikgOiB2b2lkIDA7XG5cbiAgaWYgKHJldCAhPT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuICEhcmV0O1xuICB9XG5cbiAgaWYgKG9iakEgPT09IG9iakIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqQSAhPT0gXCJvYmplY3RcIiB8fCAhb2JqQSB8fCB0eXBlb2Ygb2JqQiAhPT0gXCJvYmplY3RcIiB8fCAhb2JqQikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBrZXlzQSA9IE9iamVjdC5rZXlzKG9iakEpO1xuICB2YXIga2V5c0IgPSBPYmplY3Qua2V5cyhvYmpCKTtcblxuICBpZiAoa2V5c0EubGVuZ3RoICE9PSBrZXlzQi5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgYkhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5iaW5kKG9iakIpO1xuXG4gIC8vIFRlc3QgZm9yIEEncyBrZXlzIGRpZmZlcmVudCBmcm9tIEIuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGtleXNBLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIga2V5ID0ga2V5c0FbaWR4XTtcblxuICAgIGlmICghYkhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVBID0gb2JqQVtrZXldO1xuICAgIHZhciB2YWx1ZUIgPSBvYmpCW2tleV07XG5cbiAgICByZXQgPSBjb21wYXJlID8gY29tcGFyZS5jYWxsKGNvbXBhcmVDb250ZXh0LCB2YWx1ZUEsIHZhbHVlQiwga2V5KSA6IHZvaWQgMDtcblxuICAgIGlmIChyZXQgPT09IGZhbHNlIHx8IChyZXQgPT09IHZvaWQgMCAmJiB2YWx1ZUEgIT09IHZhbHVlQikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAvVXNlcnMvdHlsZXIvcHJvamVjdHMvdHJ1ZmZsZS9ub2RlX21vZHVsZXMvc2hhbGxvd2VxdWFsL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY29uc3QgSU5JVF9XRUIzID0gXCJJTklUX1dFQjNcIjtcbmV4cG9ydCBmdW5jdGlvbiBpbml0KHByb3ZpZGVyKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogSU5JVF9XRUIzLFxuICAgIHByb3ZpZGVyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBJTlNQRUNUID0gXCJJTlNQRUNUX1RSQU5TQUNUSU9OXCI7XG5leHBvcnQgZnVuY3Rpb24gaW5zcGVjdCh0eEhhc2gpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBJTlNQRUNULFxuICAgIHR4SGFzaFxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgRkVUQ0hfQklOQVJZID0gXCJGRVRDSF9CSU5BUllcIjtcbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEJpbmFyeShhZGRyZXNzLCBibG9jaykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEZFVENIX0JJTkFSWSxcbiAgICBhZGRyZXNzLFxuICAgIGJsb2NrIC8vb3B0aW9uYWxcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfQklOQVJZID0gXCJSRUNFSVZFX0JJTkFSWVwiO1xuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVCaW5hcnkoYWRkcmVzcywgYmluYXJ5KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogUkVDRUlWRV9CSU5BUlksXG4gICAgYWRkcmVzcyxcbiAgICBiaW5hcnlcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IFJFQ0VJVkVfVFJBQ0UgPSBcIlJFQ0VJVkVfVFJBQ0VcIjtcbmV4cG9ydCBmdW5jdGlvbiByZWNlaXZlVHJhY2UodHJhY2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRUNFSVZFX1RSQUNFLFxuICAgIHRyYWNlXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBSRUNFSVZFX0NBTEwgPSBcIlJFQ0VJVkVfQ0FMTFwiO1xuZXhwb3J0IGZ1bmN0aW9uIHJlY2VpdmVDYWxsKHtcbiAgYWRkcmVzcyxcbiAgYmluYXJ5LFxuICBkYXRhLFxuICBzdG9yYWdlQWRkcmVzcyxcbiAgc3RhdHVzLFxuICBzZW5kZXIsXG4gIHZhbHVlLFxuICBnYXNwcmljZSxcbiAgYmxvY2tcbn0pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRUNFSVZFX0NBTEwsXG4gICAgYWRkcmVzcyxcbiAgICBiaW5hcnksXG4gICAgZGF0YSxcbiAgICBzdG9yYWdlQWRkcmVzcyxcbiAgICBzdGF0dXMsIC8vb25seSB1c2VkIGZvciBjcmVhdGlvbiBjYWxscyBhdCBwcmVzZW50IVxuICAgIHNlbmRlcixcbiAgICB2YWx1ZSxcbiAgICBnYXNwcmljZSxcbiAgICBibG9ja1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgRVJST1JfV0VCMyA9IFwiRVJST1JfV0VCM1wiO1xuZXhwb3J0IGZ1bmN0aW9uIGVycm9yKGVycm9yKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogRVJST1JfV0VCMyxcbiAgICBlcnJvclxuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi93ZWIzL2FjdGlvbnMvaW5kZXguanMiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6d2ViMzphZGFwdGVyXCIpO1xuXG5pbXBvcnQgV2ViMyBmcm9tIFwid2ViM1wiO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViM0FkYXB0ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm92aWRlcikge1xuICAgIHRoaXMud2ViMyA9IG5ldyBXZWIzKHByb3ZpZGVyKTtcbiAgfVxuXG4gIGFzeW5jIGdldFRyYWNlKHR4SGFzaCkge1xuICAgIGxldCByZXN1bHQgPSBhd2FpdCBwcm9taXNpZnkodGhpcy53ZWIzLmN1cnJlbnRQcm92aWRlci5zZW5kKShcbiAgICAgIC8vc2VuZCAqb25seSogdXNlcyBjYWxsYmFja3MsIHNvIHdlIHVzZSBwcm9tc2lmaXkgdG8gbWFrZSB0aGluZ3MgbW9yZVxuICAgICAgLy9yZWFkYWJsZVxuICAgICAge1xuICAgICAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgICAgICBtZXRob2Q6IFwiZGVidWdfdHJhY2VUcmFuc2FjdGlvblwiLFxuICAgICAgICBwYXJhbXM6IFt0eEhhc2gsIHt9XSxcbiAgICAgICAgaWQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICB9XG4gICAgKTtcbiAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yLm1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0LnJlc3VsdC5zdHJ1Y3RMb2dzO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldFRyYW5zYWN0aW9uKHR4SGFzaCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLndlYjMuZXRoLmdldFRyYW5zYWN0aW9uKHR4SGFzaCk7XG4gIH1cblxuICBhc3luYyBnZXRSZWNlaXB0KHR4SGFzaCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLndlYjMuZXRoLmdldFRyYW5zYWN0aW9uUmVjZWlwdCh0eEhhc2gpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QmxvY2soYmxvY2tOdW1iZXJPckhhc2gpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRCbG9jayhibG9ja051bWJlck9ySGFzaCk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0RGVwbG95ZWRDb2RlIC0gZ2V0IHRoZSBkZXBsb3llZCBjb2RlIGZvciBhbiBhZGRyZXNzIGZyb20gdGhlIGNsaWVudFxuICAgKiBOT1RFOiB0aGUgYmxvY2sgYXJndW1lbnQgaXMgb3B0aW9uYWxcbiAgICogQHBhcmFtICB7U3RyaW5nfSBhZGRyZXNzXG4gICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICBkZXBsb3llZEJpbmFyeVxuICAgKi9cbiAgYXN5bmMgZ2V0RGVwbG95ZWRDb2RlKGFkZHJlc3MsIGJsb2NrKSB7XG4gICAgZGVidWcoXCJnZXR0aW5nIGRlcGxveWVkIGNvZGUgZm9yICVzXCIsIGFkZHJlc3MpO1xuICAgIGxldCBjb2RlID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRDb2RlKGFkZHJlc3MsIGJsb2NrKTtcbiAgICByZXR1cm4gY29kZSA9PT0gXCIweDBcIiA/IFwiMHhcIiA6IGNvZGU7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvd2ViMy9hZGFwdGVyLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInV0aWxcIlxuLy8gbW9kdWxlIGlkID0gNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoLnN1bVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImxvZGFzaC5zdW1cIlxuLy8gbW9kdWxlIGlkID0gNThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOnNlc3Npb246c2FnYXNcIik7XG5cbmltcG9ydCB7IGNhbGwsIGFsbCwgZm9yaywgdGFrZSwgcHV0LCByYWNlIH0gZnJvbSBcInJlZHV4LXNhZ2EvZWZmZWN0c1wiO1xuXG5pbXBvcnQgeyBwcmVmaXhOYW1lIH0gZnJvbSBcImxpYi9oZWxwZXJzXCI7XG5cbmltcG9ydCAqIGFzIGFzdCBmcm9tIFwibGliL2FzdC9zYWdhc1wiO1xuaW1wb3J0ICogYXMgY29udHJvbGxlciBmcm9tIFwibGliL2NvbnRyb2xsZXIvc2FnYXNcIjtcbmltcG9ydCAqIGFzIHNvbGlkaXR5IGZyb20gXCJsaWIvc29saWRpdHkvc2FnYXNcIjtcbmltcG9ydCAqIGFzIGV2bSBmcm9tIFwibGliL2V2bS9zYWdhc1wiO1xuaW1wb3J0ICogYXMgdHJhY2UgZnJvbSBcImxpYi90cmFjZS9zYWdhc1wiO1xuaW1wb3J0ICogYXMgZGF0YSBmcm9tIFwibGliL2RhdGEvc2FnYXNcIjtcbmltcG9ydCAqIGFzIHdlYjMgZnJvbSBcImxpYi93ZWIzL3NhZ2FzXCI7XG5cbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSBcIi4uL2FjdGlvbnNcIjtcblxuY29uc3QgTE9BRF9TQUdBUyA9IHtcbiAgW2FjdGlvbnMuTE9BRF9UUkFOU0FDVElPTl06IGxvYWRcbiAgLy93aWxsIGFsc28gYWRkIHJlY29uc3RydWN0IGFjdGlvbi9zYWdhIG9uY2UgaXQgZXhpc3RzXG59O1xuXG5mdW5jdGlvbiogbGlzdGVuZXJTYWdhKCkge1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGxldCBhY3Rpb24gPSB5aWVsZCB0YWtlKE9iamVjdC5rZXlzKExPQURfU0FHQVMpKTtcbiAgICBsZXQgc2FnYSA9IExPQURfU0FHQVNbYWN0aW9uLnR5cGVdO1xuXG4gICAgeWllbGQgcHV0KGFjdGlvbnMud2FpdCgpKTtcbiAgICB5aWVsZCByYWNlKHtcbiAgICAgIGV4ZWM6IGNhbGwoc2FnYSwgYWN0aW9uKSwgLy9ub3QgYWxsIHdpbGwgdXNlIHRoaXNcbiAgICAgIGludGVycnVwdDogdGFrZShhY3Rpb25zLklOVEVSUlVQVClcbiAgICB9KTtcbiAgICB5aWVsZCBwdXQoYWN0aW9ucy5yZWFkeSgpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24qIHNhZ2EoKSB7XG4gIGRlYnVnKFwic3RhcnRpbmcgbGlzdGVuZXJzXCIpO1xuICB5aWVsZCogZm9ya0xpc3RlbmVycygpO1xuXG4gIC8vIHJlY2VpdmluZyAmIHNhdmluZyBjb250cmFjdHMgaW50byBzdGF0ZVxuICBkZWJ1ZyhcIndhaXRpbmcgZm9yIGNvbnRyYWN0IGluZm9ybWF0aW9uXCIpO1xuICBsZXQgeyBjb250ZXh0cywgc291cmNlcyB9ID0geWllbGQgdGFrZShhY3Rpb25zLlJFQ09SRF9DT05UUkFDVFMpO1xuXG4gIGRlYnVnKFwicmVjb3JkaW5nIGNvbnRyYWN0IGJpbmFyaWVzXCIpO1xuICB5aWVsZCogcmVjb3JkQ29udGV4dHMoLi4uY29udGV4dHMpO1xuXG4gIGRlYnVnKFwicmVjb3JkaW5nIGNvbnRyYWN0IHNvdXJjZXNcIik7XG4gIHlpZWxkKiByZWNvcmRTb3VyY2VzKC4uLnNvdXJjZXMpO1xuXG4gIGRlYnVnKFwibm9ybWFsaXppbmcgY29udGV4dHNcIik7XG4gIHlpZWxkKiBldm0ubm9ybWFsaXplQ29udGV4dHMoKTtcblxuICBkZWJ1ZyhcIndhaXRpbmcgZm9yIHN0YXJ0XCIpO1xuICAvLyB3YWl0IGZvciBzdGFydCBzaWduYWxcbiAgbGV0IHsgdHhIYXNoLCBwcm92aWRlciB9ID0geWllbGQgdGFrZShhY3Rpb25zLlNUQVJUKTtcbiAgZGVidWcoXCJzdGFydGluZ1wiKTtcblxuICBkZWJ1ZyhcInZpc2l0aW5nIEFTVHNcIik7XG4gIC8vIHZpc2l0IGFzdHNcbiAgeWllbGQqIGFzdC52aXNpdEFsbCgpO1xuXG4gIC8vc2F2ZSBhbGxvY2F0aW9uIHRhYmxlXG4gIGRlYnVnKFwic2F2aW5nIGFsbG9jYXRpb24gdGFibGVcIik7XG4gIHlpZWxkKiBkYXRhLnJlY29yZEFsbG9jYXRpb25zKCk7XG5cbiAgLy9pbml0aWFsaXplIHdlYjMgYWRhcHRlclxuICB5aWVsZCogd2ViMy5pbml0KHByb3ZpZGVyKTtcblxuICAvL3Byb2Nlc3MgdHJhbnNhY3Rpb24gKGlmIHRoZXJlIGlzIG9uZSlcbiAgLy8obm90ZTogdGhpcyBwYXJ0IG1heSBhbHNvIHNldCB0aGUgZXJyb3Igc3RhdGUpXG4gIGlmICh0eEhhc2ggIT09IHVuZGVmaW5lZCkge1xuICAgIHlpZWxkKiBwcm9jZXNzVHJhbnNhY3Rpb24odHhIYXNoKTtcbiAgfVxuXG4gIGRlYnVnKFwicmVhZHlpbmdcIik7XG4gIC8vIHNpZ25hbCB0aGF0IGNvbW1hbmRzIGNhbiBiZWdpblxuICB5aWVsZCogcmVhZHkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBwcm9jZXNzVHJhbnNhY3Rpb24odHhIYXNoKSB7XG4gIC8vIHByb2Nlc3MgdHJhbnNhY3Rpb25cbiAgZGVidWcoXCJmZXRjaGluZyB0cmFuc2FjdGlvbiBpbmZvXCIpO1xuICBsZXQgZXJyID0geWllbGQqIGZldGNoVHgodHhIYXNoKTtcbiAgaWYgKGVycikge1xuICAgIGRlYnVnKFwiZXJyb3IgJW9cIiwgZXJyKTtcbiAgICB5aWVsZCogZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcmVmaXhOYW1lKFwic2Vzc2lvblwiLCBzYWdhKTtcblxuZnVuY3Rpb24qIGZvcmtMaXN0ZW5lcnMoKSB7XG4gIHlpZWxkIGZvcmsobGlzdGVuZXJTYWdhKTsgLy9zZXNzaW9uIGxpc3RlbmVyOyB0aGlzIG9uZSBpcyBzZXBhcmF0ZSwgc29ycnlcbiAgLy8oSSBkaWRuJ3Qgd2FudCB0byBtZXNzIHcvIHRoZSBleGlzdGluZyBzdHJ1Y3R1cmUgb2YgZGVmYXVsdHMpXG4gIHJldHVybiB5aWVsZCBhbGwoXG4gICAgW2NvbnRyb2xsZXIsIGRhdGEsIGV2bSwgc29saWRpdHksIHRyYWNlLCB3ZWIzXS5tYXAoXG4gICAgICBhcHAgPT4gZm9yayhhcHAuc2FnYSlcbiAgICAgIC8vYXN0IG5vIGxvbmdlciBoYXMgYSBsaXN0ZW5lclxuICAgIClcbiAgKTtcbn1cblxuZnVuY3Rpb24qIGZldGNoVHgodHhIYXNoKSB7XG4gIGxldCByZXN1bHQgPSB5aWVsZCogd2ViMy5pbnNwZWN0VHJhbnNhY3Rpb24odHhIYXNoKTtcbiAgZGVidWcoXCJyZXN1bHQgJW9cIiwgcmVzdWx0KTtcblxuICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgcmV0dXJuIHJlc3VsdC5lcnJvcjtcbiAgfVxuXG4gIGRlYnVnKFwic2VuZGluZyBpbml0aWFsIGNhbGxcIik7XG4gIHlpZWxkKiBldm0uYmVnaW4ocmVzdWx0KTtcblxuICAvL2dldCBhZGRyZXNzZXMgY3JlYXRlZC9jYWxsZWQgZHVyaW5nIHRyYW5zYWN0aW9uXG4gIGRlYnVnKFwicHJvY2Vzc2luZyB0cmFjZSBmb3IgYWRkcmVzc2VzXCIpO1xuICBsZXQgYWRkcmVzc2VzID0geWllbGQqIHRyYWNlLnByb2Nlc3NUcmFjZShyZXN1bHQudHJhY2UpO1xuICAvL2FkZCBpbiB0aGUgYWRkcmVzcyBvZiB0aGUgY2FsbCBpdHNlbGYgKGlmIGEgY2FsbClcbiAgaWYgKHJlc3VsdC5hZGRyZXNzICYmICFhZGRyZXNzZXMuaW5jbHVkZXMocmVzdWx0LmFkZHJlc3MpKSB7XG4gICAgYWRkcmVzc2VzLnB1c2gocmVzdWx0LmFkZHJlc3MpO1xuICB9XG4gIC8vaWYgYSBjcmVhdGUsIG9ubHkgYWRkIGluIGFkZHJlc3MgaWYgaXQgd2FzIHN1Y2Nlc3NmdWxcbiAgaWYgKFxuICAgIHJlc3VsdC5iaW5hcnkgJiZcbiAgICByZXN1bHQuc3RhdHVzICYmXG4gICAgIWFkZHJlc3Nlcy5pbmNsdWRlcyhyZXN1bHQuc3RvcmFnZUFkZHJlc3MpXG4gICkge1xuICAgIGFkZHJlc3Nlcy5wdXNoKHJlc3VsdC5zdG9yYWdlQWRkcmVzcyk7XG4gIH1cblxuICBsZXQgYmxvY2tOdW1iZXIgPSByZXN1bHQuYmxvY2subnVtYmVyLnRvU3RyaW5nKCk7IC8vYSBCTiBpcyBub3QgYWNjZXB0ZWRcbiAgZGVidWcoXCJvYnRhaW5pbmcgYmluYXJpZXNcIik7XG4gIGxldCBiaW5hcmllcyA9IHlpZWxkKiB3ZWIzLm9idGFpbkJpbmFyaWVzKGFkZHJlc3NlcywgYmxvY2tOdW1iZXIpO1xuXG4gIGRlYnVnKFwicmVjb3JkaW5nIGluc3RhbmNlc1wiKTtcbiAgeWllbGQgYWxsKFxuICAgIGFkZHJlc3Nlcy5tYXAoKGFkZHJlc3MsIGkpID0+IGNhbGwocmVjb3JkSW5zdGFuY2UsIGFkZHJlc3MsIGJpbmFyaWVzW2ldKSlcbiAgKTtcbn1cblxuZnVuY3Rpb24qIHJlY29yZENvbnRleHRzKC4uLmNvbnRleHRzKSB7XG4gIGZvciAobGV0IGNvbnRleHQgb2YgY29udGV4dHMpIHtcbiAgICB5aWVsZCogZXZtLmFkZENvbnRleHQoY29udGV4dCk7XG4gIH1cbn1cblxuZnVuY3Rpb24qIHJlY29yZFNvdXJjZXMoLi4uc291cmNlcykge1xuICBmb3IgKGxldCBzb3VyY2VEYXRhIG9mIHNvdXJjZXMpIHtcbiAgICBpZiAoc291cmNlRGF0YSAhPT0gdW5kZWZpbmVkICYmIHNvdXJjZURhdGEgIT09IG51bGwpIHtcbiAgICAgIHlpZWxkKiBzb2xpZGl0eS5hZGRTb3VyY2UoXG4gICAgICAgIHNvdXJjZURhdGEuc291cmNlLFxuICAgICAgICBzb3VyY2VEYXRhLnNvdXJjZVBhdGgsXG4gICAgICAgIHNvdXJjZURhdGEuYXN0LFxuICAgICAgICBzb3VyY2VEYXRhLmNvbXBpbGVyXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiogcmVjb3JkSW5zdGFuY2UoYWRkcmVzcywgYmluYXJ5KSB7XG4gIHlpZWxkKiBldm0uYWRkSW5zdGFuY2UoYWRkcmVzcywgYmluYXJ5KTtcbn1cblxuZnVuY3Rpb24qIHJlYWR5KCkge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5yZWFkeSgpKTtcbn1cblxuZnVuY3Rpb24qIGVycm9yKGVycikge1xuICB5aWVsZCBwdXQoYWN0aW9ucy5lcnJvcihlcnIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiB1bmxvYWQoKSB7XG4gIGRlYnVnKFwidW5sb2FkaW5nXCIpO1xuICB5aWVsZCogZGF0YS5yZXNldCgpO1xuICB5aWVsZCogc29saWRpdHkucmVzZXQoKTtcbiAgeWllbGQqIGV2bS51bmxvYWQoKTtcbiAgeWllbGQqIHRyYWNlLnVubG9hZCgpO1xuICB5aWVsZCBwdXQoYWN0aW9ucy51bmxvYWRUcmFuc2FjdGlvbigpKTtcbn1cblxuLy9ub3RlIHRoYXQgbG9hZCB0YWtlcyBhbiBhY3Rpb24gYXMgaXRzIGFyZ3VtZW50LCB3aGljaCBpcyB3aHkgaXQncyBzZXBhcmF0ZVxuLy9mcm9tIHByb2Nlc3NUcmFuc2FjdGlvblxuZnVuY3Rpb24qIGxvYWQoeyB0eEhhc2ggfSkge1xuICB5aWVsZCogcHJvY2Vzc1RyYW5zYWN0aW9uKHR4SGFzaCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL3Nlc3Npb24vc2FnYXMvaW5kZXguanMiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6YXN0OnNhZ2FzXCIpO1xuXG5pbXBvcnQgeyBhbGwsIGNhbGwsIHNlbGVjdCB9IGZyb20gXCJyZWR1eC1zYWdhL2VmZmVjdHNcIjtcblxuaW1wb3J0ICogYXMgZGF0YSBmcm9tIFwibGliL2RhdGEvc2FnYXNcIjtcblxuaW1wb3J0IGFzdCBmcm9tIFwiLi4vc2VsZWN0b3JzXCI7XG5cbmZ1bmN0aW9uKiB3YWxrKHNvdXJjZUlkLCBub2RlLCBwb2ludGVyID0gXCJcIiwgcGFyZW50SWQgPSBudWxsKSB7XG4gIGRlYnVnKFwid2Fsa2luZyAlbyAlb1wiLCBwb2ludGVyLCBub2RlKTtcblxuICB5aWVsZCogaGFuZGxlRW50ZXIoc291cmNlSWQsIG5vZGUsIHBvaW50ZXIsIHBhcmVudElkKTtcblxuICBpZiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgZm9yIChsZXQgW2ksIGNoaWxkXSBvZiBub2RlLmVudHJpZXMoKSkge1xuICAgICAgeWllbGQgY2FsbCh3YWxrLCBzb3VyY2VJZCwgY2hpbGQsIGAke3BvaW50ZXJ9LyR7aX1gLCBwYXJlbnRJZCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICBmb3IgKGxldCBba2V5LCBjaGlsZF0gb2YgT2JqZWN0LmVudHJpZXMobm9kZSkpIHtcbiAgICAgIHlpZWxkIGNhbGwod2Fsaywgc291cmNlSWQsIGNoaWxkLCBgJHtwb2ludGVyfS8ke2tleX1gLCBub2RlLmlkKTtcbiAgICB9XG4gIH1cblxuICB5aWVsZCogaGFuZGxlRXhpdChzb3VyY2VJZCwgbm9kZSwgcG9pbnRlcik7XG59XG5cbmZ1bmN0aW9uKiBoYW5kbGVFbnRlcihzb3VyY2VJZCwgbm9kZSwgcG9pbnRlciwgcGFyZW50SWQpIHtcbiAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBkZWJ1ZyhcImVudGVyaW5nICVzXCIsIHBvaW50ZXIpO1xuXG4gIGlmIChub2RlLmlkICE9PSB1bmRlZmluZWQpIHtcbiAgICBkZWJ1ZyhcIiVzIHJlY29yZGluZyBzY29wZSAlc1wiLCBwb2ludGVyLCBub2RlLmlkKTtcbiAgICB5aWVsZCogZGF0YS5zY29wZShub2RlLmlkLCBwb2ludGVyLCBwYXJlbnRJZCwgc291cmNlSWQpO1xuICB9XG5cbiAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgY2FzZSBcIlZhcmlhYmxlRGVjbGFyYXRpb25cIjpcbiAgICAgIGRlYnVnKFwiJXMgcmVjb3JkaW5nIHZhcmlhYmxlICVvXCIsIHBvaW50ZXIsIG5vZGUpO1xuICAgICAgeWllbGQqIGRhdGEuZGVjbGFyZShub2RlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJDb250cmFjdERlZmluaXRpb25cIjpcbiAgICBjYXNlIFwiU3RydWN0RGVmaW5pdGlvblwiOlxuICAgIGNhc2UgXCJFbnVtRGVmaW5pdGlvblwiOlxuICAgICAgeWllbGQqIGRhdGEuZGVmaW5lVHlwZShub2RlKTtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmZ1bmN0aW9uKiBoYW5kbGVFeGl0KHNvdXJjZUlkLCBub2RlLCBwb2ludGVyKSB7XG4gIGRlYnVnKFwiZXhpdGluZyAlc1wiLCBwb2ludGVyKTtcblxuICAvLyBuby1vcCByaWdodCBub3dcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiB2aXNpdEFsbCgpIHtcbiAgbGV0IHNvdXJjZXMgPSB5aWVsZCBzZWxlY3QoYXN0LnZpZXdzLnNvdXJjZXMpO1xuXG4gIHlpZWxkIGFsbChcbiAgICBPYmplY3QuZW50cmllcyhzb3VyY2VzKVxuICAgICAgLmZpbHRlcigoW18sIHNvdXJjZV0pID0+IHNvdXJjZS5hc3QpXG4gICAgICAubWFwKChbaWQsIHsgYXN0IH1dKSA9PiBjYWxsKHdhbGssIGlkLCBhc3QpKVxuICApO1xuXG4gIGRlYnVnKFwiZG9uZSB2aXNpdGluZ1wiKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvYXN0L3NhZ2FzL2luZGV4LmpzIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOnNlc3Npb246cmVkdWNlcnNcIik7XG5cbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xuXG5pbXBvcnQgZGF0YSBmcm9tIFwibGliL2RhdGEvcmVkdWNlcnNcIjtcbmltcG9ydCBldm0gZnJvbSBcImxpYi9ldm0vcmVkdWNlcnNcIjtcbmltcG9ydCBzb2xpZGl0eSBmcm9tIFwibGliL3NvbGlkaXR5L3JlZHVjZXJzXCI7XG5pbXBvcnQgdHJhY2UgZnJvbSBcImxpYi90cmFjZS9yZWR1Y2Vyc1wiO1xuaW1wb3J0IGNvbnRyb2xsZXIgZnJvbSBcImxpYi9jb250cm9sbGVyL3JlZHVjZXJzXCI7XG5cbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSBcIi4vYWN0aW9uc1wiO1xuXG5mdW5jdGlvbiByZWFkeShzdGF0ZSA9IGZhbHNlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5SRUFEWTpcbiAgICAgIGRlYnVnKFwicmVhZHlpbmdcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYWN0aW9ucy5XQUlUOlxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9qZWN0SW5mb0NvbXB1dGVkKHN0YXRlID0gZmFsc2UsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25zLlBST0pFQ1RfSU5GT19DT01QVVRFRDpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gbGFzdExvYWRpbmdFcnJvcihzdGF0ZSA9IG51bGwsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25zLkVSUk9SOlxuICAgICAgZGVidWcoXCJlcnJvcjogJW9cIiwgYWN0aW9uLmVycm9yKTtcbiAgICAgIHJldHVybiBhY3Rpb24uZXJyb3I7XG5cbiAgICBjYXNlIGFjdGlvbnMuV0FJVDpcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2FjdGlvbihzdGF0ZSA9IHt9LCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5TQVZFX1RSQU5TQUNUSU9OOlxuICAgICAgcmV0dXJuIGFjdGlvbi50cmFuc2FjdGlvbjtcbiAgICBjYXNlIGFjdGlvbnMuVU5MT0FEX1RSQU5TQUNUSU9OOlxuICAgICAgcmV0dXJuIHt9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVjZWlwdChzdGF0ZSA9IHt9LCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5TQVZFX1JFQ0VJUFQ6XG4gICAgICByZXR1cm4gYWN0aW9uLnJlY2VpcHQ7XG4gICAgY2FzZSBhY3Rpb25zLlVOTE9BRF9UUkFOU0FDVElPTjpcbiAgICAgIHJldHVybiB7fTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJsb2NrKHN0YXRlID0ge30sIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25zLlNBVkVfQkxPQ0s6XG4gICAgICByZXR1cm4gYWN0aW9uLmJsb2NrO1xuICAgIGNhc2UgYWN0aW9ucy5VTkxPQURfVFJBTlNBQ1RJT046XG4gICAgICByZXR1cm4ge307XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5jb25zdCBzZXNzaW9uID0gY29tYmluZVJlZHVjZXJzKHtcbiAgcmVhZHksXG4gIGxhc3RMb2FkaW5nRXJyb3IsXG4gIHByb2plY3RJbmZvQ29tcHV0ZWQsXG4gIHRyYW5zYWN0aW9uLFxuICByZWNlaXB0LFxuICBibG9ja1xufSk7XG5cbmNvbnN0IHJlZHVjZVN0YXRlID0gY29tYmluZVJlZHVjZXJzKHtcbiAgc2Vzc2lvbixcbiAgZGF0YSxcbiAgZXZtLFxuICBzb2xpZGl0eSxcbiAgdHJhY2UsXG4gIGNvbnRyb2xsZXJcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByZWR1Y2VTdGF0ZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvc2Vzc2lvbi9yZWR1Y2Vycy5qcyIsImltcG9ydCBkZWJ1Z01vZHVsZSBmcm9tIFwiZGVidWdcIjtcbmNvbnN0IGRlYnVnID0gZGVidWdNb2R1bGUoXCJkZWJ1Z2dlcjpkYXRhOnJlZHVjZXJzXCIpO1xuXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcblxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tIFwiLi9hY3Rpb25zXCI7XG5cbmltcG9ydCB7IHNsb3RBZGRyZXNzIH0gZnJvbSBcInRydWZmbGUtZGVjb2RlclwiO1xuaW1wb3J0IHsgbWFrZUFzc2lnbm1lbnQgfSBmcm9tIFwibGliL2hlbHBlcnNcIjtcbmltcG9ydCB7IENvbnZlcnNpb24sIERlZmluaXRpb24sIEVWTSB9IGZyb20gXCJ0cnVmZmxlLWRlY29kZS11dGlsc1wiO1xuXG5jb25zdCBERUZBVUxUX1NDT1BFUyA9IHtcbiAgYnlJZDoge31cbn07XG5cbmZ1bmN0aW9uIHNjb3BlcyhzdGF0ZSA9IERFRkFVTFRfU0NPUEVTLCBhY3Rpb24pIHtcbiAgdmFyIHNjb3BlO1xuICB2YXIgdmFyaWFibGVzO1xuXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuU0NPUEU6XG4gICAgICBzY29wZSA9IHN0YXRlLmJ5SWRbYWN0aW9uLmlkXSB8fCB7fTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYnlJZDoge1xuICAgICAgICAgIC4uLnN0YXRlLmJ5SWQsXG5cbiAgICAgICAgICBbYWN0aW9uLmlkXToge1xuICAgICAgICAgICAgLi4uc2NvcGUsXG5cbiAgICAgICAgICAgIGlkOiBhY3Rpb24uaWQsXG4gICAgICAgICAgICBzb3VyY2VJZDogYWN0aW9uLnNvdXJjZUlkLFxuICAgICAgICAgICAgcGFyZW50SWQ6IGFjdGlvbi5wYXJlbnRJZCxcbiAgICAgICAgICAgIHBvaW50ZXI6IGFjdGlvbi5wb2ludGVyXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgY2FzZSBhY3Rpb25zLkRFQ0xBUkU6XG4gICAgICBzY29wZSA9IHN0YXRlLmJ5SWRbYWN0aW9uLm5vZGUuc2NvcGVdIHx8IHt9O1xuICAgICAgdmFyaWFibGVzID0gc2NvcGUudmFyaWFibGVzIHx8IFtdO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBieUlkOiB7XG4gICAgICAgICAgLi4uc3RhdGUuYnlJZCxcblxuICAgICAgICAgIFthY3Rpb24ubm9kZS5zY29wZV06IHtcbiAgICAgICAgICAgIC4uLnNjb3BlLFxuXG4gICAgICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICAgICAgLi4udmFyaWFibGVzLFxuXG4gICAgICAgICAgICAgIHsgbmFtZTogYWN0aW9uLm5vZGUubmFtZSwgaWQ6IGFjdGlvbi5ub2RlLmlkIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbi8vYSBub3RlIG9uIHRoZSBmb2xsb3dpbmcgcmVkdWNlcjogc29saWRpdHkgYXNzaWducyBhIHVuaXF1ZSBBU1QgSUQgdG8gZXZlcnlcbi8vQVNUIG5vZGUgYW1vbmcgYWxsIHRoZSBmaWxlcyBiZWluZyBjb21waWxlZCB0b2dldGhlci4gIHRodXMsIGl0IGlzLCBmb3Igbm93LFxuLy9zYWZlIHRvIGlkZW50aWZ5IHVzZXItZGVmaW5lZCB0eXBlcyBzb2xlbHkgYnkgdGhlaXIgQVNUIElELiAgSW4gdGhlIGZ1dHVyZSxcbi8vb25jZSB3ZSBldmVudHVhbGx5IHN1cHBvcnQgaGF2aW5nIHNvbWUgZmlsZXMgY29tcGlsZWQgc2VwYXJhdGVseSBmcm9tIG90aGVycyxcbi8vdGhpcyB3aWxsIGJlY29tZSBhIGJ1ZyB5b3UnbGwgaGF2ZSB0byBmaXgsIGFuZCB5b3UnbGwgaGF2ZSB0byBmaXggaXQgaW4gdGhlXG4vL2RlY29kZXIsIHRvby4gIFNvcnJ5LCBmdXR1cmUgbWUhIChvciB3aG9ldmVyJ3Mgc3R1Y2sgZG9pbmcgdGhpcylcblxuZnVuY3Rpb24gdXNlckRlZmluZWRUeXBlcyhzdGF0ZSA9IFtdLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5ERUZJTkVfVFlQRTpcbiAgICAgIHJldHVybiBbLi4uc3RhdGUsIGFjdGlvbi5ub2RlLmlkXTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmNvbnN0IERFRkFVTFRfQUxMT0NBVElPTlMgPSB7XG4gIHN0b3JhZ2U6IHt9LFxuICBtZW1vcnk6IHt9LFxuICBjYWxsZGF0YToge31cbn07XG5cbmZ1bmN0aW9uIGFsbG9jYXRpb25zKHN0YXRlID0gREVGQVVMVF9BTExPQ0FUSU9OUywgYWN0aW9uKSB7XG4gIGlmIChhY3Rpb24udHlwZSA9PT0gYWN0aW9ucy5BTExPQ0FURSkge1xuICAgIHJldHVybiB7XG4gICAgICBzdG9yYWdlOiBhY3Rpb24uc3RvcmFnZSxcbiAgICAgIG1lbW9yeTogYWN0aW9uLm1lbW9yeSxcbiAgICAgIGNhbGxkYXRhOiBhY3Rpb24uY2FsbGRhdGFcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5jb25zdCBpbmZvID0gY29tYmluZVJlZHVjZXJzKHtcbiAgc2NvcGVzLFxuICB1c2VyRGVmaW5lZFR5cGVzLFxuICBhbGxvY2F0aW9uc1xufSk7XG5cbmNvbnN0IEdMT0JBTF9BU1NJR05NRU5UUyA9IFtcbiAgW3sgYnVpbHRpbjogXCJtc2dcIiB9LCB7IHNwZWNpYWw6IFwibXNnXCIgfV0sXG4gIFt7IGJ1aWx0aW46IFwidHhcIiB9LCB7IHNwZWNpYWw6IFwidHhcIiB9XSxcbiAgW3sgYnVpbHRpbjogXCJibG9ja1wiIH0sIHsgc3BlY2lhbDogXCJibG9ja1wiIH1dLFxuICBbeyBidWlsdGluOiBcInRoaXNcIiB9LCB7IHNwZWNpYWw6IFwidGhpc1wiIH1dLFxuICBbeyBidWlsdGluOiBcIm5vd1wiIH0sIHsgc3BlY2lhbDogXCJ0aW1lc3RhbXBcIiB9XSAvL3dlIGRvbid0IGhhdmUgYW4gYWxpYXMgXCJub3dcIlxuXS5tYXAoKFtpZE9iaiwgcmVmXSkgPT4gbWFrZUFzc2lnbm1lbnQoaWRPYmosIHJlZikpO1xuXG5jb25zdCBERUZBVUxUX0FTU0lHTk1FTlRTID0ge1xuICBieUlkOiBPYmplY3QuYXNzaWduKFxuICAgIHt9LCAvL3dlIHN0YXJ0IG91dCB3aXRoIGFsbCBnbG9iYWxzIGFzc2lnbmVkXG4gICAgLi4uR0xPQkFMX0FTU0lHTk1FTlRTLm1hcChhc3NpZ25tZW50ID0+ICh7IFthc3NpZ25tZW50LmlkXTogYXNzaWdubWVudCB9KSlcbiAgKSxcbiAgYnlBc3RJZDoge30sIC8vbm8gcmVndWxhciB2YXJpYWJsZXMgYXNzaWduZWQgYXQgc3RhcnRcbiAgYnlCdWlsdGluOiBPYmplY3QuYXNzaWduKFxuICAgIHt9LCAvL2FnYWluLCBhbGwgZ2xvYmFscyBzdGFydCBhc3NpZ25lZFxuICAgIC4uLkdMT0JBTF9BU1NJR05NRU5UUy5tYXAoYXNzaWdubWVudCA9PiAoe1xuICAgICAgW2Fzc2lnbm1lbnQuYnVpbHRpbl06IFthc3NpZ25tZW50LmlkXSAvL3llcywgdGhhdCdzIGEgMS1lbGVtZW50IGFycmF5XG4gICAgfSkpXG4gIClcbn07XG5cbmZ1bmN0aW9uIGFzc2lnbm1lbnRzKHN0YXRlID0gREVGQVVMVF9BU1NJR05NRU5UUywgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuQVNTSUdOOlxuICAgIGNhc2UgYWN0aW9ucy5NQVBfUEFUSF9BTkRfQVNTSUdOOlxuICAgICAgZGVidWcoXCJhY3Rpb24udHlwZSAlT1wiLCBhY3Rpb24udHlwZSk7XG4gICAgICBkZWJ1ZyhcImFjdGlvbi5hc3NpZ25tZW50cyAlT1wiLCBhY3Rpb24uYXNzaWdubWVudHMpO1xuICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYWN0aW9uLmFzc2lnbm1lbnRzKS5yZWR1Y2UoKGFjYywgYXNzaWdubWVudCkgPT4ge1xuICAgICAgICBsZXQgeyBpZCwgYXN0SWQgfSA9IGFzc2lnbm1lbnQ7XG4gICAgICAgIC8vd2UgYXNzdW1lIGZvciBub3cgdGhhdCBvbmx5IG9yZGluYXJ5IHZhcmlhYmxlcyB3aWxsIGJlIGFzc2lnbmVkIHRoaXNcbiAgICAgICAgLy93YXksIGFuZCBub3QgZ2xvYmFsczsgZ2xvYmFscyBhcmUgaGFuZGxlZCBpbiBERUZBVUxUX0FTU0lHTk1FTlRTXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgIGJ5SWQ6IHtcbiAgICAgICAgICAgIC4uLmFjYy5ieUlkLFxuICAgICAgICAgICAgW2lkXTogYXNzaWdubWVudFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnlBc3RJZDoge1xuICAgICAgICAgICAgLi4uYWNjLmJ5QXN0SWQsXG4gICAgICAgICAgICBbYXN0SWRdOiBbLi4ubmV3IFNldChbLi4uKGFjYy5ieUFzdElkW2FzdElkXSB8fCBbXSksIGlkXSldXG4gICAgICAgICAgICAvL3dlIHVzZSBhIHNldCBmb3IgdW5pcXVlbmVzc1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sIHN0YXRlKTtcblxuICAgIGNhc2UgYWN0aW9ucy5SRVNFVDpcbiAgICAgIHJldHVybiBERUZBVUxUX0FTU0lHTk1FTlRTO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5jb25zdCBERUZBVUxUX1BBVEhTID0ge1xuICBieUFkZHJlc3M6IHt9XG59O1xuXG4vL1dBUk5JTkc6IGRvICpub3QqIHJlbHkgb24gbWFwcGVkUGF0aHMgdG8ga2VlcCB0cmFjayBvZiBwYXRocyB0aGF0IGRvIG5vdFxuLy9pbnZvbHZlIG1hcHBpbmcga2V5cyEgIFllcywgbWFueSB3aWxsIGdldCBtYXBwZWQsIGJ1dCB0aGVyZSBpcyBubyBndWFyYW50ZWUuXG4vL09ubHkgd2hlbiBtYXBwaW5nIGtleXMgYXJlIGludm9sdmVkIGRvZXMgaXQgbmVjZXNzYXJpbHkgd29yayByZWxpYWJseSAtLVxuLy93aGljaCBpcyBmaW5lLCBhcyB0aGF0J3MgYWxsIHdlIG5lZWQgaXQgZm9yLlxuZnVuY3Rpb24gbWFwcGVkUGF0aHMoc3RhdGUgPSBERUZBVUxUX1BBVEhTLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5NQVBfUEFUSF9BTkRfQVNTSUdOOlxuICAgICAgbGV0IHsgYWRkcmVzcywgc2xvdCwgdHlwZUlkZW50aWZpZXIsIHBhcmVudFR5cGUgfSA9IGFjdGlvbjtcbiAgICAgIC8vaG93IHRoaXMgY2FzZSB3b3JrczogZmlyc3QsIHdlIGZpbmQgdGhlIHNwb3QgaW4gb3VyIHRhYmxlIChiYXNlZCBvblxuICAgICAgLy9hZGRyZXNzLCB0eXBlIGlkZW50aWZpZXIsIGFuZCBzbG90IGFkZHJlc3MpIHdoZXJlIHRoZSBuZXcgZW50cnkgc2hvdWxkXG4gICAgICAvL2JlIGFkZGVkOyBpZiBuZWVkZWQgd2Ugc2V0IHVwIGFsbCB0aGUgb2JqZWN0cyBuZWVkZWQgYWxvbmcgdGhlIHdheS4gIElmXG4gICAgICAvL3RoZXJlJ3MgYWxyZWFkeSBzb21ldGhpbmcgdGhlcmUsIHdlIGRvIG5vdGhpbmcuICBJZiB0aGVyZSdzIG5vdGhpbmdcbiAgICAgIC8vdGhlcmUsIHdlIHJlY29yZCBvdXIgZ2l2ZW4gc2xvdCBpbiB0aGF0IHNwb3QgaW4gdGhhdCB0YWJsZSAtLSBob3dldmVyLFxuICAgICAgLy93ZSBhbHRlciBpdCBpbiBvbmUga2V5IHdheS4gIEJlZm9yZSBlbnRyeSwgd2UgY2hlY2sgaWYgdGhlIHNsb3Qnc1xuICAgICAgLy8qcGFyZW50KiBoYXMgYSBzcG90IGluIHRoZSB0YWJsZSwgYmFzZWQgb24gYWRkcmVzcyAoc2FtZSBmb3IgYm90aCBjaGlsZFxuICAgICAgLy9hbmQgcGFyZW50KSwgcGFyZW50VHlwZSwgYW5kIHRoZSBwYXJlbnQncyBzbG90IGFkZHJlc3MgKHdoaWNoIGNhbiBiZVxuICAgICAgLy9mb3VuZCBhcyB0aGUgc2xvdEFkZHJlc3Mgb2YgdGhlIHNsb3QncyBwYXRoIG9iamVjdCwgaWYgaXQgZXhpc3RzIC0tIGlmXG4gICAgICAvL2l0IGRvZXNuJ3QgdGhlbiB3ZSBjb25jbHVkZSB0aGF0IG5vIHRoZSBwYXJlbnQgZG9lcyBub3QgaGF2ZSBhIHNwb3QgaW5cbiAgICAgIC8vdGhlIHRhYmxlKS4gIElmIHRoZSBwYXJlbnQgaGFzIGEgc2xvdCBpbiB0aGUgdGFibGUgYWxyZWFkeSwgdGhlbiB3ZVxuICAgICAgLy9hbHRlciB0aGUgY2hpbGQgc2xvdCBieSByZXBsYWNpbmcgaXRzIHBhdGggd2l0aCB0aGUgcGFyZW50IHNsb3QuICBUaGlzXG4gICAgICAvL3dpbGwga2VlcCB0aGUgc2xvdEFkZHJlc3MgdGhlIHNhbWUsIGJ1dCBzaW5jZSB0aGUgdmVyc2lvbnMga2VwdCBpbiB0aGVcbiAgICAgIC8vdGFibGUgaGVyZSBhcmUgc3VwcG9zZWQgdG8gcHJlc2VydmUgcGF0aCBpbmZvcm1hdGlvbiwgd2UnbGwgYmVcbiAgICAgIC8vcmVwbGFjaW5nIGEgZmFpcmx5IGJhcmUtYm9uZXMgU2xvdCBvYmplY3Qgd2l0aCBvbmUgd2l0aCBhIGZ1bGwgcGF0aC5cblxuICAgICAgLy93ZSBkbyBOT1Qgd2FudCB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIHR5cGVzIHdpdGggYW5kIHdpdGhvdXQgXCJfcHRyXCIgb25cbiAgICAgIC8vdGhlIGVuZCBoZXJlIVxuICAgICAgZGVidWcoXCJ0eXBlSWRlbnRpZmllciAlc1wiLCB0eXBlSWRlbnRpZmllcik7XG4gICAgICB0eXBlSWRlbnRpZmllciA9IERlZmluaXRpb24ucmVzdG9yZVB0cih0eXBlSWRlbnRpZmllcik7XG4gICAgICBwYXJlbnRUeXBlID0gRGVmaW5pdGlvbi5yZXN0b3JlUHRyKHBhcmVudFR5cGUpO1xuXG4gICAgICBkZWJ1ZyhcInNsb3QgJW9cIiwgc2xvdCk7XG4gICAgICBsZXQgaGV4U2xvdEFkZHJlc3MgPSBDb252ZXJzaW9uLnRvSGV4U3RyaW5nKFxuICAgICAgICBzbG90QWRkcmVzcyhzbG90KSxcbiAgICAgICAgRVZNLldPUkRfU0laRVxuICAgICAgKTtcbiAgICAgIGxldCBwYXJlbnRBZGRyZXNzID0gc2xvdC5wYXRoXG4gICAgICAgID8gQ29udmVyc2lvbi50b0hleFN0cmluZyhzbG90QWRkcmVzcyhzbG90LnBhdGgpLCBFVk0uV09SRF9TSVpFKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgLy90aGlzIGlzIGdvaW5nIHRvIGJlIG1lc3N5IGFuZCBwcm9jZWR1cmFsLCBzb3JyeS4gIGJ1dCBsZXQncyBzdGFydCB3aXRoXG4gICAgICAvL3RoZSBlYXN5IHN0dWZmOiBjcmVhdGUgdGhlIG5ldyBhZGRyZXNzIGlmIG5lZWRlZCwgY2xvbmUgaWYgbm90XG4gICAgICBsZXQgbmV3U3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBieUFkZHJlc3M6IHtcbiAgICAgICAgICAuLi5zdGF0ZS5ieUFkZHJlc3MsXG4gICAgICAgICAgW2FkZHJlc3NdOiB7XG4gICAgICAgICAgICBieVR5cGU6IHtcbiAgICAgICAgICAgICAgLi4uKHN0YXRlLmJ5QWRkcmVzc1thZGRyZXNzXSB8fCB7IGJ5VHlwZToge30gfSkuYnlUeXBlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvL25vdywgbGV0J3MgYWRkIGluIHRoZSBuZXcgdHlwZSwgaWYgbmVlZGVkXG4gICAgICBuZXdTdGF0ZS5ieUFkZHJlc3NbYWRkcmVzc10uYnlUeXBlID0ge1xuICAgICAgICAuLi5uZXdTdGF0ZS5ieUFkZHJlc3NbYWRkcmVzc10uYnlUeXBlLFxuICAgICAgICBbdHlwZUlkZW50aWZpZXJdOiB7XG4gICAgICAgICAgYnlTbG90QWRkcmVzczoge1xuICAgICAgICAgICAgLi4uKFxuICAgICAgICAgICAgICBuZXdTdGF0ZS5ieUFkZHJlc3NbYWRkcmVzc10uYnlUeXBlW3R5cGVJZGVudGlmaWVyXSB8fCB7XG4gICAgICAgICAgICAgICAgYnlTbG90QWRkcmVzczoge31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS5ieVNsb3RBZGRyZXNzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBsZXQgb2xkU2xvdCA9XG4gICAgICAgIG5ld1N0YXRlLmJ5QWRkcmVzc1thZGRyZXNzXS5ieVR5cGVbdHlwZUlkZW50aWZpZXJdLmJ5U2xvdEFkZHJlc3NbXG4gICAgICAgICAgaGV4U2xvdEFkZHJlc3NcbiAgICAgICAgXTtcbiAgICAgIC8veWVzLCB0aGlzIGxvb2tzIHN0cmFuZ2UsIGJ1dCB3ZSBoYXZlbid0IGNoYW5nZWQgaXQgeWV0IGV4Y2VwdCB0b1xuICAgICAgLy9jbG9uZSBvciBjcmVhdGUgZW1wdHkgKGFuZCB3ZSBkb24ndCB3YW50IHVuZGVmaW5lZCEpXG4gICAgICAvL25vdzogaXMgdGhlcmUgc29tZXRoaW5nIGFscmVhZHkgdGhlcmUgb3Igbm8/ICBpZiBubywgd2UgbXVzdCBhZGRcbiAgICAgIGlmIChvbGRTbG90ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IG5ld1Nsb3Q7XG4gICAgICAgIGRlYnVnKFwicGFyZW50QWRkcmVzcyAlb1wiLCBwYXJlbnRBZGRyZXNzKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBhcmVudEFkZHJlc3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIG5ld1N0YXRlLmJ5QWRkcmVzc1thZGRyZXNzXS5ieVR5cGVbcGFyZW50VHlwZV0gJiZcbiAgICAgICAgICBuZXdTdGF0ZS5ieUFkZHJlc3NbYWRkcmVzc10uYnlUeXBlW3BhcmVudFR5cGVdLmJ5U2xvdEFkZHJlc3NbXG4gICAgICAgICAgICBwYXJlbnRBZGRyZXNzXG4gICAgICAgICAgXVxuICAgICAgICApIHtcbiAgICAgICAgICAvL2lmIHRoZSBwYXJlbnQgaXMgYWxyZWFkeSBwcmVzZW50LCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBnaXZlblxuICAgICAgICAgIC8vcGFyZW50IVxuICAgICAgICAgIG5ld1Nsb3QgPSB7XG4gICAgICAgICAgICAuLi5zbG90LFxuICAgICAgICAgICAgcGF0aDpcbiAgICAgICAgICAgICAgbmV3U3RhdGUuYnlBZGRyZXNzW2FkZHJlc3NdLmJ5VHlwZVtwYXJlbnRUeXBlXS5ieVNsb3RBZGRyZXNzW1xuICAgICAgICAgICAgICAgIHBhcmVudEFkZHJlc3NcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3U2xvdCA9IHNsb3Q7XG4gICAgICAgIH1cbiAgICAgICAgbmV3U3RhdGUuYnlBZGRyZXNzW2FkZHJlc3NdLmJ5VHlwZVt0eXBlSWRlbnRpZmllcl0uYnlTbG90QWRkcmVzc1tcbiAgICAgICAgICBoZXhTbG90QWRkcmVzc1xuICAgICAgICBdID0gbmV3U2xvdDtcbiAgICAgIH1cbiAgICAgIC8vaWYgdGhlcmUncyBhbHJlYWR5IHNvbWV0aGluZyB0aGVyZSwgd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZ1xuXG4gICAgICByZXR1cm4gbmV3U3RhdGU7XG5cbiAgICBjYXNlIGFjdGlvbnMuUkVTRVQ6XG4gICAgICByZXR1cm4gREVGQVVMVF9QQVRIUztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuY29uc3QgcHJvYyA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGFzc2lnbm1lbnRzLFxuICBtYXBwZWRQYXRoc1xufSk7XG5cbmNvbnN0IHJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuICBpbmZvLFxuICBwcm9jXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVkdWNlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvZGF0YS9yZWR1Y2Vycy5qcyIsImltcG9ydCBkZWJ1Z01vZHVsZSBmcm9tIFwiZGVidWdcIjtcbmNvbnN0IGRlYnVnID0gZGVidWdNb2R1bGUoXCJkZWJ1Z2dlcjpldm06cmVkdWNlcnNcIik7XG5cbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xuXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gXCIuL2FjdGlvbnNcIjtcbmltcG9ydCB7IGtlY2NhazI1NiwgZXh0cmFjdFByaW1hcnlTb3VyY2UgfSBmcm9tIFwibGliL2hlbHBlcnNcIjtcbmltcG9ydCAqIGFzIERlY29kZVV0aWxzIGZyb20gXCJ0cnVmZmxlLWRlY29kZS11dGlsc1wiO1xuXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCI7XG5cbmNvbnN0IERFRkFVTFRfQ09OVEVYVFMgPSB7XG4gIGJ5Q29udGV4dDoge31cbn07XG5cbmZ1bmN0aW9uIGNvbnRleHRzKHN0YXRlID0gREVGQVVMVF9DT05URVhUUywgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAvKlxuICAgICAqIEFkZGluZyBhIG5ldyBjb250ZXh0XG4gICAgICovXG4gICAgY2FzZSBhY3Rpb25zLkFERF9DT05URVhUOlxuICAgICAgY29uc3Qge1xuICAgICAgICBjb250cmFjdE5hbWUsXG4gICAgICAgIGJpbmFyeSxcbiAgICAgICAgc291cmNlTWFwLFxuICAgICAgICBjb21waWxlcixcbiAgICAgICAgYWJpLFxuICAgICAgICBjb250cmFjdElkLFxuICAgICAgICBjb250cmFjdEtpbmQsXG4gICAgICAgIGlzQ29uc3RydWN0b3JcbiAgICAgIH0gPSBhY3Rpb247XG4gICAgICBkZWJ1ZyhcImFjdGlvbiAlT1wiLCBhY3Rpb24pO1xuICAgICAgLy9OT1RFOiB3ZSB0YWtlIGhhc2ggYXMgKnN0cmluZyosIG5vdCBhcyBieXRlcywgYmVjYXVzZSB0aGUgYmluYXJ5IG1heVxuICAgICAgLy9jb250YWluIGxpbmsgcmVmZXJlbmNlcyFcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBrZWNjYWsyNTYoeyB0eXBlOiBcInN0cmluZ1wiLCB2YWx1ZTogYmluYXJ5IH0pO1xuICAgICAgbGV0IHByaW1hcnlTb3VyY2U7XG4gICAgICBpZiAoc291cmNlTWFwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJpbWFyeVNvdXJjZSA9IGV4dHJhY3RQcmltYXJ5U291cmNlKHNvdXJjZU1hcCk7XG4gICAgICB9XG4gICAgICAvL290aGVyd2lzZSBsZWF2ZSBpdCB1bmRlZmluZWRcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGJ5Q29udGV4dDoge1xuICAgICAgICAgIC4uLnN0YXRlLmJ5Q29udGV4dCxcbiAgICAgICAgICBbY29udGV4dF06IHtcbiAgICAgICAgICAgIGNvbnRyYWN0TmFtZSxcbiAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICBiaW5hcnksXG4gICAgICAgICAgICBzb3VyY2VNYXAsXG4gICAgICAgICAgICBwcmltYXJ5U291cmNlLFxuICAgICAgICAgICAgY29tcGlsZXIsXG4gICAgICAgICAgICBhYmksXG4gICAgICAgICAgICBjb250cmFjdElkLFxuICAgICAgICAgICAgY29udHJhY3RLaW5kLFxuICAgICAgICAgICAgaXNDb25zdHJ1Y3RvclxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIGNhc2UgYWN0aW9ucy5OT1JNQUxJWkVfQ09OVEVYVFM6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBieUNvbnRleHQ6IERlY29kZVV0aWxzLkNvbnRleHRzLm5vcm1hbGl6ZUNvbnRleHRzKHN0YXRlLmJ5Q29udGV4dClcbiAgICAgIH07XG5cbiAgICAvKlxuICAgICAqIERlZmF1bHQgY2FzZVxuICAgICAqL1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9JTlNUQU5DRVMgPSB7XG4gIGJ5QWRkcmVzczoge30sXG4gIGJ5Q29udGV4dDoge31cbn07XG5cbmZ1bmN0aW9uIGluc3RhbmNlcyhzdGF0ZSA9IERFRkFVTFRfSU5TVEFOQ0VTLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIC8qXG4gICAgICogQWRkaW5nIGEgbmV3IGFkZHJlc3MgZm9yIGNvbnRleHRcbiAgICAgKi9cbiAgICBjYXNlIGFjdGlvbnMuQUREX0lOU1RBTkNFOlxuICAgICAgbGV0IHsgYWRkcmVzcywgY29udGV4dCwgYmluYXJ5IH0gPSBhY3Rpb247XG5cbiAgICAgIC8vIGdldCBrbm93biBhZGRyZXNzZXMgZm9yIHRoaXMgY29udGV4dFxuICAgICAgbGV0IG90aGVySW5zdGFuY2VzID0gc3RhdGUuYnlDb250ZXh0W2NvbnRleHRdIHx8IFtdO1xuICAgICAgbGV0IG90aGVyQWRkcmVzc2VzID0gb3RoZXJJbnN0YW5jZXMubWFwKCh7IGFkZHJlc3MgfSkgPT4gYWRkcmVzcyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJ5QWRkcmVzczoge1xuICAgICAgICAgIC4uLnN0YXRlLmJ5QWRkcmVzcyxcblxuICAgICAgICAgIFthZGRyZXNzXTogeyBhZGRyZXNzLCBjb250ZXh0LCBiaW5hcnkgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGJ5Q29udGV4dDoge1xuICAgICAgICAgIC4uLnN0YXRlLmJ5Q29udGV4dCxcblxuICAgICAgICAgIC8vIHJlY29uc3RydWN0IGNvbnRleHQgaW5zdGFuY2VzIHRvIGluY2x1ZGUgbmV3IGFkZHJlc3NcbiAgICAgICAgICBbY29udGV4dF06IEFycmF5LmZyb20obmV3IFNldChvdGhlckFkZHJlc3NlcykuYWRkKGFkZHJlc3MpKS5tYXAoXG4gICAgICAgICAgICBhZGRyZXNzID0+ICh7IGFkZHJlc3MgfSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25zLlVOTE9BRF9UUkFOU0FDVElPTjpcbiAgICAgIHJldHVybiBERUZBVUxUX0lOU1RBTkNFUztcblxuICAgIC8qXG4gICAgICogRGVmYXVsdCBjYXNlXG4gICAgICovXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5jb25zdCBERUZBVUxUX1RYID0ge1xuICBnYXNwcmljZTogbmV3IEJOKDApLFxuICBvcmlnaW46IERlY29kZVV0aWxzLkVWTS5aRVJPX0FERFJFU1Ncbn07XG5cbmZ1bmN0aW9uIHR4KHN0YXRlID0gREVGQVVMVF9UWCwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuU0FWRV9HTE9CQUxTOlxuICAgICAgbGV0IHsgZ2FzcHJpY2UsIG9yaWdpbiB9ID0gYWN0aW9uO1xuICAgICAgcmV0dXJuIHsgZ2FzcHJpY2UsIG9yaWdpbiB9O1xuICAgIGNhc2UgYWN0aW9ucy5VTkxPQURfVFJBTlNBQ1RJT046XG4gICAgICByZXR1cm4gREVGQVVMVF9UWDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmNvbnN0IERFRkFVTFRfQkxPQ0sgPSB7XG4gIGNvaW5iYXNlOiBEZWNvZGVVdGlscy5FVk0uWkVST19BRERSRVNTLFxuICBkaWZmaWN1bHR5OiBuZXcgQk4oMCksXG4gIGdhc2xpbWl0OiBuZXcgQk4oMCksXG4gIG51bWJlcjogbmV3IEJOKDApLFxuICB0aW1lc3RhbXA6IG5ldyBCTigwKVxufTtcblxuZnVuY3Rpb24gYmxvY2soc3RhdGUgPSBERUZBVUxUX0JMT0NLLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5TQVZFX0dMT0JBTFM6XG4gICAgICByZXR1cm4gYWN0aW9uLmJsb2NrO1xuICAgIGNhc2UgYWN0aW9ucy5VTkxPQURfVFJBTlNBQ1RJT046XG4gICAgICByZXR1cm4gREVGQVVMVF9CTE9DSztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmNvbnN0IGdsb2JhbHMgPSBjb21iaW5lUmVkdWNlcnMoe1xuICB0eCxcbiAgYmxvY2tcbn0pO1xuXG5jb25zdCBpbmZvID0gY29tYmluZVJlZHVjZXJzKHtcbiAgY29udGV4dHNcbn0pO1xuXG5jb25zdCB0cmFuc2FjdGlvbiA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGluc3RhbmNlcyxcbiAgZ2xvYmFsc1xufSk7XG5cbmZ1bmN0aW9uIGNhbGxzdGFjayhzdGF0ZSA9IFtdLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5DQUxMOiB7XG4gICAgICBjb25zdCB7IGFkZHJlc3MsIGRhdGEsIHN0b3JhZ2VBZGRyZXNzLCBzZW5kZXIsIHZhbHVlIH0gPSBhY3Rpb247XG4gICAgICByZXR1cm4gc3RhdGUuY29uY2F0KFt7IGFkZHJlc3MsIGRhdGEsIHN0b3JhZ2VBZGRyZXNzLCBzZW5kZXIsIHZhbHVlIH1dKTtcbiAgICB9XG5cbiAgICBjYXNlIGFjdGlvbnMuQ1JFQVRFOiB7XG4gICAgICBjb25zdCB7IGJpbmFyeSwgc3RvcmFnZUFkZHJlc3MsIHNlbmRlciwgdmFsdWUgfSA9IGFjdGlvbjtcbiAgICAgIHJldHVybiBzdGF0ZS5jb25jYXQoXG4gICAgICAgIFt7IGJpbmFyeSwgZGF0YTogXCIweFwiLCBzdG9yYWdlQWRkcmVzcywgc2VuZGVyLCB2YWx1ZSB9XVxuICAgICAgICAvL3RoZSBlbXB0eSBkYXRhIGZpZWxkIGlzIHRvIG1ha2UgbXNnLmRhdGEgYW5kIG1zZy5zaWcgY29tZSBvdXQgcmlnaHRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY2FzZSBhY3Rpb25zLlJFVFVSTjpcbiAgICBjYXNlIGFjdGlvbnMuRkFJTDpcbiAgICAgIC8vcG9wIHRoZSBzdGFjay4uLiB1bmxlc3MgKEhBQ0spIHRoYXQgd291bGQgbGVhdmUgaXQgZW1wdHkgKHRoaXMgd2lsbFxuICAgICAgLy9vbmx5IGhhcHBlbiBhdCB0aGUgZW5kIHdoZW4gd2Ugd2FudCB0byBrZWVwIHRoZSBsYXN0IG9uZSBhcm91bmQpXG4gICAgICByZXR1cm4gc3RhdGUubGVuZ3RoID4gMSA/IHN0YXRlLnNsaWNlKDAsIC0xKSA6IHN0YXRlO1xuXG4gICAgY2FzZSBhY3Rpb25zLlJFU0VUOlxuICAgICAgcmV0dXJuIFtzdGF0ZVswXV07IC8vbGVhdmUgdGhlIGluaXRpYWwgY2FsbCBzdGlsbCBvbiB0aGUgc3RhY2tcblxuICAgIGNhc2UgYWN0aW9ucy5VTkxPQURfVFJBTlNBQ1RJT046XG4gICAgICByZXR1cm4gW107XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbi8vZGVmYXVsdCBjb2RleCBzdGFja2ZyYW1lIHdpdGggYSBzaW5nbGUgYWRkcmVzcyAob3Igbm9uZSBpZiBhZGRyZXNzIG5vdFxuLy9zdXBwbGllZClcbmZ1bmN0aW9uIGRlZmF1bHRDb2RleEZyYW1lKGFkZHJlc3MpIHtcbiAgaWYgKGFkZHJlc3MgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7XG4gICAgICAvL3RoZXJlIHdpbGwgYmUgbW9yZSBoZXJlIGluIHRoZSBmdXR1cmUhXG4gICAgICBhY2NvdW50czoge1xuICAgICAgICBbYWRkcmVzc106IHtcbiAgICAgICAgICAvL3RoZXJlIHdpbGwgYmUgbW9yZSBoZXJlIGluIHRoZSBmdXR1cmUhXG4gICAgICAgICAgc3RvcmFnZToge31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vdGhlcmUgd2lsbCBiZSBtb3JlIGhlcmUgaW4gdGhlIGZ1dHVyZSFcbiAgICAgIGFjY291bnRzOiB7fVxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gY29kZXgoc3RhdGUgPSBbXSwgYWN0aW9uKSB7XG4gIGxldCBuZXdTdGF0ZSwgdG9wQ29kZXg7XG5cbiAgY29uc3QgdXBkYXRlRnJhbWVTdG9yYWdlID0gKGZyYW1lLCBhZGRyZXNzLCBzbG90LCB2YWx1ZSkgPT4ge1xuICAgIGxldCBleGlzdGluZ1BhZ2UgPSBmcmFtZS5hY2NvdW50c1thZGRyZXNzXSB8fCB7IHN0b3JhZ2U6IHt9IH07XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZyYW1lLFxuICAgICAgYWNjb3VudHM6IHtcbiAgICAgICAgLi4uZnJhbWUuYWNjb3VudHMsXG4gICAgICAgIFthZGRyZXNzXToge1xuICAgICAgICAgIC4uLmV4aXN0aW5nUGFnZSxcbiAgICAgICAgICBzdG9yYWdlOiB7XG4gICAgICAgICAgICAuLi5leGlzdGluZ1BhZ2Uuc3RvcmFnZSxcbiAgICAgICAgICAgIFtzbG90XTogdmFsdWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuQ0FMTDpcbiAgICBjYXNlIGFjdGlvbnMuQ1JFQVRFOlxuICAgICAgLy9vbiBhIGNhbGwgb3IgY3JlYXRlLCBtYWtlIGEgbmV3IHN0YWNrZnJhbWUsIHRoZW4gYWRkIGEgbmV3IHBhZ2VzIHRvIHRoZVxuICAgICAgLy9jb2RleCBpZiBuZWNlc3Nhcnk7IGRvbid0IGFkZCBhIHplcm8gcGFnZSB0aG91Z2ggKG9yIHBhZ2VzIHRoYXQgYWxyZWFkeVxuICAgICAgLy9leGlzdClcblxuICAgICAgLy9maXJzdCwgYWRkIGEgbmV3IHN0YWNrZnJhbWU7IGlmIHRoZXJlJ3MgYW4gZXhpc3Rpbmcgc3RhY2tmcmFtZSwgY2xvbmVcbiAgICAgIC8vdGhhdCwgb3RoZXJ3aXNlIG1ha2Ugb25lIGZyb20gc2NyYXRjaFxuICAgICAgbmV3U3RhdGUgPVxuICAgICAgICBzdGF0ZS5sZW5ndGggPiAwXG4gICAgICAgICAgPyBbLi4uc3RhdGUsIHN0YXRlW3N0YXRlLmxlbmd0aCAtIDFdXVxuICAgICAgICAgIDogW2RlZmF1bHRDb2RleEZyYW1lKCldO1xuICAgICAgdG9wQ29kZXggPSBuZXdTdGF0ZVtuZXdTdGF0ZS5sZW5ndGggLSAxXTtcbiAgICAgIC8vbm93LCBkbyB3ZSBuZWVkIHRvIGFkZCBhIG5ldyBhZGRyZXNzIHRvIHRoaXMgc3RhY2tmcmFtZT9cbiAgICAgIGlmIChcbiAgICAgICAgdG9wQ29kZXguYWNjb3VudHNbYWN0aW9uLnN0b3JhZ2VBZGRyZXNzXSAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIGFjdGlvbi5zdG9yYWdlQWRkcmVzcyA9PT0gRGVjb2RlVXRpbHMuRVZNLlpFUk9fQUREUkVTU1xuICAgICAgKSB7XG4gICAgICAgIC8vaWYgd2UgZG9uJ3RcbiAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuICAgICAgfVxuICAgICAgLy9pZiB3ZSBkb1xuICAgICAgbmV3U3RhdGVbbmV3U3RhdGUubGVuZ3RoIC0gMV0gPSB7XG4gICAgICAgIC4uLnRvcENvZGV4LFxuICAgICAgICBhY2NvdW50czoge1xuICAgICAgICAgIC4uLnRvcENvZGV4LmFjY291bnRzLFxuICAgICAgICAgIFthY3Rpb24uc3RvcmFnZUFkZHJlc3NdOiB7XG4gICAgICAgICAgICBzdG9yYWdlOiB7fVxuICAgICAgICAgICAgLy90aGVyZSB3aWxsIGJlIG1vcmUgaGVyZSBpbiB0aGUgZnV0dXJlIVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcblxuICAgIGNhc2UgYWN0aW9ucy5TVE9SRToge1xuICAgICAgLy9vbiBhIHN0b3JlLCB0aGUgcmVsZXZhbnQgcGFnZSBzaG91bGQgYWxyZWFkeSBleGlzdCwgc28gd2UgY2FuIGp1c3RcbiAgICAgIC8vYWRkIG9yIHVwZGF0ZSB0aGUgbmVlZGVkIHNsb3RcbiAgICAgIGNvbnN0IHsgYWRkcmVzcywgc2xvdCwgdmFsdWUgfSA9IGFjdGlvbjtcbiAgICAgIGlmIChhZGRyZXNzID09PSBEZWNvZGVVdGlscy5FVk0uWkVST19BRERSRVNTKSB7XG4gICAgICAgIC8vYXMgYWx3YXlzLCB3ZSBkbyBub3QgbWFpbnRhaW4gYSB6ZXJvIHBhZ2VcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgICAgbmV3U3RhdGUgPSBzdGF0ZS5zbGljZSgpOyAvL2Nsb25lIHRoZSBzdGF0ZVxuICAgICAgdG9wQ29kZXggPSBuZXdTdGF0ZVtuZXdTdGF0ZS5sZW5ndGggLSAxXTtcbiAgICAgIG5ld1N0YXRlW25ld1N0YXRlLmxlbmd0aCAtIDFdID0gdXBkYXRlRnJhbWVTdG9yYWdlKFxuICAgICAgICB0b3BDb2RleCxcbiAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgc2xvdCxcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG4gICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgfVxuXG4gICAgY2FzZSBhY3Rpb25zLkxPQUQ6IHtcbiAgICAgIC8vbG9hZHMgYXJlIGEgbGl0dGxlIG1vcmUgY29tcGxpY2F0ZWQgLS0gdXN1YWxseSB3ZSBkbyBub3RoaW5nLCBidXQgaWZcbiAgICAgIC8vaXQncyBhbiBleHRlcm5hbCBsb2FkICh0aGVyZSB3YXMgbm90aGluZyBhbHJlYWR5IHRoZXJlKSwgdGhlbiB3ZSB3YW50XG4gICAgICAvL3RvIHVwZGF0ZSAqZXZlcnkqIHN0YWNrZnJhbWVcbiAgICAgIGNvbnN0IHsgYWRkcmVzcywgc2xvdCwgdmFsdWUgfSA9IGFjdGlvbjtcbiAgICAgIGlmIChhZGRyZXNzID09PSBEZWNvZGVVdGlscy5FVk0uWkVST19BRERSRVNTKSB7XG4gICAgICAgIC8vYXMgYWx3YXlzLCB3ZSBkbyBub3QgbWFpbnRhaW4gYSB6ZXJvIHBhZ2VcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgICAgdG9wQ29kZXggPSBzdGF0ZVtzdGF0ZS5sZW5ndGggLSAxXTtcbiAgICAgIGlmICh0b3BDb2RleC5hY2NvdW50c1thZGRyZXNzXS5zdG9yYWdlW3Nsb3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy9pZiB3ZSBhbHJlYWR5IGhhdmUgYSB2YWx1ZSBpbiB0aGUgKnRvcCogc3RhY2tmcmFtZSwgdXBkYXRlICpubypcbiAgICAgICAgLy9zdGFja2ZyYW1lczsgZG9uJ3QgdXBkYXRlIHRoZSB0b3AgKG5vIG5lZWQsIGl0J3MganVzdCBhIGxvYWQsIG5vdCBhXG4gICAgICAgIC8vc3RvcmUpLCBkb24ndCB1cGRhdGUgdGhlIHJlc3QgKHRoYXQgd291bGQgYmUgd3JvbmcsIHlvdSBtaWdodCBiZVxuICAgICAgICAvL2xvYWRpbmcgYSB2YWx1ZSB0aGF0IHdpbGwgZ2V0IHJldmVydGVkIGxhdGVyKVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2lmIHdlICpkb24ndCogYWxyZWFkeSBoYXZlIGEgdmFsdWUgaW4gdGhlIHRvcCBzdGFja2ZyYW1lLCB0aGF0IG1lYW5zXG4gICAgICAgIC8vd2UncmUgbG9hZGluZyBhIHZhbHVlIGZyb20gYSBwcmV2aW91cyB0cmFuc2FjdGlvbiEgIFRoYXQncyBub3QgYVxuICAgICAgICAvL3ZhbHVlIHRoYXQgd2lsbCBnZXQgcmV2ZXJ0ZWQgaWYgdGhpcyBjYWxsIGZhaWxzLCBzbyB1cGRhdGUgKmV2ZXJ5KlxuICAgICAgICAvL3N0YWNrZnJhbWVcbiAgICAgICAgcmV0dXJuIHN0YXRlLm1hcChmcmFtZSA9PlxuICAgICAgICAgIHVwZGF0ZUZyYW1lU3RvcmFnZShmcmFtZSwgYWRkcmVzcywgc2xvdCwgdmFsdWUpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FzZSBhY3Rpb25zLlJFVFVSTjpcbiAgICAgIC8vd2Ugd2FudCB0byBwb3AgdGhlIHRvcCB3aGlsZSBtYWtpbmcgdGhlIG5ldyB0b3AgYSBjb3B5IG9mIHRoZSBvbGQgdG9wO1xuICAgICAgLy90aGF0IGlzIHRvIHNheSwgd2Ugd2FudCB0byBkcm9wIGp1c3QgdGhlIGVsZW1lbnQgKnNlY29uZCogZnJvbSB0aGUgdG9wXG4gICAgICAvLyhhbHRob3VnaCwgSEFDSywgaWYgdGhlIHN0YWNrIG9ubHkgaGFzIG9uZSBlbGVtZW50LCBqdXN0IGxlYXZlIGl0IGFsb25lKVxuICAgICAgcmV0dXJuIHN0YXRlLmxlbmd0aCA+IDFcbiAgICAgICAgPyBzdGF0ZS5zbGljZSgwLCAtMikuY29uY2F0KFtzdGF0ZVtzdGF0ZS5sZW5ndGggLSAxXV0pXG4gICAgICAgIDogc3RhdGU7XG5cbiAgICBjYXNlIGFjdGlvbnMuRkFJTDpcbiAgICAgIC8vcG9wIHRoZSBzdGFjay4uLiB1bmxlc3MgKEhBQ0spIHRoYXQgd291bGQgbGVhdmUgaXQgZW1wdHkgKHRoaXMgd2lsbFxuICAgICAgLy9vbmx5IGhhcHBlbiBhdCB0aGUgZW5kIHdoZW4gd2Ugd2FudCB0byBrZWVwIHRoZSBsYXN0IG9uZSBhcm91bmQpXG4gICAgICByZXR1cm4gc3RhdGUubGVuZ3RoID4gMSA/IHN0YXRlLnNsaWNlKDAsIC0xKSA6IHN0YXRlO1xuXG4gICAgY2FzZSBhY3Rpb25zLlJFU0VUOlxuICAgICAgcmV0dXJuIFtkZWZhdWx0Q29kZXhGcmFtZShhY3Rpb24uc3RvcmFnZUFkZHJlc3MpXTtcblxuICAgIGNhc2UgYWN0aW9ucy5VTkxPQURfVFJBTlNBQ1RJT046XG4gICAgICByZXR1cm4gW107XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmNvbnN0IHByb2MgPSBjb21iaW5lUmVkdWNlcnMoe1xuICBjYWxsc3RhY2ssXG4gIGNvZGV4XG59KTtcblxuY29uc3QgcmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGluZm8sXG4gIHRyYW5zYWN0aW9uLFxuICBwcm9jXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVkdWNlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvZXZtL3JlZHVjZXJzLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2FycmF5L2Zyb21cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvYXJyYXkvZnJvbVwiXG4vLyBtb2R1bGUgaWQgPSA2NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tIFwicmVkdXhcIjtcblxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tIFwiLi9hY3Rpb25zXCI7XG5cbmNvbnN0IERFRkFVTFRfU09VUkNFUyA9IHtcbiAgYnlJZDoge31cbn07XG5cbmZ1bmN0aW9uIHNvdXJjZXMoc3RhdGUgPSBERUZBVUxUX1NPVVJDRVMsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgLypcbiAgICAgKiBBZGRpbmcgYSBuZXcgc291cmNlXG4gICAgICovXG4gICAgY2FzZSBhY3Rpb25zLkFERF9TT1VSQ0U6XG4gICAgICBsZXQgeyBhc3QsIHNvdXJjZSwgc291cmNlUGF0aCwgY29tcGlsZXIgfSA9IGFjdGlvbjtcblxuICAgICAgbGV0IGlkID0gT2JqZWN0LmtleXMoc3RhdGUuYnlJZCkubGVuZ3RoO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBieUlkOiB7XG4gICAgICAgICAgLi4uc3RhdGUuYnlJZCxcblxuICAgICAgICAgIFtpZF06IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgYXN0LFxuICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgc291cmNlUGF0aCxcbiAgICAgICAgICAgIGNvbXBpbGVyXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgLypcbiAgICAgKiBEZWZhdWx0IGNhc2VcbiAgICAgKi9cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmNvbnN0IGluZm8gPSBjb21iaW5lUmVkdWNlcnMoe1xuICBzb3VyY2VzXG59KTtcblxuZnVuY3Rpb24gZnVuY3Rpb25EZXB0aFN0YWNrKHN0YXRlID0gWzBdLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5KVU1QOlxuICAgICAgbGV0IG5ld1N0YXRlID0gc3RhdGUuc2xpY2UoKTsgLy9jbG9uZSB0aGUgc3RhdGVcbiAgICAgIGNvbnN0IGRlbHRhID0gc3BlbHVuayhhY3Rpb24uanVtcERpcmVjdGlvbik7XG4gICAgICBsZXQgdG9wID0gbmV3U3RhdGVbbmV3U3RhdGUubGVuZ3RoIC0gMV07XG4gICAgICBuZXdTdGF0ZVtuZXdTdGF0ZS5sZW5ndGggLSAxXSA9IHRvcCArIGRlbHRhO1xuICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuXG4gICAgY2FzZSBhY3Rpb25zLlJFU0VUOlxuICAgICAgcmV0dXJuIFswXTtcblxuICAgIGNhc2UgYWN0aW9ucy5FWFRFUk5BTF9DQUxMOlxuICAgICAgcmV0dXJuIFsuLi5zdGF0ZSwgc3RhdGVbc3RhdGUubGVuZ3RoIC0gMV0gKyAxXTtcblxuICAgIGNhc2UgYWN0aW9ucy5FWFRFUk5BTF9SRVRVUk46XG4gICAgICAvL2p1c3QgcG9wIHRoZSBzdGFjayEgdW5sZXNzLCBIQUNLLCB0aGF0IHdvdWxkIGxlYXZlIGl0IGVtcHR5XG4gICAgICByZXR1cm4gc3RhdGUubGVuZ3RoID4gMSA/IHN0YXRlLnNsaWNlKDAsIC0xKSA6IHN0YXRlO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzcGVsdW5rKGp1bXApIHtcbiAgaWYgKGp1bXAgPT09IFwiaVwiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoanVtcCA9PT0gXCJvXCIpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxuY29uc3QgcHJvYyA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGZ1bmN0aW9uRGVwdGhTdGFja1xufSk7XG5cbmNvbnN0IHJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuICBpbmZvLFxuICBwcm9jXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVkdWNlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBsaWIvc29saWRpdHkvcmVkdWNlcnMuanMiLCJpbXBvcnQgZGVidWdNb2R1bGUgZnJvbSBcImRlYnVnXCI7XG5jb25zdCBkZWJ1ZyA9IGRlYnVnTW9kdWxlKFwiZGVidWdnZXI6dHJhY2U6cmVkdWNlcnNcIik7XG5cbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xuXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gXCIuL2FjdGlvbnNcIjtcblxuZnVuY3Rpb24gaW5kZXgoc3RhdGUgPSAwLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9ucy5UT0NLOlxuICAgICAgcmV0dXJuIHN0YXRlICsgMTtcblxuICAgIGNhc2UgYWN0aW9ucy5SRVNFVDpcbiAgICBjYXNlIGFjdGlvbnMuVU5MT0FEX1RSQU5TQUNUSU9OOlxuICAgICAgcmV0dXJuIDA7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmlzaGVkKHN0YXRlID0gZmFsc2UsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25zLkVORF9PRl9UUkFDRTpcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBhY3Rpb25zLlJFU0VUOlxuICAgIGNhc2UgYWN0aW9ucy5VTkxPQURfVFJBTlNBQ1RJT046XG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0ZXBzKHN0YXRlID0gbnVsbCwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuU0FWRV9TVEVQUzpcbiAgICAgIHJldHVybiBhY3Rpb24uc3RlcHM7XG4gICAgY2FzZSBhY3Rpb25zLlVOTE9BRF9UUkFOU0FDVElPTjpcbiAgICAgIGRlYnVnKFwidW5sb2FkaW5nXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5jb25zdCB0cmFuc2FjdGlvbiA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIHN0ZXBzXG59KTtcblxuY29uc3QgcHJvYyA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGluZGV4LFxuICBmaW5pc2hlZFxufSk7XG5cbmNvbnN0IHJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuICB0cmFuc2FjdGlvbixcbiAgcHJvY1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJlZHVjZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gbGliL3RyYWNlL3JlZHVjZXJzLmpzIiwiaW1wb3J0IGRlYnVnTW9kdWxlIGZyb20gXCJkZWJ1Z1wiO1xuY29uc3QgZGVidWcgPSBkZWJ1Z01vZHVsZShcImRlYnVnZ2VyOmNvbnRyb2xsZXI6cmVkdWNlcnNcIik7XG5cbmltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xuXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gXCIuL2FjdGlvbnNcIjtcblxuZnVuY3Rpb24gYnJlYWtwb2ludHMoc3RhdGUgPSBbXSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvbnMuQUREX0JSRUFLUE9JTlQ6XG4gICAgICAvL2NoZWNrIGZvciBhbnkgZXhpc3RpbmcgaWRlbnRpY2FsIGJyZWFrcG9pbnRzIHRvIGF2b2lkIHJlZHVuZGFuY3lcbiAgICAgIGlmIChcbiAgICAgICAgc3RhdGUuZmlsdGVyKFxuICAgICAgICAgIGJyZWFrcG9pbnQgPT5cbiAgICAgICAgICAgIGJyZWFrcG9pbnQuc291cmNlSWQgPT09IGFjdGlvbi5icmVha3BvaW50LnNvdXJjZUlkICYmXG4gICAgICAgICAgICBicmVha3BvaW50LmxpbmUgPT09IGFjdGlvbi5icmVha3BvaW50LmxpbmUgJiZcbiAgICAgICAgICAgIGJyZWFrcG9pbnQubm9kZSA9PT0gYWN0aW9uLmJyZWFrcG9pbnQubm9kZSAvL21heSBiZSB1bmRlZmluZWRcbiAgICAgICAgKS5sZW5ndGggPiAwXG4gICAgICApIHtcbiAgICAgICAgLy9pZiBpdCdzIGFscmVhZHkgdGhlcmUsIGRvIG5vdGhpbmdcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9vdGhlcndpc2UgYWRkIGl0XG4gICAgICAgIHJldHVybiBzdGF0ZS5jb25jYXQoW2FjdGlvbi5icmVha3BvaW50XSk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYWN0aW9ucy5SRU1PVkVfQlJFQUtQT0lOVDpcbiAgICAgIHJldHVybiBzdGF0ZS5maWx0ZXIoXG4gICAgICAgIGJyZWFrcG9pbnQgPT5cbiAgICAgICAgICBicmVha3BvaW50LnNvdXJjZUlkICE9PSBhY3Rpb24uYnJlYWtwb2ludC5zb3VyY2VJZCB8fFxuICAgICAgICAgIGJyZWFrcG9pbnQubGluZSAhPT0gYWN0aW9uLmJyZWFrcG9pbnQubGluZSB8fFxuICAgICAgICAgIGJyZWFrcG9pbnQubm9kZSAhPT0gYWN0aW9uLmJyZWFrcG9pbnQubm9kZSAvL21heSBiZSB1bmRlZmluZWRcbiAgICAgICk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYWN0aW9ucy5SRU1PVkVfQUxMX0JSRUFLUE9JTlRTOlxuICAgICAgcmV0dXJuIFtdO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1N0ZXBwaW5nKHN0YXRlID0gZmFsc2UsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25zLlNUQVJUX1NURVBQSU5HOlxuICAgICAgZGVidWcoXCJnb3Qgc3RlcCBzdGFydCBhY3Rpb25cIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIGFjdGlvbnMuRE9ORV9TVEVQUElORzpcbiAgICAgIGRlYnVnKFwiZ290IHN0ZXAgc3RvcCBhY3Rpb25cIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5jb25zdCByZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcbiAgYnJlYWtwb2ludHMsXG4gIGlzU3RlcHBpbmdcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByZWR1Y2VyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGxpYi9jb250cm9sbGVyL3JlZHVjZXJzLmpzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzdEQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNLQTtBQVFBO0FBWUE7QUFlQTtBQU9BO0FBUUE7QUFRQTtBQVNBO0FBUUE7QUFRQTtBQVFBO0FBUUE7QUFTQTtBQVNBO0FBQ0E7QUEzSEE7QUFDQTtBQURBO0FBQ0E7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzlIQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTs7O0FBRUE7QUFDQTtBQUFBO0FBQ0E7OztBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTs7Ozs7QUFUQTtBQUNBO0FBaUJBOzs7O0FBSUE7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBSUE7Ozs7O0FBS0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBR0E7Ozs7O0FBS0E7QUFDQTtBQUdBOzs7QUFHQTtBQUNBO0FBR0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUdBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQWhHQTtBQUNBO0FBcUdBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUtBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUtBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZIQTtBQTBIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7OztBQU1BO0FBUEE7QUFUQTtBQUNBO0FBcUJBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBSUE7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBUkE7QUFaQTtBQUNBO0FBdUJBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFLQTs7O0FBR0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRkE7QUFJQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFHQTtBQURBO0FBQ0E7QUFJQTs7O0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUlBOzs7O0FBSUE7QUFDQTtBQUlBOzs7O0FBSUE7QUE5Q0E7QUFDQTtBQW9EQTs7O0FBR0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBR0E7QUFqQkE7QUExSEE7QUFDQTtBQWlKQTs7O0FBR0E7QUFDQTs7Ozs7QUFLQTtBQUdBO0FBREE7QUFDQTtBQUlBOzs7QUFHQTtBQWhCQTtBQUNBO0FBa0JBOzs7QUFHQTtBQUNBOzs7OztBQUtBO0FBR0E7QUFEQTtBQVJBO0FBeE9BO0FBQ0E7QUFzUEE7Ozs7Ozs7Ozs7Ozs7QUM3ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQUNBO0FBWUE7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUlBOzs7OztBQUtBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBSUE7Ozs7O0FBS0E7QUFBQTtBQUNBO0FBSUE7Ozs7Ozs7QUFPQTtBQUNBO0FBS0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBL0VBO0FBQ0E7QUFpRkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqR0E7QUFDQTs7O0FBRUE7QUFDQTtBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUNBO0FBQ0E7QUFBQTtBQUNBOzs7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQVhBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUxBO0FBSEE7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBR0E7QUFDQTtBQUtBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFLQTs7O0FBR0E7QUF4Q0E7QUE4Q0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFKQTtBQUNBO0FBTUE7OztBQUdBO0FBQ0E7OztBQUdBO0FBQUE7QUFDQTtBQUtBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFJQTs7O0FBR0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBREE7QUFNQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFMQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBRUE7OztBQUdBO0FBT0E7QUFEQTtBQUNBO0FBNUlBO0FBQ0E7QUFrSkE7OztBQUdBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFFQTs7O0FBR0E7QUFRQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBREE7QUFlQTtBQUNBO0FBR0E7OztBQUdBO0FBQ0E7QUFLQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBSUE7OztBQUdBO0FBQ0E7QUFJQTs7O0FBR0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUF2U0E7QUFDQTtBQTZTQTs7Ozs7QUFLQTtBQXRVQTtBQUNBO0FBd1VBOzs7Ozs7Ozs7Ozs7QUN4WkE7QUFRQTtBQUtBO0FBS0E7QUFLQTtBQUtBO0FBS0E7QUFLQTtBQXZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0JBO0FBOENBO0FBSUE7QUFtQ0E7QUFJQTtBQUlBO0FBQ0E7QUExR0E7QUFDQTs7O0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQVZBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkJBO0FBQ0E7QUEwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVHQTtBQVNBO0FBUUE7QUFLQTtBQU9BO0FBT0E7QUFPQTtBQVFBO0FBT0E7QUFTQTtBQVFBO0FBUUE7QUFwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOzs7Ozs7QUN6RkE7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzRCQTtBQUlBO0FBSUE7QUFZQTtBQThoQkE7QUFJQTtBQWlGQTtBQUNBO0FBcHFCQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQU9BO0FBQ0E7Ozs7Ozs7QUExQkE7QUFDQTtBQTBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNCQTtBQTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBSEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcENBO0FBc0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQWpCQTtBQW1CQTtBQUNBO0FBQ0E7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBellBO0FBMllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU1BO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3ZxQkE7Ozs7OztBQ0FBOzs7Ozs7Ozs7Ozs7QUNDQTtBQUtBO0FBS0E7QUFLQTtBQUtBO0FBS0E7QUFLQTtBQUtBO0FBU0E7QUFRQTtBQVFBO0FBT0E7QUFPQTtBQTNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9FQTtBQUNBOzs7QUFFQTtBQUNBO0FBQUE7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUNBO0FBQ0E7QUFEQTtBQUNBOzs7OztBQVhBO0FBQ0E7QUFXQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFJQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTs7OztBQUlBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7QUFHQTtBQU9BO0FBQ0E7QUFFQTtBQUhBO0FBREE7QUF6QkE7QUFKQTtBQUNBO0FBMkNBOzs7QUFHQTtBQUNBOzs7O0FBSUE7QUFMQTtBQUNBO0FBYUE7OztBQUdBO0FBQ0E7QUFRQTs7O0FBR0E7QUFDQTtBQVdBOzs7O0FBSUE7QUFDQTtBQUdBOzs7OztBQUtBO0FBSUE7QUFEQTtBQUNBO0FBS0E7Ozs7Ozs7Ozs7O0FBV0E7QUFNQTtBQURBO0FBMUlBO0FBQ0E7QUFnSkE7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUlBO0FBQ0E7QUFIQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7OztBQUdBO0FBdkRBO0FBQ0E7QUF5REE7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQWRBO0FBQ0E7QUFnQkE7OztBQUdBO0FBckZBO0FBQ0E7QUEwRkE7OztBQUdBO0FBQ0E7OztBQUdBO0FBR0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTs7O0FBR0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBckJBO0FBQ0E7QUEwQkE7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFLQTs7O0FBR0E7QUFDQTtBQUtBOzs7QUFHQTtBQUNBO0FBS0E7OztBQUdBO0FBT0E7QUFEQTtBQUNBO0FBS0E7Ozs7OztBQU1BO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFXQTtBQURBO0FBUUE7QUFEQTtBQXBFQTtBQUNBO0FBMkVBOzs7QUFHQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUlBOzs7QUFHQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUFhQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBR0E7QUFHQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUtBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBR0E7QUFDQTs7Ozs7O0FBTUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7OztBQUdBO0FBSUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQXZDQTtBQUNBO0FBa0RBOzs7OztBQUtBO0FBS0E7QUFKQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBOUpBO0FBaFJBO0FBQ0E7QUFvYkE7OztBQUdBO0FBQ0E7Ozs7O0FBS0E7QUFDQTs7O0FBR0E7QUFKQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7QUFHQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBbkVBO0FBQ0E7QUFxRUE7OztBQUdBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBOzs7QUFHQTtBQUpBO0FBUkE7QUF2eEJBO0FBQ0E7QUE4eUJBOzs7Ozs7QUM5M0JBOzs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7O0FDa0JBO0FBV0E7QUFVQTtBQW9CQTtBQXlCQTtBQWtFQTtBQUtBO0FBSUE7QUFDQTtBQWhLQTtBQUNBOzs7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFEQTtBQUNBOzs7OztBQVhBO0FBQ0E7QUFXQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbktBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFDQTtBQUNBOzs7QUFUQTtBQUNBO0FBU0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUlBOzs7QUFHQTtBQUNBO0FBSUE7OztBQUdBO0FBQ0E7QUFJQTs7O0FBR0E7QUE1QkE7QUFDQTtBQWlDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQVRBO0FBeERBO0FBQ0E7QUFvRUE7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaERBO0FBQ0E7QUFrREE7Ozs7QUFJQTtBQUNBO0FBQ0E7OztBQUdBO0FBNUlBO0FBQ0E7QUE4SUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEpBO0FBY0E7QUE4QkE7QUFrQkE7QUFhQTtBQUNBO0FBdEZBO0FBQ0E7OztBQUVBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUxBO0FBQ0E7QUFLQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFOQTtBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvRkE7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7O0FBUEE7QUFDQTtBQU9BO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFEQTtBQU9BO0FBekJBO0FBQ0E7QUE2QkE7OztBQUdBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQWpCQTtBQUNBO0FBbUJBOzs7QUFHQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFJQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBSUE7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFsREE7QUFqRUE7QUFDQTtBQXlIQTs7Ozs7Ozs7Ozs7O0FDbElBO0FBV0E7QUFRQTtBQVFBO0FBa0JBO0FBS0E7QUFRQTtBQTNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTs7Ozs7Ozs7Ozs7O0FDakVBO0FBd0JBO0FBS0E7QUFVQTtBQVVBO0FBWUE7QUFXQTtBQU9BO0FBT0E7QUFVQTtBQVVBO0FBUUE7QUFuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOzs7Ozs7Ozs7Ozs7QUN4QkE7QUEwQ0E7QUF1QkE7QUFJQTtBQUNBO0FBcktBO0FBQ0E7OztBQUVBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQXJCQTtBQUNBO0FBQ0E7QUFvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVVBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDN0tBOzs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN5QkE7QUFrT0E7QUFDQTtBQTVQQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBZEE7QUFDQTtBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcFBBO0FBaUNBO0FBSUE7QUFDQTtBQWxEQTtBQUNBOzs7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQVZBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BEQTtBQVdBO0FBUUE7QUFLQTtBQUtBO0FBOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2hDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFMQTtBQUNBO0FBS0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBSkE7QUFKQTtBQUNBO0FBV0E7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFDQTs7O0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7O0FBZEE7QUFDQTtBQUNBO0FBYUE7Ozs7Ozs7OztBQVNBO0FBQ0E7Ozs7QUFJQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsQkE7QUFtQkE7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBWEE7QUFZQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBN0ZBO0FBQ0E7QUFEQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBOzs7QUFFQTtBQUNBOzs7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTs7O0FBRUE7QUFDQTs7Ozs7OztBQWZBO0FBQ0E7QUFlQTs7O0FBR0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6QkE7QUEwQkE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFDQTtBQVlBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFJQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkJBO0FBb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBREE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBREE7QUFJQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBREE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFLQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFoQkE7QUFpQkE7QUFwVEE7QUFBQTs7Ozs7O0FDcEJBOzs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ09BO0FBcUNBO0FBQ0E7QUE5Q0E7QUFDQTs7O0FBR0E7QUFDQTtBQUFBO0FBQ0E7OztBQUFBO0FBQ0E7Ozs7O0FBTkE7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFJQTtBQVBBO0FBQ0E7QUFTQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzdFQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ25GQTtBQUNBOzs7Ozs7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDaFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDekpBOzs7Ozs7QUNBQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDbnNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzVDQTtBQVFBO0FBUUE7QUFTQTtBQVNBO0FBUUE7QUEwQkE7QUFyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFFQTtBQUNBOzs7QUFFQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFKQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWZBO0FBZ0JBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBREE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUlBO0FBN0NBO0FBQUE7Ozs7OztBQ05BOzs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNvQ0E7QUE0Q0E7QUEyRkE7QUFDQTtBQTVLQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7Ozs7O0FBZkE7QUFDQTtBQWVBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUZBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUhBO0FBQ0E7QUEzREE7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQVBBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFDQTtBQUNBO0FBREE7QUFDQTs7Ozs7QUFYQTtBQUNBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBQ0E7QUFRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyR0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBOzs7OztBQVRBO0FBQ0E7QUFTQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQUhBO0FBREE7QUFDQTtBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBSEE7QUFIQTtBQURBO0FBQ0E7QUFlQTtBQUNBO0FBeENBO0FBMENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQUE7QUFDQTtBQU9BO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBREE7QUFSQTtBQUNBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQUhBO0FBTkE7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNCQTtBQTZCQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQURBO0FBRkE7QUFGQTtBQUNBO0FBV0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQURBO0FBSEE7QUFGQTtBQUNBO0FBWUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUVBO0FBRkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdkdBO0FBeUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM1JBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFUQTtBQUNBO0FBU0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFGQTtBQUZBO0FBQ0E7QUFrQkE7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBOzs7QUFHQTtBQUNBO0FBckRBO0FBdURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFFQTtBQUNBO0FBSkE7QUFQQTtBQWdCQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQWxDQTtBQW9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNCQTtBQTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQURBO0FBRkE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFGQTtBQUZBO0FBRkE7QUFGQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUZBO0FBRkE7QUFGQTtBQVVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFyR0E7QUF1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTs7Ozs7O0FDcFdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7Ozs7O0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUhBO0FBREE7QUFDQTtBQWFBOzs7QUFHQTtBQUNBO0FBM0JBO0FBNkJBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5CQTtBQXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTs7Ozs7Ozs7Ozs7OztBQ3ZGQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7Ozs7O0FBTEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBOzs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTs7Ozs7QUFMQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaENBO0FBa0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTs7OztBIiwic291cmNlUm9vdCI6IiJ9
