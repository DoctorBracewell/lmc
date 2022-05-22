<div align="center">
  
  <h1 align="center">The Little Man Computer</h1>
  <p>
    <img alt="Github license" src="https://img.shields.io/github/license/DoctorBracewell/lmc?style=for-the-badge">
    <img alt="Github release" src="https://img.shields.io/github/v/release/DoctorBracewell/lmc?style=for-the-badge" />
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/DoctorBracewell/lmc?style=for-the-badge">
  </p>
</div>

This is a collection of implementations of the [Little Man Computer](https://en.wikipedia.org/wiki/Little_man_computer) in various languages - nothing particuarly fancy going on in any of them, but it's a neat side project to work on when learning a new language!

> The **Little Man Computer** (**LMC**) is an instructional model of a computer, created by Dr. Stuart Madnick. The LMC is generally used to teach students, because it models a simple Von Neumann Architecture computer — which has all of the basic features of a modern computer. It can be programmed in machine code (albeit in decimal rather than binary) or assembly code.

## Project Layout
Each language folder contains the full project that acts as the implementation of the computer in that language. Where possible, project files will live in the root of that folder, and the implementation source code will be in a `src/` folder. Any dependencies or output folders will generated with the language deafults.

Each implementation aims to include the following features:

- An entry point that will accept a path to a `.lmc` file.

- An Assembler containing:
  - An instruction set of 11 assembly language commands, detailed [here](https://en.wikipedia.org/wiki/Little_man_computer#Commands).
  - An assembly pipeline that converts `.lmc` files into a list of decimal numbers to be loaded into memory.
  - File comments using `//`.
  - Basic compilation error messages.


- A model of the Little Man Computer, containing:
  - 3 CPU Registers
  - 100 Memory Locations
  - Arithmetic Logic Unit
  - Control Unit (Fetch-Decode-Execute Cycle)
  - Basic computation error messages.
  - An input and output system.

## LMC Assembly Code
The Little Man Computer accepts decimal machine code, and defines a very basic assembly language that compiles to these decimal codes. In these implementations, this assembly can be written in `.lmc` files, and most implementations will accept a path to a file and feed the file contents into the assembler.
There are a variety of example programs in the `examples/` folder, most of which come from wikipedia. Some implementations will accept paths to files when running the virtual machine, others will default to the `index.lmc` file in the root.

## Author

👤 **DrBracewell**

- Website: https://brace.dev
- Github: [@DoctorBracewell](https://github.com/DoctorBracewell)

---

Feel free to ⭐️ the repo if you thought this project was cool!

~ Brace
