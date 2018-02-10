var program = require('commander');  
  
function range (val) {  
    return val.split('..').map(Number);  
}  
  
function list (val) {  
    return val.split(',');
}  
  
//定义参数,以及参数内容的描述  
program  
    .version('0.0.1')  
    .usage('[options] [value ...]')  
    .option('-m, --message <string>', 'a string argument')  
    .option('-i, --integer <n>', 'input a integet argument.', parseInt)  
    .option('-f, --float <f>', 'input a float arg', parseFloat)  
    .option('-l, --list <items>', 'a list', list)  
    .option('-r, --range <a>..<b>', 'a range', range)  
// console.log(program('-m'))
  
//解析commandline arguments  
if (process.argv.length == 4){
    program.parse(process.argv); 
}

module.exports = {
    m: program.message  || ""
};
