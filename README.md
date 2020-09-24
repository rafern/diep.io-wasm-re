# diep.io-wasm-re
diep.io WASM reverse engineering

The goal of this project is simply to create annotated decompiled code, not
source code that can be recompiled. So far, the current focus is to find out
which functions are part of the standard library so that reverse engineering
becomes easier

`build_[hash goes here].wasm.wasm` is the WASM binary. The decompiled code is
`decomp_[hash goes here].c`. However, if you want the original decompiled code
with no comments and refactoring, you can find this in
`decomp_original_[hash goes here].c`

`build_[hash goes here].wasm.js` is the emscripten bootstrap for the binary. The
beautified version is `bootstrap_beaut_[hash goes here].js`

`objdump_[hash goes here].txt` is the raw memory found in the binary, generated
with `wasm-objdump`

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

Cool resources that helped me a lot:
- https://github.com/HueHanaejistla/diep.io-protocol-wiki

Build history:
- ??/??/????: 6f59094d60f98fafc14371671d3ff31ef4d75d9e
  - This is the version being reverse-engineered, once this is decoded, you
    could compare each function's old code with newer code to know what each
    function is
- 24/09/2020: 6f874414d08a988a0525d9053773d7f0d407a670
  - WASM to JS function mappings changed
  - Internal WASM function names changed
  - Some code modified
  - Internal structures have different offsets, maybe they are auto-shuffled?