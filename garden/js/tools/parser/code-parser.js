
function loadScriptFile(src, callback) {
  httpRequest = new XMLHttpRequest()
  httpRequest.open('GET', src)
  httpRequest.send()
  httpRequest.onreadystatechange = function(){
    // Process the server response here.
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        callback(httpRequest.responseText)
    } else {
      console.log('There was a problem with the request.');
    }
   }
  }
}

var past = undefined;
var parseUrl = function(src, opts) {
    loadScriptFile(src, function(text){
        past = parseCode(text, opts)
    })
}

var parseCode = function (codeString, opts={locations: true,ranges: true}) {

    var comments = opts.onComment = [];
    var tokens = opts.onToken = [];

    var ast;
    try {
        ast = acorn.parse(codeString, opts);
    } catch (err) {
      throw err;
    }

    tokens.pop();
    ast.tokens = toTokens(tokens, types);

    convertComments(comments);
    ast.comments = comments;
    attachComments(ast, comments, ast.tokens);

    //toAST(ast, traverse);

    return ast;
}


var beforeExpr = { beforeExpr: true },
    startsExpr = { startsExpr: true };


function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}


var convertTemplateType = function (tokens, tt) {
  var startingToken    = 0;
  var currentToken     = 0;
  var numBraces        = 0; // track use of {}
  var numBackQuotes    = 0; // track number of nested templates

  function isBackQuote(token) {
    return tokens[token].type === tt.backQuote;
  }

  function isTemplateStarter(token) {
    return isBackQuote(token) ||
           // only can be a template starter when in a template already
           tokens[token].type === tt.braceR && numBackQuotes > 0;
  }

  function isTemplateEnder(token) {
    return isBackQuote(token) ||
           tokens[token].type === tt.dollarBraceL;
  }

  // append the values between start and end
  function createTemplateValue(start, end) {
    var value = "";
    while (start <= end) {
      if (tokens[start].value) {
        value += tokens[start].value;
      } else if (tokens[start].type !== tt.template) {
        value += tokens[start].type.label;
      }
      start++;
    }
    return value;
  }

  // create Template token
  function replaceWithTemplateType(start, end) {
    var templateToken = {
      type: "Template",
      value: createTemplateValue(start, end),
      start: tokens[start].start,
      end: tokens[end].end,
      loc: {
        start: tokens[start].loc.start,
        end: tokens[end].loc.end
      }
    };

    // put new token in place of old tokens
    tokens.splice(start, end - start + 1, templateToken);
  }

  function trackNumBraces(token) {
    if (tokens[token].type === tt.braceL) {
      numBraces++;
    } else if (tokens[token].type === tt.braceR) {
      numBraces--;
    }
  }

  while (startingToken < tokens.length) {
    // template start: check if ` or }
    if (isTemplateStarter(startingToken) && numBraces === 0) {
      if (isBackQuote(startingToken)) {
        numBackQuotes++;
      }

      currentToken = startingToken + 1;

      // check if token after template start is "template"
      if (currentToken >= tokens.length - 1 || tokens[currentToken].type !== tt.template) {
        break;
      }

      // template end: find ` or ${
      while (!isTemplateEnder(currentToken)) {
        if (currentToken >= tokens.length - 1) {
          break;
        }
        currentToken++;
      }

      if (isBackQuote(currentToken)) {
        numBackQuotes--;
      }
      // template start and end found: create new token
      replaceWithTemplateType(startingToken, currentToken);
    } else if (numBackQuotes > 0) {
      trackNumBraces(startingToken);
    }
    startingToken++;
  }
}


var toTokens = function (tokens, tt, code) {
  // transform tokens to type "Template"
  convertTemplateType(tokens, tt);
  var transformedTokens = tokens.filter(function (token) {
    return token.type !== "CommentLine" && token.type !== "CommentBlock";
  });

  for (var i = 0, l = transformedTokens.length; i < l; i++) {
    transformedTokens[i] = toToken(transformedTokens[i], tt, code);
  }

  return transformedTokens;
}


