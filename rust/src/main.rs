pub mod assembler;
pub mod lmc;

use std::env;
use std::fs;

fn main() {
    // TODO: Add actual pathing
    let default_path = "../index.lmc".to_string();

    let args = env::args().collect::<Vec<String>>();
    let path = args.get(1).unwrap_or(&default_path);
    let data = fs::read_to_string(path).unwrap();
    let decimal_data = assembler::assemble(&data);

    let mut lmc = lmc::LittleManComputer::new(100);

    lmc.load_program(decimal_data);
    lmc.run();
}
