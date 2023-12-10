import { SqlModel } from '@core/sql/sql.model';
import { IsUnique } from '@core/sql/sql.unique-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { Column, DataType, Index, Table } from 'sequelize-typescript';

@Table
export class Setting extends SqlModel {
  @Column
  @Index('name')
  @ApiProperty({
    description: 'Setting Name',
    example: 'timezone',
  })
  @IsString()
  @IsUnique('Setting')
  name: string;

  @Column
  @ApiProperty({
    description: 'Setting Display Name',
    example: 'System Timezone',
  })
  @IsString()
  display_name: string;

  @Column
  @ApiProperty({
    description: 'Setting Value',
    example: 'America/New_York',
  })
  @IsString()
  value: string;

  @Column({ defaultValue: true })
  @ApiProperty({
    description: 'Editable?',
    example: true,
  })
  @IsBoolean()
  editable: boolean;

  @Column({ defaultValue: 1 })
  @ApiProperty({
    description: 'Group ID',
    example: 1,
  })
  @IsInt()
  group_id: number;

  @Column({ defaultValue: 0 })
  @ApiProperty({
    description: 'Sort Order',
    example: 1,
  })
  @IsInt()
  sort_no: number;

  @Column({
    type: DataType.TEXT,
    get(this: Setting): any {
      try {
        const tx = this.getDataValue('options');
        return tx ? JSON.parse(tx) : { type: 'text', required: true };
      } catch (error) {
        return null;
      }
    },
  })
  @ApiProperty({
    description: 'Settings Input Options',
    type: 'object',
  })
  options: string;

  static async getValue(name: string): Promise<string> {
    try {
      const setting = await Setting.findOne({
        where: { name },
      });
      return setting?.value || null;
    } catch (error) {
      return null;
    }
  }
}
