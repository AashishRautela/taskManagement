import CrudRepository from './crud.repository.js';
import { User } from '../models/index.js';
class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async findOneWithPassword(filter) {
    return await this.model.findOne(filter).select('+password');
  }
}

export default new UserRepository();
