#[derive(Clone, Debug, Default)]
struct MemoryCell {
    value: usize,
}

#[derive(Default)]
struct Registers {
    accumulator: MemoryCell,
    program_counter: MemoryCell,
    current_instruction: MemoryCell,
}

#[derive(Default)]
struct Flags {
    overflow: bool,
    negative: bool,
    halted: bool,
}

#[derive(Debug)]
enum Instruction {
    Add(usize),
    Subtract(usize),
    Store(usize),
    Load(usize),
    Branch(usize),
    BranchIfZero(usize),
    BranchIfPositive(usize),
    Input,
    Output,
    Halt,
}

mod alu {
    pub fn add(a: usize, b: usize) -> (usize, bool) {
        // Tuple (result, isOverflow)
        ((a + b) % 1000, a + b > 999)
    }

    pub fn subtract(a: i16, b: i16) -> (usize, bool) {
        // Tuple (result, isNegative)
        ((a - b).rem_euclid(1000) as usize, a - b < 0)
    }
}

pub struct LittleManComputer {
    memory: Vec<MemoryCell>,
    registers: Registers,
    flags: Flags,
}

impl LittleManComputer {
    pub fn new(size: usize) -> Self {
        Self {
            memory: vec![MemoryCell::default(); size],
            registers: Registers::default(),
            flags: Flags::default(),
        }
    }

    pub fn load_program(&mut self, instructions: Vec<usize>) {
        for (i, instruction) in instructions.iter().enumerate() {
            self.set(i, *instruction);
        }
    }

    pub fn run(&mut self) {
        while !self.flags.halted {
            self.fetch_instruction(self.registers.program_counter.value);

            let instruction = self.decode_instruction(self.registers.current_instruction.value);

            self.execute_instruction(instruction);

            self.registers.program_counter.value =
                alu::add(self.registers.program_counter.value, 1).0;
        }
    }

    fn fetch_instruction(&mut self, address: usize) {
        self.registers.current_instruction.value = self.get(address);
    }

    fn decode_instruction(&mut self, instruction: usize) -> Instruction {
        use Instruction::*;

        let digits: Vec<char> = format!("{:03}", instruction).chars().collect();
        let operand: usize = digits[1..digits.len()]
            .iter()
            .collect::<String>()
            .parse::<usize>()
            .unwrap();

        match digits[0].to_digit(10).unwrap() {
            _ if instruction == 000 => Halt,
            _ if instruction == 901 => Input,
            _ if instruction == 902 => Output,
            1 => Add(operand),
            2 => Subtract(operand),
            3 => Store(operand),
            5 => Load(operand),
            6 => Branch(operand),
            7 => BranchIfZero(operand),
            8 => BranchIfPositive(operand),
            _ => panic!("Invalid Instruction Opcode"),
        }
    }

    fn execute_instruction(&mut self, instruction: Instruction) {
        use Instruction::*;

        match instruction {
            Halt => self.halt(),
            Add(address) => self.add(address),
            Subtract(address) => self.subtract(address),
            Store(address) => self.store(address),
            Load(address) => self.load(address),
            Branch(address) => self.branch(address),
            BranchIfZero(address) => self.branch_if_zero(address),
            BranchIfPositive(address) => self.branch_if_positive(address),
            Input => self.input(),
            Output => self.output(),
        };
    }

    fn set(&mut self, address: usize, value: usize) {
        self.memory[address].value = value;
    }

    fn get(&self, address: usize) -> usize {
        self.memory[address].value
    }

    fn halt(&mut self) {
        self.flags.halted = true;

        for (flag, value) in [
            ("overflow", self.flags.overflow),
            ("negative", self.flags.negative),
        ] {
            println!("{}: {}", flag, value);
        }
    }

    fn add(&mut self, address: usize) {
        let (res, overflow) = alu::add(self.registers.accumulator.value, self.get(address));

        self.flags.overflow = overflow;
        self.registers.accumulator.value = res;
    }

    fn subtract(&mut self, address: usize) {
        let (res, negative) = alu::subtract(
            self.registers.accumulator.value as i16,
            self.get(address) as i16,
        );

        self.flags.overflow = negative;
        self.registers.accumulator.value = res;
    }

    fn store(&mut self, value: usize) {
        self.set(value, self.registers.accumulator.value);
    }

    fn load(&mut self, address: usize) {
        self.registers.accumulator.value = self.get(address);
    }

    fn branch(&mut self, value: usize) {
        self.registers.program_counter.value = alu::subtract(value as i16, 1).0;
    }

    fn branch_if_zero(&mut self, value: usize) {
        if self.registers.accumulator.value == 0 {
            self.registers.program_counter.value = alu::subtract(value as i16, 1).0;
        }
    }

    fn branch_if_positive(&mut self, value: usize) {
        if !self.flags.negative {
            self.registers.program_counter.value = alu::subtract(value as i16, 1).0;
        }
    }

    fn input(&mut self) {
        println!("\nEnter Input:");

        let mut input = String::new();
        std::io::stdin()
            .read_line(&mut input)
            .expect("Error recieving input!");

        println!("");

        self.registers.accumulator.value = input.trim().parse::<usize>().expect("Invalid Input!");
    }

    fn output(&self) {
        println!("{}", self.registers.accumulator.value);
    }
}
