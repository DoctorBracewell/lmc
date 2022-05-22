import { readFile } from "fs/promises";
import { LittleManComputer } from "./lmc.js";
import { Assembler } from "./assembler.js";

class Program {
  constructor(filePath) {
    // Read the `.lmc` file
    if (!filePath.endsWith(".lmc")) throw new Error("Invalid file type!");
    this.filePath = filePath;

    this.assembler = new Assembler();

    // Initialise a new computer per program
    this.lmc = new LittleManComputer();
  }

  async init() {
    this.content = await readFile(this.filePath, "utf-8");

    // Use the assembler to assemble our program text into an array of decimal representations of the code
    this.assembledProgram = this.assembler.assemble(this.content);

    // Load these instructions into the main memory
    this.lmc.loadIntoMemory(this.assembledProgram);

    // Run the program using the LMC;
    this.lmc.run();
  }
}

// Initialise a program!
const program = new Program("../index.lmc");
await program.init();
