<div align="center">
  
  <h1 align="center">The Little Man Computer</h1>
  <p>
    <img alt="License: MIT" src="https://img.shields.io/github/license/DoctorBracewell/lmc?style=for-the-badge">
    <img src="https://img.shields.io/github/v/release/DoctorBracewell/lmc?style=for-the-badge" />
  </p>
</div>

This is a simple JavaScript implementation of the [Little Man Computer](https://en.wikipedia.org/wiki/Little_man_computer) - nothing fancy going on here, but it was pretty fun to work on personally!

> The **Little Man Computer** (**LMC**) is an instructional model of a computer, created by Dr. Stuart Madnick. The LMC is generally used to teach students, because it models a simple Von Neumann Architecture computer — which has all of the basic features of a modern computer. It can be programmed in machine code (albeit in decimal rather than binary) or assembly code.

## Features

This implementation contains the following features:

- An instruction set of 11 assembly language commands, detailed [here](https://en.wikipedia.org/wiki/Little_man_computer#Commands).
- File comments using `//`.
- An assembler to compile `.lmc` files into an array of decimal numbers.
- A model of the Little Man Computer, containing:
  - 3 CPU Registers
  - 100 Memory Locations
  - Arithmetic Logic Unit
  - Control Unit (Fetch-Decode-Execute Cycle)
- An output system using `console.log` and an input system using the [`prompt-sync`](https://www.npmjs.com/package/prompt-sync) package.
- Basic error messages from both the assembler and computer.

## Install

```sh
npm install
```

## Usage

- Edit the `index.lmc` with a valid Assembly Language program - find examples in the `examples/` folder.

```sh
npm start
```

## Author

👤 **DrBracewell**

- Website: https://brace.dev
- Github: [@DoctorBracewell](https://github.com/DoctorBracewell)

---

Feel free to ⭐️ the repo if you thought this site was cool!

~ Brace
