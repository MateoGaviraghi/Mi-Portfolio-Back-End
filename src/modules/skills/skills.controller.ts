import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillCategory } from './schemas/skill.scehma';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Skill created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: SkillCategory,
    description: 'Filter by skill category',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of skills',
  })
  findAll(
    @Query('category') category?: SkillCategory,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.skillsService.findAll({
      category,
      isActive: isActive !== undefined ? isActive === true : undefined,
    });
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Get skills statistics' })
  @ApiResponse({
    status: 200,
    description: 'Skills statistics by category and top skills',
  })
  getStats() {
    return this.skillsService.getStats();
  }

  @Get('category/:category')
  @Public()
  @ApiOperation({ summary: 'Get skills by category' })
  @ApiResponse({
    status: 200,
    description: 'List of skills in the specified category',
  })
  findByCategory(@Param('category') category: SkillCategory) {
    return this.skillsService.findByCategory(category);
  }

  @Get('level/:minLevel')
  @Public()
  @ApiOperation({ summary: 'Get skills by minimum level' })
  @ApiResponse({
    status: 200,
    description: 'List of skills with level greater than or equal to minLevel',
  })
  getByLevel(@Param('minLevel') minLevel: number) {
    return this.skillsService.getSkillsByLevel(minLevel);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skill details',
  })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Skill updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a skill (Admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Skill deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
