# diep.io-wasm-re
diep.io WASM reverse engineering

The goal of this project is simply to create annotated decompiled code, not
source code that can be recompiled. So far, the current focus is to find out
which functions are part of the standard library so that reverse engineering
becomes easier

`build_[hash goes here].wasm.wasm` is the WASM binary. The decompiled code is
`wasm_decomp.c`. However, if you want the original decompiled code with no
comments and refactoring, you can find this in `wasm_decomp_original.c`

`build_[hash goes here].wasm.js` is the emscripten bootstrap for the binary. The
beautified version is `build_beaut.js`

`wasm_obj_dump.txt` is the raw memory found in the binary, generated with
`wasm-objdump`

General factoids:
- decompiled with `wasm2c`. `wasm2c` generates really shitty code because WASM
  is a stack machine, so it uses a lot of temporary variables
- original code is written in C++ and compiled with emscripten
- emscripten uses LLVM libcxx, so you can figure out which function of the
  standard library something is by comparing it with the libcxx source code
- some libcxx function (like strlen) do not have an implementation and fall back
  to glibc, so keep that in mind
- similarly, emscripten replaces some libcxx functions (like memcpy) with their
  own implementation
- code is being refactored manually because i don't know any tools that do this
  automatically
