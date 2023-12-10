import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  ApiErrorResponses,
  ApiQueryGetAll,
  ApiQueryGetById,
  ApiQueryGetOne,
  ResponseGetAll,
  ResponseGetOne,
  ResponseUpdated,
} from 'src/core/core.decorators';
import { NotFoundError } from 'src/core/core.errors';
import { ErrorResponse, NotFound, Result } from 'src/core/core.responses';
import { Owner, OwnerDto } from 'src/core/decorators/sql/owner.decorator';
import { Roles } from 'src/core/decorators/sql/roles.decorator';
import { Role } from '../user/role.enum';
import { UpdateBulkSettingDto } from './dto/update-bulk-settings.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

@ApiTags('setting')
@ApiBearerAuth()
@Roles(Role.Admin)
@ApiErrorResponses()
@ApiExtraModels(Setting)
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  /**
   * Update a Setting using id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a setting using id' })
  @ResponseUpdated(Setting)
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Param('id') id: number,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    const { error, data } = await this.settingService.update({
      owner,
      action: 'update',
      id: +id,
      body: updateSettingDto,
    });

    if (error) {
      if (error instanceof NotFoundError) {
        return NotFound(res, {
          error,
          message: `Record not found`,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data: { setting: data }, message: 'Updated' });
  }

  /**
   * Update bulk settings
   */
  @Post('bulk')
  @ApiExtraModels(UpdateBulkSettingDto)
  @ApiOperation({ summary: 'Update bulk settings' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(UpdateBulkSettingDto),
      },
    },
  })
  @ApiOkResponse({
    description: 'Updated',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            settings: {
              type: 'array',
              items: {
                $ref: getSchemaPath(Setting),
              },
            },
          },
        },
        message: {
          type: 'string',
          example: 'Updated',
        },
      },
    },
  })
  async updateBulk(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body(new ParseArrayPipe({ items: UpdateBulkSettingDto }))
    updateBulkSettingsDto: UpdateBulkSettingDto[],
  ) {
    const { error, data } = await this.settingService.updateBulk({
      owner,
      action: 'updateBulk',
      records: updateBulkSettingsDto,
    });

    if (error) {
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data: { settings: data }, message: 'Updated' });
  }

  /**
   * Return all Settings list
   */
  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiQueryGetAll()
  @ResponseGetAll(Setting)
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Query() query: any,
  ) {
    const { error, data, offset, limit, count } =
      await this.settingService.findAll({
        owner,
        action: 'findAll',
        payload: { ...query },
      });

    if (error) {
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, {
      data: { settings: data, offset, limit, count },
      message: 'Ok',
    });
  }

  /**
   * Find one Setting
   */
  @Get('find')
  @ApiOperation({ summary: 'Find a setting' })
  @ApiQueryGetOne()
  @ResponseGetOne(Setting)
  async findOne(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Query() query: any,
  ) {
    const { error, data } = await this.settingService.findOne({
      owner,
      action: 'findOne',
      payload: { ...query },
    });

    if (error) {
      if (error instanceof NotFoundError) {
        return NotFound(res, {
          error,
          message: `Record not found`,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data: { setting: data }, message: 'Ok' });
  }

  /**
   * Get a Setting by id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a setting using id' })
  @ApiQueryGetById()
  @ResponseGetOne(Setting)
  async findById(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Param('id') id: number,
    @Query() query: any,
  ) {
    const { error, data } = await this.settingService.findById({
      owner,
      action: 'findById',
      id: +id,
      payload: { ...query },
    });

    if (error) {
      if (error instanceof NotFoundError) {
        return NotFound(res, {
          error,
          message: `Record not found`,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data: { setting: data }, message: 'Ok' });
  }
}
