import CrudRepository from './crud.repository.js';
import { User } from '../models/index.js';
class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async verifyUser(email) {
    const response = this.model.updateOne(
      {
        email: email
      },
      { $set: { isVerified: true } },
      { new: true }
    );
    return response;
  }

  async findOneWithPassword(filter) {
    return await this.model.findOne(filter).select('+password');
  }
}

export default new UserRepository();
