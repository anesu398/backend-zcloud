const { getRepository } = require('typeorm');

class UsersService {
  constructor() {
    this.userRepository = getRepository('User');
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async createUser(data) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email) {
    return await this.userRepository.findOne({ where: { email } });
  }
}

module.exports = new UsersService();
