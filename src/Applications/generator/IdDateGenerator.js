const { nanoid } = require('nanoid');
const moment = require('moment');

class IdDateGenerator {
    async generateDate() {
        return moment().format('YYYY-MM-DDTHH:mm:ss.SSS')
    }
}
  
module.exports = IdDateGenerator;
