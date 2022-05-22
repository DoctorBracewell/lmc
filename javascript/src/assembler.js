// When creating decimal instructions from the program we store the index as well so they can be loaded into memory by the LMC
class DecimalInstruction {
  constructor(decimal, index) {
    this.decimal = decimal;
    this.index = index;
  }
}

class Instruction {
  constructor(index, instruction, parameter) {
    this.instruction = instruction;
    this.parameter = parameter ?? null;
    this.index = index;
  }
}

class LabelledInstruction extends Instruction {
  constructor(index, label, instruction, value) {
    super(index, instruction, value);
    this.label = label;
  }
}

// Represents a line to act as a parent in the token list
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
    if (Object.keys(Assembler.instructionsData).includes(token))
      return "instruction";

    // Any string that isn't a command or a number literal is a label
    if (isNaN(token)) return "label";

    return "parameter";
  }
}

export class Assembler {
  static instructionsData = {
    add: {
      decimal: 100,
      parameter: true,
    },
    sub: {
      decimal: 200,
      parameter: true,
    },
    sta: {
      decimal: 300,
      parameter: true,
    },
    lda: {
      decimal: 500,
      parameter: true,
    },
    bra: {
      decimal: 600,
      parameter: true,
    },
    brz: {
      decimal: 700,
      parameter: true,
    },
    brp: {
      decimal: 800,
      parameter: true,
    },
    inp: {
      decimal: 901,
      parameter: false,
    },
    out: {
      decimal: 902,
      parameter: false,
    },
    hlt: {
      decimal: 0,
      parameter: false,
    },
    dat: {
      decimal: 0,
      parameter: true,
    },
  };

  assemble(program) {
    const sanitisedProgram = this.sanitise(program);
    const tokens = this.tokenise(sanitisedProgram);
    const parsedTokens = this.parseTokens(tokens);
    const parsedLabels = this.parseLabels(parsedTokens);
    const assembledInstructions = this.assembleInstructions(parsedLabels);

    return assembledInstructions;
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

      // Various self-explanatory error checks
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

    // For label, replace any paramaters equal to that label to the label's index
    labelledInstructions.forEach((labelledInstruction) => {
      instructions.forEach((instruction) => {
        if (labelledInstruction.label === instruction.parameter)
          instruction.parameter = labelledInstruction.index;
      });
    });

    return instructions;
  }

  assembleInstructions(instructions) {
    // Map into decimal form
    return instructions.map(({ instruction, parameter, index }) => {
      const instructionData = Assembler.instructionsData[instruction];

      // Default to 0 if a dat parameter is not provided
      if (instruction === "dat")
        return new DecimalInstruction(parseInt(parameter ?? 0), index);

      // Add pre-set operand for parameterless commands and return without continuing - inp = 901, out = 902, hlt = 000
      if (instructionData.parameter === false)
        return new DecimalInstruction(parseInt(instructionData.decimal), index);

      // Otherwise just add the decimal value of the instruction and the parameter
      return new DecimalInstruction(
        instructionData.decimal + parseInt(parameter),
        index
      );
    });
  }
}
