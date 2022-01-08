import { readFile } from "fs/promises";
import { LittleManComputer } from "./lmc.js";
import { Assembler } from "./assembler.js";

class InstructionLabel {
  constructor(value, address) {
    this.value = value;
    this.address = address;
  }
}

class Program {
  constructor(filePath) {
    // Read the `.lmc` file
    if (!filePath.endsWith(".lmc")) throw new Error("Invalid file type!");
    this.filePath = filePath;

    this.assembler = new Assembler();

    // Initialise a new computer per program
    this.lmc = new LittleManComputer();
  }

  static instructionToDecimalMap = {
    add: "1",
    sub: "2",
    sta: "3",
    lda: "5",
    bra: "6",
    brz: "7",
    brp: "8",
    inp: "9",
    out: "9",
    hlt: "0",
  };

  async init() {
    this.content = await readFile(this.filePath, "utf-8");

    // Use the assembler to assemble our program text into an array of decimal representations of the code
    this.assembledProgram = this.assembler.assemble(this.content);

    // // Load these instructions into RAM
    // this.lmc.loadIntoMemory(this.assembledProgram);

    // // Run the program using the LMC;
    // this.lmc.run();
  }

  compileInstructions(instructions) {
    const parameterlessInstructionMap = {
      hlt: "00",
      inp: "01",
      out: "02",
    };

    // Map into decimal form
    return instructions.map((instruction) => {
      // Extract command and parameters
      const [command, parameter] = instruction.split(" ");

      // Default to 0 if a dat parameter is not provided
      if (command === "dat") return parseInt(parameter ?? 0);

      // Add pre-set operand for parameterless commands and return without continuing - inp = 901, out = 902, hlt = 000
      if (parameter === undefined)
        return parseInt(
          Program.instructionToDecimalMap[command] +
            parameterlessInstructionMap[command]
        );

      // Make sure the parameter is always 2 digits before adding to the op-code
      const parameterValue = parseInt(parameter).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

      // Map the instruction to its decimal and add its parameter to the string then parse as an int
      return parseInt(
        Program.instructionToDecimalMap[command] + parameterValue
      );
    });
  }
}

// Initialise a program!
const program = new Program("index.lmc");
await program.init();
