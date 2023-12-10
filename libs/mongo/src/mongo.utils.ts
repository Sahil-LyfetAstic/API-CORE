import { SchemaFactory } from '@nestjs/mongoose';
import { Aggregate, FilterQuery, Model, Schema } from 'mongoose';
import { getPopulates } from './mongo.decorator';
import { DeleteOptions, RestoreOptions } from './mongo.schema';

const setVirtualPopulates = (model: any, schema: Schema): void => {
  const populates = getPopulates(model);
  populates.forEach((populate) => {
    schema.virtual(populate.name, populate.options);
  });
};

const setDefaultHooks = (schema: Schema): void => {
  schema.pre(
    [
      'count',
      'countDocuments',
      'find',
      'findOne',
      'findOneAndDelete',
      'findOneAndRemove',
      'findOneAndReplace',
      'findOneAndUpdate',
    ],
    function () {
      const option = this.getOptions() || {};
      if (option.onlyDeleted) {
        this.where({ deleted: true });
      } else if (!option.withDeleted) {
        this.where({ deleted: false });
      }
    },
  );
  schema.pre('aggregate', async function (this: Aggregate<unknown>) {
    const option = this.options;
    if (option.onlyDeleted) {
      this.pipeline().unshift({ $match: { deleted: true } });
    } else if (!option.withDeleted) {
      this.pipeline().unshift({ $match: { deleted: false } });
    }
  });
};

const setDefaultMethods = (schema: Schema): void => {
  schema.method({
    delete: function (options: DeleteOptions = {}) {
      if (options.force) {
        return this.deleteOne();
      } else {
        this.set('deleted', true);
        this.set('deleted_at', new Date());
        if (options.deletedBy) {
          this.set('deleted_by', options.deletedBy);
          this.set('updated_by', options.deletedBy);
        }
        return this.save();
      }
    },
    restore: function (options: RestoreOptions = {}) {
      this.set('deleted', false);
      this.set('deleted_at', undefined);
      this.set('deleted_by', undefined);
      if (options.restoredBy) {
        this.set('updated_by', options.restoredBy);
      }
      return this.save();
    },
  });
};

const setDefaultStaticMethods = (schema: Schema): void => {
  schema.static({
    bulkDelete: function <T>(
      filter: FilterQuery<T>,
      options: DeleteOptions = {},
    ) {
      if (options.force) {
        return Model.deleteMany.apply(this, [filter]);
      } else {
        const update: any = {
          deleted: true,
          deleted_at: new Date(),
        };
        if (options.deletedBy) {
          update.deleted_by = options.deletedBy;
          update.updated_by = options.deletedBy;
        }
        return Model.updateMany.apply(this, [filter, update]);
      }
    },
  });
};

export const createMongoSchema = (model: any) => {
  const schema = SchemaFactory.createForClass(model);
  setVirtualPopulates(model, schema);
  setDefaultHooks(schema);
  setDefaultMethods(schema);
  setDefaultStaticMethods(schema);
  return schema;
};

export function convertPopulate(
  populate: any,
  populateAttributes: {
    path: string;
    attributes: string[];
  }[] = [],
): any {
  try {
    const _populate: any[] = [];
    for (let index = 0; index < populate.length; index++) {
      if (typeof populate[index] === 'string') {
        const path = populate[index];
        const attributeIndex = populateAttributes.findIndex(
          (x) => x.path === path,
        );
        let attributes: string | undefined = undefined;
        if (attributeIndex > -1) {
          attributes = populateAttributes[attributeIndex].attributes?.join(' ');
        }

        if (path.indexOf('.') > -1) {
          const pathArr = path.split('.');
          let parentPopulate: any[] = _populate;
          for (let _index = 0; _index < pathArr.length - 1; _index++) {
            const _path = pathArr[_index];
            const parentPathIndex = parentPopulate.findIndex(
              (x) => x.path === _path,
            );
            if (parentPathIndex > -1) {
              parentPopulate = parentPopulate[parentPathIndex].populate;
            } else {
              parentPopulate.push({
                path: _path,
                populate: [],
                select: attributes,
              });
              parentPopulate =
                parentPopulate[parentPopulate.length - 1].populate;
            }
          }

          parentPopulate.push({
            path: pathArr[pathArr.length - 1],
            populate: [],
            select: attributes,
          });
        } else {
          _populate.push({
            path,
            populate: [],
            select: attributes,
          });
        }
      }
    }
    return _populate;
  } catch (error) {
    return [];
  }
}

export function populateSelect(selects: string[]): {
  attributes: string[];
  populateAttributes: {
    path: string;
    attributes: string[];
  }[];
} {
  const attributes: string[] = selects.filter(
    (select) => select.indexOf('.') === -1,
  );
  const otherPopulateAttributes: any = selects.filter(
    (select) => select.indexOf('.') > -1,
  );
  const populateAttributes: any = [];

  otherPopulateAttributes.forEach((select: string) => {
    const split = select.split('.');
    const attribute = split.pop();
    const key = split.join('.');
    const index = populateAttributes.findIndex(
      (x: { path: string }) => x.path === key,
    );
    if (index > -1) {
      populateAttributes[index].attributes = [
        ...populateAttributes[index].attributes,
        attribute,
      ].filter((x: any, i: any, a: string | any[]) => a.indexOf(x) === i);
    } else {
      populateAttributes.push({
        path: key,
        attributes: [attribute],
      });
    }
  });

  return { attributes, populateAttributes };
}
