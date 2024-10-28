const bcrypt = require('bcrypt')

exports.hashPassword = async(password) => {
    try {
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        return hashPassword
    } catch (error) {
        console.log(error)
    }
}

exports.comparePassword = async (password,hashPassword) => {
    return bcrypt.compare(password,hashPassword);
};