const bcrypt = require('bcrypt');

async function run() {
    const hash = await bcrypt.hash('123456', 10);
    console.log('START_HASH');
    console.log(hash);
    console.log('END_HASH');
}

run();