var toToken = function (token, tt, source) {
  var type = token.type;
  token.range = [token.start, token.end];

  if (type === tt.name) {
    token.type = "Identifier";
  } else if (type === tt.semi || type === tt.comma ||
             type === tt.parenL || type === tt.parenR ||
             type === tt.braceL || type === tt.braceR ||
             type === tt.slash || type === tt.dot ||
             type === tt.bracketL || type === tt.bracketR ||
             type === tt.ellipsis || type === tt.arrow ||
             type === tt.star || type === tt.incDec ||
             type === tt.colon || type === tt.question ||
             type === tt.template || type === tt.backQuote ||
             type === tt.dollarBraceL || type === tt.at ||
             type === tt.logicalOR || type === tt.logicalAND ||
             type === tt.bitwiseOR || type === tt.bitwiseXOR ||
             type === tt.bitwiseAND || type === tt.equality ||
             type === tt.relational || type === tt.bitShift ||
             type === tt.plusMin || type === tt.modulo ||
             type === tt.exponent || type === tt.prefix ||
             type === tt.doubleColon ||
             type.isAssign) {
    token.type = "Punctuator";
    if (!token.value) token.value = type.label;
  } else if (type === tt.jsxTagStart) {
    token.type = "Punctuator";
    token.value = "<";
  } else if (type === tt.jsxTagEnd) {
    token.type = "Punctuator";
    token.value = ">";
  } else if (type === tt.jsxName) {
    token.type = "JSXIdentifier";
  } else if (type === tt.jsxText) {
    token.type = "JSXText";
  } else if (type.keyword === "null") {
    token.type = "Null";
  } else if (type.keyword === "false" || type.keyword === "true") {
    token.type = "Boolean";
  } else if (type.keyword) {
    token.type = "Keyword";
  } else if (type === tt.num) {
    token.type = "Numeric";
    token.value = source.slice(token.start, token.end);
  } else if (type === tt.string) {
    token.type = "String";
    token.value = source.slice(token.start, token.end);
  } else if (type === tt.regexp) {
    token.type = "RegularExpression";
    var value = token.value;
    token.regex = {
      pattern: value.pattern,
      flags: value.flags
    };
    token.value = "/" + value.pattern + "/" + value.flags;
  }

  return token;
}


// var traverse = require("babel-core").traverse;

var source;

var toAST = function (ast, traverse, code) {
  source = code;
  ast.sourceType = "module";
  ast.range = [ast.start, ast.end];
  traverse(ast, astTransformVisitor);
}


function changeToLiteral(node) {
  node.type = 'Literal';
  if (!node.raw) {
    if (node.extra && node.extra.raw) {
      node.raw = node.extra.raw;
    } else {
      node.raw = source.slice(node.start, node.end);
    }
  }
}


