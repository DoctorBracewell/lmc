use assembler_instructions::INSTRUCTION_LIST;
use regex::Regex;

pub mod assembler_instructions {
    pub struct Instruction {
        pub name: &'static str,
        pub decimal: usize,
        pub parameter: bool,
    }

    pub const INSTRUCTION_LIST: [Instruction; 11] = [
        Instruction {
            name: "hlt",
            decimal: 0,
            parameter: false,
        },
        Instruction {
            name: "dat",
            decimal: 0,
            parameter: true,
        },
        Instruction {
            name: "add",
            decimal: 100,
            parameter: true,
        },
        Instruction {
            name: "sub",
            decimal: 200,
            parameter: true,
        },
        Instruction {
            name: "sta",
            decimal: 300,
            parameter: true,
        },
        Instruction {
            name: "lda",
            decimal: 500,
            parameter: true,
        },
        Instruction {
            name: "bra",
            decimal: 600,
            parameter: true,
        },
        Instruction {
            name: "brz",
            decimal: 700,
            parameter: true,
        },
        Instruction {
            name: "brp",
            decimal: 800,
            parameter: true,
        },
        Instruction {
            name: "inp",
            decimal: 901,
            parameter: false,
        },
        Instruction {
            name: "out",
            decimal: 902,
            parameter: false,
        },
    ];
}

enum TokenKind {
    Instruction,
    Label,
    Parameter,
}

struct Token {
    kind: TokenKind,
    value: String,
}

impl Token {
    pub fn new(token: String) -> Self {
        let kind = if INSTRUCTION_LIST.into_iter().any(|v| v.name == token) {
            TokenKind::Instruction
        } else if token.parse::<usize>().is_err() {
            TokenKind::Label
        } else {
            TokenKind::Parameter
        };

        Self { kind, value: token }
    }
}

struct Line {
    text: String,
    index: usize,
    tokens: Vec<Token>,
}

#[derive(Debug)]
enum InstructionParameter {
    Label(String),
    Number(usize),
}

#[derive(Debug)]
struct Instruction {
    index: usize,
    instruction: String,
    parameter: Option<InstructionParameter>,
    label: Option<String>,
}

pub fn assemble(program: &str) -> Vec<usize> {
    let sanitised = sanitise(program).unwrap();
    let lines = line_and_tokenise(&sanitised[..]);
    let mut parsed_instructions = parse_instructions(lines);

    parse_labels(&mut parsed_instructions);

    assemble_instructions(&mut parsed_instructions)
}

fn sanitise(text: &str) -> Result<String, regex::Error> {
    let space_replace = Regex::new(r"[\r]")?;
    let gap_replace = Regex::new(r"[\t\f ]+")?;

    let lowercase = text.to_lowercase();
    let replaced_space = space_replace.replace_all(&lowercase, "");
    let replaced_gap = gap_replace.replace_all(&replaced_space, " ");

    Ok(replaced_gap.to_string())
}

fn line_and_tokenise(text: &str) -> impl Iterator<Item = Line> + '_ {
    let lines = text
        .split("\n")
        .map(|line| line.split("//").collect::<Vec<&str>>()[0].trim())
        .filter(|line| line.len() > 0);

    lines.enumerate().map(|(index, line)| Line {
        text: line.to_string(),
        index,
        tokens: line
            .split(" ")
            .map(|token| Token::new(token.to_string()))
            .collect(),
    })
}

fn parse_instructions(lines: impl Iterator<Item = Line>) -> Vec<Instruction> {
    lines
        .map(|line| {
            // Turn token structs into a map of their raw strings
            let token_values = line
                .tokens
                .iter()
                .map(|t| &t.value)
                .collect::<Vec<&String>>();

            // Check whether or not the line has a parameter
            let param_option = if line.tokens.len() >= 3 {
                Some(line.tokens[2].value.clone())
            } else if INSTRUCTION_LIST
                .into_iter()
                .any(|v| v.name == token_values[0])
                && token_values.len() >= 2
            {
                Some(line.tokens[1].value.clone())
            } else {
                None
            };

            // Turn the lines parameter into an Option<InstructionParameter>
            let parameter = match param_option {
                Some(value) => match value.parse::<usize>() {
                    Ok(value) => Some(InstructionParameter::Number(value)),
                    Err(_) => Some(InstructionParameter::Label(value)),
                },
                None => None,
            };

            match line.tokens[0].kind {
                _ if line.tokens.len() > 3 => {
                    panic!("Invalid Instruction at line {}: {}", line.index, line.text)
                }
                TokenKind::Label => Instruction {
                    index: line.index,
                    instruction: line.tokens[1].value.clone(),
                    parameter,
                    label: Some(line.tokens[0].value.clone()),
                },
                TokenKind::Instruction => Instruction {
                    index: line.index,
                    instruction: line.tokens[0].value.clone(),
                    parameter,
                    label: None,
                },
                _ => panic!("Invalid Instruction at line {}: {}", line.index, line.text),
            }
        })
        .collect()
}

fn parse_labels(instructions: &mut Vec<Instruction>) {
    // Loop over all instructions in the vector
    for i in 0..instructions.len() {
        // If the instruction has a label, destructure the label
        if instructions[i].label.is_some() {
            // Loop over all the instructions in the vector again for this specific label
            for j in 0..instructions.len() {
                // If the instruction has a parameter that is a label
                let param = match &instructions[j].parameter {
                    Some(InstructionParameter::Label(param)) => Some(param),
                    _ => None,
                };
                // If the parameter label is equal to the current label
                if param == instructions[i].label.as_ref() {
                    // Replace the parameter with the current label's index
                    instructions[j].parameter =
                        Some(InstructionParameter::Number(instructions[i].index))
                }
            }
        }
    }
}

fn assemble_instructions(instructions: &mut Vec<Instruction>) -> Vec<usize> {
    instructions
        .iter()
        .map(|instruction| {
            let data = INSTRUCTION_LIST
                .iter()
                .find(|v| v.name == instruction.instruction)
                .expect("Invalid Instruction!");

            match &instruction.parameter {
                None => data.decimal,
                Some(param) => match param {
                    InstructionParameter::Label(_) => panic!("Invalid Instruction!"),
                    InstructionParameter::Number(num) => data.decimal + num,
                },
            }
        })
        .collect()
}
