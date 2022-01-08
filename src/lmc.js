import promptSync from "prompt-sync";
const prompt = promptSync();

// Represent any space in memory - CPU registers or RAM location
class MemorySpace {
  constructor(address) {
    this.address = address;
    this._value = 0;
  }

  // Custom setter to throw an error if trying to set to a value more than 3 digits
  set value(value) {
    if (value < -999 || value > 999)
      throw new Error(`Overflow error when using value: ${value}`);

    this._value = value;
  }

  get value() {
    return this._value;
  }
}

class Registers {
  constructor() {
    this.programCounter = new MemorySpace(0);
    this.accumulator = new MemorySpace(0);
    this.currentInstruction = new MemorySpace(0);
  }
}

// For the sake of ""realism""" we'll add an ALU although the functions could easily be inculuded in the LMC class
class ArithmeticLogicUnit {
  constructor() {}

  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }
}

// Main computer
export class LittleManComputer {
  constructor() {
    // Set up different parts
    this.alu = new ArithmeticLogicUnit();
    this.memory = Array(100)
      .fill(0)
      .map((_, index) => new MemorySpace(index));
    this.registers = new Registers();
    this.halted = false;
  }

  // Load an array of instructions in decimal format into RAM
  loadIntoMemory(program) {
    for (const [index, decimalInstruction] of program.entries()) {
      this.set(index, decimalInstruction);
    }
  }

  run() {
    // Run FDE Cycle
    while (this.halted === false) {
      // FETCH
      this.fetchInstruction(this.registers.programCounter.value);

      // DECODE
      const functionToRun = this.decodeInstruction(
        this.registers.currentInstruction.value
      );

      // EXECUTE
      this.executeFunction(functionToRun);

      this.registers.programCounter.value =
        this.registers.programCounter.value + 1;
    }
  }

  fetchInstruction(address) {
    // Fetch instruction from memory and store in currentInstruction register
    const currentInstruction = this.memory[address].value;
    this.registers.currentInstruction.value = currentInstruction;
  }

  decodeInstruction(instruction) {
    const instructionToFunctionMap = {
      1: this.add,
      2: this.subtract,
      3: this.store,
      5: this.load,
      6: this.branchAlways,
      7: this.branchIfZero,
      8: this.branchIfPositive,
    };

    // Check for specific functions that are defined by their entire instruction rather than op-code
    if (instruction === 0) return this.halt;
    if (instruction === 901) return this.input;
    if (instruction === 902) return this.output;

    // Otherwise decode instruction using the map
    const opcode = Math.trunc(instruction / 100);
    return instructionToFunctionMap[opcode];
  }

  executeFunction(functionToRun) {
    const operand = this.registers.currentInstruction.value % 100;
    functionToRun.call(this, operand);
  }

  // Utility function for setting a memory location to a specific value - this is used by the internal store function as well as externally for assembling into RAM from the Program class
  set(address, value) {
    this.memory[address].value = value;
  }

  // Below are functions that implement the instruction set of the Little Man Computer - most only take an address parameter and pull any other parameter from the accumulator
  halt() {
    this.halted = true;
  }

  add(address) {
    this.registers.accumulator.value = this.alu.add(
      this.registers.accumulator.value,
      this.memory[address].value
    );
  }

  subtract(address) {
    this.registers.accumulator.value = this.alu.subtract(
      this.registers.accumulator.value,
      this.memory[address].value
    );
  }

  store(address) {
    this.set(address, this.registers.accumulator.value);
  }

  load(address) {
    this.registers.accumulator.value = this.memory[address].value;
  }

  branchAlways(address) {
    this.registers.programCounter.value = address - 1;
  }

  branchIfZero(address) {
    if (this.registers.accumulator.value === 0)
      this.registers.programCounter.value = address - 1;
  }

  branchIfPositive(address) {
    if (this.registers.accumulator.value >= 0)
      this.registers.programCounter.value = address - 1;
  }

  output() {
    console.log(this.registers.accumulator.value);
  }

  input() {
    const input = prompt("Enter input: ");

    this.registers.accumulator.value = parseInt(input);
  }
}