var astTransformVisitor = {
  noScope: true,
  enter: function (path) {
    var node = path.node;
    node.range = [node.start, node.end];

    // private var to track original node type
    node._babelType = node.type;

    if (node.innerComments) {
      node.trailingComments = node.innerComments;
      delete node.innerComments;
    }

    if (node.trailingComments) {
      for (var i = 0; i < node.trailingComments.length; i++) {
        var comment = node.trailingComments[i];
        if (comment.type === 'CommentLine') {
          comment.type = 'Line';
        } else if (comment.type === 'CommentBlock') {
          comment.type = 'Block';
        }
        comment.range = [comment.start, comment.end];
      }
    }

    if (node.leadingComments) {
      for (var i = 0; i < node.leadingComments.length; i++) {
        var comment = node.leadingComments[i];
        if (comment.type === 'CommentLine') {
          comment.type = 'Line';
        } else if (comment.type === 'CommentBlock') {
          comment.type = 'Block';
        }
        comment.range = [comment.start, comment.end];
      }
    }

    // make '_paths' non-enumerable (babel-eslint #200)
    Object.defineProperty(node, "_paths", { value: node._paths, writable: true });
  },
  exit: function (path) {
    var node = path.node;

    [
      fixDirectives,
    ].forEach(function (fixer) {
      fixer(path);
    });

    if (path.isJSXText()) {
      node.type = 'Literal';
      node.raw = node.value;
    }

    if (path.isNumericLiteral() ||
        path.isStringLiteral()) {
      changeToLiteral(node);
    }

    if (path.isBooleanLiteral()) {
      node.type = 'Literal';
      node.raw = String(node.value);
    }

    if (path.isNullLiteral()) {
      node.type = 'Literal';
      node.raw = 'null';
      node.value = null;
    }

    if (path.isRegExpLiteral()) {
      node.type = 'Literal';
      node.raw = node.extra.raw;
      node.value = {};
      node.regex = {
        pattern: node.pattern,
        flags: node.flags
      };
      delete node.extra;
      delete node.pattern;
      delete node.flags;
    }

    if (path.isObjectProperty()) {
      node.type = 'Property';
      node.kind = 'init';
    }

    if (path.isClassMethod() || path.isObjectMethod()) {
      var code = source.slice(node.key.end, node.body.start);
      var offset = code.indexOf("(");

      node.value = {
          type: 'FunctionExpression',
          id: node.id,
          params: node.params,
          body: node.body,
          async: node.async,
          generator: node.generator,
          expression: node.expression,
          defaults: [], // basic support - TODO: remove (old esprima)
          loc: {
            start: {
              line: node.key.loc.start.line,
              column: node.key.loc.end.column + offset // a[() {]
            },
            end: node.body.loc.end
          }
      }

      // [asdf]() {
      node.value.range = [node.key.end + offset, node.body.end];

      if (node.returnType) {
        node.value.returnType = node.returnType;
      }

      if (node.typeParameters) {
        node.value.typeParameters = node.typeParameters;
      }

      if (path.isClassMethod()) {
        node.type = 'MethodDefinition';
      }

      if (path.isObjectMethod()) {
        node.type = 'Property';
        if (node.kind === 'method') {
          node.kind = 'init';
        }
      }

      delete node.body;
      delete node.id;
      delete node.async;
      delete node.generator;
      delete node.expression;
      delete node.params;
      delete node.returnType;
      delete node.typeParameters;
    }

    if (path.isRestProperty() || path.isSpreadProperty()) {
      node.type = "SpreadProperty";
      node.key = node.value = node.argument;
    }

    // flow: prevent "no-undef"
    // for "Component" in: "let x: React.Component"
    if (path.isQualifiedTypeIdentifier()) {
      delete node.id;
    }
    // for "b" in: "var a: { b: Foo }"
    if (path.isObjectTypeProperty()) {
      delete node.key;
    }
    // for "indexer" in: "var a: {[indexer: string]: number}"
    if (path.isObjectTypeIndexer()) {
      delete node.id;
    }
    // for "param" in: "var a: { func(param: Foo): Bar };"
    if (path.isFunctionTypeParam()) {
      delete node.name;
    }

    // modules

    if (path.isImportDeclaration()) {
      delete node.isType;
    }

    if (path.isExportDeclaration()) {
      var declar = path.get("declaration");
      if (declar.isClassExpression()) {
        node.declaration.type = "ClassDeclaration";
      } else if (declar.isFunctionExpression()) {
        node.declaration.type = "FunctionDeclaration";
      }
    }

    // remove class property keys (or patch in escope)
    if (path.isClassProperty()) {
      delete node.key;
    }

    // async function as generator
    if (path.isFunction()) {
      if (node.async) node.generator = true;
    }

    // TODO: remove (old esprima)
    if (path.isFunction()) {
      if (!node.defaults) {
        node.defaults = [];
      }
    }

    // await transform to yield
    if (path.isAwaitExpression()) {
      node.type = "YieldExpression";
      node.delegate = node.all;
      delete node.all;
    }

    // template string range fixes
    if (path.isTemplateLiteral()) {
      node.quasis.forEach(function (q) {
        q.range[0] -= 1;
        if (q.tail) {
          q.range[1] += 1;
        } else {
          q.range[1] += 2;
        }
        q.loc.start.column -= 1;
        if (q.tail) {
          q.loc.end.column += 1;
        } else {
          q.loc.end.column += 2;
        }
      });
    }
  }
}


