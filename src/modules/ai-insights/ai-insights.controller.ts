import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiInsightsService } from './ai-insights.service';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { InsightType } from './schemas/ai-insight.schema';

@ApiTags('AI Insights')
@Controller('ai-insights')
export class AiInsightsController {
  constructor(private readonly aiInsightsService: AiInsightsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create AI insight (Admin only)' })
  @ApiResponse({ status: 201, description: 'AI insight created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createAiInsightDto: CreateAiInsightDto) {
    return this.aiInsightsService.create(createAiInsightDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all AI insights (public)' })
  @ApiResponse({ status: 200, description: 'Returns all public AI insights' })
  findAll(
    @Query('type') type?: InsightType,
    @Query('projectId') projectId?: string,
    @Query('isPublic') isPublic?: string,
  ) {
    const filters: {
      type?: InsightType;
      projectId?: string;
      isPublic?: boolean;
    } = {};
    if (type) filters.type = type;
    if (projectId) filters.projectId = projectId;
    if (isPublic !== undefined) filters.isPublic = isPublic === 'true';

    return this.aiInsightsService.findAll(filters);
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Get AI insights statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics about AI usage',
  })
  getStats() {
    return this.aiInsightsService.getStats();
  }

  @Get('top')
  @Public()
  @ApiOperation({ summary: 'Get top AI insights by impact' })
  @ApiResponse({ status: 200, description: 'Returns top AI insights' })
  getTopInsights(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.aiInsightsService.getTopInsights(parsedLimit);
  }

  @Get('project/:projectId')
  @Public()
  @ApiOperation({ summary: 'Get AI insights for a specific project' })
  @ApiResponse({
    status: 200,
    description: 'Returns AI insights for the project',
  })
  findByProject(@Param('projectId') projectId: string) {
    return this.aiInsightsService.findByProject(projectId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get AI insight by ID' })
  @ApiResponse({ status: 200, description: 'Returns the AI insight' })
  @ApiResponse({ status: 404, description: 'AI insight not found' })
  findOne(@Param('id') id: string) {
    return this.aiInsightsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update AI insight (Admin only)' })
  @ApiResponse({ status: 200, description: 'AI insight updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'AI insight not found' })
  update(
    @Param('id') id: string,
    @Body() updateAiInsightDto: UpdateAiInsightDto,
  ) {
    return this.aiInsightsService.update(id, updateAiInsightDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete AI insight (Admin only)' })
  @ApiResponse({ status: 200, description: 'AI insight deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'AI insight not found' })
  remove(@Param('id') id: string) {
    return this.aiInsightsService.remove(id);
  }
}
