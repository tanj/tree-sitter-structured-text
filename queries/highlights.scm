[
 (builtin_function)
] @function.builtin

; ; Keywords
[
  "ACTION"
  "AND"
  "ARRAY"
  ;"AT"
  "BOOL"
  "BY"
  "BYTE"
  ;"CAL"
  ;"CALC"
  ;"CALCN"
  "CASE"
  "CONSTANT"
  "DO"
  "ELSE"
  "ELSIF"
  "END_ACTION"
  "END_CASE"
  "END_FOR"
  "END_FUNCTION"
  "END_FUNCTION_BLOCK"
  "END_IF"
  "END_PROGRAM"
  "END_REPEAT"
  "END_STRUCT"
  "END_TYPE"
  "END_VAR"
  "END_WHILE"
  "EQ"
  "EXIT"
  "EXTENDS"
  "FOR"
  "FUNCTION"
  "FUNCTION_BLOCK"
  "IF"
  "IMPLEMENTS"
  ;; "JMP"
  ;; "JMPC"
  ;; "JMPCN"
  ;; "LD"
  ;; "LDN"
  ;; "MOVE"
  "NOT"
  "OF"
  "OR"
  ;; "PARAMS"
  "PERSISTENT"
  "POINTER"
  "PROGRAM"
  "REFERENCE"
  ;; "READ_ONLY"
  ;; "READ_WRITE"
  "REPEAT"
  ;; "RET"
  "RETAIN"
  ;; "RETC"
  ;; "RETCN"
  "RETURN"
  ;; "ST"
  ;; "STN"
  "STRUCT"
  "SUB"
  "THEN"
  "TIME"
  "TO"
  "TOD"
  "TYPE"
  "VAR"
  "VAR_ACCESS"
  "VAR_CONFIG"
  "VAR_EXTERNAL"
  "VAR_GLOBAL"
  "VAR_IN_OUT"
  "VAR_INPUT"
  "VAR_OUTPUT"
  "VAR_STAT"
  "VAR_TEMP"
  "WHILE"
  "XOR"
] @keyword

[
  (inline_comment)
  (block_comment)
] @comment @spell


[
 "SUPER"
 "THIS"
] @variable.builtin

[
 (variable)
 (identifier)
 ] @variable

[
 (structure_member)
 ] @variable.member

[
 (string)
 (wstring)
 ] @string

(boolean) @constant.builtin.boolean

[
 (time)
 (date)
 (time_of_day)
 (date_and_time)
 ] @constant

[
 (integer)
 (binary)
 (octal)
 (hexidecimal)
 ] @constant.numeric.integer @constant.numeric

(floating_point) @constant.numeric.float

[
 (basic_data_type)
 ] @type.builtin

[
 (derived_data_type)
 (array_type)
 (pointer_type)
 (reference_type)
 ] @type
