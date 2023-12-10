import { SqlModel } from '@core/sql/sql.model';
import { IsUnique } from '@core/sql/sql.unique-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { DataTypes } from 'sequelize';
import { Column, Index, Table } from 'sequelize-typescript';

@Table
export class Page extends SqlModel {
  @Column
  @Index('name')
  @ApiProperty({
    description: 'Page Name',
    example: 'about_us',
  })
  @IsString()
  @IsUnique('Page')
  name: string;

  @Column
  @ApiProperty({
    description: 'Page Title',
    example: 'About Us',
  })
  @IsString()
  title: string;

  @Column(DataTypes.TEXT({ length: 'long' }))
  @ApiProperty({
    description: 'Page Content',
    example: 'About us sample content',
  })
  @IsString()
  content: string;

  @Column({ defaultValue: true })
  @ApiProperty({
    description: 'Allow HTML Content?',
    example: true,
  })
  @IsBoolean()
  allow_html: boolean;
}
