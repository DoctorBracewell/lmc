pub mod assembler;
pub mod lmc;

use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];
    let data = fs::read_to_string(&filename).unwrap();
    let decimal_data = assembler::assemble(&data);

    let mut lmc = lmc::LittleManComputer::new(100);

    lmc.load_program(decimal_data);
    lmc.run();
}
