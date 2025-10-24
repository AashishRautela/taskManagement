import { Stage } from '../models/index.js';
import CrudRepository from './crud.repository.js';

class StageRepository extends CrudRepository {
  constructor() {
    super(Stage);
  }
}

export default new StageRepository();
