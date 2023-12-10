import { isArray, isObject } from 'class-validator';
import { IncludeOptions, Includeable } from 'sequelize';
import { getIncludeOptions } from './sql.decorator';
import { operatorsAliases } from './sql.module';

export function convertWhere(where: any): any {
  try {
    if (typeof where !== 'object') return where;
    for (const key of Object.keys(where)) {
      if (Object.prototype.hasOwnProperty.call(where, key)) {
        const value = where[key];
        if (isArray(value)) {
          where[key] = value.map((x) => convertWhere(x));
        } else if (isObject(value)) {
          where[key] = convertWhere(value);
        }
        if (Object.prototype.hasOwnProperty.call(operatorsAliases, key)) {
          where[operatorsAliases[key]] = where[key];
          delete where[key];
        }
      }
    }
    return where;
  } catch (error) {
    return {};
  }
}

export function convertPopulate(
  populate: any,
  populateAttributes: {
    association: string;
    attributes: string[];
  }[] = [],
): any {
  try {
    const _populate: any[] = [];
    for (let index = 0; index < populate.length; index++) {
      if (typeof populate[index] === 'string') {
        let association = populate[index];
        const isRequired = association.endsWith('*');
        const withDeleted = association.startsWith('+');
        const fetchSeparate =
          association.startsWith('+-') || association.startsWith('-');
        association = association.replace(/[*+-]/g, '');

        const attributeIndex = populateAttributes.findIndex(
          (x) => x.association === association,
        );
        let attributes: string[] | undefined = undefined;
        if (attributeIndex > -1) {
          attributes = populateAttributes[attributeIndex].attributes;
        }

        if (association.indexOf('.') > -1) {
          const associationArr = association.split('.');

          let parentInclude: any[] = _populate;
          for (let _index = 0; _index < associationArr.length - 1; _index++) {
            const _association = associationArr[_index];
            const parentAassociationIndex = parentInclude.findIndex(
              (x) => x.association === _association,
            );
            if (parentAassociationIndex > -1) {
              parentInclude[parentAassociationIndex].required =
                isRequired ||
                (parentInclude[parentAassociationIndex].required ?? undefined);
              parentInclude = parentInclude[parentAassociationIndex].include;
            } else {
              parentInclude.push({
                association: _association,
                include: [],
                attributes,
                required: isRequired || undefined,
              });
              parentInclude = parentInclude[parentInclude.length - 1].include;
            }
          }
          parentInclude.push({
            association: associationArr[associationArr.length - 1],
            include: [],
            attributes,
            required: isRequired || undefined,
            paranoid: withDeleted ? false : undefined,
            separate: fetchSeparate || undefined,
          });
        } else {
          _populate.push({
            association,
            include: [],
            attributes,
            required: isRequired || undefined,
            paranoid: withDeleted ? false : undefined,
            separate: fetchSeparate || undefined,
          });
        }
      }
    }
    return _populate;
  } catch (error) {
    return [];
  }
}

export function setIncludeOptions(
  _this: any,
  includes: Includeable | Includeable[],
): Includeable[] {
  if (!Array.isArray(includes)) {
    includes = [includes];
  }
  includes.forEach((include: IncludeOptions, index: number) => {
    const options = getIncludeOptions(_this, include.as) || {};
    if (options.attributes) {
      const attributes = options.attributes;
      let _attributes = include.attributes;
      if (Array.isArray(attributes) && Array.isArray(_attributes)) {
        _attributes = _attributes.filter((x: string) => attributes.includes(x));
        options.attributes = _attributes;
      } else if (
        Array.isArray(_attributes) &&
        !Array.isArray(attributes) &&
        attributes.hasOwnProperty('exclude')
      ) {
        _attributes = _attributes.filter(
          (x: string) => !attributes.exclude.includes(x),
        );
        options.attributes = _attributes;
      } else {
        options.attributes = _attributes || attributes;
      }
    }
    include = { ...include, ...options };
    include.include = include.include
      ? setIncludeOptions(include.model, include.include)
      : [];
    includes[index] = include;
  });
  return includes;
}

export function populateSelect(selects: string[]): {
  attributes: string[];
  populateAttributes: {
    association: string;
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
      (x: { association: string }) => x.association === key,
    );
    if (index > -1) {
      populateAttributes[index].attributes = [
        ...populateAttributes[index].attributes,
        attribute,
      ].filter((x: any, i: any, a: string | any[]) => a.indexOf(x) === i);
    } else {
      populateAttributes.push({
        association: key,
        attributes: [attribute],
      });
    }
  });

  return { attributes, populateAttributes };
}
