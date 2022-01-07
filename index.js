import { readFile } from "fs/promises";
import { LittleManComputer } from "./lmc.js";

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

    // Get the program text in a nice format that we can work with
    this.instructions = this.content
      .toLocaleLowerCase()
      .replace(/[\r]/g, "")
      .replace(/[\t\f ]+/g, " ")
      .split("\n")
      .map((instruction) => instruction.split("//")[0].trim());

    // Compile instructions
    const compiledInstructions = this.compile(this.instructions);

    // Assemble instructions into RAM
    this.loadIntoRam(compiledInstructions);

    // Run the program using the LMC;
    this.lmc.run();
  }

  compile(instructions) {
    const compiledLabels = this.compileLabels(instructions);
    const compiledInstructions = this.compileInstructions(compiledLabels);

    console.log(compiledLabels, compiledInstructions);

    return compiledInstructions;
  }

  compileLabels(instructions) {
    // Extract labels from the code
    const labels = instructions.reduce((accumulator, instruction, index) => {
      // Extract command and parameters
      const instructionParts = instruction.split(" ");

      // If the instruction does not start with a command, add it to the list of labelled addresses.
      if (
        ![...Object.keys(Program.instructionToDecimalMap), "dat"].some(
          (command) => instructionParts.indexOf(command) === 0
        )
      )
        return [
          ...accumulator,
          new InstructionLabel(instructionParts[0], index),
        ];

      return accumulator;
    }, []);

    // For each instruction replace all instances of labels with their address
    const instructionsWithReplacedLabels = instructions.map((instruction) => {
      // Use reduce so that we can replace all instances of all labels in the instruction
      const instructionWithReplacedLabel = labels
        .reduce((acc, label) => {
          // If the instruction defines a lebel, make sure to remove it from the start of the instruction
          if (acc.startsWith(label.value))
            return `${acc.substring(label.value.length).trim()}`;

          // Otherwise, replace the label with the address
          return acc.replace(label.value, label.address.toString());
        }, instruction)
        .trim();

      return instructionWithReplacedLabel;
    });

    return instructionsWithReplacedLabels;
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

  loadIntoRam(instructions) {
    // Then load these decimal numbers into the memory of the LMC
    for (const [index, decimalInstruction] of instructions.entries()) {
      this.lmc.set(index, decimalInstruction);
    }
  }
}

// Initialise a program!
const program = new Program("test.lmc");
await program.init();
