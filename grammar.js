const unsignedInteger = seq(
  /\d/,
  repeat(choice('_', /\d/))
);

const signedInteger = seq(
  optional(/[\+-]/),
  unsignedInteger
);

module.exports = grammar({
  name: 'structured_text',

  extras: $ => [
    $.doc_comment,
    $.inline_comment,
    $.block_comment,
    /\s/
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.case],
    [$.variable],
    [$.variable, $.call_expression],
    [$.body_only_definition],
  ],

  supertypes: $ => [
    $._definition,
    $.statement,
    $._control_statement,
    $._loop_statement,
    $._expression,
    $._literal
  ],

  rules: {
    source_file: $ => repeat(choice(
      $._definition,
      $._declaration,
    )),

    _definition: $ => choice(
      $.program_definition,
      $.action_definition,
      $.function_definition,
      $.function_block_definition,
      $.method_definition,
      $.type_definition,
      $.struct_definition,
      $.union_definition,
      $.enum_definition,
      $.body_only_definition,
    ),

    _declaration: $ => choice(
      $.var_declaration,
      $.var_input_declaration,
      $.var_output_declaration,
      $.var_in_out_declaration,
      $.var_global_declaration,
      $.var_temp_declaration,
      $.var_stat_declaration,
      $.var_external_declaration,
      $.var_instance_declaration,
      $.var_access_declaration,
      $.var_config_declaration,
      $.var_generic_constant_declaration,
    ),

    program_definition: $ => seq(
      'PROGRAM',
      field('programName', $.identifier),
      repeat($._declaration),
      repeat($.statement),
      'END_PROGRAM'
    ),

    action_definition: $ => seq(
      'ACTION',
      field('ActionName', $.identifier),
      ':',
      repeat($._declaration),
      repeat($.statement),
      'END_ACTION'
    ),

    function_definition: $ => seq(
      'FUNCTION',
      field('functionName', $.identifier),
      ':',
      $._data_type,
      repeat($._declaration),
      repeat($.statement),
      'END_FUNCTION'
    ),

    method_definition: $ => seq(
      'METHOD',
      field('methodName', $.identifier),
      ':',
      $._data_type,
      repeat($._declaration),
      repeat($.statement),
      'END_METHOD'
    ),

    function_block_definition: $ => seq(
      'FUNCTION_BLOCK',
      field('functionName', $.identifier),
      optional($.extend),
      optional($.implement),
      repeat($._declaration),
      // TODO EXTENDS AND IMPLEMENTS
      choice(repeat($.statement), $.method_definition),
      'END_FUNCTION_BLOCK'
    ),

    body_only_definition: $ => seq(
      $.statement,
      repeat($.statement),
    ),

    variable_attribute: $ => choice(
      'CONSTANT',
      'RETAIN',
      'PERSISTENT',
    ),

    var_declaration: $ => seq(
      'VAR',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_input_declaration: $ => seq(
      'VAR_INPUT',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_output_declaration: $ => seq(
      'VAR_OUTPUT',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_in_out_declaration: $ => seq(
      'VAR_IN_OUT',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_global_declaration: $ => seq(
      'VAR_GLOBAL',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_temp_declaration: $ => seq(
      'VAR_TEMP',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_stat_declaration: $ => seq(
      'VAR_STAT',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_external_declaration: $ => seq(
      'VAR_EXTERNAL',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_instance_declaration: $ => seq(
      'VAR_INST',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_config_declaration: $ => seq(
      'VAR_CONFIG',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_access_declaration: $ => seq(
      'VAR_ACCESS',
      optional($.variable_attribute),
      repeat($.constant),
      'END_VAR'
    ),

    var_generic_constant_declaration: $ => seq(
      'VAR_GENERIC',
      'CONSTANT',
      repeat($.constant),
      'END_VAR'
    ),

    type_definition: $ => seq(
      'TYPE',
      field('typeName', $.variable),
      ':',
      $._data_type,
      ';',
      'END_TYPE',
    ),

    struct_definition: $ => seq(
      'TYPE',
      field('typeName', $.variable),
      ':',
      optional($.extend),
      'STRUCT',
      repeat($.constant),
      'END_STRUCT',
      'END_TYPE',
    ),

    union_definition: $ => seq(
      'TYPE',
      field('typeName', $.variable),
      ':',
      optional($.extend),
      'UNION',
      repeat($.constant),
      'END_UNION',
      'END_TYPE',
    ),

    enum_definition: $ => seq(
      'TYPE',
      field('typeName', $.variable),
      ':',
      '(',
      commaSep($.constant),
      ')',
      'END_TYPE',
    ),

    extend: $ => seq(
      'EXTENDS',
      $.identifier,
    ),

    implement: $ => seq(
      'IMPLEMENTS',
      commaSep1($.identifier),
    ),

    /*
      Statements
    */

    statement: $ => choice(
      $.assignment,
      $.expression_statement,
      $.call_statement,
      $._control_statement,
      $._loop_statement,
      $.early_termination_statement,
      $.set_expression,
      $.reset_expression,
    ),

    _control_statement: $ => choice(
      $.case_statement,
      $.if_statement
    ),

    _loop_statement: $ => choice(
      $.for_statement,
      $.repeat_statement,
      $.while_statement
    ),

    assignment: $ => seq(
      $.variable,
      ':=',
      $._expression,
      ';'
    ),


    set_expression: $ => seq(
      $.identifier,
      'S=',
      $._expression,
      ';',
    ),

    reset_expression: $ => seq(
      $.identifier,
      'R=',
      $._expression,
      ';',
    ),

    expression_statement: $ => seq($.variable, ';'),

    call_statement: $ => seq($.call_expression, ';'),

    if_statement: $ => seq(
      'IF',
      field('condition', $._expression),
      'THEN',
      repeat($.statement),
      repeat($.elseif_clause),
      optional($.else_clause),
      'END_IF',
      optional(';')
    ),

    case_statement: $ => seq(
      'CASE',
      field('caseControlValue', $.variable),
      'OF',
      repeat($.case),
      optional($.else_case),
      'END_CASE',
      optional(';')
    ),

    for_statement: $ => seq(
      'FOR',
      $.for_range,
      'DO',
      repeat($.statement),
      'END_FOR',
      optional(';')
    ),

    repeat_statement: $ => seq(
      'REPEAT',
      repeat($.statement),
      'UNTIL',
      field('terminationCondition', $._expression),
      'END_REPEAT',
      optional(';')
    ),

    while_statement: $ => seq(
      'WHILE',
      $._expression,
      'DO',
      repeat($.statement),
      'END_WHILE',
      optional(';')
    ),


    early_termination_statement: $ => seq(
      choice(
        'EXIT',
        'CONTINUE',
        'RETURN',
      ),
      ';',
    ),

    /*
      Statement components
    */

    elseif_clause: $ => seq(
      'ELSIF',
      field('elsifCondition', $._expression),
      'THEN',
      repeat($.statement)
    ),

    else_clause: $ => seq(
      'ELSE',
      repeat($.statement)
    ),

    case: $ => seq(
      $.case_value,
      ':',
      repeat($.statement)
    ),

    else_case: $ => seq(
      'ELSE',
      repeat($.statement)
    ),

    case_value: $ => commaSep1(choice(
      alias(token(signedInteger), $.integer),
      $.index_range,
      $.identifier
    )),

    index_range: $ => seq(
      field('lowerBound', choice(alias(token(signedInteger), $.integer), $.identifier)),
      '..',
      field('upperBound', choice(alias(token(signedInteger), $.integer), $.identifier))
    ),

    for_range: $ => seq(
      $.statement_initialization,
      'TO',
      $._expression,
      optional(seq('BY', $._expression))
    ),

    statement_initialization: $ => seq(
      $.variable,
      ':=',
      $._expression
    ),


    /*
      Declarations
    */

    constant: $ => seq(
      field('name', $.identifier),
      ':',
      $._data_type,
      $.variable_initialization
    ),

    /*
      Declaration components
    */
    variable_initialization: $ => seq(
      ':=',
      choice(
        commaSep1(choice($._expression, $.repetition_expression)),
        seq('(', commaSep1($.statement_initialization), ')'),
        seq('[', commaSep1(choice($._expression, $.repetition_expression)), ']'),
      ),
      ';'
    ),

    /*
      Expressions
    */

    _expression: $ => choice(
      $._literal,
      $.variable,
      $.parenthesis_expression,
      $.unary_expression,
      $.binary_expression,
      $.mask_expression,
      $.call_expression
    ),

    parenthesis_expression: $ => seq('(', $._expression, ')'),

    unary_expression: $ => prec(6, choice(
      seq('NOT', $._expression),
      seq('+', $._expression),
      seq('-', $._expression)
    )),

    binary_expression: $ => choice(
      prec.left(5, seq($._expression, '**', $._expression)), // Not supported in Automation Studio
      prec.left(4, seq($._expression, '*', $._expression)),
      prec.left(4, seq($._expression, 'MUL', $._expression)),
      prec.left(4, seq($._expression, '/', $._expression)),
      prec.left(4, seq($._expression, 'DIV', $._expression)),
      prec.left(4, seq($._expression, 'MOD', $._expression)),
      prec.left(3, seq($._expression, '+', $._expression)),
      prec.left(3, seq($._expression, '-', $._expression)),
      prec.left(2, seq($._expression, '<', $._expression)),
      prec.left(2, seq($._expression, 'LT', $._expression)),
      prec.left(2, seq($._expression, '>', $._expression)),
      prec.left(2, seq($._expression, 'GT', $._expression)),
      prec.left(2, seq($._expression, '<=', $._expression)),
      prec.left(2, seq($._expression, 'LE', $._expression)),
      prec.left(2, seq($._expression, '>=', $._expression)),
      prec.left(2, seq($._expression, 'GE', $._expression)),
      prec.left(1, seq($._expression, '=', $._expression)),
      prec.left(1, seq($._expression, 'EQ', $._expression)),
      prec.left(1, seq($._expression, '<>', $._expression)),
      prec.left(1, seq($._expression, 'NE', $._expression)),
      prec.left(0, seq($._expression, 'AND', $._expression)),
      prec.left(0, seq($._expression, 'XOR', $._expression)),
      prec.left(0, seq($._expression, 'OR', $._expression))
    ),

    parameter_assignment: $ => seq(
      alias($.identifier, $.parameter),
      ':=',
      $._expression
    ),

    call_expression: $ => seq(
      field('functionName', choice($.builtin_function, $.identifier)),
      optional($.index), // Only for function block instances
      '(',
      commaSep(field('input', choice($.parameter_assignment, $._expression))), // Function calls have ordered lists allowing expressions
      ')'
    ),

    mask_expression: $ => seq(
      $.variable,
      token.immediate('.'),
      /\d{1,2}/
    ),

    repetition_expression: $ => seq(
      $._expression,
      '(', $._expression, ')'
    ),

    /*
      Variables
    */

    variable: $ => seq(
      field('name', $.identifier),
      optional($.index),
      optional($.structure_member)
    ),

    index: $ => seq(
      '[',
      field('dim1', $._expression),
      optional(seq(',', field('dim2', $._expression))),
      ']'
    ),

    structure_member: $ => seq(token.immediate('.'), choice($.variable, $.call_expression)),

    /*
      Data types
    */
    _data_type: $ => choice(
      $.basic_data_type,
      alias(seq($.identifier, optional($.structure_member)), $.derived_data_type),
      $.array_type,
      $.pointer_type,
      $.reference_type,
    ),

    basic_data_type: $ => choice(
      'BOOL',
      /U?[SD]?INT/,
      /L?REAL/,
      'TIME',
      'DATE',
      'TIME_OF_DAY',
      'TOD',
      'DATE_AND_TIME',
      'DT',
      /W?STRING/,
      'BYTE',
      /D?WORD/
    ),

    array_type: $ => seq(
      'ARRAY',
      '[',
      commaSep1($.index_range),
      ']',
      'OF',
      choice($.basic_data_type, alias($.identifier, $.derived_data_type))
    ),

    pointer_type: $ => seq(
      'POINTER',
      'TO',
      choice($.basic_data_type, alias($.identifier, $.derived_data_type)),
    ),

    reference_type: $ => seq(
      'REFERENCE',
      'TO',
      choice($.basic_data_type, alias($.identifier, $.derived_data_type)),
    ),

    /*
      Literals
    */

    _literal: $ => choice(
      $.boolean,
      $.integer,
      $.floating_point,
      $.binary,
      $.octal,
      $.hexidecimal,
      $.time,
      $.date,
      $.time_of_day,
      $.date_and_time,
      $.string,
      $.wstring
    ),

    boolean: $ => token(choice('TRUE', 'FALSE')),

    integer: $ => {
      return token(unsignedInteger);
    },

    floating_point: $ => {
      const scientific = seq(/[eE]/, signedInteger);
      return token(seq(
        unsignedInteger,
        choice(
          seq(
            '.',
            repeat(choice('_', /\d/)),
            optional(scientific)
          ),
          scientific
        )
      ));
    },

    binary: $ => token(seq('2#', /_*[0-1]/, repeat(choice('_', /[0-1]/)))),

    octal: $ => token(seq('8#', /_*[0-7]/, repeat(choice('_', /[0-7]/)))),

    hexidecimal: $ => token(seq('16#', /_*[0-9a-fA-F]/, repeat(choice('_', /[0-9a-fA-F]/)))),

    time: $ => token(seq(
      'T#',
      optional('-'),
      optional(/\d{1,2}[dD]/),
      optional(/\d{1,3}[hH]/),
      optional(/\d{1,5}[mM]/),
      optional(/\d{1,9}[sS]/),
      optional(/\d{1,9}((ms)|(MS))/)
    )),

    date: $ => token(seq(
      'D#',
      /\d(_?\d){3}/, // Year
      /(-\d(_?\d)?){2}/ // Month and day
    )),

    time_of_day: $ => token(seq(
      'TOD#',
      /\d(_?\d)?/,
      ':',
      /\d(_?\d)?/,
      optional(seq(
        ':',
        /\d(_?\d)?/,
        optional(seq('.', /\d(_?\d)*/))
      ))
    )),

    date_and_time: $ => seq(
      'DT#',
      /\d(_?\d){3}/, // Year
      /(-\d(_?\d)?){3}/, // Month, day, hour
      /(:\d(_?\d)?){1,2}/ // Minute, second
    ),

    string: $ => token(prec.left(seq(
      '\'',
      /.*/,
      '\''
    ))),

    wstring: $ => token(prec.left(seq(
      '"',
      /.*/,
      '"'
    ))),

    inline_comment: $ => token(seq('//', /.*/)),
    doc_comment: $ => token(seq('///', /.*/)),

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    block_comment: $ => token(seq(
      '(*',
      /[^*]*\*+([^*)][^*]*\*+)*/,
      ')'
    )),

    identifier: $ => /[a-zA-Z_]\w*/,

    builtin_function: $ => choice(
      "ABS",
      "ACOS",
      "ADD",
      "ADR",
      "ASIN",
      "ATAN",
      "BITADR",
      "COS",
      "EXP",
      "EXPT",
      "INDEXOF",
      "LOG",
      "LN",
      "MAX",
      "MIN",
      "MUX",
      "ROL",
      "ROR",
      "SEL",
      "SHL",
      "SHR",
      "SIN",
      "SIZEOF",
      "SUB",
      "SQRT",
      "TAN",
      "TRUNC",
    ),

    builtin_variale: $ => choice(
      "SUPER",
      "THIS",
    ),

  }

});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
