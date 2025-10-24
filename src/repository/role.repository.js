import { Role } from '../models/index.js';
import CrudRepository from './crud.repository.js';

class RoleRepository extends CrudRepository {
  constructor() {
    super(Role);
  }
}

export default new RoleRepository();