var attachComments = function (ast, comments, tokens) {
  if (comments.length) {
    var firstComment = comments[0];
    var lastComment = comments[comments.length - 1];
    // fixup program start
    if (!tokens.length) {
      // if no tokens, the program starts at the end of the last comment
      ast.start = lastComment.end;
      ast.loc.start.line = lastComment.loc.end.line;
      ast.loc.start.column = lastComment.loc.end.column;

      if (ast.leadingComments === null && ast.innerComments.length) {
        ast.leadingComments = ast.innerComments;
      }
    } else if (firstComment.start < tokens[0].start) {
      // if there are comments before the first token, the program starts at the first token
      var token = tokens[0];
      ast.start = token.start;
      ast.loc.start.line = token.loc.start.line;
      ast.loc.start.column = token.loc.start.column;

      // estraverse do not put leading comments on first node when the comment
      // appear before the first token
      if (ast.body.length) {
        var node = ast.body[0];
        node.leadingComments = [];
        var firstTokenStart = token.start;
        var len = comments.length;
        for (var i = 0; i < len && comments[i].start < firstTokenStart; i++) {
          node.leadingComments.push(comments[i]);
        }
      }
    }
    // fixup program end
    if (tokens.length) {
      var lastToken = tokens[tokens.length - 1];
      if (lastComment.end > lastToken.end) {
        // If there is a comment after the last token, the program ends at the
        // last token and not the comment
        ast.end = lastToken.end;
        ast.loc.end.line = lastToken.loc.end.line;
        ast.loc.end.column = lastToken.loc.end.column;
      }
    }
  } else {
    if (!tokens.length) {
      ast.loc.start.line = 0;
      ast.loc.end.line = 0;
    }
  }
  if (ast.body && ast.body.length > 0) {
    ast.loc.start.line = ast.body[0].loc.start.line;
    ast.start = ast.body[0].start;
  }
  ast.range[0] = ast.start;
  ast.range[1] = ast.end;
}


var convertComments = function (comments) {
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];
    if (comment.type === "CommentBlock") {
      comment.type = "Block";
    } else if (comment.type === "CommentLine") {
      comment.type = "Line";
    }
    // sometimes comments don't get ranges computed,
    // even with options.ranges === true
    if (!comment.range) {
      comment.range = [comment.start, comment.end];
    }
  }
}


function fixDirectives (path) {
  if (!(path.isProgram() || path.isFunction())) return;

  var node = path.node;
  var directivesContainer = node;
  var body = node.body;

  if (node.type !== "Program") {
    directivesContainer = body;
    body = body.body;
  }

  if (!directivesContainer.directives) return;

  directivesContainer.directives.reverse().forEach(function (directive) {
    directive.type = "ExpressionStatement";
    directive.expression = directive.value;
    delete directive.value;
    directive.expression.type = "Literal";
    changeToLiteral(directive.expression);
    body.unshift(directive);
  });
  delete directivesContainer.directives;
}

// fixDirectives
var _classCallCheck = function (instance, Constructor) {
    if(!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
};


var TokenType = function TokenType(label) {
  var conf = arguments[1] === undefined ? {} : arguments[1];

  _classCallCheck(this, TokenType);

  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.rightAssociative = !!conf.rightAssociative;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
}

var types = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  eof: new TokenType("eof"),

  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
  at: new TokenType("@"),

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("prefix", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=", 6),
  relational: binop("</>", 7),
  bitShift: binop("<</>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  exponent: new TokenType("**", { beforeExpr: true, binop: 11, rightAssociative: true })
}
