import { SetMetadata } from '@nestjs/common';
import { User } from '../../../modules/mongo/user/entities/user.entity';

export const OWNER_INCLUDE_ATTRIBUTES_KEY = 'owner_include_attributes';
export const OwnerIncludeAttribute = (...attributes: (keyof User)[]) =>
  SetMetadata(OWNER_INCLUDE_ATTRIBUTES_KEY, attributes);
