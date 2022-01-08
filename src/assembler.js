class Instruction {
  constructor(index, instruction, value) {
    this.instruction = instruction;
    this.value = value ?? null;
    this.index = index;
  }
}

class LabelledInstruction extends Instruction {
  constructor(index, label, instruction, value) {
    super(index, instruction, value);
    this.label = label;
  }
}

class Line {
  constructor(text, index, tokens) {
    this.text = text;
    this.index = index;
    this.tokens = tokens;
  }
}

class Token {
  constructor(token) {
    this.type = this.inferType(token);
    this.value = token;
  }

  inferType(token) {
    // Instructions
    if (Object.keys(Assembler.instructionData).includes(token))
      return "instruction";

    // Any string that isn't a command or a number literal is a label
    if (isNaN(token)) return "label";

    return "parameter";
  }
}

export class Assembler {
  static instructionData = {
    add: {
      decimal: "1",
      parameter: true,
    },
    sub: {},
    sta: {},
    lda: {},
    bra: {},
    brz: {},
    brp: {},
    inp: {},
    out: {},
    hlt: {},
    dat: {},
  };

  assemble(program) {
    this.sanitisedProgram = this.sanitise(program);
    this.tokens = this.tokenise(this.sanitisedProgram);
    this.parsedTokens = this.parseTokens(this.tokens);
    this.parsedLabels = this.parseLabels(this.parsedTokens);
  }

  sanitise(text) {
    return text
      .toLocaleLowerCase()
      .replace(/[\r]/g, "")
      .replace(/[\t\f ]+/g, " ");
  }

  tokenise(sanitisedText) {
    // Split by lines and remove comments
    const lines = sanitisedText
      .split("\n")
      .map((instruction) => instruction.split("//")[0].trim())
      .filter((instruction) => instruction.length > 0);

    // For each line split by spaces and map into Token instances
    return lines.map(
      (line, index) =>
        new Line(
          line,
          index,
          line.split(" ").map((token) => new Token(token))
        )
    );
  }

  parseTokens(lines) {
    // Check for errors and map into Instruction instances
    const ast = lines.map(({ index, tokens, text }) => {
      const instructionParts = tokens.map((token) => token.value);

      if (tokens.length > 3)
        throw new Error(`Too many parameters at line ${index}: ${text}`);

      if (!tokens.some((part) => part.type === "instruction"))
        throw new Error(`Invalid instruction at line ${index}: ${text}`);

      if (tokens[0].type === "label")
        return new LabelledInstruction(index, ...instructionParts);

      return new Instruction(index, ...instructionParts);
    });

    return ast;
  }

  parseLabels(instructions) {
    // Instructions is an array of Instructions and LabelledInstructions, so let's extract all the labelled ones to start parsing them
    const labelledInstructions = instructions.filter(
      (instruction) => instruction instanceof LabelledInstruction
    );

    // For each instruction replace instances of the label
    for (const instruction of instructions) {
      if (instruction.value === null) continue;

      // Use reduce here to replace all instances of the label
      const correctedValue = labelledInstructions.reduce(
        (acc, { label, index }) => acc.replace(label, index),
        instruction.value ?? ""
      );

      instruction.value = correctedValue;
    }

    console.log(instructions);

    // For each labelled instruction, replace the label with the address
  }
}
