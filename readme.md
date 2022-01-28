<h1 align="center">Welcome to the Little Man Computer 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/the Little Man Computer" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/the Little Man Computer.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

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

- Website: https://www.brace.dev
- Github: [@DoctorBracewell](https://github.com/DoctorBracewell)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
