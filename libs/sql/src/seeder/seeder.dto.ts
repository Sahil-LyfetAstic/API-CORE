export interface SeedReference {
  model: string;
  where: any;
}

export class SeedReference {
  model: string;
  where: any;

  constructor(ref: SeedReference) {
    this.model = ref.model;
    this.where = ref.where;
  }
}

export interface SeedRecord {
  [key: string]:
    | null
    | boolean
    | number
    | string
    | Date
    | SeedReference
    | SeedRecord;
}

export class Seed<T> {
  model: string;
  action: 'never' | 'once' | 'always';
  data: (Partial<T> & SeedRecord)[];
}
